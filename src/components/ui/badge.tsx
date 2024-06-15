import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center select-none rounded-full border  font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary/80",
        opaque:
          "border-neutral-300 border-2 bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
        foreground:
          "border-transparent bg-foreground text-white hover:bg-foreground/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        white: "border border-neutral-300 bg-background hover:bg-background/80",
        accent:
          "border-transparent bg-blue-400 text-blue-950 hover:bg-blue-400/90",
        yellow:
          "border-transparent bg-yellow-500 text-yellow-950 hover:bg-yellow-500/90",
        green:
          "border-transparent bg-emerald-500 text-green-950 hover:bg-emerald-500/90",
        destructive:
          "border-transparent bg-destructive/70 text-red-950 hover:bg-destructive/60",
        outline: "text-foreground",
      },
      size: {
        xs: "px-1 py-[0.5px] text-xs",
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
