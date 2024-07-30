import { RouteNavigation } from "@/components/ui/route-navigation";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import {
  ChartBarIcon,
  ClipboardPlusIcon,
  FileStackIcon,
  GaugeIcon,
  GraduationCapIcon,
  TextSearchIcon, UsersIcon
} from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen overflow-clip">
      <AppHeader />
      <ReactQueryDevtools />
      <div className="flex flex-1">
        <RouteNavigation tabs={tabs} />
        <main className="flex-1 overflow-hidden h-full">
          {children}
        </main>
      </div>
    </div>
  );
}

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <GaugeIcon size={20} />,
    href: "/dashboard"
  },
  {
    id: "Evaluate",
    label: "Evaluate",
    icon: <ClipboardPlusIcon size={20} />,
    href: "/evaluate"
  },
  {
    id: "forms",
    label: "Forms",
    icon: <FileStackIcon size={20} />,
    href: "/forms",
  },
  {
    id: "programs",
    label: "Reports",
    icon: <UsersIcon size={20} />,
    href: "/programs",
  },
  {
    id: "programs",
    label: "Programs",
    icon: <GraduationCapIcon size={20} />,
    href: "/reports",
  },
];
