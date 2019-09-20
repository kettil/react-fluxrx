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
