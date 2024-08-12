"use client";
import React, { useEffect, useRef, useState, useImperativeHandle, useCallback } from "react";
import { cn } from "@/lib/helpers/utils";

interface UseAutosizeTextAreaProps {
  textAreaRef: HTMLTextAreaElement | null;
  minHeight?: number;
  maxHeight?: number;
  triggerAutoSize: string;
}

const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
}: UseAutosizeTextAreaProps) => {
  const resizeTextArea = useCallback(() => {
    if (textAreaRef) {
      textAreaRef.style.height = "auto";
      const scrollHeight = textAreaRef.scrollHeight;
      const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
      textAreaRef.style.height = `${newHeight}px`;
    }
  }, [maxHeight, minHeight, textAreaRef]);

  useEffect(() => {
    resizeTextArea();
  }, [textAreaRef, triggerAutoSize, minHeight, maxHeight, resizeTextArea]);

  // Use ResizeObserver to detect width changes
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

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  maxHeight: number;
  minHeight: number;
};

type AutosizeTextAreaProps = {
  maxHeight?: number;
  minHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutosizeTextarea = React.forwardRef<
  AutosizeTextAreaRef,
  AutosizeTextAreaProps
>(
  (
    {
      maxHeight = Number.MAX_SAFE_INTEGER,
      minHeight = 52,
      className,
      onChange,
      value,
      ...props
    }: AutosizeTextAreaProps,
    ref: React.Ref<AutosizeTextAreaRef>,
  ) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [triggerAutoSize, setTriggerAutoSize] = useState("");

    useAutosizeTextArea({
      textAreaRef: textAreaRef.current,
      triggerAutoSize: triggerAutoSize,
      maxHeight,
      minHeight,
    });

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef.current?.focus(),
      maxHeight,
      minHeight,
    }));

    useEffect(() => {
      setTriggerAutoSize(value as string);
    }, [value]);

    return (
      <textarea
        {...props}
        value={value}
        ref={textAreaRef}
        className={cn(
          "flex w-full rounded-md bg-primary/5 resize-none overflow-y-clip focus-visible:border-transparent border border-border px-3 py-2 text-sm text-neutral-800 ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/80 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onChange={(e) => {
          setTriggerAutoSize(e.target.value);
          if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
          }
          onChange?.(e);
        }}
      />
    );
  },
);

AutosizeTextarea.displayName = "AutosizeTextarea";

export default AutosizeTextarea;
