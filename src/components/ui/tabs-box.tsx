import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

export interface Tab {
  id: string;
  label: string | ReactNode;
  content: ReactNode;
}

interface TabsBoxProps<T extends Tab[]> {
  defaultTab?: T[number]['id'];
  tabs: T;
  onTabChange?: (activeTab: T[number]['id']) => void;
}

export function TabsBox<T extends Tab[]>({
  defaultTab,
  tabs,
  onTabChange,
}: TabsBoxProps<T>) {
  const [selectedTabId, setSelectedTabId] = useState<T[number]['id']>(
    defaultTab || tabs[0]?.id,
  );

  const handleTabChange = (tabId: T[number]['id']) => {
    setSelectedTabId(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="flex flex-row items-end">
        {tabs?.map((t) => (
          <div
            key={t.id}
            onMouseDown={() => handleTabChange(t.id)}
            className={cn(
              '-mb-[0.75px] ml-[0px] justify-center inline-block h-[1.85rem] w-24 cursor-pointer rounded-tl-sm rounded-tr-sm border-x-[1px] border-t px-1  text-center text-2xs',
              'transition-all duration-200 ease-in-out',
              t.id === selectedTabId
                ? '-translate-y-[1.5px] scale-y-[110%] border-b border-b-white pt-1.5 bg-white'
                : ' border-b border-b-transparent bg-primary/5 text-neutral-500 pt-2 hover:bg-gray-200',
            )}
          >
            <div
              className={cn(
                'relative text-2xs select-none',
                t.id === selectedTabId && 'scale-y-[90.91%]', // Inverse of 110%
              )}
            >
              {t.label}
            </div>
          </div>
        ))}
      </div>
      <div className="-mt-[1px] flex flex-grow flex-col bg-white rounded-b-sm rounded-tr-sm border">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTabId}
            initial={{ opacity: 0.5, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.1 }}
            className="flex-grow"
          >
            {tabs.find((t) => t.id === selectedTabId)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
