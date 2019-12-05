import { empty, of, throwError } from 'rxjs';
import { ajax as rxAjax, AjaxError, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ActionSubjectType, GetStateType, MiddlewareType } from '../types';
import { isObject } from '../utils/helper';
import retryByError from '../utils/retryByError';
import { actionFlat, actionValidate } from '../utils/store';

export const ajax = <State>({
  url,
  ajaxRequest = {},
  ajaxBody = {},
  actionWhitelist,
  timeout = 2500,
  retries = 0,
  delay = 1000,
}: {
  url: string;
  ajaxRequest?: AjaxRequest;
  ajaxBody?: Record<string, any> | ((getState: GetStateType<State>) => Record<string, any> | void);
  actionWhitelist?: string[];
  timeout?: number;
  retries?: number;
  delay?: number[] | number;
}): MiddlewareType<State> => {
  return {
    action: (action, getState, dispatch, reducer) => {
      if (isObject(action.ajax) && typeof action.ajax.path === 'string') {
        const {
          path,
          data = {},
          method = 'POST',
          silent = false,
          options = {},
          success,
          error,
          ignoreUrl = false,
        } = action.ajax;

        const body: AjaxRequest['body'] = {
          ...(typeof ajaxBody === 'function' ? ajaxBody(getState) : ajaxBody),
          ...data,
        };

        const params: AjaxRequest = {
          timeout,
          ...ajaxRequest,
          ...options,
          url: ignoreUrl === true ? path : url + path,
          body: Object.keys(body).length > 0 ? body : undefined,
          method,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Accept: 'application/json',
            ...(ajaxRequest.headers || {}),
            ...(options.headers || {}),
          },
        };

        const observable = rxAjax(params).pipe(
          retryByError(retries, delay, (err) => !(err instanceof AjaxError) || err.status < 500),
          map<AjaxResponse, ActionSubjectType<State>>((ajaxResponse) => {
            const response = ajaxResponse.response || {};

            if (silent === true) {
              return empty();
            }

            if (success) {
              return success(response, ajaxResponse.status, ajaxResponse.responseType);
            }

            const responseAction = response.action;
            if (actionValidate(responseAction, true) && typeof responseAction.type === 'string') {
              if (Array.isArray(actionWhitelist) && actionWhitelist.indexOf(responseAction.type) === -1) {
                throw new AjaxError(`Action type ${responseAction.type} is not allowed`, ajaxResponse.xhr, params);
              }

              return responseAction;
            }

            return empty();
          }),
          catchError((err: unknown) => (error && err instanceof AjaxError ? of(error(err)) : throwError(err))),
          mergeMap(actionFlat),
        );

        dispatch(observable);
      }

      return action;
    },
  };
};

export default ajax;
