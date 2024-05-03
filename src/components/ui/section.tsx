import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Section({ children }: { children: ReactNode }) {
  return (
    <div className={cn("xs:px-4 xs:pb-4 lg:px-16 lg:pb-16")}>{children}</div>
  );
}
