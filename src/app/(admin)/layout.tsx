import {
  BookCheckIcon,
  BoxesIcon,
  FlaskConicalIcon,
  GaugeCircleIcon,
  UserIcon,
} from "lucide-react";
import AnimatedTabs from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnimatedTabs tabs={tabs} vertical icons />
      <div
        className={cn("rounded-[10px] w-full h-screen bg-primary no-scrollbar")}
      >
        {children}
      </div>
    </>
  );
}

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <GaugeCircleIcon className={cn("text-notepad")} />,
    href: "/dashboard",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FlaskConicalIcon className={cn("text-notepad")} />,
    href: "/reports",
  },
  {
    id: "evaluations",
    label: "Draft Evaluations",
    icon: <BookCheckIcon className={cn("text-notepad")} />,
    href: "/forms",
  },
  {
    id: "program",
    label: "Program",
    icon: <BoxesIcon className={cn("text-notepad")} />,
    href: "/program",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <UserIcon className={cn("text-notepad")} />,
    href: "/profile",
  },
];
