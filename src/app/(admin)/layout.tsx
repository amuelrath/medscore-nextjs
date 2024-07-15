import { RouteNavigation } from "@/components/ui/route-navigation";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import {
  ClipboardPlusIcon,
  FileStackIcon,
  GaugeIcon,
  GraduationCapIcon,
  TextSearchIcon,
} from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <ReactQueryDevtools />
      <div className="flex w-full">
        <RouteNavigation tabs={tabs} />
        {children}
      </div>
    </>
  );
}

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <GaugeIcon />,
    href: "/dashboard",
  },
  {
    id: "Evaluate",
    label: "Evaluate",
    icon: <ClipboardPlusIcon />,
    href: "/evaluate",
  },
  {
    id: "forms",
    label: "Forms",
    icon: <FileStackIcon />,
    href: "/forms",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <TextSearchIcon />,
    href: "/reports",
  },
  {
    id: "programs",
    label: "Programs",
    icon: <GraduationCapIcon />,
    href: "/programs",
  },
];
