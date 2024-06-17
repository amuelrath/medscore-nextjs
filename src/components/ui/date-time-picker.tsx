"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "./time-picker-input";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";

interface DateTimePickerProps {
  disabled?: boolean;
  onChange?: (value: Date | undefined) => void;
  value?: Date | undefined;
}

export function DateTimePicker({
  disabled,
  value,
  onChange,
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
  };

  useEffect(() => {
    if (onChange) {
      onChange(date);
    }
  }, [date, onChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("fixed -left-96 -top-32 w-full p-0")}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => handleSelect(d)}
          initialFocus
        />
        <div className="border-t border-border p-3">
          <TimePickerDemo setDate={setDate} date={date} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DateTimePickerWithoutPopover({
  value,
  onChange,
  disabled,
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
  };

  useEffect(() => {
    if (onChange) {
      onChange(date);
    }
  }, [date, onChange]);

  if (disabled) {
    return null; // Return null to hide the component when disabled
  }

  return (
    <Card className={cn("border-none bg-background shadow-none p-4 z-10")}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(d) => handleSelect(d)}
        initialFocus
      />
      <div className="border-t border-border p-3">
        <TimePickerDemo setDate={setDate} date={date} />
      </div>
    </Card>
  );
}
