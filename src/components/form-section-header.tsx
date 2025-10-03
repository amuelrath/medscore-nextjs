import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export function FormSectionHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div
        className={cn(
          'flex select-none text-md font-medium flex-row items-center justify-between',
          className,
        )}
      >
        {children}
      </div>
      <hr />
    </>
  );
}

export function FormSectionHeaderContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('flex flex-row flex-grow items-center space-x-2', className)}>
      {children}
    </span>
  );
}

export function FormSectionHeaderIcon({ Icon }: { Icon: LucideIcon }) {
  return <Icon className="text-primary" size={16} />;
}

export function FormSectionHeaderTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={className}>{children}</p>;
}

