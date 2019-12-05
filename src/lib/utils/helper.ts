export const isActionType = <Type>(type: any): type is Type => {
  const types = ['string', 'symbol'];

  return types.indexOf(typeof type) >= 0;
};

export const isActionPayload = <Payload>(payload: any): payload is Payload => {
  const types = ['number', 'string'];

  return types.indexOf(typeof payload) >= 0 || isObject(payload) || Array.isArray(payload);
};

export const isPromise = (obj: any): obj is Promise<any> => {
  if (obj instanceof Promise) {
    return true;
  }

  if (!isObject(obj) && typeof obj !== 'function') {
    return false;
  }

  return typeof obj.then === 'function' && typeof obj.catch === 'function';
};

export const isObject = (obj: any): obj is { [k: string]: any } => {
  return typeof obj === 'object' && obj !== null;
};

export const hasProperty = (obj: object, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

export const defaultErrorHandler = (err: any) => {
  // istanbul ignore else
  if (process.env.NODE_ENV !== 'production') {
    // tslint:disable-next-line:no-console
    console.error(err);
  }
};
