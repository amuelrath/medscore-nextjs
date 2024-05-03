"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "public/mark@2x.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  useEffect(() => {
    const activeTab = tabs.find((tab) => pathname.startsWith(tab.href));
    if (activeTab) {
      setActiveTab(activeTab.id);
    }
  }, [pathname, tabs]);

  return (
    <div
      className={cn("z-50 shadow-xl border-b-2 border-primary sticky top-0")}
    >
      <div
        className={`flex flex-row justify-between bg-foreground items-center p-2`}
      >
        <div className={cn("flex flex-row items-center space-x-2")}>
          <Image src={logo} alt="logo" className={cn("size-10 ")} />
          <h3 className={cn("flex flex-row")}>
            <p className={cn("text-xl font-poppins font-bold text-accent")}>
              MED
            </p>
            <p
              className={cn("text-xl font-poppins font-light text-destructive")}
            >
              score
            </p>
          </h3>
        </div>
        {!withoutTabs && (
          <div className={cn("flex flex-row space-x-2 items-center")}>
            {tabs.map((tab) => (
              <Link key={tab.id} href={tab.href || "#"}>
                <div
                  onMouseEnter={() =>
                    preload(`http://localhost:3000${tab.href}`)
                  }
                  role="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id ? "" : "hover:text-white/70"
                  } text-white tracking-wider relative rounded-full px-3 py-1.5 text-sm z-20 font-medium transition focus-visible:outline-2`}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 -z-10 mix-blend bg-accent mix-blend-exclusion"
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
