"use client";
import AnimatedTabs from "@/components/ui/sidebar";
import {
  BoxesIcon,
  GaugeCircleIcon,
  UserIcon,
  FlaskConicalIcon,
  BookCheckIcon,
  ActivityIcon,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <GaugeCircleIcon />,
    href: "/secure/dashboard",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FlaskConicalIcon />,
    href: "/secure/reports",
  },
  {
    id: "evaluations",
    label: "Draft Evaluations",
    icon: <BookCheckIcon />,
    href: "/secure/evaluations/home",
  },
  {
    id: "program",
    label: "Program",
    icon: <BoxesIcon />,
    href: "/secure/program",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <UserIcon />,
    href: "/secure/profile",
  },
];

export default function SecureRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-row h-screen w-full bg-white">
      <AnimatedTabs tabs={tabs} vertical icons />
      <div className="flex-1 ml-[4rem] mt-[72px] bg-secondary rounded-[5px] border pb-32 overflow-y-auto no-scrollbar">
        <Toaster />
        {children}
      </div>
    </main>
  );
}
