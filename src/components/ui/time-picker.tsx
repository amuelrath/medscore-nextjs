"use client";
import { ChangeEvent, FC, useState, useEffect, useRef, RefObject } from "react";
import { cn } from "@/lib/utils";
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

  useEffect(() => {
    if (value) {
      setTime(value);
      setIsAM(value.getHours() < 12);
    }
  }, [value]);

  const handleHoursChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newHours = parseInt(event.target.value, 10);
    if (!isNaN(newHours) && newHours >= 1 && newHours <= 12) {
      const newTime = new Date(time);
      newTime.setHours(isAM ? newHours % 12 : (newHours % 12) + 12);
      setTime(newTime);
      if (onChange) {
        onChange(newTime);
      }
    }
  };

  const handleMinutesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseInt(event.target.value, 10);
    if (!isNaN(newMinutes) && newMinutes >= 0 && newMinutes <= 59) {
      const newTime = new Date(time);
      newTime.setMinutes(newMinutes);
      setTime(newTime);
      if (onChange) {
        onChange(newTime);
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

  const getDisplayHours = () => {
    const hours = time.getHours();
    if (hours === 1) {
      return "1";
    }
    return hours % 12 === 0 ? "12" : (hours % 12).toString().padStart(2, "0");
  };

  const getDisplayMinutes = () => {
    return time.getMinutes().toString().padStart(2, "0");
  };

  // QOL
  const handleInputAutoClear = (ref: RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.value = "";
    }
  };

  useEffect(() => {
    if (hourRef.current) {
      const hourValue = hourRef.current.value;
      if (hourValue.length === 1 && hourValue <= "09") {
        if (minuteRef.current) {
          minuteRef.current.focus();
        }
      }

      if (hourValue.length === 2 && hourValue >= "01" && hourValue <= "12") {
        if (minuteRef.current) {
          minuteRef.current.focus();
        }
      }
    }
  }, [hourRef.current?.value]);

  return (
    <div className="flex flex-row items-center space-x-1 rounded-md border border-slate-200 bg-blue-800/5 p-[3px] shadow-inner">
      <input
        autoFocus={false}
        autoComplete={"off"}
        ref={hourRef}
        onClick={() => handleInputAutoClear(hourRef)}
        disabled={disabled}
        className={cn(
          "h-8 w-9 rounded-md border-none bg-transparent p-0 text-center text-sm tracking-widest transition-colors focus:outline-transparent focus-visible:bg-slate-100",
        )}
        type="number"
        placeholder="--"
        value={getDisplayHours()}
        onChange={handleHoursChange}
        size={2}
        min={0}
        max={12}
      />
      <span className="text-sm font-medium">:</span>
      <input
        autoFocus={false}
        autoComplete={"off"}
        size={2}
        ref={minuteRef}
        disabled={disabled}
        className={cn(
          "focus:ring-none h-8 w-9 rounded-md border-none bg-transparent p-0 text-center text-sm tracking-widest transition-colors focus:outline-transparent focus-visible:bg-slate-100",
        )}
        type="number"
        onClick={() => handleInputAutoClear(minuteRef)}
        placeholder="--"
        value={getDisplayMinutes()}
        onChange={handleMinutesChange}
        min={0}
        max={59}
      />
      <Button
        type={"button"}
        className={cn("w-8 bg-blue-950/5 hover:bg-blue-900/5 transition-all")}
        variant={"secondary"}
        size={"xs"}
        onClick={handleAMPMClick}
      >
        {isAM ? "AM" : "PM"}
      </Button>
    </div>
  );
};
