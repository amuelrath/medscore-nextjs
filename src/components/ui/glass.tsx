import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const glassVariants = cva(
  "backdrop-filter backdrop-blur border border-opacity-18 bg-opacity-20 shadow-lg",
  {
    variants: {
      glassColor: {
        default: "bg-white border-white",
        blue: "bg-blue-100 border-blue-200",
        green: "bg-green-100 border-green-200",
      },
      intensity: {
        sm: "backdrop-blur-sm bg-opacity-10",
        md: "backdrop-blur-md bg-opacity-20",
        lg: "backdrop-blur-2lg bg-opacity-30",
        xl: "backdrop-blur-3xl bg-opacity-40",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
      },
      padding: {
        none: "p-0",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      glassColor: "default",
      intensity: "md",
      rounded: "xl",
      shadow: "md",
      padding: "md",
    },
  },
);

type GlassVariantProps = VariantProps<typeof glassVariants>;

export interface GlassProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    GlassVariantProps {
  children?: React.ReactNode;
  className?: string;
}

export const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  (
    {
      children,
      glassColor,
      intensity,
      rounded,
      shadow,
      padding,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)", // For Safari support
        }}
        className={twMerge(
          glassVariants({ glassColor, intensity, rounded, shadow, padding }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Glass.displayName = "Glass";
