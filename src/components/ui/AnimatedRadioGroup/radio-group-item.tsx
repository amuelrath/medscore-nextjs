import { forwardRef, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import CHECK_IN_ICON from "public/icons/system-regular-31-check-in-dark.json";
import { useFocusVisible } from "@/hooks/useFocusVisible";
import { useRadioGroup } from "./radio-group-provider";
import { mergeRefs } from "@/lib/mergeRefs";

interface RadioGroupItemProps {
  label: string | null;
  value: string;
  className?: string;
}
const RadioGroupItem = forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ label, value, className, ...props }, ref) => {
    const {
      selectedValue,
      setSelectedValue,
      registerOption,
      unregisterOption,
    } = useRadioGroup();
    const itemRef = useRef<HTMLDivElement>(null);
    const {
      isFocusVisible,
      ref: focusRef,
      onFocus,
      onBlur,
      onKeyUp,
    } = useFocusVisible<HTMLDivElement>();
    const isSelected = selectedValue === value;

    useEffect(() => {
      if (itemRef.current) {
        registerOption(value, itemRef.current);
      }
      return () => {
        unregisterOption(value);
      };
    }, [registerOption, unregisterOption, value]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        setSelectedValue(value);
      }
    };

    return (
      <div
        ref={mergeRefs(ref, itemRef, focusRef)}
        tabIndex={0}
        role="radio"
        aria-checked={isSelected}
        onClick={() => setSelectedValue(value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
        className={cn(
          "flex items-center rounded-full border-4 p-2 transition-all ease-in-out",
          isSelected ? "shadow-md drop-shadow-lg" : "hover:shadow-md",
          isFocusVisible && "ring-2 ring-primary",
          className,
        )}
        {...props}
      >
        <Lottie
          animationData={CHECK_IN_ICON}
          className={cn("size-6 text-black transition-all", {
            "opacity-100": isSelected,
            "opacity-0": !isSelected,
          })}
        />
        {label && (
          <label htmlFor={value} className={cn("relative z-10 ml-2")}>
            {label}
          </label>
        )}
      </div>
    );
  },
);

RadioGroupItem.displayName = "RadioGroupItem";
