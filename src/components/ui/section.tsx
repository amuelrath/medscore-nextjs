import { cn } from "@/lib/utils";
import { forwardRef, ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "no-scrollbar xs:px-4 xs:pb-4 lg:px-4 lg:pb-0",
          className,
        )}
      >
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";
