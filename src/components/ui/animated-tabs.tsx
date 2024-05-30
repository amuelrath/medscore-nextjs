"use client";
import { motion } from "framer-motion";
import {
  useState,
  useContext,
  createContext,
  useEffect,
  ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType>({
  activeTab: "",
  setActiveTab: () => {},
});

export function useTabsContext() {
  return useContext(TabsContext);
}

export function TabsProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("");
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

export function TabContent({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { activeTab } = useTabsContext();
  return activeTab === id ? <>{children}</> : null;
}

const tabsStyles = cva(`relative select-none flex flex-row space-x-2 items-center z-10`, {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm space-x-4",
      md: "text-base space-x-4",
      lg: "text-lg space-x-6",
    },
    color: {
      primary: "text-notepad",
      accent: "bg-accent text-white",
      "accent-secondary": "bg-accent-secondary text-white",
    },
  },
  defaultVariants: {
    size: "xs",
    color: "primary",
  },
});

type TabsProps = {
  id?: string;
  tabs: Tab[];
  icons?: boolean;
} & VariantProps<typeof tabsStyles>;

export function Tabs({ id, tabs, icons, size, color }: TabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeTab, setActiveTab } = useTabsContext();

  useEffect(() => {
    const activeTabFromQuery = searchParams.get("tab");
    if (
      activeTabFromQuery &&
      tabs.some((tab) => tab.id === activeTabFromQuery)
    ) {
      setActiveTab(activeTabFromQuery);
    } else {
      setActiveTab(tabs[0]?.id);
    }
  }, [searchParams, tabs, setActiveTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", tabId);
    const newPathname = `${pathname}?${newSearchParams.toString()}`;
    router.replace(newPathname);
  };

  return (
    <div className={tabsStyles({ size, color })}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="button"
          onClick={() => handleTabClick(tab.id)}
          className={`${
            activeTab == tab.id ? "text-shadow text-primary" : "text-primary/70 hover:text-primary/60"
          } relative tracking-wide rounded-full font-semibold py-1 text-primary transition-all focus-visible:outline-2`}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <span className="relative z-40">{icons ? tab.icon : tab.label}</span>
          {activeTab === tab.id && (
            <motion.span
              layoutId={`module-select-${id}`}
              className="absolute inset-0 z-40 border-b-2 border-accent"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
