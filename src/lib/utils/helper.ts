/**
 *
 * @param obj
 */
export const isPromise = (obj: any): obj is Promise<any> => {
  if (obj instanceof Promise) {
    return true;
  }

  if (!isObject(obj) && typeof obj !== 'function') {
    return false;
  }

  return typeof obj.then === 'function' && typeof obj.catch === 'function';
};

/**
 *
 * @param obj
 */
export const isObject = (obj: any): boolean => {
  return typeof obj === 'object' && obj !== null;
};

/**
 *
 * @param obj
 * @param key
 */
export const hasProperty = (obj: object, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 *
 * @param id
 * @param withSymbol
 */
export const getUniqueAction = (id: string, withSymbol = true) => {
  if (withSymbol && typeof Symbol === 'function') {
    return Symbol(id);
  }

  // fallback
  return `${id}_${Math.round(Math.random() * 1000)}`;
};

/**
 *
 * @param err
 */
export const defaultErrorHandler = (err: any) => {
  // istanbul ignore else
  if (process.env.NODE_ENV !== 'production') {
    // tslint:disable-next-line:no-console
    console.error(err);
  }
};
