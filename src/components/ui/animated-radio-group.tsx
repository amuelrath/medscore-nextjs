import { useId } from "react";
import { useEffect, useRef } from "react";
import CHECK_IN_ICON from "public/icons/system-regular-31-check-in-dark.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { cn } from "@/lib/utils";

// TODO Fix Animation Breaking if you switch options too quickly
// TODO Fix keyboard controls

export function RadioGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: { value: string; label: string; pointValue: number }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}) {
  const id = useId();

  /*
  const radioRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    const selectedIndex = options.findIndex((option) => option.value === value);
    if (selectedIndex !== -1 && radioRefs.current[selectedIndex]) {
      radioRefs.current[selectedIndex]?.focus();
    }
  }, [value, options]);

  const handleFormKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
*/
  return (
    <div role="radiogroup" className="space-y-2">
      {options.map((option, k) => (
        <RadioGroupItem
          key={option.value}
          id={`${id}-${k}`}
          name={name}
          value={option.value}
          label={option.label}
          checked={value === option.value}
          onChange={onChange}
          pointValue={option.pointValue}
          tabIndex={k === 0 ? 0 : -1}
        />
      ))}
    </div>
  );
}

function RadioGroupItem({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  pointValue,
  tabIndex,
}: {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  pointValue: number;
  tabIndex: number;
}) {
  const playerRef = useRef<Player>(null);
  /*
  const radioRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      onChange(value);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const previousElement = radioRef.current
        ?.previousElementSibling as HTMLInputElement;
      if (previousElement) {
        previousElement.focus();
      } else {
        const lastElement = radioRef.current?.parentElement?.lastElementChild
          ?.previousElementSibling as HTMLInputElement;
        if (lastElement) {
          lastElement.focus();
        }
      }
    } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const nextElement = radioRef.current
        ?.nextElementSibling as HTMLInputElement;
      if (nextElement) {
        nextElement.focus();
      } else {
        const firstElement = radioRef.current?.parentElement?.firstElementChild
          ?.nextElementSibling as HTMLInputElement;
        if (firstElement) {
          firstElement.focus();
        }
      }
    }
  };

  useEffect(() => {
    if (checked) {
      radioRef.current?.focus();
    }
  }, [checked]);
*/
  // Calculate background color based on pointValue

  const positiveColor = "#97c2e8"; // Desaturated blue color for positive values
  const negativeColor = "#f09f9f"; // Desaturated red color for negative values

  const normalizedValue = (pointValue + 1) / 2; // Normalize from -1 to 1 range to 0 to 1 range

  const red = Math.round(
    parseInt(negativeColor.slice(1, 3), 16) * (1 - normalizedValue) +
      parseInt(positiveColor.slice(1, 3), 16) * normalizedValue,
  );
  const green = Math.round(
    parseInt(negativeColor.slice(3, 5), 16) * (1 - normalizedValue) +
      parseInt(positiveColor.slice(3, 5), 16) * normalizedValue,
  );
  const blue = Math.round(
    parseInt(negativeColor.slice(5, 7), 16) * (1 - normalizedValue) +
      parseInt(positiveColor.slice(5, 7), 16) * normalizedValue,
  );

  const bgColor = `rgb(${red}, ${green}, ${blue})`;

  useEffect(() => {
    if (playerRef.current && checked) {
      if (playerRef.current.state.seeker <= 50) {
        playerRef.current?.play();
        const checkSeeker = () => {
          if (playerRef.current && playerRef.current.state.seeker === 50) {
            playerRef.current.pause();
          } else {
            requestAnimationFrame(checkSeeker);
          }
        };
        requestAnimationFrame(checkSeeker);
      }
    } else {
      if (playerRef.current && playerRef.current.state.seeker > 0) {
        playerRef.current?.setPlayerSpeed(2);
        playerRef.current.setPlayerDirection(-1);
        playerRef.current.play();
        const checkSeeker = () => {
          if (playerRef.current && playerRef.current.state.seeker <= 0) {
            playerRef.current?.setPlayerSpeed(1);
            playerRef.current.setPlayerDirection(1);
            playerRef.current.pause();
            playerRef.current.setSeeker(0);
          } else {
            requestAnimationFrame(checkSeeker);
          }
        };
        requestAnimationFrame(checkSeeker);
      } else {
        playerRef.current?.stop();
        playerRef.current?.setSeeker(0);
      }
    }
  }, [checked]);

  return (
    <div
      className={cn(
        "flex items-center rounded-full border-4 p-2 transition-all ease-in-out",
        checked ? "shadow-md drop-shadow-lg" : "hover:shadow-md",
        "ring-primary focus-within:ring-2 focus-within:ring-offset-2",
      )}
      onClick={() => onChange(value)}
      style={{
        backgroundColor: bgColor,
        borderColor: bgColor,
      }}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
        tabIndex={tabIndex}
      />
      <Player
        ref={playerRef}
        src={CHECK_IN_ICON}
        className={cn("size-6 text-black transition-all")}
      />
      <label htmlFor={id} className={cn("relative z-10 ml-2")}>
        {label}
      </label>
    </div>
  );
}
