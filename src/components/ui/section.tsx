"use client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Section({ children }: { children: ReactNode }) {
  return (
    <section
      className={cn(
        " overflow-y-scroll fixed top-[4rem] left-[4rem] w-full h-full p-4 pb-[20rem] pr-[5rem] bg-background rounded-tl-[10px] no-scrollbar"
      )}
    >
      {children}
    </section>
  );
}
