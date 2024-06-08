"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";
import { useSearchParamEffect } from "@/hooks/useSearchParamEffect";
import { useSearchParams } from "next/navigation";

type Tab = {
  id: number;
  label: string;
  content: ReactNode;
};

interface DirectionAwareTabsContextProps {
  activeTab: number;
  setActiveTab: (id: number) => void;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
  direction: number;
  setDirection: (direction: number) => void;
  tabs: Tab[];
  bubbleId?: string;
}

const DirectionAwareTabsContext = createContext<
  DirectionAwareTabsContextProps | undefined
>(undefined);

interface DirectionAwareTabsProviderProps {
  tabs: Tab[];
  bubbleId?: string;
  children: ReactNode;
}

function DirectionAwareTabsProvider({
  tabs,
  bubbleId,
  children,
}: DirectionAwareTabsProviderProps) {

  const [activeTab, setActiveTab] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);


  const contextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      isAnimating,
      setIsAnimating,
      direction,
      setDirection,
      tabs,
      bubbleId,
    }),
    [activeTab, setActiveTab, isAnimating, direction, tabs, bubbleId],
  );

  return (
    <DirectionAwareTabsContext.Provider value={contextValue}>
      {children}
    </DirectionAwareTabsContext.Provider>
  );
}

function useDirectionAwareTabs() {
  const context = useContext(DirectionAwareTabsContext);
  if (context === undefined) {
    throw new Error(
      "useDirectionAwareTabs must be used within a DirectionAwareTabsProvider",
    );
  }
  return context;
}

interface DirectionAwareTabsProps {
  className?: string;
}

function DirectionAwareTabs({ className }: DirectionAwareTabsProps) {
  const { activeTab, setActiveTab, isAnimating, setDirection, tabs, bubbleId } =
    useDirectionAwareTabs();

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1;
      setDirection(newDirection);
      setActiveTab(newTabId);
    }
  };

  return (
    <div
      className={cn(
        "flex cursor-pointer space-x-1 px-[3px] py-[3.2px]",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={cn(
            "text-accent-200 relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:outline-1 focus-visible:ring-1 sm:text-sm",
            activeTab === tab.id
              ? "text-foreground"
              : "text-foreground/80 hover:text-foreground/60",
          )}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId={bubbleId || "direction-aware-tabs-bubble"}
              className="absolute inset-0 z-10 border-b-2 border-accent"
              transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
            />
          )}

          {tab.label}
        </button>
      ))}
    </div>
  );
}

function DirectionAwareContent() {
  const { activeTab, isAnimating, setIsAnimating, direction, tabs } =
    useDirectionAwareTabs();
  const [ref, bounds] = useMeasure();

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    return activeTabContent || null;
  }, [activeTab, tabs]);

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
      <motion.div
        className="relative mx-auto h-full w-full overflow-hidden"
        initial={false}
        animate={{ height: bounds.height }}
      >
        <div className="p-1" ref={ref}>
          <AnimatePresence
            custom={direction}
            mode="popLayout"
            onExitComplete={() => setIsAnimating(false)}
          >
            <motion.div
              key={activeTab}
              variants={variants}
              initial="initial"
              animate="active"
              exit="exit"
              custom={direction}
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </MotionConfig>
  );
}

export {
  DirectionAwareTabsProvider,
  DirectionAwareTabs,
  DirectionAwareContent,
};
