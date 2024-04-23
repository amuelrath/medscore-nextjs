import { useEffect, useRef } from "react";
import * as deepEqual from "fast-deep-equal/es6/react";

const isPrimitive = (value: number | string) =>
  ["number", "string", "boolean"].includes(typeof value);

const warnDeps = (dependencies: any[]) => {
  if (dependencies.length === 0) {
    console.warn(
      "useDeepEffect should not be used with no dependencies. Use useEffect instead."
    );
  }
  if (dependencies.every(isPrimitive)) {
    console.warn(
      "useDeepEffect should not be used with primitive values. Use useEffect instead."
    );
  }
};

const useDeepEffect = (
  fn: React.EffectCallback,
  dependencies: any[] = [],
  comparisonFn: (a: any, b: any) => boolean = deepEqual.default
): void => {
  if (process.env.NODE_ENV !== "production") {
    warnDeps(dependencies);
  }

  const ref = useRef<any[]>([]);

  if (!comparisonFn(dependencies, ref.current)) {
    ref.current = dependencies;
  }

  return useEffect(fn, ref.current);
};

export default useDeepEffect;
