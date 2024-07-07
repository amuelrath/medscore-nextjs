import React, { ChangeEvent, FC, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/helpers/utils";
import { Button } from "@/components/ui/button";

interface TimeInputProps {
  disabled?: boolean;
  value?: Date;
  onChange?: (time: Date) => void;
}

export const TimePicker: FC<TimeInputProps> = ({
  disabled,
  value,
  onChange,
}) => {
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const [time, setTime] = useState(value || new Date());
  const [isAM, setIsAM] = useState(time.getHours() < 12);
  const [hours, setHours] = useState(getDisplayHours());
  const [minutes, setMinutes] = useState(getDisplayMinutes());

  useEffect(() => {
    if (value) {
      setTime(value);
      setIsAM(value.getHours() < 12);
      setHours(getDisplayHours(value));
      setMinutes(getDisplayMinutes(value));
    }
  }, [value]);

  const handleHoursChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newHours = event.target.value;
    if (
      newHours === "" ||
      (parseInt(newHours, 10) >= 1 && parseInt(newHours, 10) <= 12)
    ) {
      setHours(newHours);
      if (newHours.length === 2) {
        const parsedHours = parseInt(newHours, 10);
        const newTime = new Date(time);
        newTime.setHours(isAM ? parsedHours % 12 : (parsedHours % 12) + 12);
        setTime(newTime);
        if (onChange) {
          onChange(newTime);
        }
        minuteRef.current?.focus();
      }
    }
  };

  const handleMinutesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMinutes = event.target.value;
    if (
      newMinutes === "" ||
      (parseInt(newMinutes, 10) >= 0 && parseInt(newMinutes, 10) <= 59)
    ) {
      setMinutes(newMinutes);
      if (newMinutes.length === 2) {
        const parsedMinutes = parseInt(newMinutes, 10);
        const newTime = new Date(time);
        newTime.setMinutes(parsedMinutes);
        setTime(newTime);
        if (onChange) {
          onChange(newTime);
        }
      }
    }
  };

  const handleAMPMClick = () => {
    const newTime = new Date(time);
    if (isAM) {
      newTime.setHours(newTime.getHours() + 12);
    } else {
      newTime.setHours(newTime.getHours() - 12);
    }
    setTime(newTime);
    setIsAM(!isAM);
    if (onChange) {
      onChange(newTime);
    }
  };

  function getDisplayHours(date: Date = time) {
    const hours = date.getHours();
    return hours === 0 || hours === 12 ? "12" : (hours % 12).toString();
  }

  function getDisplayMinutes(date: Date = time) {
    return date.getMinutes().toString().padStart(2, "0");
  }

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <div className="flex flex-row items-center space-x-1 rounded-md border border-slate-200 bg-blue-800/5 p-[3px] shadow-inner">
      <input
        ref={hourRef}
        disabled={disabled}
        className={cn(
          "h-8 w-9 rounded-md border-none bg-transparent p-0 text-center text-sm tracking-widest transition-colors focus:outline-transparent focus-visible:bg-slate-100",
        )}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="--"
        value={hours}
        onChange={handleHoursChange}
        onFocus={handleInputFocus}
        maxLength={2}
      />
      <span className="text-sm font-medium">:</span>
      <input
        ref={minuteRef}
        disabled={disabled}
        className={cn(
          "focus:ring-none h-8 w-9 rounded-md border-none bg-transparent p-0 text-center text-sm tracking-widest transition-colors focus:outline-transparent focus-visible:bg-slate-100",
        )}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="--"
        value={minutes}
        onChange={handleMinutesChange}
        onFocus={handleInputFocus}
        maxLength={2}
      />
      <Button
        type="button"
        className={cn("w-8 bg-blue-950/5 transition-all hover:bg-blue-900/5")}
        variant="secondary"
        size="xs"
        onClick={handleAMPMClick}
      >
        {isAM ? "AM" : "PM"}
      </Button>
    </div>
  );
};
