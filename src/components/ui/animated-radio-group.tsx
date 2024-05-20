import { useId, useCallback } from "react";
import { useEffect, useRef } from "react";
import CHECK_IN_ICON from "public/icons/system-regular-31-check-in-dark.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";

export function RadioGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: {
    value: string;
    label: string;
    pointValue: number;
    position: number;
  }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}) {
  const id = useId();

  return (
    <div role="radiogroup" className="space-y-2">
      {options
        .sort((a, b) => a.position - b.position)
        .map((option, k) => (
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

  const debouncedOnChange = useCallback(
    (value: string) => {
      debounce((newValue: string) => {
        onChange(newValue);
      }, 200)(value);
    },
    [onChange],
  );

  const bgColor = getBgColorFromPointValue((pointValue + 1) / 2);

  useEffect(() => {
    let animationFrameId: number | null = null;

    if (playerRef.current && checked) {
      if (playerRef.current.state.seeker <= 50) {
        playerRef.current?.play();
        const checkSeeker = () => {
          if (playerRef.current && playerRef.current.state.seeker === 50) {
            playerRef.current.pause();
            animationFrameId = null;
          } else {
            animationFrameId = requestAnimationFrame(checkSeeker);
          }
        };
        animationFrameId = requestAnimationFrame(checkSeeker);
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
            animationFrameId = null;
          } else {
            animationFrameId = requestAnimationFrame(checkSeeker);
          }
        };
        animationFrameId = requestAnimationFrame(checkSeeker);
      } else {
        playerRef.current?.stop();
        playerRef.current?.setSeeker(0);
      }
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [checked]);

  return (
    <div
      className={cn(
        "flex items-center rounded-full border-4 p-2 transition-all ease-in-out",
        checked ? "shadow-md drop-shadow-lg" : "hover:shadow-md",
        "ring-primary focus-within:ring-2 focus-within:ring-offset-2",
      )}
      onClick={() => debouncedOnChange(value)}
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
        onChange={() => debouncedOnChange(value)}
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
