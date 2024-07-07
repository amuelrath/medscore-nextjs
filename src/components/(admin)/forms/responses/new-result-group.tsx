import { PlusIcon } from "lucide-react";
import * as React from "react";

export function NewResultGroup() {
  return (
    <button
      className="group flex h-7 w-full  flex-row items-center justify-between rounded-md border border-neutral-300 bg-blue-800/5  px-4 font-medium text-neutral-600 transition-all hover:border-neutral-600">
      <p className="truncate text-sm text-neutral-500">New Result Group</p>
      <PlusIcon className="size-4 opacity-50 transition-opacity group-hover:opacity-100" />
    </button>
  );
}