'use client';

import { cn } from '@/lib/helpers/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface UseAutosizeTextAreaProps {
  textAreaRef: HTMLTextAreaElement | null;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight: number;
  triggerAutoSize: string;
}

const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 24,
  defaultHeight,
}: UseAutosizeTextAreaProps) => {
  const resizeTextArea = useCallback(() => {
    if (textAreaRef) {
      textAreaRef.style.height = `${defaultHeight}px`;
      const { scrollHeight } = textAreaRef;
      const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
      textAreaRef.style.height = `${newHeight}px`;
    }
  }, [maxHeight, minHeight, defaultHeight, textAreaRef]);

  useEffect(() => {
    resizeTextArea();
  }, [
    textAreaRef,
    triggerAutoSize,
    minHeight,
    maxHeight,
    defaultHeight,
    resizeTextArea,
  ]);

  useEffect(() => {
    if (textAreaRef) {
      const resizeObserver = new ResizeObserver(() => {
        resizeTextArea();
      });

      resizeObserver.observe(textAreaRef);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [resizeTextArea, textAreaRef]);
};

const textareaVariants = cva(
  'flex w-full rounded resize-none overflow-y-clip focus-visible:border-transparent border px-3 py-2 ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary/5 border-border text-neutral-800 focus-visible:ring-foreground/80',
        typography:
          'bg-transparent py-1 px-2 border-x-transparent border-t-transparent border-b-[1.75px] border-b-primary/30 hover:border-b-primary/60 focus-visible:border-b-primary rounded-none focus-visible:ring-transparent transition-colors',
        secondary:
          'bg-secondary/5 border-secondary text-neutral-700 focus-visible:ring-secondary/80',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
    },
  },
);

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  maxHeight: number;
  minHeight: number;
  defaultHeight: number;
};

type AutosizeTextAreaProps = {
  maxHeight?: number;
  minHeight?: number;
  defaultHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

export const AutosizeTextarea = React.forwardRef<
  AutosizeTextAreaRef,
  AutosizeTextAreaProps
>(
  (
    {
      maxHeight = Number.MAX_SAFE_INTEGER,
      minHeight: propMinHeight,
      defaultHeight = 24,
      className,
      onChange,
      value,
      variant,
      size,
      ...props
    }: AutosizeTextAreaProps,
    ref: React.Ref<AutosizeTextAreaRef>,
  ) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [triggerAutoSize, setTriggerAutoSize] = useState('');

    // Ensure minHeight is never less than defaultHeight
    const minHeight = Math.max(propMinHeight ?? defaultHeight, defaultHeight);

    useAutosizeTextArea({
      textAreaRef: textAreaRef.current,
      triggerAutoSize,
      maxHeight,
      minHeight,
      defaultHeight,
    });

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef.current?.focus(),
      maxHeight,
      minHeight,
      defaultHeight,
    }));

    useEffect(() => {
      setTriggerAutoSize(value as string);
    }, [value]);

    return (
      <textarea
        {...props}
        value={value}
        ref={textAreaRef}
        className={cn(textareaVariants({ variant, size, className }))}
        style={{ ...props.style, minHeight: `${defaultHeight}px` }}
        onChange={(e) => {
          setTriggerAutoSize(e.target.value);
          if (textAreaRef.current) {
            textAreaRef.current.style.height = `${defaultHeight}px`;
          }
          onChange?.(e);
        }}
      />
    );
  },
);

AutosizeTextarea.displayName = 'AutosizeTextarea';

export default AutosizeTextarea;
