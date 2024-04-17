"use client";
import { cn } from "@/lib/utils";
import AnimatedTabs from "@/components/ui/sidebar";
import {
  BoxesIcon,
  GaugeCircleIcon,
  UserIcon,
  FlaskConicalIcon,
  BookCheckIcon,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <GaugeCircleIcon className={cn("text-notepad")} />,
    href: "/secure/dashboard",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FlaskConicalIcon className={cn("text-notepad")} />,
    href: "/secure/reports",
  },
  {
    id: "evaluations",
    label: "Draft Evaluations",
    icon: <BookCheckIcon className={cn("text-notepad")} />,
    href: "/secure/evaluations/home",
  },
  {
    id: "program",
    label: "Program",
    icon: <BoxesIcon className={cn("text-notepad")} />,
    href: "/secure/program",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <UserIcon className={cn("text-notepad")} />,
    href: "/secure/profile",
  },
];

export default function SecureRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-row h-full w-full">
      <AnimatedTabs tabs={tabs} vertical icons />
      <div
        className={cn("rounded-[10px] w-full h-screen bg-primary no-scrollbar")}
      >
        <Toaster />
        {children}
      </div>
    </main>
  );
}
