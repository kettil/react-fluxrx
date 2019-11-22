// tslint:disable:no-console
import { of, throwError } from 'rxjs';
import { createStore } from './store';
import { MiddlewareInitType } from './types';

const reducer = jest.fn((a, b) => ({ ...a, action: [...a.action, b.payload] }));

const middlewareInit2 = jest.fn();
const middlewareAction1 = jest.fn((a) => a);
const middlewareAction2 = jest.fn(async (a) => a);
const middlewareError1 = jest.fn();

describe('Check the store', () => {
  let state: any;
  let middleware: any[];

  beforeEach(() => {
    state = { action: [] };

    middleware = [
      { action: middlewareAction1, error: middlewareError1 },
      { init: middlewareInit2, action: middlewareAction2 },
    ];
  });

  test('initialize the store', () => {
    const store = createStore(reducer, state, middleware);

    expect(store).toEqual({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      subscribe: expect.any(Function),
    });

    expect(store.getState()).toEqual({ action: [] });
    expect(reducer).toHaveBeenCalledTimes(0);

    expect(middlewareInit2).toHaveBeenCalledTimes(1);
    expect(middlewareInit2).toHaveBeenCalledWith(state, store.dispatch, expect.any(Function));
    expect(middlewareAction1).toHaveBeenCalledTimes(0);
    expect(middlewareAction2).toHaveBeenCalledTimes(0);
    expect(middlewareError1).toHaveBeenCalledTimes(0);
  });

  test('it should be that the initial state is passed when subscribing', (done) => {
    expect.assertions(3);

    const store = createStore(reducer, state);

    expect(store).toEqual({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      subscribe: expect.any(Function),
    });

    expect(reducer).toHaveBeenCalledTimes(0);

    store.subscribe((newState) => {
      expect(newState).toEqual({ action: [] });
      done();
    });
  });

  test('it should be that the last state is passed when subscribing', (done) => {
    expect.assertions(11);

    const store = createStore(reducer, state, middleware, 5);

    expect(store).toEqual({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      subscribe: expect.any(Function),
    });

    const action = { type: 'update', payload: { lastname: 'q' } };

    store.dispatch({ type: 'update', payload: { lastname: 'q' } });

    setTimeout(() => {
      store.subscribe((newState) => {
        try {
          expect(newState).toEqual({ action: [{ lastname: 'q' }] });

          expect(reducer).toHaveBeenCalledTimes(1);
          expect(reducer).toHaveBeenCalledWith({ action: [] }, action);

          expect(middlewareInit2).toHaveBeenCalledTimes(1);
          expect(middlewareInit2).toHaveBeenCalledWith(state, store.dispatch, expect.any(Function));
          expect(middlewareAction1).toHaveBeenCalledTimes(1);
          expect(middlewareAction1).toHaveBeenCalledWith(action, state, store.dispatch, expect.any(Function));
          expect(middlewareAction2).toHaveBeenCalledTimes(1);
          expect(middlewareAction2).toHaveBeenCalledWith(action, state, store.dispatch, expect.any(Function));
          expect(middlewareError1).toHaveBeenCalledTimes(0);

          done();
        } catch (err) {
          done(err);
        }
      });
    }, 100);
  });

  test('it should be that subscription callback is called twice when dispather is called twice', (done) => {
    expect.assertions(6);

    const store = createStore(reducer, state);

    expect(store).toEqual({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      subscribe: expect.any(Function),
    });

    const action1 = { type: 'update', payload: { lastname: 'q' } };
    const action2 = { type: 'add', payload: { firstname: 'b', lastname: 'y' } };

    let i = 0;
    store.subscribe((newState) => {
      try {
        switch (i) {
          case 0:
            expect(newState).toEqual({ action: [] });
            break;

          case 1:
            expect(newState).toEqual({ action: [{ lastname: 'q' }] });
            done();
        }

        i++;
      } catch (err) {
        done(err);
      }
    });

    store.dispatch(of(action1, action2));

    expect(reducer).toHaveBeenCalledTimes(2);
    expect(reducer).toHaveBeenNthCalledWith(1, { action: [] }, { payload: { lastname: 'q' }, type: 'update' });
    expect(reducer).toHaveBeenNthCalledWith(
      2,
      { action: [{ lastname: 'q' }] },
      { payload: { firstname: 'b', lastname: 'y' }, type: 'add' },
    );
  });

  test('it should be that the state is changed directly when updateDirectly() is called', (done) => {
    expect.assertions(2);

    const middlewareInit: MiddlewareInitType<any> = (_1, _2, updateDirectly) => {
      updateDirectly({ articles: [] });
    };

    const store = createStore(reducer, state, [{ init: middlewareInit }]);

    expect(store).toEqual({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      subscribe: expect.any(Function),
    });

    store.subscribe((newState) => {
      try {
        expect(newState).toEqual({
          articles: [],
        });
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  test('it should be that the state was restored and adjusted by action when the dispatcher was called after updateDirectly()', (done) => {
    expect.assertions(2);

    const middlewareInit: MiddlewareInitType<any> = (_1, _2, updateDirectly) => {
      updateDirectly({ articles: [], action: [] });
    };

    const store = createStore(reducer, state, [{ init: middlewareInit }]);

    expect(store).toEqual({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      subscribe: expect.any(Function),
    });

    store.dispatch({ type: 'remove', payload: { id: 5 } });

    store.subscribe((newState) => {
      try {
        expect(newState).toEqual({ action: [{ id: 5 }] });
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  test('it should be that the default error handler is called when an incorrect action is passed without middleware', (done) => {
    jest.spyOn(console, 'error').mockImplementation();

    expect.assertions(5);

    const action: any = { type: 'update' };

    const store = createStore(reducer, state);

    expect(store).toEqual({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      subscribe: expect.any(Function),
    });

    store.dispatch(action);

    setTimeout(() => {
      store.subscribe((newState) => {
        try {
          expect(newState).toEqual({ action: [] });

          expect(console.error).toHaveBeenCalledTimes(1);
          expect(console.error).toHaveBeenCalledWith(expect.any(Error));
          expect((console.error as jest.Mock).mock.calls[0][0].message).toBe(
            'Incorrect action structure ({"type":"update"})',
          );
          done();
        } catch (err) {
          done(err);
        }
      });
    }, 100);
  });

  test('it should be that the middleware error handler is called when an error is thrown', (done) => {
    expect.assertions(4);

    const error = new Error('Middleware error');
    const middlewareAction = jest.fn().mockImplementation(() => {
      throw error;
    });
    const middlewareError = jest.fn();

    const action = { type: 'update', payload: { lastname: 'q' } };

    const store = createStore(reducer, state, [{ action: middlewareAction, error: middlewareError }]);

    expect(store).toEqual({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      subscribe: expect.any(Function),
    });

    store.dispatch(action);

    store.subscribe((newState) => {
      try {
        expect(newState).toEqual({ action: [] });

        expect(middlewareError).toHaveBeenCalledTimes(1);
        expect(middlewareError).toHaveBeenCalledWith(error, store.dispatch, state);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  test('it should be that an error was caught when a middleware init has thrown an error', () => {
    jest.spyOn(console, 'error').mockImplementation();

    expect.assertions(2);

    try {
      createStore(reducer, state, [
        {
          init: () => {
            throw new Error('init error');
          },
        },
      ]);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('init error');
    }
  });

  test('it should be that the default error handler is called when the middleware error handler has thrown an error', () => {
    jest.spyOn(console, 'error').mockImplementation();

    expect.assertions(4);

    const action: any = { type: 'update' };

    const store = createStore(reducer, state, [
      {
        error: () => {
          throw new Error('middleware error');
        },
      },
    ]);

    expect(store).toEqual({
      dispatch: expect.any(Function),
      getState: expect.any(Function),
      subscribe: expect.any(Function),
    });

    store.dispatch(action);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    expect((console.error as jest.Mock).mock.calls[0][0].message).toBe('middleware error');
  });

  test('it should be reduce a action normaly after a faulty action', () => {
    expect.assertions(4);

    const subscribtion = jest.fn();

    const store = createStore(reducer, state, [{ error: () => undefined }]);

    store.subscribe(subscribtion);

    store.dispatch({ type: 'run1', payload: { id: 1 } });
    store.dispatch(throwError('Test-Error'));
    store.dispatch({ type: 'run1', payload: { id: 2 } });

    expect(subscribtion).toHaveBeenCalledTimes(3);
    expect(subscribtion).toHaveBeenNthCalledWith(1, { action: [] });
    expect(subscribtion).toHaveBeenNthCalledWith(2, { action: [{ id: 1 }] });
    expect(subscribtion).toHaveBeenNthCalledWith(3, { action: [{ id: 1 }, { id: 2 }] });
  });
});
