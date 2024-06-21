"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type UseSearchParamStateOptions<T> = {
  initialValue: T;
  paramName: string;
};

export function useSearchParamState<T>({
  initialValue,
  paramName,
}: UseSearchParamStateOptions<T>): [T, (value: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState<T>(() => {
    const paramValue = searchParams.get(paramName);
    return paramValue !== null ? JSON.parse(paramValue) : initialValue;
  });

  useEffect(() => {
    const paramValue = searchParams.get(paramName);
    if (paramValue !== null) {
      setValue(JSON.parse(paramValue));
    } else {
      setValue(initialValue);
    }
  }, [searchParams, paramName, initialValue]);

  const updateValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(paramName, JSON.stringify(newValue));
      router.push(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams, paramName],
  );

  return [value, updateValue];
}
