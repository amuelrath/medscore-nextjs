"use client";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  m,
  LazyMotion,
  domAnimation,
} from "framer-motion";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/helpers/utils";
import { cva, VariantProps } from "class-variance-authority";

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

const tabVariants = cva(
  "font-medium relative flex items-center gap-2 rounded-full transition focus-visible:outline-none focus-visible:outline-1 focus-visible:ring-1",
  {
    variants: {
      size: {
        sm: "px-2.5 py-1 text-xs",
        md: "px-3.5 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
      active: {
        true: "text-foreground",
        false: "text-foreground/80 hover:text-foreground/60",
      },
      variant: {
        primary: "",
        secondary: "rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
      active: false,
      variant: "primary",
    },
  },
);

const motionSpanVariants = cva("absolute inset-0 z-10", {
  variants: {
    color: {
      accent: "border-accent",
      "accent-secondary": "border-accent-secondary",
      outline: "border-neutral-600",
      primary: "border-primary",
      secondary: "border-secondary",
      success: "border-success",
      warning: "border-warning",
      error: "border-error",
      info: "border-info",
    },
    variant: {
      primary: "border-b-2",
      secondary: "rounded-md",
    },
  },
  compoundVariants: [
    {
      variant: "secondary",
      color: "accent",
      class: "bg-accent/10",
    },
    {
      variant: "secondary",
      color: "accent-secondary",
      class: "bg-accent-secondary/10",
    },
    {
      variant: "secondary",
      color: "outline",
      class: "bg-neutral-600/10 border-b-2",
    },
    {
      variant: "secondary",
      color: "primary",
      class: "bg-primary/10 border-b-2",
    },
    {
      variant: "secondary",
      color: "secondary",
      class: "bg-secondary/10",
    },
    {
      variant: "secondary",
      color: "success",
      class: "bg-success/10",
    },
    {
      variant: "secondary",
      color: "warning",
      class: "bg-warning/10",
    },
    {
      variant: "secondary",
      color: "error",
      class: "bg-error/10",
    },
    {
      variant: "secondary",
      color: "info",
      class: "bg-info/10",
    },
  ],
  defaultVariants: {
    color: "accent-secondary",
    variant: "primary",
  },
});
interface DirectionAwareTabsProps
  extends VariantProps<typeof tabVariants>,
    VariantProps<typeof motionSpanVariants> {
  className?: string;
}

function DirectionAwareTabs({
  className,
  size,
  variant,
  color,
}: DirectionAwareTabsProps) {
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
          className={tabVariants({
            size,
            active: activeTab === tab.id,
            variant,
          })}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {activeTab === tab.id && (
            <LazyMotion features={domAnimation}>
              <m.span
                layoutId={bubbleId || "direction-aware-tabs-bubble"}
                className={motionSpanVariants({
                  color,
                  variant,
                })}
                transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
              />
            </LazyMotion>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function DirectionAwareContent({ className }: { className?: string }) {
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
    <LazyMotion features={domAnimation}>
      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.1 }}>
        <m.div
          className={cn("flex flex-col overflow-x-hidden", className)}
          initial={false}
          animate={{ height: bounds.height > 0 ? bounds.height : "100%" }}
        >
          <div ref={ref} className="flex flex-grow flex-col">
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <m.div
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
                className="flex flex-grow flex-col"
              >
                {content}
              </m.div>
            </AnimatePresence>
          </div>
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}

export {
  DirectionAwareTabsProvider,
  DirectionAwareTabs,
  DirectionAwareContent,
};
