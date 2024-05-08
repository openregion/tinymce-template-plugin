const constant = <T>(value: T): () => T => {
  return () => {
    return value;
  };
};

const identity = <T = any>(x: T): T => {
  return x;
};

const never: (...args: any[]) => false = constant<false>(false);
constant<true>(true);

export {
  identity,
  never,
};
