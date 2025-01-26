'use client';

import { cn } from '@/lib/helpers/utils';
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  motion,
} from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import useMeasure from 'react-use-measure';

export type Tab = {
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
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
  goBack: () => void;
  goForward: () => void;
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
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const goBack = () => {
    if (activeTab > 0 && !isAnimating) {
      setDirection(-1);
      setActiveTab(activeTab - 1);
    }
  };

  const goForward = () => {
    if (activeTab < tabs.length - 1 && !isAnimating) {
      setDirection(1);
      setActiveTab(activeTab + 1);
    }
  };

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
      isHovering,
      setIsHovering,
      goBack,
      goForward,
    }),
    [activeTab, isAnimating, direction, tabs, bubbleId, isHovering],
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
      'useDirectionAwareTabs must be used within a DirectionAwareTabsProvider',
    );
  }
  return context;
}

const navigationButtonClass =
  'p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed';

function DirectionAwareTabHeader({ className }: { className?: string }) {
  const { activeTab, isAnimating, tabs, goBack, goForward } =
    useDirectionAwareTabs();

  return (
    <div className="relative flex flex-grow">
      <div
        className={cn(
          'flex items-center flex-grow justify-between gap-4',
          className,
        )}
      >
        <button
          type="button"
          onMouseDown={goBack}
          disabled={activeTab === 0}
          className={navigationButtonClass}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <p className="col-start-2 col-span-1 text-md font-semibold">
          {tabs[activeTab]?.label}
        </p>

        <button
          type="button"
          onMouseDown={goForward}
          disabled={activeTab === tabs.length - 1}
          className={navigationButtonClass}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function DirectionAwareDots() {
  const { activeTab, tabs } = useDirectionAwareTabs();

  const activeTabIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="flex justify-center flex-row space-x-2 items-center">
      {tabs.map((_, index) => (
        <motion.circle
          key={index}
          className={cn(
            'rounded-full origin-center bg-primary/15 transition-all',
            index === activeTabIndex
              ? 'opacity-100 h-1.5 w-4'
              : 'opacity-80 size-1',
          )}
        />
      ))}
    </div>
  );
}

function DirectionAwareContent({ className }: { className?: string }) {
  const { activeTab, isHovering, setIsAnimating, direction, tabs } =
    useDirectionAwareTabs();
  const [ref, bounds] = useMeasure();

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    return activeTabContent || null;
  }, [activeTab, tabs]);

  const variants = {
    initial: (initDirection: number) => ({
      x: 300 * initDirection,
      opacity: 0,
      filter: 'blur(4px)',
      position: 'absolute',
      width: '100%',
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      position: 'relative',
      width: '100%',
    },
    exit: (exitDirection: number) => ({
      x: -300 * exitDirection,
      opacity: 0,
      filter: 'blur(4px)',
      position: 'absolute',
      width: '100%',
    }),
  };

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig transition={{ duration: 0.4, type: 'spring', bounce: 0.1 }}>
        <m.div
          className={cn(
            'flex flex-col relative',
            className,
            isHovering && 'will-change-transform',
          )}
          initial={false}
          animate={{ height: bounds.height > 0 ? bounds.height : '100%' }}
        >
          <div ref={ref} className="relative w-full">
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
                className="w-full"
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
  DirectionAwareContent,
  DirectionAwareTabHeader,
  DirectionAwareTabsProvider,
};
