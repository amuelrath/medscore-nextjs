import { SearchIcon } from "lucide-react";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/helpers/utils";
import * as React from "react";

interface SearchInputProps  extends InputProps {

}

export function SearchInput({ size="xs", placeholder="Search results...", className,...props }: SearchInputProps) {
  return (
    <div
      className="relative">
      <SearchIcon className="absolute left-2 top-1.5 size-3 opacity-50" />
      <Input
        {...props}
        size={size}
        placeholder={placeholder}
        variant="underline"
        className={cn(" pl-8 font-light", className)}
      />
    </div>
  )
}
