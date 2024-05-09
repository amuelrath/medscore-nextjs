"use client";
import { TopNav } from "@/components/ui/top-nav";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-gray-200">
      <ReactQueryDevtools />
      <TopNav withoutTabs tabs={[]} />

      <main>{children}</main>
    </div>
  );
}
