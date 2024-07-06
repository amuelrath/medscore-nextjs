import * as React from "react";

import { cn } from "@/lib/helpers/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  autocomplete?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autocomplete, ...props }, ref) => {
    return (
      <input
        type={type}
        autoComplete={autocomplete ? "on" : "off"}
        className={cn(
          "flex h-10 w-full text-neutral-800 rounded-md px-3 py-2 text-sm ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
