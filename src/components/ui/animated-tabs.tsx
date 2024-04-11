"use client";
import { motion } from "framer-motion";
import { useState, useContext, createContext, useEffect } from "react";

type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

type TabsContextType = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextType>({
  activeTab: "",
  setActiveTab: () => {},
});

export function useTabsContext() {
  return useContext(TabsContext);
}

export function TabsProvider({ children }: { children: React.ReactNode }) {
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
  children: React.ReactNode;
}) {
  const { activeTab } = useTabsContext();
  return activeTab === id ? <>{children}</> : null;
}

type TabsProps = {
  tabs: Tab[];
  icons?: boolean;
};

export function AnimatedTabs({ tabs, icons }: TabsProps) {
  const { activeTab, setActiveTab } = useTabsContext();

  useEffect(() => {
    setActiveTab(tabs[0]?.id);
  }, []);

  return (
    <div
      className={`relative flex flex-row space-x-2 items-center bg-primary z-10`}
    >
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="button"
          onClick={() => setActiveTab(tab.id)}
          className={`${
            activeTab === tab.id ? "" : "hover:text-notepad/60"
          } relative rounded-full px-2 py-1 text-sm font-medium text-notepad transition focus-visible:outline-2`}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <span className="relative z-20">{icons ? tab.icon : tab.label}</span>
          {activeTab === tab.id && (
            <motion.span
              layoutId="module-select"
              className="absolute inset-0 z-10 bg-accent mix-blend-exclusion"
              style={{ borderRadius: 5 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
