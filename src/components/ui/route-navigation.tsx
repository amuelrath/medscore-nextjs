"use client";
import { useState, useEffect, ReactNode, ReactElement } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string | ReactNode;
  icon?: ReactElement;
  href: string;
}

// TODO discriminated union type so we know tabs are null if withoutTabs is true
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
        className={`flex h-full flex-col items-center border-r border-accent-secondary bg-card p-3`}
      >
        <div className="fixed bottom-3 left-[68px] z-50">
          <div className={cn("flex select-none flex-row text-gray-600")}>
            <h3 className={cn("flex flex-row text-2xl")}>
              <p className={cn("font-bold ")}>MED</p>
              <p className={cn("font-extralight ")}>score</p>
            </h3>
          </div>
        </div>
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
                    : "text-gray-400 hover:text-accent-secondary",
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
