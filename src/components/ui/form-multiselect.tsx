"use client";

import {
  formTypeColors,
  formTypeLottie,
} from "@/components/(admin)/forms/home/create-form-dialog";
import { Card } from "@/components/ui/card";
import { LottieHover } from "@/components/ui/lottie-hover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollShadow } from "@/components/ui/scroll-shadow";
import { SearchInput } from "@/components/ui/search-input";
import { TFormType } from "@/db/schema";
import {
  UseMultiselectField,
  useMultiselectField,
} from "@/hooks/use-multiselect-field";
import { cn } from "@/lib/helpers/utils";
import { truncate } from "@/lib/truncate";
import { getAllFormsLite } from "@/server/actions/forms/get-all-forms-lite";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2Icon, PlusCircleIcon } from "lucide-react";
import { useMemo } from "react";
import { FieldValues } from "react-hook-form";

export function FormMultiselect<T extends FieldValues>({
  name,
  disabled = false,
  control,
  defaultValue,
  max = 1,
}: UseMultiselectField<T>) {
  const { select, deselect, selectedIds } = useMultiselectField({
    name,
    disabled,
    control,
    defaultValue,
    max,
  });

  // get the forms
  const { data: forms } = useSuspenseQuery({
    queryKey: ["forms"],
    queryFn: () =>
      getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const sortedItems = useMemo(() => {
    return [...forms]
      .filter((f) => f.type !== "DIRECT_OBSERVATION")
      .sort((a, b) => {
        if (a.id === (selectedIds.at(0) || "")) return -1;
        if (b.id === (selectedIds.at(0) || "")) return 1;
        return 0;
      });
  }, [forms, selectedIds]);

  return (
    <Popover modal>
      <PopoverTrigger asChild disabled={disabled}>
        <div
          role="button"
          className={cn(
            "w-[156px] h-[90px] relative overflow-hidden",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <div
            className={cn(
              "absolute transition inset-0 flex items-center justify-center",
              selectedIds.length > 0 && "hidden",
            )}
          >
            <div className="w-full h-full flex flex-col items-center justify-center hover:border-foreground/50 border transition group border-foreground/30 rounded-md">
              <PlusCircleIcon
                className={cn(
                  "text-foreground/30 group-hover:text-foreground/50 transition",
                  selectedIds.length > 0 && "opacity-0",
                )}
                strokeWidth={1.25}
              />
            </div>
          </div>
          {selectedIds.length > 0 && (
            <div className="absolute w-full">
              <CompactFormCard
                displayOnly
                title={forms.find((f) => f.id === selectedIds[0])?.title || ""}
                type={
                  forms.find((f) => f.id === selectedIds[0])?.type || "OSCE"
                }
              />
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="left"
        className={cn(
          "flex flex-col w-[375px] overflow-hidden h-[350px] max-h-[80vh]",
        )}
      >
        <div
          aria-label="search-and-filters"
          className="flex-shrink-0 flex -mt-4 flex-row items-center justify-between h-[45px]"
        >
          <SearchInput placeholder="Search forms..." size="xs" />
        </div>
        <div className="relative -mt-1 flex-grow overflow-hidden">
          <ScrollShadow position="top" />
          <ScrollShadow position="bottom" />
          <div className="grid grid-cols-2 auto-rows-[90px] gap-3 h-full p-2 overflow-y-auto no-scrollbar">
            {sortedItems.map((f) => (
              <CompactFormCard
                key={f.id}
                title={f.title}
                type={f.type}
                select={() => select(f.id)}
                deselect={() => deselect(f.id)}
                isSelected={selectedIds.includes(f.id)}
                disabled={disabled}
                isMaxReached={selectedIds.length >= max}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface CompactFormCardProps {
  title: string;
  type: TFormType;
  isSelected?: boolean;
  select?: () => void;
  deselect?: () => void;
  disabled?: boolean;
  isMaxReached?: boolean;
  displayOnly?: boolean;
}

function CompactFormCard({
  title,
  type,
  isSelected,
  select,
  deselect,
  disabled = false,
  isMaxReached,
  displayOnly = false,
}: CompactFormCardProps) {
  const iconSrc = formTypeLottie[type];

  const handleClick = () => {
    if (displayOnly) return;
    if (isSelected) {
      if (!disabled) {
        deselect?.();
      }
    } else if (!disabled) {
      select?.();
    }
  };

  return (
    <Card
      aria-disabled={disabled && isSelected}
      onClick={handleClick}
      className={cn(
        "relative h-[90px] overflow-clip",
        !displayOnly && "cursor-pointer hover:shadow-md transition",
        formTypeColors[type].border,
        disabled &&
          isSelected &&
          "opacity-50 cursor-not-allowed hover:scale-100",
        !isSelected && isMaxReached && "opacity-50",
      )}
    >
      <span className="opacity-30 translate-x-4 shadow-lg pointer-events-none">
        <LottieHover size="lg" isHovering={false} src={iconSrc} loop={false} />
      </span>
      <span className="absolute flex origin-center font-medium select-none flex-row items-center justify-between w-full p-2 text-xs z-20 h-2/5 backdrop-opacity-20 backdrop-filter bg-card bottom-0">
        <p>{truncate(title, 21)}</p>
        <AnimatePresence>
          {isSelected && !displayOnly && (
            <motion.span
              initial={{ rotate: 180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 180, scale: 0 }}
              transition={{ duration: 0.2, ease: "circInOut" }}
            >
              <CheckCircle2Icon className="text-accent-secondary" size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </Card>
  );
}
