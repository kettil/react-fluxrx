import { empty } from 'rxjs';
import { ajax as rxAjax, AjaxError, AjaxRequest } from 'rxjs/ajax';
import { map, mergeMap } from 'rxjs/operators';
import { middlewareType, TypeAction } from '../types';
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
}): middlewareType<State> => {
  return {
    action: (action, state, dispatch, reducer) => {
      if (typeof action.ajax === 'object' && typeof action.ajax.path === 'string') {
        const { path, data = {}, response: next, method = 'POST', silent = false, options = {} } = action.ajax;

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
          map((ajaxResponse) => {
            const response = ajaxResponse.response || {};

            if (silent === true) {
              return empty();
            }

            if (next) {
              return next(response, ajaxResponse.status, ajaxResponse.responseType);
            }

            if (actionValidate(response.action, true) && typeof response.action.type !== 'symbol') {
              if (Array.isArray(actionWhitelist) && actionWhitelist.indexOf(response.action.type) === -1) {
                throw new AjaxError(`Action type ${response.action.type} is not allowed`, ajaxResponse.xhr, params);
              }

              return response.action;
            }

            return empty();
          }),
          mergeMap(actionFlat),
        );

        dispatch(observable);
      }

      return action;
    },
  };
};

export default ajax;
