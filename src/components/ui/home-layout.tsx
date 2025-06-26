import { ReactNode } from 'react';
import { cn } from '@/lib/utils';


export function HomeLayout({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("flex flex-grow flex-col", className)}>{children}</main>;
}

export function HomeLayoutHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("h-12 flex-shrink-0 items-center grid grid-cols-3 px-4 border-border bg-card", className)}>
      {children}
    </div>
  );
}

export function HomeLayoutTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-2xl border border-transparent font-semibold text-foreground", className)}>
      {children}
    </span>
  );
}

export function HomeLayoutContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex-grow px-4 pb-4 pt-2", className)}>
      {children}
    </div>
  )
}