"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "public/mark@2x.png";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
};

type Props = {
  tabs: Tab[];
  defaultValue?: string;
  vertical?: boolean;
  icons?: boolean;
};

export default function sidebar({ tabs, vertical, icons }: Props) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    const activeTab = tabs.find((tab) => pathname.startsWith(tab.href));
    if (activeTab) {
      setActiveTab(activeTab.id);
    }
  }, [pathname, tabs]);

  return (
    <div
      className={cn(
        "fixed items-center justify-start bg-primary min-h-screen z-20 w-16 no-scrollbar"
      )}
    >
      <Image
        src={logo}
        alt={"logo"}
        className={cn("fixed top-[12px] left-[5px] w-14 z-20")}
      />
      <div className={`flex flex-col items-center space-y-2 pt-20 p-2`}>
        {tabs.map((tab) => (
          <TabTooltip label={tab.label} key={tab.id}>
            <Link href={tab.href || "#"}>
              <div
                role="button"
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id ? "" : "hover:text-white/60"
                } relative rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 -z-10 bg-accent mix-blend-exclusion"
                    style={{ borderRadius: 5 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                {icons ? tab.icon : tab.label}
              </div>
            </Link>
          </TabTooltip>
        ))}
      </div>
    </div>
  );
}

function TabTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
