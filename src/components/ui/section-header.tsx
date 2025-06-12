import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex w-full border-b h-12 min-h-12 border-neutral-300 bg-card/50",
        className,
      )}
    >
      {children}
    </header>
  );
}
