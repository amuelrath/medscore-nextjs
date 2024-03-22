"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
};

type Props = {
  tabs: Tab[];
  defaultValue?: string;
  vertical?: boolean;
  icons?: boolean;
};

export default function AnimatedTabs({
  tabs,
  defaultValue,
  vertical,
  icons,
}: Props) {
  let [activeTab, setActiveTab] = useState(defaultValue || tabs[0].id);

  return (
    <div
      className={`flex ${
        vertical ? "flex-col space-y-2" : "flex-row space-x-2"
      } items-center fixed bg-white h-full w-14 bg-gray-200 p-2 z-10`}
    >
      {tabs.map((tab) => (
        <TabTooltip label={tab.label} key={tab.id}>
          <Link href={tab.href || "#"}>
            <div
              role="button"
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id ? "" : "hover:text-black/60"
              } relative rounded-full px-3 py-1.5 text-sm font-medium text-black outline-sky-400 transition focus-visible:outline-2`}
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="bubble"
                  className="absolute inset-0 z-10 bg-yellow-400 mix-blend-exclusion"
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
