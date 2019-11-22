// tslint:disable:no-console
import { isObservable, of, Subject } from 'rxjs';
import { MiddlewareUtils } from './middleware';

const dispatch = jest.fn();
const reducer = jest.fn();

/**
 *
 */
describe('Check the middleware class', () => {
  /**
   *
   */
  test('initialize the class', () => {
    const middleware = new MiddlewareUtils();

    expect(middleware).toBeInstanceOf(MiddlewareUtils);
  });

  const testDataHandler = [
    ['an object', jest.fn().mockReturnValue({ type: 'remove', payload: { message: '...' } })],
    ['an promise', jest.fn().mockResolvedValue({ type: 'remove', payload: { message: '...' } })],
    ['an observable', jest.fn().mockReturnValue(of({ type: 'remove', payload: { message: '...' } }))],
  ];

  /**
   *
   */
  test.each((testDataHandler as any) as Array<[string, jest.Mock, jest.DoneCallback]>)(
    'it should be return an observable when handler() is called with %s',
    (_, middleware, done) => {
      expect.assertions(6);

      const middlewareUtils = new MiddlewareUtils();
      const result = middlewareUtils.handler(
        of({ type: 'remove', payload: { message: '...' } }),
        middleware,
        { todos: [] },
        dispatch,
        reducer,
      );

      expect(isObservable(result)).toBe(true);

      result.subscribe(
        (action) => {
          try {
            expect(action).toEqual({ type: 'remove', payload: { message: '...' } });
          } catch (err) {
            done(err);
          }
        },
        done,
        () => {
          try {
            expect(reducer).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledTimes(0);
            expect(middleware).toHaveBeenCalledTimes(1);
            expect(middleware).toHaveBeenCalledWith(
              { payload: { message: '...' }, type: 'remove' },
              { todos: [] },
              dispatch,
              reducer,
            );

            done();
          } catch (err) {
            done(err);
          }
        },
      );
    },
  );

  /**
   *
   */
  test('it should be throw an error when handler() is called and the middleware return a wrong action', (done) => {
    expect.assertions(7);

    const middleware = jest.fn().mockReturnValue({ payload: { message: '...' } });

    const middlewareUtils = new MiddlewareUtils();
    const result = middlewareUtils.handler(
      of({ type: 'remove', payload: { message: '...' } }),
      middleware,
      { todos: [] },
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

          expect(reducer).toHaveBeenCalledTimes(0);
          expect(dispatch).toHaveBeenCalledTimes(0);
          expect(middleware).toHaveBeenCalledTimes(1);
          expect(middleware).toHaveBeenCalledWith(
            { type: 'remove', payload: { message: '...' } },
            { todos: [] },
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

  /**
   *
   */
  test('it should be return an observable when manager() is called', (done) => {
    expect.assertions(12);

    const middleware1 = jest.fn().mockImplementation((action) => action);
    const middleware2 = jest.fn().mockImplementation((action) => action);
    const subscribe = jest.fn();
    const getState = jest.fn().mockReturnValue({ todos: [] });

    const middlewareUtils = new MiddlewareUtils();

    const callback = middlewareUtils.manager([middleware1, middleware2], { dispatch, getState, subscribe }, reducer);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(1);

    const result = callback(of({ type: 'edit', payload: { id: 4, message: '...' } }));

    expect(isObservable(result)).toBe(true);

    result.subscribe(
      (action) => {
        try {
          expect(action).toEqual({ type: 'edit', payload: { id: 4, message: '...' } });
        } catch (err) {
          done(err);
        }
      },
      done,
      () => {
        try {
          expect(getState).toHaveBeenCalledTimes(1);
          expect(subscribe).toHaveBeenCalledTimes(0);
          expect(dispatch).toHaveBeenCalledTimes(0);
          expect(reducer).toHaveBeenCalledTimes(0);
          expect(middleware1).toHaveBeenCalledTimes(1);
          expect(middleware1).toHaveBeenCalledWith(
            { type: 'edit', payload: { id: 4, message: '...' } },
            { todos: [] },
            dispatch,
            reducer,
          );
          expect(middleware2).toHaveBeenCalledTimes(1);
          expect(middleware2).toHaveBeenCalledWith(
            { type: 'edit', payload: { id: 4, message: '...' } },
            { todos: [] },
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

  /**
   *
   */
  test('it should be return an observable when manager() is called without calling the middleware', (done) => {
    expect.assertions(10);

    const middleware1 = jest.fn().mockImplementation((action) => action);
    const middleware2 = jest.fn().mockImplementation((action) => action);
    const subscribe = jest.fn();
    const getState = jest.fn().mockReturnValue({ todos: [] });

    const middlewareUtils = new MiddlewareUtils();

    const callback = middlewareUtils.manager([middleware1, middleware2], { dispatch, getState, subscribe }, reducer);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(1);

    const result = callback(of({ type: 'edit', payload: { id: 4, message: '...' }, ignoreMiddleware: true }));

    expect(isObservable(result)).toBe(true);

    result.subscribe(
      (action) => {
        try {
          expect(action).toEqual({ type: 'edit', payload: { id: 4, message: '...' }, ignoreMiddleware: true });
        } catch (err) {
          done(err);
        }
      },
      done,
      () => {
        try {
          expect(getState).toHaveBeenCalledTimes(0);
          expect(subscribe).toHaveBeenCalledTimes(0);
          expect(dispatch).toHaveBeenCalledTimes(0);
          expect(reducer).toHaveBeenCalledTimes(0);
          expect(middleware1).toHaveBeenCalledTimes(0);
          expect(middleware2).toHaveBeenCalledTimes(0);

          done();
        } catch (err) {
          done(err);
        }
      },
    );
  });

  /**
   *
   */
  test('it should be call the getState() twice when manager() is called and trigger two actions', (done) => {
    expect.assertions(12);

    const middleware = jest.fn().mockImplementation((action) => action);
    const subscribe = jest.fn();
    const getState = jest
      .fn()
      .mockReturnValue({ todos: [] })
      .mockReturnValueOnce({ todos: [], firstRun: true });

    const middlewareUtils = new MiddlewareUtils();

    const callback = middlewareUtils.manager([middleware], { dispatch, getState, subscribe }, reducer);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(1);

    const expected = { payload: { id: 4, message: '...' }, type: 'edit' };
    const subject$ = new Subject<any>();

    const result$ = callback(subject$);

    expect(isObservable(result$)).toBe(true);

    result$.subscribe(
      (action) => {
        try {
          expect(action).toEqual(expected);
        } catch (err) {
          done(err);
        }
      },
      done,
      () => {
        try {
          expect(getState).toHaveBeenCalledTimes(2);
          expect(subscribe).toHaveBeenCalledTimes(0);
          expect(dispatch).toHaveBeenCalledTimes(0);
          expect(reducer).toHaveBeenCalledTimes(0);
          expect(middleware).toHaveBeenCalledTimes(2);
          expect(middleware).toHaveBeenNthCalledWith(1, expected, { firstRun: true, todos: [] }, dispatch, reducer);
          expect(middleware).toHaveBeenNthCalledWith(2, expected, { todos: [] }, dispatch, reducer);

          done();
        } catch (err) {
          done(err);
        }
      },
    );

    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });

    subject$.complete();
  });

  /**
   *
   */
  test('it should be call the getState() twice when manager() is called and trigger five actions', (done) => {
    expect.assertions(16);

    const middleware = jest.fn().mockImplementation((action) => action);
    const subscribe = jest.fn();
    const getState = jest
      .fn()
      .mockReturnValue({ todos: [] })
      .mockReturnValueOnce({ todos: [], firstRun: true })
      .mockReturnValueOnce({ todos: [], secondRun: true });

    const middlewareUtils = new MiddlewareUtils();

    const callback = middlewareUtils.manager([middleware], { dispatch, getState, subscribe }, reducer);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(1);

    const expected = { payload: { id: 4, message: '...' }, type: 'edit' };
    const subject$ = new Subject<any>();

    const result$ = callback(subject$);

    expect(isObservable(result$)).toBe(true);

    let i = 0;
    result$.subscribe(
      (action) => {
        try {
          if (i === 1 || i === 2) {
            expect(action).toEqual({ ...expected, ignoreMiddleware: true });
          } else {
            expect(action).toEqual(expected);
          }

          i += 1;
        } catch (err) {
          done(err);
        }
      },
      done,
      () => {
        try {
          expect(getState).toHaveBeenCalledTimes(3);
          expect(subscribe).toHaveBeenCalledTimes(0);
          expect(dispatch).toHaveBeenCalledTimes(0);
          expect(reducer).toHaveBeenCalledTimes(0);
          expect(middleware).toHaveBeenCalledTimes(3);
          expect(middleware).toHaveBeenNthCalledWith(1, expected, { firstRun: true, todos: [] }, dispatch, reducer);
          expect(middleware).toHaveBeenNthCalledWith(2, expected, { secondRun: true, todos: [] }, dispatch, reducer);
          expect(middleware).toHaveBeenNthCalledWith(3, expected, { todos: [] }, dispatch, reducer);

          done();
        } catch (err) {
          done(err);
        }
      },
    );

    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' }, ignoreMiddleware: true });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' }, ignoreMiddleware: true });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });
    subject$.next({ type: 'edit', payload: { id: 4, message: '...' } });

    subject$.complete();
  });
});
