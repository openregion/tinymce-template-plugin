const getPrototypeOf = Object.getPrototypeOf;

interface Constructor<T extends Object> {
  readonly prototype: T;
  readonly name?: string;
}

const hasProto = <T extends Object>(v: Object, constructor: Constructor<T>, predicate: (v: Object, prototype: T) => boolean): boolean => {
  if (predicate(v, constructor.prototype)) {
    return true;
  } else {
    // String-based fallback time
    return (v.constructor?.name as string | undefined) === constructor.name;
  }
};

const typeOf = (x: any): string => {
  const t = typeof x;
  if (x === null) {
    return 'null';
  } else if (t === 'object' && Array.isArray(x)) {
    return 'array';
  } else if (t === 'object' && hasProto(x, String, (o, proto) => proto.isPrototypeOf(o))) {
    return 'string';
  } else {
    return t;
  }
};

const isType = <Yolo>(type: string) => (value: any): value is Yolo =>
  typeOf(value) === type;

const isSimpleType = <Yolo>(type: string) => (value: any): value is Yolo =>
  typeof value === type;

const eq = <T> (t: T) => (a: any): a is T =>
  t === a;

export const is = <E extends Object>(value: any, constructor: Constructor<E>): value is E =>
  isObject(value) && hasProto<E>(value, constructor, (o, proto) => getPrototypeOf(o) === proto);

export const isString: (value: any) => value is string =
  isType('string');

export const isObject: (value: any) => value is Object =
  isType('object');



export const isArray: (value: any) => value is Array<unknown> =
  isType('array');

eq(null);

isSimpleType<boolean>('boolean');

eq(undefined);

export const isNullable = (a: any): a is null | undefined =>
  a === null || a === undefined;

export const isNonNullable = <A> (a: A | null | undefined): a is NonNullable<A> =>
  !isNullable(a);

export const isFunction: (value: any) => value is Function =
  isSimpleType<Function>('function');

isSimpleType<number>('number');

export const isArrayOf = <E>(value: any, pred: (x: any) => x is E): value is Array<E> => {
  if (isArray(value)) {
    for (let i = 0, len = value.length; i < len; ++i) {
      if (!(pred(value[i]))) {
        return false;
      }
    }
    return true;
  }
  return false;
};
