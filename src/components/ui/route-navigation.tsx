"use client";
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
        className={`flex h-full flex-col items-center border-r border-neutral-300 bg-gray-950 py-2`}
      >
        <div
          className={cn("flex flex-col items-center p-2 text-gray-300")}
        >
          <h3 className={cn("flex flex-row")}>
            <p className={cn("text-lg font-bold ")}>MED</p>
            <p className={cn("text-lg font-extralight ")}>score</p>
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
                } relative z-20 w-full rounded-full py-1.5 text-xs font-medium tracking-wider text-white transition focus-visible:outline-2`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <div
                  className={cn(
                    "flex w-full flex-col items-center justify-center space-y-1 transition-all duration-300",
                    activeTab === tab.id
                      ? "text-gray-100"
                      : "text-gray-400 hover:text-gray-100",
                  )}
                >
                  <div className="size-6">{tab.icon}</div>
                  <p className={cn("text-2xs font-bold")}>{tab.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </nav>
  );
}
