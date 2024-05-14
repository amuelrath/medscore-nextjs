import TRENDING_UP from "public/icons/system-solid-160-trending-up.json";
import TRENDING_DOWN from "public/icons/system-solid-159-trending-down.json";
import { cn } from "@/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";
export function ChangeIndicator({ percentChange }: { percentChange: number }) {
  const isChangePositive = percentChange > 0;

  if (percentChange === 0)
    return <p className={cn("font-poppins text-xs italic text-end")}>No Change.</p>;

  return (
    <div className={cn("flex select-none flex-row items-center")}>
      <Player
        src={isChangePositive ? TRENDING_UP : TRENDING_DOWN}
        className={cn("size-5 pb-1 pr-1")}
        autoplay
        hover
      />
      <p
        className={cn(
          "font-poppins text-sm font-bold tracking-wide",
          isChangePositive ? "text-emerald-500" : "text-destructive",
        )}
      >
        {percentChange}%
      </p>
    </div>
  );
}
