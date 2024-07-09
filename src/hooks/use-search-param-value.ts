"use client";

import { useSearchParams } from "next/navigation";

export function useSearchParamValue(paramName: string): string | null {
  const searchParams = useSearchParams();
  return searchParams.get(paramName);
}