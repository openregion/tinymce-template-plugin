import * as Fun from './Fun';
import { Optional } from './Optional';

type ObjKeys<T extends {}> = Extract<keyof T, string>;
type ObjCallback<T extends {}> = (value: T[keyof T], key: ObjKeys<T>) => void;
type ObjMorphism<T extends {}, R> = (value: T[keyof T], key: ObjKeys<T>) => R;

// There are many variations of Object iteration that are faster than the 'for-in' style:
// http://jsperf.com/object-keys-iteration/107
//
// Use the native keys if it is available (IE9+), otherwise fall back to manually filtering
export const keys = Object.keys;

// eslint-disable-next-line @typescript-eslint/unbound-method
export const hasOwnProperty = Object.hasOwnProperty;

export const each = <T extends {}>(obj: T, f: ObjCallback<T>): void => {
  const props = keys(obj) as Array<ObjKeys<T>>;
  for (let k = 0, len = props.length; k < len; k++) {
    const i = props[k];
    const x = obj[i];
    f(x, i);
  }
};

export const map = <T extends {}, R>(obj: T, f: ObjMorphism<T, R>): { [k in keyof T]: R } => {
  return tupleMap<{ [k in keyof T]: R }, T>(obj, (x, i) => ({
    k: i,
    v: f(x, i)
  }));
};

export const tupleMap = <R extends {}, T extends {}>(obj: T, f: ObjMorphism<T, { k: keyof R; v: R[keyof R] }>): R => {
  const r = {} as R;
  each(obj, (x, i) => {
    const tuple = f(x, i);
    r[tuple.k] = tuple.v;
  });
  return r;
};

export const mapToArray = <T extends {}, R>(obj: T, f: ObjMorphism<T, R>): R[] => {
  const r: R[] = [];
  each(obj, (value, name) => {
    r.push(f(value, name));
  });
  return r;
};

export const find = <T extends {}>(obj: T, pred: (value: T[keyof T], key: ObjKeys<T>, obj: T) => boolean): Optional<T[keyof T]> => {
  const props = keys(obj) as Array<ObjKeys<T>>;
  for (let k = 0, len = props.length; k < len; k++) {
    const i = props[k];
    const x = obj[i];
    if (pred(x, i, obj)) {
      return Optional.some(x);
    }
  }
  return Optional.none();
};

export const values = <T extends {}>(obj: T): Array<T[keyof T]> => {
  return mapToArray(obj, Fun.identity);
};

export const size = (obj: {}): number => {
  return keys(obj).length;
};

export const get = <T extends {}, K extends keyof T>(obj: T, key: K): Optional<NonNullable<T[K]>> => {
  return has(obj, key) ? Optional.from(obj[key] as NonNullable<T[K]>) : Optional.none();
};

export const has = <T extends {}, K extends keyof T>(obj: T, key: K): boolean =>
  hasOwnProperty.call(obj, key);






