import { TopNav } from "@/components/ui/top-nav";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <TopNav tabs={tabs} />
      <ReactQueryDevtools />
      {children}
    </>
  );
}

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    id: "Evaluate",
    label: "Evaluate",
    href: "/evaluate",
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
];
