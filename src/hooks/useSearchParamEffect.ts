'use client'
import { useEffect } from 'react';

export function useSearchParamEffect<T>(value: T, paramName: string) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set(paramName, JSON.stringify(value));
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [value, paramName]);
}