import { useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ARROW from "public/icons/system-regular-161-trending-flat.json";

export function ResponseDetailsButton() {
  const [isHovered, setIsHovered] = useState(false);

  const arrowRef = useRef<Player>(null);

  const handleHoverEnter = () => {
    setIsHovered(true);
    arrowRef.current?.setSeeker(0);
    arrowRef.current?.play();
  };

  const handleHoverExit = () => {
    setIsHovered(false);
    arrowRef.current?.setSeeker(0);
    arrowRef.current?.stop();
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
          <Player src={ARROW} ref={arrowRef} className={cn("size-10")} />
        </div>
      </div>
    </Button>
  );
}
