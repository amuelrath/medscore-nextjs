import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ActionGroup({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <aside className={cn(className, "relative z-40 backdrop-filter rounded-lg items-center p-2 space-x-3 border-2 border-opacity-10 border-blue-200 overflow-y-hidden border-b bg-blue-800 bg-opacity-5 backdrop-blur-lg px-2 shadow-md")}>
      {children}
    </aside>
  )
}