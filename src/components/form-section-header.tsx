import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

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
    <span
      className={cn(
        'flex flex-row flex-grow items-center space-x-2',
        className,
      )}
    >
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

export const FormSectionHeaderButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof Button> & {
    LIcon: LucideIcon;
  }
>(({ children, className, LIcon, ...props }, ref) => (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      size="xs"
      className={cn('absolute top-0 space-x-2 right-0 w-36', className)}
      {...props}
    >
      <LIcon size={12} />
      <span>{children}</span>
    </Button>
  ));

FormSectionHeaderButton.displayName = 'FormSectionHeaderButton';
