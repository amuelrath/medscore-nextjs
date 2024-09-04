'use client';

import { cn } from '@/lib/helpers/utils';
import { usePathname, useRouter } from 'next/navigation';
import { ReactElement, ReactNode, useEffect, useState } from 'react';

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
      <div className="flex h-full w-12 flex-col items-center bg-primary p-1.5">
        <div className={cn('flex select-none flex-col items-center space-y-3')}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              role="button"
              onClick={() => {
                setActiveTab(tab.id);
                handleNavigate(tab.href);
              }}
              className={`${
                activeTab === tab.id ? '' : 'hover:text-primary/5'
              } relative z-20 w-full rounded-full py-1.5 text-xs font-medium tracking-wider text-white transition focus-visible:outline-2`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className={cn(
                  'flex w-full flex-col items-center  space-y-1 transition-all duration-300',
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-neutral-300 hover:text-white',
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
