import { ReactNode, useState } from "react";
import { cn } from "@/lib/helpers/utils";

interface TabsBoxProps {
  defaultTab?: string;
  tabs: Tab[];
}

export interface Tab {
  id: string;
  label: string | ReactNode;
  content: ReactNode;
}

export function TabsBox({ defaultTab, tabs }: TabsBoxProps) {
  const [selectedTabId, setSelectedTabId] = useState<string>(
    defaultTab || tabs[0]?.id
  );

  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="flex flex-row  items-end">
        {tabs?.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTabId(t.id)}
            className={cn(
              "-mb-[0.5px] -ml-[0.5px] inline-block h-6 w-24 cursor-pointer rounded-tl-md rounded-tr-md border-x-[1px] border-t border-neutral-300 px-4 py-2 text-center text-xs",
              "transition-all duration-200 ease-in-out",
              t.id === selectedTabId
                ? "-translate-y-[1.5px] scale-y-[110%] border-b border-b-white bg-white"
                : " border-b border-b-transparent bg-primary/5 text-neutral-500 hover:bg-gray-200"
            )}
          >
            <div
              className={cn(
                "relative text-2xs select-none",
                t.id === selectedTabId && "scale-y-[90.91%]" // Inverse of 110%
              )}
            >
              {t.label}
            </div>
          </div>
        ))}
      </div>
      <div className="-mt-[1px] flex flex-grow flex-col bg-white rounded-b-md rounded-tr-md border border-neutral-300">
        <div className="flex-grow">
          {tabs.find((t) => t.id === selectedTabId)?.content}
        </div>
      </div>
    </div>
  );
}