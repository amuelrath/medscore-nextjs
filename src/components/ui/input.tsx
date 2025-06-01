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
          'bg-white border-0 focus:border-0 transition-none focus-visible:ring-0 ring-0 rounded-none',
        outline:
          'leading-none py-1 px-2 border-transparent hover:border-primary',
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
  format?: (value: string) => string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      autocomplete,
      size,
      variant,
      format,
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    // Show raw value when focused, formatted value when not focused
    const displayValue =
      format && value !== undefined && !isFocused
        ? format(value.toString())
        : value;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        if (format) {
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: e.target.value.replace(/[^\d.-]/g, ''),
            },
          };
          onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
        } else {
          onChange(e);
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <input
        type={type}
        autoComplete={autocomplete ? 'on' : 'off'}
        className={cn(inputVariants({ size, variant, className }))}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
