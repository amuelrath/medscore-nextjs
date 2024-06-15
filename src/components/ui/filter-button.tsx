"use client";
import { LottieHover } from "@/components/ui/lottie-hover";
import FILTER from "public/icons/filter.json";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
export interface Tag {
  tag: string;
  variant: string;
}

interface FilterProps {
  children: ReactNode;
}

export function FilterPopover({ children }: FilterProps) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn("transition-all hover:mix-blend-exclusion")}
      >
        <LottieHover src={FILTER} size={"xs"} loop={false} />
      </PopoverTrigger>
      <PopoverContent
        className={cn("flex-1 flex-col justify-center space-y-1")}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

interface FilterOptionProps {
  tag: Tag;
  checked?: boolean;
  onChange?: (value: boolean) => void;
}

export function FilterOption({ tag, checked = false }: FilterOptionProps) {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  return (
    <Badge
      onClick={() => setIsChecked(!isChecked)}
      className={cn(
        isChecked && "ring-2 ring-primary ring-offset-1",
        "m-1 cursor-pointer truncate transition-all",
      )}
      // @ts-ignore
      variant={tag.variant}
    >
      {tag.tag}
    </Badge>
  );
}
