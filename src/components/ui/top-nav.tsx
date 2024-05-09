"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "public/mark@2x.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { preload } from "react-dom";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href: string;
}

// TODO discriminated union type so we know tabs are null if withoutTabs is true
interface Props {
  tabs: Tab[];
  defaultValue?: string;
  icons?: boolean;
  withoutTabs?: boolean;
}

export function TopNav({ tabs, icons, withoutTabs }: Props) {
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
    <div
      className={cn("sticky top-0 z-50 border-b-2 border-primary shadow-xl")}
    >
      <div
        className={`flex flex-row items-center justify-between bg-foreground p-2`}
      >
        <div className={cn("flex flex-row items-center space-x-2")}>
          <Image src={logo} alt="logo" className={cn("size-10 ")} />
          <h3 className={cn("flex flex-row")}>
            <p className={cn("font-poppins text-xl font-bold text-accent")}>
              MED
            </p>
            <p
              className={cn("font-poppins text-xl font-light text-destructive")}
            >
              score
            </p>
          </h3>
        </div>
        {!withoutTabs && (
          <div className={cn("flex flex-row items-center space-x-2")}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onMouseEnter={() => preload(`http://localhost:3000${tab.href}`)}
                role="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  handleNavigate(tab.href);
                }}
                className={`${
                  activeTab === tab.id ? "" : "hover:text-white/70"
                } relative z-20 rounded-full px-3 py-1.5 text-sm font-medium tracking-wider text-white transition focus-visible:outline-2`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="bubble"
                    className="mix-blend absolute inset-0 -z-10 bg-accent mix-blend-exclusion"
                    style={{ borderRadius: 9999 }}
                    transition={{
                      type: "spring",
                      bounce: 0.1,
                      duration: 0.4,
                    }}
                  />
                )}
                {icons ? tab.icon : tab.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
