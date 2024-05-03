"use client";
import {TopNav} from "@/components/ui/top-nav";
import {ReactNode} from 'react'

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-t from-foreground/90 via-foreground/10 to-background">
      <TopNav withoutTabs tabs={[]} />
      <main>{children}</main>
    </div>
  );
}
