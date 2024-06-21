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
          "flex-1 pt-36 no-scrollbar min-h-full mx-8",
          className,
        )}
      >
        {children}
      </main>
    );
  },
);

Main.displayName = "Main";
