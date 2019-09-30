/* tslint:disable:no-submodule-imports */
import { empty } from 'rxjs';
import { ajax as rxAjax, AjaxError, AjaxRequest } from 'rxjs/ajax';
import { map, mergeMap } from 'rxjs/operators';

import { isObject } from '../utils/helper';
import { actionFlat, actionValidate } from '../utils/store';

import { middlewareType, TypeAction } from '../types';

/**
 *
 * @param url
 */
export const ajax = <State>(url: string, actionWhitelist?: TypeAction[]): middlewareType<State> => {
  return {
    action: (action, state, dispatch, reducer) => {
      if (typeof action.ajaxUrlPath === 'string' && (isObject(action.ajaxData) || action.ajaxData === undefined)) {
        const path = action.ajaxUrlPath;
        const body = typeof action.ajaxRequest === 'function' ? action.ajaxRequest(state) : action.ajaxData;
        const next = action.ajaxResponse;
        const method = action.ajaxMethod || 'POST';
        const silent = action.ajaxSilentMode === true;
        const options = action.ajaxOptions || {};

        const params: AjaxRequest = {
          ...options,
          url: url + path,
          body,
          method,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            ...(options.headers || {}),
          },
        };

        const observable = rxAjax(params).pipe(
          map((response) => {
            const data = response.response || {};

            if (silent) {
              return empty();
            }

            if (next) {
              return next(data, response.status, response.responseType);
            }

            if (actionValidate(data.action, true) && typeof data.action.type !== 'symbol') {
              if (Array.isArray(actionWhitelist) && actionWhitelist.indexOf(data.action.type) === -1) {
                throw new AjaxError(`Action type ${data.action.type} is not allowed`, response.xhr, params);
              }

              return data.action;
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
