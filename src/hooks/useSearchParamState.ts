'use client'
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
    }
  }, [searchParams, paramName]);

  const updateValue = useCallback(
    (newValue: T) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(paramName, JSON.stringify(newValue));
      const newPathname = `${pathname}?${newSearchParams.toString()}`;
      router.push(newPathname);
    },
    [router, pathname, searchParams, paramName],
  );

  return [value, updateValue];
}
