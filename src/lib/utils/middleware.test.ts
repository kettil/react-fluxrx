// tslint:disable:no-console
import { isObservable, of, Subject } from 'rxjs';
import { MiddlewareUtils } from './middleware';

const getState = jest.fn();
const dispatch = jest.fn();
const reducer = jest.fn();

describe('Check the middleware class', () => {
  test('initialize the class', () => {
    const middleware = new MiddlewareUtils();

    expect(middleware).toBeInstanceOf(MiddlewareUtils);
  });

  const testDataHandler = [
    ['an object', jest.fn().mockReturnValue({ type: 'remove', payload: { message: '...' } })],
    ['an promise', jest.fn().mockResolvedValue({ type: 'remove', payload: { message: '...' } })],
    ['an observable', jest.fn().mockReturnValue(of({ type: 'remove', payload: { message: '...' } }))],
  ];

  test.each((testDataHandler as any) as Array<[string, jest.Mock, jest.DoneCallback]>)(
    'it should be return an observable when handler() is called with %s',
    (_, middleware, done) => {
      expect.assertions(8);

      const next = jest.fn();
      const middlewareUtils = new MiddlewareUtils();
      const result = middlewareUtils.handler(
        of({ type: 'remove', payload: { message: '...' } }),
        middleware,
        getState,
        dispatch,
        reducer,
      );

      expect(isObservable(result)).toBe(true);

      result.subscribe(next, done, () => {
        try {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith({ payload: { message: '...' }, type: 'remove' });

          expect(getState).toHaveBeenCalledTimes(0);
          expect(reducer).toHaveBeenCalledTimes(0);
          expect(dispatch).toHaveBeenCalledTimes(0);
          expect(middleware).toHaveBeenCalledTimes(1);
          expect(middleware).toHaveBeenCalledWith(
            { payload: { message: '...' }, type: 'remove' },
            getState,
            dispatch,
            reducer,
          );

          done();
        } catch (err) {
          done(err);
        }
      });
    },
  );

  test('it should be throw an error when handler() is called and the middleware return a wrong action', (done) => {
    expect.assertions(8);

    const middleware = jest.fn().mockReturnValue({ payload: { message: '...' } });

    const middlewareUtils = new MiddlewareUtils();
    const result = middlewareUtils.handler(
      of({ type: 'remove', payload: { message: '...' } }),
      middleware,
      getState,
      dispatch,
      reducer,
    );

    expect(isObservable(result)).toBe(true);

    result.subscribe(
      () => done(new Error('No error was thrown')),
      (err) => {
        try {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBe('Incorrect action structure ({"payload":{"message":"..."}})');

          expect(getState).toHaveBeenCalledTimes(0);
          expect(reducer).toHaveBeenCalledTimes(0);
          expect(dispatch).toHaveBeenCalledTimes(0);
          expect(middleware).toHaveBeenCalledTimes(1);
          expect(middleware).toHaveBeenCalledWith(
            { type: 'remove', payload: { message: '...' } },
            getState,
            dispatch,
            reducer,
          );

          done();
        } catch (err) {
          done(err);
        }
      },
    );
  });

  test('it should be return an observable when manager() is called', (done) => {
    expect.assertions(13);

    const next = jest.fn();
    const middleware1 = jest.fn().mockImplementation((action, getStateCb) => ({ ...action, ...getStateCb() }));
    const middleware2 = jest.fn().mockImplementation((action, getStateCb) => ({ ...action, ...getStateCb() }));
    const subscribe = jest.fn();
    const getStateLocal = jest.fn().mockReturnValue({ todos: [] });

    const middlewareUtils = new MiddlewareUtils();

    const callback = middlewareUtils.manager(
      [middleware1, middleware2],
      { dispatch, getState: getStateLocal, subscribe },
      reducer,
    );

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(1);

    const result = callback(of({ type: 'edit', payload: { id: 4, message: '...' } }));
    const expected = { type: 'edit', payload: { id: 4, message: '...' } };

    expect(isObservable(result)).toBe(true);

    result.subscribe(next, done, () => {
      try {
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({
          payload: { id: 4, message: '...' },
          type: 'edit',
          todos: [],
        });

        expect(getStateLocal).toHaveBeenCalledTimes(2);
        expect(subscribe).toHaveBeenCalledTimes(0);
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(reducer).toHaveBeenCalledTimes(0);
        expect(middleware1).toHaveBeenCalledTimes(1);
        expect(middleware1).toHaveBeenCalledWith(expected, getStateLocal, dispatch, reducer);
        expect(middleware2).toHaveBeenCalledTimes(1);
        expect(middleware2).toHaveBeenCalledWith({ ...expected, todos: [] }, getStateLocal, dispatch, reducer);

        done();
      } catch (err) {
        done(err);
      }
    });
  });

  test('it should be return an observable when manager() is called without calling the middleware', (done) => {
    expect.assertions(11);

    const next = jest.fn();
    const middleware1 = jest.fn().mockImplementation((action, getStateCb) => ({ ...action, ...getStateCb() }));
    const middleware2 = jest.fn().mockImplementation((action, getStateCb) => ({ ...action, ...getStateCb() }));
    const subscribe = jest.fn();
    const getStateLocal = jest.fn().mockReturnValue({ todos: [] });

    const middlewareUtils = new MiddlewareUtils();

    const callback = middlewareUtils.manager(
      [middleware1, middleware2],
      { dispatch, getState: getStateLocal, subscribe },
      reducer,
    );

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(1);

    const result = callback(of({ type: 'edit', payload: { id: 4, message: '...' }, ignoreMiddleware: true }));

    expect(isObservable(result)).toBe(true);

    result.subscribe(next, done, () => {
      try {
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({
          ignoreMiddleware: true,
          payload: { id: 4, message: '...' },
          type: 'edit',
        });

        expect(getStateLocal).toHaveBeenCalledTimes(0);
        expect(subscribe).toHaveBeenCalledTimes(0);
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(reducer).toHaveBeenCalledTimes(0);
        expect(middleware1).toHaveBeenCalledTimes(0);
        expect(middleware2).toHaveBeenCalledTimes(0);

        done();
      } catch (err) {
        done(err);
      }
    });
  });

  test('it should be call the getState() twice when manager() is called and trigger two actions', (done) => {
    expect.assertions(12);

    const next = jest.fn();
    const middleware = jest.fn().mockImplementation((action, getStateCb) => ({ ...action, ...getStateCb() }));
    const subscribe = jest.fn();
    const getStateLocal = jest
      .fn()
      .mockReturnValue({ todos: [] })
      .mockReturnValueOnce({ todos: [], firstRun: true });

    const middlewareUtils = new MiddlewareUtils();

    const callback = middlewareUtils.manager([middleware], { dispatch, getState: getStateLocal, subscribe }, reducer);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(1);

    const expected = { payload: { id: 4, message: '...' }, type: 'edit' };
    const subject$ = new Subject<any>();

    const result$ = callback(subject$);

    expect(isObservable(result$)).toBe(true);

    result$.subscribe(next, done, () => {
      try {
        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenNthCalledWith(1, { ...expected, firstRun: true, todos: [] });
        expect(next).toHaveBeenNthCalledWith(2, { ...expected, todos: [] });

        expect(getStateLocal).toHaveBeenCalledTimes(2);
        expect(subscribe).toHaveBeenCalledTimes(0);
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(reducer).toHaveBeenCalledTimes(0);
        expect(middleware).toHaveBeenCalledTimes(2);
        expect(middleware).toHaveBeenCalledWith(expected, getStateLocal, dispatch, reducer);

        done();
      } catch (err) {
        done(err);
      }
    });

    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });

    subject$.complete();
  });

  test('it should be call the getState() twice when manager() is called and trigger five actions', (done) => {
    expect.assertions(15);

    const next = jest.fn();
    const middleware = jest.fn().mockImplementation((action, getStateCb) => ({ ...action, ...getStateCb() }));
    const subscribe = jest.fn();
    const getStateLocal = jest
      .fn()
      .mockReturnValue({ todos: [] })
      .mockReturnValueOnce({ todos: [], firstRun: true })
      .mockReturnValueOnce({ todos: [], secondRun: true });

    const middlewareUtils = new MiddlewareUtils();

    const callback = middlewareUtils.manager([middleware], { dispatch, getState: getStateLocal, subscribe }, reducer);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(1);

    const expected = { payload: { id: 4, message: '...' }, type: 'edit' };
    const subject$ = new Subject<any>();

    const result$ = callback(subject$);

    expect(isObservable(result$)).toBe(true);

    result$.subscribe(next, done, () => {
      try {
        expect(next).toHaveBeenCalledTimes(5);
        expect(next).toHaveBeenNthCalledWith(1, { ...expected, firstRun: true, todos: [] });
        expect(next).toHaveBeenNthCalledWith(2, { ...expected, ignoreMiddleware: true });
        expect(next).toHaveBeenNthCalledWith(3, { ...expected, ignoreMiddleware: true });
        expect(next).toHaveBeenNthCalledWith(4, { ...expected, secondRun: true, todos: [] });
        expect(next).toHaveBeenNthCalledWith(5, { ...expected, todos: [] });

        expect(getStateLocal).toHaveBeenCalledTimes(3);
        expect(subscribe).toHaveBeenCalledTimes(0);
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(reducer).toHaveBeenCalledTimes(0);
        expect(middleware).toHaveBeenCalledTimes(3);
        expect(middleware).toHaveBeenCalledWith(expected, getStateLocal, dispatch, reducer);

        done();
      } catch (err) {
        done(err);
      }
    });

    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' }, ignoreMiddleware: true });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' }, ignoreMiddleware: true });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });

    subject$.complete();
  });
});
