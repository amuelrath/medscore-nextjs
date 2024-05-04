"use client";
import {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  ReactNode,
  forwardRef,
  cloneElement,
  Children,
  isValidElement,
} from "react";
import CHECK_IN_ICON from "public/icons/system-regular-31-check-in-dark.json";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { cn } from "@/lib/utils";

type TRadioGroupContext = {
  selectedValue: string | undefined;
  setSelectedValue: (newVal: string) => void;
};

const RadioGroupContext = createContext<TRadioGroupContext | undefined>(
  undefined,
);

function useRadioGroup() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error(
      "useRadioGroup must be used inside a RadioGroupContext.Provider",
    );
  }
  return context;
}

interface RadioGroupProviderProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

const RadioGroupProvider = forwardRef<
  HTMLUListElement,
  RadioGroupProviderProps
>(({ children, defaultValue, onChange, className, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue || undefined,
  );

  useEffect(() => {
    if (onChange && selectedValue) {
      onChange(selectedValue);
    }
  }, [onChange, selectedValue]);

  const clonedChildren = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return <li>{cloneElement(child)}</li>;
    }
    return child;
  });

  return (
    <RadioGroupContext.Provider value={{ selectedValue, setSelectedValue }}>
      <ul ref={ref} className={cn(className, "space-y-2")} {...props}>
        {clonedChildren}
      </ul>
    </RadioGroupContext.Provider>
  );
});

RadioGroupProvider.displayName = "RadioGroupProvider";

interface RadioGroupItemProps {
  label: string | null;
  value: string;
  className?: string;
  style?: React.CSSProperties;
}

const RadioGroupItem = forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ label, value, className, style, ...props }, ref) => {
    const { selectedValue, setSelectedValue } = useRadioGroup();
    const isSelected = selectedValue === value;

    const playerRef = useRef<Player>(null);

    useEffect(() => {
      if (playerRef.current && isSelected) {
        if (playerRef.current.state.seeker !== 50) {
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
            if (playerRef.current && playerRef.current.state.seeker === 0) {
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
    }, [isSelected]);

    return (
      <div
        ref={ref}
        onClick={() => setSelectedValue(value)}
        className={cn(
          "flex items-center rounded-full border p-2 transition-all ease-in-out hover:shadow-md",
          className,
        )}
        style={style}
        {...props}
      >
        <Player
          ref={playerRef}
          src={CHECK_IN_ICON}
          className={cn("size-6 text-black transition-all")}
        />
        {label && <span className={cn("relative z-10 ml-2")}>{label}</span>}
      </div>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroupProvider, RadioGroupItem };
