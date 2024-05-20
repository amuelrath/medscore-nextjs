import { TopNav } from "@/components/ui/top-nav";
import { cn } from "@/lib/utils";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className={cn("flex flex-col min-h-screen no-scrollbar")}>
      <TopNav tabs={tabs} />
      <ReactQueryDevtools />
      <div className={cn("transition-all")}>{children}</div>
    </div>
  );
}

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    id: "forms",
    label: "Forms",
    href: "/forms",
  },
  {
    id: "reports",
    label: "Reports",
    href: "/reports",
  },
  {
    id: "programs",
    label: "Programs",
    href: "/programs",
  },
  {
    id: "resources",
    label: "Resources",
    href: "/resources"
  }
];
