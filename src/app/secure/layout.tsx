import AnimatedTabs from "@/components/ui/animated-tabs";
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
    label: "Evaluations",
    icon: <BookCheckIcon />,
    href: "/secure/evaluations",
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
    <main className="flex flex-row h-full w-full">
      <div>
        <AnimatedTabs tabs={tabs} vertical icons />
      </div>
      <div className="w-full h-full ml-[4rem] mt-16 bg-gray-100 rounded-[15px] fixed">
        <div className="mr-16">{children}</div>
        <Toaster />
      </div>
    </main>
  );
}
