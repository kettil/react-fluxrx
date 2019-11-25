import { empty, of, throwError } from 'rxjs';
import { ajax as rxAjax, AjaxError, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ActionSubjectType, MiddlewareType, TypeAction } from '../types';
import { actionFlat, actionValidate } from '../utils/store';

export const ajax = <State>({
  url,
  actionWhitelist,
  ajaxRequest = {},
  ajaxBody = {},
}: {
  url: string;
  actionWhitelist?: TypeAction[];
  ajaxRequest?: AjaxRequest;
  ajaxBody?: Record<string, any> | ((state: State) => Record<string, any> | void);
}): MiddlewareType<State> => {
  return {
    action: (action, state, dispatch, reducer) => {
      if (typeof action.ajax === 'object' && typeof action.ajax.path === 'string') {
        const { path, data = {}, method = 'POST', silent = false, options = {}, success, error } = action.ajax;

        const body: AjaxRequest['body'] = {
          ...(typeof ajaxBody === 'function' ? ajaxBody(state) : ajaxBody),
          ...(typeof data === 'function' ? data(state) : data),
        };

        const params: AjaxRequest = {
          ...ajaxRequest,
          ...options,
          url: url + path,
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
          map<AjaxResponse, ActionSubjectType<State, any>>((ajaxResponse) => {
            const response = ajaxResponse.response || {};

            if (silent === true) {
              return empty();
            }

            if (success) {
              return success(response, ajaxResponse.status, ajaxResponse.responseType);
            }

            const responseAction = response.action;
            if (actionValidate(responseAction, true) && typeof responseAction.type !== 'symbol') {
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
