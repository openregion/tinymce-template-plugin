import * as Fun from './Fun';
import { Optional } from './Optional';
import * as Type from './Type';

type ArrayMorphism<T, U> = (x: T, i: number) => U;
type ArrayGuardPredicate<T, U extends T> = (x: T, i: number) => x is U;
type ArrayPredicate<T> = ArrayMorphism<T, boolean>;

/* eslint-disable @typescript-eslint/unbound-method */
const nativeSlice = Array.prototype.slice;
/* eslint-enable */

export const exists = <T = any>(xs: ArrayLike<T>, pred: ArrayPredicate<T>): boolean => {
  for (let i = 0, len = xs.length; i < len; i++) {
    const x = xs[i];
    if (pred(x, i)) {
      return true;
    }
  }

  return false;
};

export const map = <T = any, U = any>(xs: ArrayLike<T>, f: ArrayMorphism<T, U>): U[] => {
  // pre-allocating array size when it's guaranteed to be known
  // http://jsperf.com/push-allocated-vs-dynamic/22
  const len = xs.length;
  const r = new Array(len);
  for (let i = 0; i < len; i++) {
    const x = xs[i];
    r[i] = f(x, i);
  }
  return r;
};

// Unwound implementing other functions in terms of each.
// The code size is roughly the same, and it should allow for better optimisation.
// const each = function<T, U>(xs: T[], f: (x: T, i?: number, xs?: T[]) => void): void {
export const each = <T = any>(xs: ArrayLike<T>, f: ArrayMorphism<T, void>): void => {
  for (let i = 0, len = xs.length; i < len; i++) {
    const x = xs[i];
    f(x, i);
  }
};

export const findUntil: {
  <T, U extends T>(xs: ArrayLike<T>, pred: ArrayGuardPredicate<T, U>, until: ArrayPredicate<T>): Optional<U>;
  <T = any>(xs: ArrayLike<T>, pred: ArrayPredicate<T>, until: ArrayPredicate<T>): Optional<T>;
} = <T>(xs: ArrayLike<T>, pred: ArrayPredicate<T>, until: ArrayPredicate<T>): Optional<T> => {
  for (let i = 0, len = xs.length; i < len; i++) {
    const x = xs[i];
    if (pred(x, i)) {
      return Optional.some(x);
    } else if (until(x, i)) {
      break;
    }
  }
  return Optional.none();
};

export const find: {
  <T, U extends T>(xs: ArrayLike<T>, pred: ArrayGuardPredicate<T, U>): Optional<U>;
  <T = any>(xs: ArrayLike<T>, pred: ArrayPredicate<T>): Optional<T>;
} = <T>(xs: ArrayLike<T>, pred: ArrayPredicate<T>): Optional<T> => {
  return findUntil(xs, pred, Fun.never);
};

export const get = <T>(xs: ArrayLike<T>, i: number): Optional<T> => i >= 0 && i < xs.length ? Optional.some(xs[i]) : Optional.none();

export const last = <T>(xs: ArrayLike<T>): Optional<T> => get(xs, xs.length - 1);

export const from: <T>(x: ArrayLike<T>) => T[] = Type.isFunction(Array.from) ? Array.from : (x) => nativeSlice.call(x);




