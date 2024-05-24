import TRENDING_UP from "public/icons/system-solid-160-trending-up.json";
import TRENDING_DOWN from "public/icons/system-solid-159-trending-down.json";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import Counter from "@/components/ui/counter";

export function ChangeIndicator({ percentChange }: { percentChange: number }) {
  const isChangePositive = percentChange > 0;

  if (percentChange === 0)
    return (
      <p
        className={cn(
          "font-regular mb-1 text-end text-xs font-bold italic",
        )}
      >
        No Change.
      </p>
    );

  return (
    <div className={cn("flex select-none flex-row items-center")}>
      <div
        className={cn(
          "flex flex-row items-center space-x-1 text-sm font-bold tracking-wide",
          isChangePositive ? "text-emerald-500" : "text-destructive",
        )}
      >
        <Counter duration={0.3} value={percentChange} />%
      </div>
      <Lottie
        loop={false}
        animationData={isChangePositive ? TRENDING_UP : TRENDING_DOWN}
        className={cn("size-5 pb-1 pl-1")}
        autoplay
      />
    </div>
  );
}
