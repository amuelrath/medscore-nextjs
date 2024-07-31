import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/helpers/utils";

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
          "border-transparent bg-blue-300 text-blue-950 hover:bg-blue-500/90",
        "accent-secondary":
          "border-transparent bg-accent-secondary/90 text-teal-950 hover:bg-accent-secondary/80",
        yellow:
          "border-transparent bg-lime-300 text-lime-900 hover:bg-lime-100/90",
        green:
          "border-transparent bg-emerald-500 text-green-950 hover:bg-emerald-500/90",
        destructive:
          "border-transparent bg-destructive/70 text-red-950 hover:bg-destructive/60",
        outline: "text-foreground",
        hide: ""
      },
      size: {
        xs: "px-[0.25px] py-[0.15px] text-2xs",
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
