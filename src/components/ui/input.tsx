import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/helpers/utils';

const inputVariants = cva(
  'flex w-full text-neutral-800 rounded px-3 py-2 text-sm ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/80 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        xs: 'h-7 text-2xs',
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
        xl: 'h-14 text-lg',
      },
      variant: {
        default: 'border-border bg-primary/5',
        underline:
          'bg-white border-x-0 rounded-none focus-visible:border-x-none focus-visible:border-t-none focus-visible:rounded-md border-t-0 border-b border-b-border',
        outline: 'leading-none py-1 px-2 border-transparent hover:border-primary',
        transparent:
          'bg-transparent no-input-border focus-visible:ring-transparent ring-0 transition-none',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

type InputVariantsProps = VariantProps<typeof inputVariants>;

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  autocomplete?: boolean;
  size?: InputVariantsProps['size'];
  variant?: InputVariantsProps['variant'];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autocomplete, size, variant, ...props }, ref) => (
    <input
      type={type}
      autoComplete={autocomplete ? 'on' : 'off'}
      className={cn(inputVariants({ size, variant, className }))}
      ref={ref}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

export { Input };
