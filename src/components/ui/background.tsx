import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
const backgroundVariants = cva("fixed w-full h-full bg-opacity-50", {
  variants: {
    variant: {
      default: "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300",
      blue: "bg-gradient-to-br from-neutral-200  from-[50%] to-accent/20",
      green:
        "bg-gradient-to-l from-zinc-200 from-[88%] to-accent-secondary/70",
      red: "bg-gradient-to-br from-neutral-100 from-[50%] to-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BackgroundProps = VariantProps<typeof backgroundVariants> & {
  children: React.ReactNode;
};

export const Background: React.FC<BackgroundProps> = ({
  children,
  variant,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className={backgroundVariants({ variant })}></div>
      <div className="relative z-10 ">{children}</div>
    </div>
  );
};
