import { empty, MonoTypeOperatorFunction, of, throwError, timer } from 'rxjs';
import { ajax as rxAjax, AjaxError, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { catchError, delayWhen, map, mergeMap, retryWhen } from 'rxjs/operators';
import { ActionSubjectType, MiddlewareType } from '../types';
import { isObject } from '../utils/helper';
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
  ajaxBody?: Record<string, any> | ((state: State) => Record<string, any> | void);
  actionWhitelist?: string[];
  timeout?: number;
  retries?: number;
  delay?: number[] | number;
}): MiddlewareType<State> => {
  return {
    action: (action, state, dispatch, reducer) => {
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
          ...(typeof ajaxBody === 'function' ? ajaxBody(state) : ajaxBody),
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
          retryByError(retries, delay),
          map<AjaxResponse, ActionSubjectType<State>>((ajaxResponse) => {
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

export const retryByError = (retries: number, delay: number[] | number): MonoTypeOperatorFunction<any> =>
  retryWhen((err$) =>
    err$.pipe(
      mergeMap((err: any, i: number) => {
        if (!(err instanceof AjaxError) || err.status < 500) {
          throw err;
        }

        if (i > retries - 1) {
          throw err;
        }

        if (Array.isArray(delay)) {
          return of(typeof delay[i] === 'number' ? delay[i] : delay[delay.length - 1]);
        }

        return of(delay);
      }),
      delayWhen((time) => timer(typeof time === 'number' ? time : 1000)),
    ),
  );

export default ajax;
