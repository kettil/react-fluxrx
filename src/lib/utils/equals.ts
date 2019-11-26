import { hasProperty, isObject } from './helper';

export const isStrictEqual = (a: any, b: any): boolean => {
  return a === b;
};

export const isEqual = (a: any, b: any): boolean => {
  if (isStrictEqual(a, b)) {
    return a !== 0 || b !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
};

export const isArrayEqual = (a: any, b: any) => {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (const i in a) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

export const shallowEqual = (a: any, b: any): boolean => {
  if (isEqual(a, b)) {
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return isArrayEqual(a, b);
  }

  if (!isObject(a) || !isObject(b)) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!hasProperty(b, key) || !isEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
};
