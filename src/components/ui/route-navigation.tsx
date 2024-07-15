"use client";
import { useState, useEffect, ReactNode, ReactElement } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/helpers/utils";

interface Tab {
  id: string;
  label: string | ReactNode;
  icon?: ReactElement;
  href: string;
}

interface Props {
  tabs: Tab[];
  defaultValue?: string;
}

export function RouteNavigation({ tabs }: Props) {
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
        className={`flex min-h-screen w-12 flex-col items-center border-r border-neutral-300 bg-[#eaeaea] p-1.5`}
      >
        <div className={cn("flex select-none flex-col items-center space-y-3")}>
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
                  "flex w-full flex-col items-center  space-y-1 transition-all duration-300",
                  activeTab === tab.id
                    ? "text-accent-secondary"
                    : "text-primary hover:text-accent-secondary",
                )}
              >
                {tab.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
