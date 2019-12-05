import { MonoTypeOperatorFunction, of, timer } from 'rxjs';
import { delayWhen, mergeMap, retryWhen } from 'rxjs/operators';

export const retryByError = (
  retries: number,
  delay: number[] | number,
  skipRetries?: (err: any) => boolean,
): MonoTypeOperatorFunction<any> => {
  if (Array.isArray(delay) && delay.length === 0) {
    throw new Error('The delay array is empty');
  }

  return retryWhen((err$) =>
    err$.pipe(
      mergeMap((err: any, i: number) => {
        if (typeof skipRetries === 'function' && skipRetries(err)) {
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
      delayWhen((time) => timer(time)),
    ),
  );
};

export default retryByError;
