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
        const body = action.ajaxData;
        const next = action.ajaxResponse;
        const method = action.ajaxMethod || 'POST';
        const silent = action.ajaxSilentMode === true;
        const request = action.ajaxRequest || {};

        const params: AjaxRequest = {
          ...request,
          url: url + path,
          body,
          method,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            ...(request.headers || {}),
          },
        };

        const observable = rxAjax(params).pipe(
          map((response) => {
            const data = response.response || {};

            if (silent) {
              return empty();
            }

            if (next) {
              return next(response.status, data, response.responseType);
            }

            if (actionValidate(data.action, true) && typeof data.action.type !== 'symbol') {
              if (Array.isArray(actionWhitelist) && actionWhitelist.indexOf(data.action.type) === -1) {
                throw new AjaxError(`Action type ${data.action.type} is not allowed`, response.xhr, request);
              }

              return data.action;
            }

            throw new AjaxError('No response handler', response.xhr, request);
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