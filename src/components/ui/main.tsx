import { cn } from "@/lib/utils";
import { forwardRef, ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export const Main = forwardRef<HTMLElement, SectionProps>(
  ({ children, className }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "",
          className,
        )}
      >
        {children}
      </main>
    );
  },
);

Main.displayName = "Main";
