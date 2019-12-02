import { Observable } from 'rxjs';
import { AjaxError } from 'rxjs/ajax';
import { SinonFakeServer, useFakeServer } from 'sinon';
import { ajax } from './ajax';

describe('Check the ajax middleware', () => {
  let xhr: SinonFakeServer;

  beforeEach(() => {
    const cType = { 'Content-Type': 'application/json' };

    const response1 = {
      status: 'ok',
      items: [
        { id: 5, text: 'first', completed: false },
        { id: 9, text: 'second', completed: true },
      ],
    };
    const response2 = { status: 'ok', action: { type: 'add', payload: { id: 5, text: 'five', completed: false } } };
    const response3 = { status: 'ok', item: { id: 7, text: 'new', completed: false } };

    xhr = useFakeServer();

    xhr.respondWith('GET', 'https://localhost/api/todos', [200, cType, JSON.stringify(response1)]);
    xhr.respondWith('GET', 'https://localhost/api/todos?page=7', [200, cType, '']);
    xhr.respondWith('GET', 'https://localhost/api/action/todos/5', [200, cType, JSON.stringify(response2)]);
    xhr.respondWith('POST', 'https://localhost/api/todos', [200, cType, JSON.stringify(response3)]);
  });

  afterEach(() => {
    xhr.restore();
  });

  test('it should be return the middleware object when logger() is called', () => {
    const result = ajax({ url: 'https://localhost' });

    expect(result).toEqual({
      action: expect.any(Function),
    });
  });

  test('it should be no request call when the middleware.action() is called without ajax data', () => {
    const dispatch = jest.fn();
    const reducer = jest.fn();

    const result = ajax({ url: 'https://localhost' });

    expect(result).toEqual({
      action: expect.any(Function),
    });

    const callback = result.action as (...args: any[]) => void;

    expect(callback.length).toBe(4);

    const action = {
      type: 'load',
      payload: { showLoader: true },
    };

    const value = callback(action, {}, dispatch, reducer);

    expect(value).toBe(action);
    expect(value).toEqual({
      type: 'load',
      payload: { showLoader: true },
    });

    expect(reducer).toHaveBeenCalledTimes(0);
    expect(dispatch).toHaveBeenCalledTimes(0);
  });

  describe('Call middleware.action() with ajax data', () => {
    test('it should be request call when action() is called and silent mode is on', (done) => {
      expect.assertions(10);

      xhr.respondWith('GET', 'https://localhost/api/todos', [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify([
          { id: 5, text: 'first', completed: false },
          { id: 9, text: 'second', completed: true },
        ]),
      ]);

      const reducer = jest.fn();
      const dispatch = jest.fn((action$: Observable<any>) =>
        action$.subscribe(
          () => {
            done(new Error('Call without error (next)'));
          },
          done,
          () => {
            expect(xhr.requests.length).toBe(1);
            expect(xhr.requests[0].method).toBe('GET');
            expect(xhr.requests[0].requestHeaders).toEqual({
              'Content-Type': 'application/json;charset=utf-8',
              Accept: 'application/json',
            });
            expect(xhr.requests[0].requestBody).toBe('{"autrh":true}');

            done();
          },
        ),
      );

      const result = ajax({ url: 'https://localhost', ajaxBody: () => ({ autrh: true }) });
      expect(result).toEqual({ action: expect.any(Function) });

      const callback = result.action as (...args: any[]) => void;
      expect(callback.length).toBe(4);

      const action = {
        type: 'load',
        payload: { showLoader: true },

        // ajax
        ajax: {
          path: '/api/todos',
          method: 'GET',
          silent: true,
        },
      };

      const value = callback(action, {}, dispatch, reducer);
      expect(value).toBe(action);
      expect(value).toEqual({
        type: 'load',
        payload: { showLoader: true },
        ajax: {
          path: '/api/todos',
          method: 'GET',
          silent: true,
        },
      });

      expect(reducer).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(1);

      xhr.respond();
    });

    test('it should be request call when action() is called and with a callback', (done) => {
      expect.assertions(14);

      const reducer = jest.fn();
      const dispatch = jest.fn((action$: Observable<any>) =>
        action$.subscribe(
          (responseAction) => {
            try {
              expect(responseAction).toEqual({
                payload: {
                  completed: false,
                  id: 7,
                  text: 'new',
                },
                type: 'add',
              });
            } catch (err) {
              done(err);
            }
          },
          done,
          () => {
            try {
              expect(xhr.requests.length).toBe(1);
              expect(xhr.requests[0].method).toBe('POST');
              expect(xhr.requests[0].requestHeaders).toEqual({
                'Content-Type': 'application/json;charset=utf-8',
                Accept: 'application/json',
              });
              expect(xhr.requests[0].requestBody).toBe(
                JSON.stringify({
                  item: {
                    completed: false,
                    text: 'new',
                  },
                }),
              );

              done();
            } catch (err) {
              done(err);
            }
          },
        ),
      );

      const result = ajax({ url: 'https://localhost' });
      expect(result).toEqual({ action: expect.any(Function) });

      const callback = result.action as (...args: any[]) => void;
      expect(callback.length).toBe(4);

      const action = {
        type: 'load',
        payload: { showLoader: true },

        // ajax
        ajax: {
          path: 'https://localhost/api/todos',
          data: { item: { completed: false, text: 'new' } },
          ignoreUrl: true,
          success: (responseData: Record<string, any>, responseStatus: number, responseType: string) => {
            expect(responseStatus).toBe(200);
            expect(responseData).toEqual({ item: { completed: false, id: 7, text: 'new' }, status: 'ok' });
            expect(responseType).toBe('json');

            return {
              type: 'add',
              payload: responseData.item,
            };
          },
        },
      };

      const value = callback(action, {}, dispatch, reducer);
      expect(value).toBe(action);
      expect(value).toEqual({
        type: 'load',
        payload: { showLoader: true },
        ajax: {
          path: 'https://localhost/api/todos',
          ignoreUrl: true,
          data: { item: { completed: false, text: 'new' } },
          success: expect.any(Function),
        },
      });

      expect(reducer).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(1);

      xhr.respond();
    });

    test('it should be request call when action() is called and the response data has an action structure (without whitelist)', (done) => {
      expect.assertions(11);

      const reducer = jest.fn();
      const dispatch = jest.fn((action$: Observable<any>) =>
        action$.subscribe(
          (responseAction) => {
            try {
              expect(responseAction).toEqual({
                payload: {
                  completed: false,
                  id: 5,
                  text: 'five',
                },
                type: 'add',
              });
            } catch (err) {
              done(err);
            }
          },
          done,
          () => {
            try {
              expect(xhr.requests.length).toBe(1);
              expect(xhr.requests[0].method).toBe('GET');
              expect(xhr.requests[0].requestHeaders).toEqual({
                'Content-Type': 'application/json;charset=utf-8',
                Accept: 'application/ld+json',
              });
              expect(xhr.requests[0].requestBody).toBeUndefined();

              done();
            } catch (err) {
              done(err);
            }
          },
        ),
      );

      const result = ajax({ url: 'https://localhost', ajaxRequest: { headers: { Accept: 'application/ld+json' } } });
      expect(result).toEqual({ action: expect.any(Function) });

      const callback = result.action as (...args: any[]) => void;
      expect(callback.length).toBe(4);

      const action = {
        type: 'load',
        payload: { showLoader: true },

        // ajax
        ajax: {
          path: '/api/action/todos/5',
          method: 'GET',
        },
      };

      const value = callback(action, {}, dispatch, reducer);
      expect(value).toBe(action);
      expect(value).toEqual({
        type: 'load',
        payload: { showLoader: true },
        ajax: {
          path: '/api/action/todos/5',
          method: 'GET',
        },
      });

      expect(reducer).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(1);

      xhr.respond();
    });

    test('it should be request call when action() is called, response data has an action structure and action type is in the whitelist', (done) => {
      expect.assertions(11);

      const reducer = jest.fn();
      const dispatch = jest.fn((action$: Observable<any>) =>
        action$.subscribe(
          (responseAction) => {
            try {
              expect(responseAction).toEqual({
                payload: {
                  completed: false,
                  id: 5,
                  text: 'five',
                },
                type: 'add',
              });
            } catch (err) {
              done(err);
            }
          },
          done,
          () => {
            try {
              expect(xhr.requests.length).toBe(1);
              expect(xhr.requests[0].method).toBe('GET');
              expect(xhr.requests[0].requestHeaders).toEqual({
                'Content-Type': 'application/json;charset=utf-8',
                Accept: 'application/json',
              });
              expect(xhr.requests[0].requestBody).toBeUndefined();

              done();
            } catch (err) {
              done(err);
            }
          },
        ),
      );

      const result = ajax({ url: 'https://localhost', actionWhitelist: ['add'] });
      expect(result).toEqual({ action: expect.any(Function) });

      const callback = result.action as (...args: any[]) => void;
      expect(callback.length).toBe(4);

      const action = {
        type: 'load',
        payload: { showLoader: true },

        // ajax
        ajax: {
          path: '/api/action/todos/5',
          method: 'GET',
        },
      };

      const value = callback(action, {}, dispatch, reducer);
      expect(value).toBe(action);
      expect(value).toEqual({
        type: 'load',
        payload: { showLoader: true },
        ajax: {
          path: '/api/action/todos/5',
          method: 'GET',
        },
      });

      expect(reducer).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(1);

      xhr.respond();
    });

    test('it should be throw an error when action() is called, response data has an action structure and action type is not in the whitelist', (done) => {
      expect.assertions(12);

      const reducer = jest.fn();
      const dispatch = jest.fn((action$: Observable<any>) =>
        action$.subscribe(
          () => {
            done(new Error('Call without error (next)'));
          },
          (err: Error) => {
            try {
              expect(err).toBeInstanceOf(AjaxError);
              expect(err.message).toBe('Action type add is not allowed');

              expect(xhr.requests.length).toBe(1);
              expect(xhr.requests[0].method).toBe('GET');
              expect(xhr.requests[0].requestHeaders).toEqual({
                'Content-Type': 'application/json;charset=utf-8',
                Accept: 'application/json',
              });
              expect(xhr.requests[0].requestBody).toBeUndefined();

              done();
            } catch (err) {
              done(err);
            }
          },
          () => {
            done(new Error('Call without error (complete)'));
          },
        ),
      );

      const result = ajax({ url: 'https://localhost', actionWhitelist: ['remove'] });
      expect(result).toEqual({ action: expect.any(Function) });

      const callback = result.action as (...args: any[]) => void;
      expect(callback.length).toBe(4);

      const action = {
        type: 'load',
        payload: { showLoader: true },

        // ajax
        ajax: {
          path: '/api/action/todos/5',
          method: 'GET',
        },
      };

      const value = callback(action, {}, dispatch, reducer);
      expect(value).toBe(action);
      expect(value).toEqual({
        type: 'load',
        payload: { showLoader: true },
        ajax: {
          path: '/api/action/todos/5',
          method: 'GET',
        },
      });

      expect(reducer).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(1);

      xhr.respond();
    });

    test('it should be nothing when action() is called and without response handler', (done) => {
      expect.assertions(10);

      const reducer = jest.fn();
      const dispatch = jest.fn((action$: Observable<any>) =>
        action$.subscribe(
          () => {
            done(new Error('Do not call next callback'));
          },
          done,
          () => {
            expect(xhr.requests.length).toBe(1);
            expect(xhr.requests[0].method).toBe('GET');
            expect(xhr.requests[0].requestHeaders).toEqual({
              'Content-Type': 'application/json;charset=utf-8',
              Accept: 'application/json',
            });
            expect(xhr.requests[0].requestBody).toBeUndefined();

            done();
          },
        ),
      );

      const result = ajax({ url: 'https://localhost' });
      expect(result).toEqual({ action: expect.any(Function) });

      const callback = result.action as (...args: any[]) => void;
      expect(callback.length).toBe(4);

      const action = {
        type: 'load',
        payload: { showLoader: true },

        // ajax
        ajax: {
          path: '/api/todos?page=7',
          method: 'GET',
        },
      };

      const value = callback(action, {}, dispatch, reducer);
      expect(value).toBe(action);
      expect(value).toEqual({
        type: 'load',
        payload: { showLoader: true },

        ajax: {
          path: '/api/todos?page=7',
          method: 'GET',
        },
      });

      expect(reducer).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(1);

      xhr.respond();
    });

    test('it should be throw an error when action() is called and url is wrong', (done) => {
      expect.assertions(12);

      const reducer = jest.fn();
      const dispatch = jest.fn((action$: Observable<any>) =>
        action$.subscribe(
          () => {
            done(new Error('Call without error (next)'));
          },
          (err: Error) => {
            try {
              expect(err).toBeInstanceOf(AjaxError);
              expect(err.message).toBe('ajax error 404');

              expect(xhr.requests.length).toBe(1);
              expect(xhr.requests[0].method).toBe('GET');
              expect(xhr.requests[0].requestHeaders).toEqual({
                'Content-Type': 'application/json;charset=utf-8',
                Accept: 'application/json',
              });
              expect(xhr.requests[0].requestBody).toBeUndefined();

              done();
            } catch (err) {
              done(err);
            }
          },
          () => {
            done(new Error('Call without error (complete)'));
          },
        ),
      );

      const result = ajax({ url: 'https://localhost' });
      expect(result).toEqual({ action: expect.any(Function) });

      const callback = result.action as (...args: any[]) => void;
      expect(callback.length).toBe(4);

      const action = {
        type: 'load',
        payload: { showLoader: true },

        // ajax
        ajax: {
          path: '/api/todoss',
          method: 'GET',
        },
      };

      const value = callback(action, {}, dispatch, reducer);
      expect(value).toBe(action);
      expect(value).toEqual({
        type: 'load',
        payload: { showLoader: true },

        ajax: {
          path: '/api/todoss',
          method: 'GET',
        },
      });

      expect(reducer).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(1);

      xhr.respond();
    });

    test('it should be throw an error callback when action() is called and url is wrong', (done) => {
      expect.assertions(10);

      const reducer = jest.fn();
      const dispatch = jest.fn((action$: Observable<any>) =>
        action$.subscribe(
          (data) => {
            expect(data).toEqual({ payload: { showError: true }, type: 'error' });
          },
          done,
          done,
        ),
      );

      const result = ajax({ url: 'https://localhost' });
      expect(result).toEqual({ action: expect.any(Function) });

      const callback = result.action as (...args: any[]) => void;
      expect(callback.length).toBe(4);

      const action = {
        type: 'load',
        payload: { showLoader: true },

        // ajax
        ajax: {
          path: '/api/todoss',
          method: 'GET',
          error: (err: any) => {
            expect(err).toBeInstanceOf(AjaxError);
            expect(err.message).toBe('ajax error 404');
            expect(err.status).toBe(404);

            return {
              type: 'error',
              payload: {
                showError: true,
              },
            };
          },
        },
      };

      const value = callback(action, {}, dispatch, reducer);
      expect(value).toBe(action);
      expect(value).toEqual({
        type: 'load',
        payload: { showLoader: true },

        ajax: {
          path: '/api/todoss',
          method: 'GET',
          error: expect.any(Function),
        },
      });

      expect(reducer).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(1);

      xhr.respond();
    });
  });
});
