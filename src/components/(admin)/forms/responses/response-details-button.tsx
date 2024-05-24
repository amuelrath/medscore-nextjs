import { useRef, useState } from "react";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ARROW from "public/icons/system-regular-161-trending-flat.json";

export function ResponseDetailsButton() {
  const [isHovered, setIsHovered] = useState(false);

  const arrowRef = useRef<any>(null);

  const handleHoverEnter = () => {
    setIsHovered(true);
    arrowRef.current?.goToAndPlay(0, true);
  };

  const handleHoverExit = () => {
    setIsHovered(false);
    arrowRef.current?.goToAndStop(0, true);
  };
  return (
    <Button
      size={"xs"}
      variant="foreground"
      onMouseEnter={() => handleHoverEnter()}
      onMouseLeave={() => handleHoverExit()}
    >
      <div
        className={cn(
          "relative flex flex-row items-center justify-center overflow-hidden",
        )}
      >
        <span
          className={cn(
            "transition-all duration-300",
            isHovered
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100",
          )}
        >
          See Full Report
        </span>
        <div
          className={cn(
            "left-3/5 absolute top-1/2 -translate-x-2/3 -translate-y-1/2 transform transition-transform duration-300",
            isHovered
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0",
          )}
        >
          <Lottie
            animationData={ARROW}
            lottieRef={arrowRef}
            className={cn("size-10")}
          />
        </div>
      </div>
    </Button>
  );
}
