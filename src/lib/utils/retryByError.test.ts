import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { retryByError } from './retryByError';

describe('Check the retryByError function', () => {
  test('it should be run withut error when retryByError() is called', (done) => {
    expect.assertions(3);

    const next = jest.fn();

    of(0, 1)
      .pipe(retryByError(1, 10))
      .subscribe(next, done, () => {
        try {
          expect(next).toHaveBeenCalledTimes(2);
          expect(next).toHaveBeenNthCalledWith(1, 0);
          expect(next).toHaveBeenNthCalledWith(2, 1);

          done();
        } catch (err) {
          done(err);
        }
      });
  });

  test('it should be run with one error but it is still running through when retryByError() is called', (done) => {
    expect.assertions(6);

    const next = jest.fn();

    let afterFirstCall = false;
    of(0, 1, 8)
      .pipe(
        map((i) => {
          if (i > 1 && !afterFirstCall) {
            afterFirstCall = true;
            throw new Error(`Error Nr: ${i}`);
          }

          return i;
        }),
        retryByError(2, 5),
      )
      .subscribe(
        next,

        done,
        () => {
          try {
            expect(next).toHaveBeenCalledTimes(5);
            expect(next).toHaveBeenNthCalledWith(1, 0);
            expect(next).toHaveBeenNthCalledWith(2, 1);
            expect(next).toHaveBeenNthCalledWith(3, 0);
            expect(next).toHaveBeenNthCalledWith(4, 1);
            expect(next).toHaveBeenNthCalledWith(5, 8);

            done();
          } catch (err) {
            done(err);
          }
        },
      );
  });

  test('it should be run with error when retryByError() is called and the skipRetries() is true', (done) => {
    expect.assertions(7);

    const next = jest.fn();
    const error = new Error('Error-Message2');
    const skip = (err: any) => err === error;

    let afterFirstCall = false;

    of(0, 1, 2)
      .pipe(
        map((i) => {
          if (i > 1) {
            if (!afterFirstCall) {
              afterFirstCall = true;

              throw new Error('Error-Message1');
            } else {
              throw error;
            }
          }

          return i;
        }),
        retryByError(2, 10, skip),
      )
      .subscribe(
        next,
        (err) => {
          try {
            expect(next).toHaveBeenCalledTimes(4);
            expect(next).toHaveBeenNthCalledWith(1, 0);
            expect(next).toHaveBeenNthCalledWith(2, 1);
            expect(next).toHaveBeenNthCalledWith(3, 0);
            expect(next).toHaveBeenNthCalledWith(4, 1);

            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Error-Message2');

            done();
          } catch (err) {
            done(err);
          }
        },
        () => done(new Error('Complete function is called')),
      );
  });

  test('it should be run with error when retryByError() is called and every attempt is faulty', (done) => {
    expect.assertions(9);

    const next = jest.fn();

    of(0, 1, 13)
      .pipe(
        map((i) => {
          if (i > 1) {
            throw new Error(`Error Nr: ${i}`);
          }

          return i;
        }),
        retryByError(2, [5]),
      )
      .subscribe(
        next,
        (err) => {
          try {
            expect(next).toHaveBeenCalledTimes(6);
            expect(next).toHaveBeenNthCalledWith(1, 0);
            expect(next).toHaveBeenNthCalledWith(2, 1);
            expect(next).toHaveBeenNthCalledWith(3, 0);
            expect(next).toHaveBeenNthCalledWith(4, 1);
            expect(next).toHaveBeenNthCalledWith(5, 0);
            expect(next).toHaveBeenNthCalledWith(6, 1);

            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Error Nr: 13');

            done();
          } catch (err) {
            done(err);
          }
        },
        () => done(new Error('Complete function is called')),
      );
  });

  test('it should be throw an error when retryByError() is called but the delay array is empty', () => {
    expect.assertions(2);

    try {
      retryByError(3, []);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('The delay array is empty');
    }
  });
});
