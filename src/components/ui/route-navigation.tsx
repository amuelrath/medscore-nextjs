"use client";
import { motion } from "framer-motion";
import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import logo from "public/mark@2x.png";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string | ReactNode;
  icon?: ReactNode;
  href: string;
}

// TODO discriminated union type so we know tabs are null if withoutTabs is true
interface Props {
  tabs: Tab[];
  defaultValue?: string;
  withoutTabs?: boolean;
}

export function RouteNavigation({ tabs, withoutTabs }: Props) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  useEffect(() => {
    const activeTab = tabs.find((tab) => pathname.startsWith(tab.href));
    if (activeTab) {
      setActiveTab(activeTab.id);
    }
  }, [pathname, tabs]);

  return (
    <nav>
      <div
        className={`flex h-full flex-col items-center bg-[#011627] py-3 border-r border-neutral-300`}
      >
        <div className={cn("mb-4 p-2 flex flex-col items-center")}>
          <Image priority src={logo} alt="logo" width={30} height={30} />
          <h3 className={cn("flex flex-row")}>
            <p className={cn("text-sm font-bold text-accent")}>MED</p>
            <p className={cn("text-sm font-light text-destructive")}>score</p>
          </h3>
        </div>
        {!withoutTabs && (
          <div className={cn("flex flex-col items-center space-y-2")}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                role="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  handleNavigate(tab.href);
                }}
                className={`${
                  activeTab === tab.id ? "" : "hover:text-white/70"
                } relative z-20 rounded-full w-full py-1.5 text-xs font-medium tracking-wider text-white transition focus-visible:outline-2`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="bubble"
                    className="mix-blend absolute inset-0 -z-10 bg-accent-secondary mix-blend-exclusion"
                    style={{ borderRadius: 5 }}
                    transition={{
                      type: "spring",
                      bounce: 0.1,
                      duration: 0.3,
                    }}
                  />
                )}
                <div className={cn("flex flex-col w-full text-white items-center justify-center space-y-1 transition-all duration-300", activeTab === tab.id && "text-teal-950")}>
                  <div className="size-6">{tab.icon}</div>
                  <p className={cn("text-2xs font-semibold")}>{tab.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
