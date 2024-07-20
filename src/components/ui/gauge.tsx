import { LazyMotion, m, domAnimation } from "framer-motion";
import { cva } from "class-variance-authority";
import { FC, memo, ReactNode } from "react";
import { cn } from "@/lib/helpers/utils";

interface GaugeChartProps {
  value: number;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  color?:
    | "emerald"
    | "accent"
    | "accent-secondary"
    | "ics"
    | "sbp"
    | "pbli"
    | "mk"
    | "p"
    | "pc"
    | "primary"
    | "foreground";
  bgStrokeColor?: string;
  label?: ReactNode;
}

const gaugeChartClasses = cva("relative", {
  variants: {
    size: {
      xs: "w-20 h-10",
      sm: "w-28 h-20",
      md: "w-60 h-30",
      lg: "w-80 h-40",
    },
  },
  defaultVariants: {
    size: "md",
  },

});

const GaugeChart: FC<GaugeChartProps> = memo(
  ({
    value,
    max = 100,
    size = "md",
    color = "accent-secondary",
    bgStrokeColor = "stroke-gray-300",
    label
  }) => {
    const percentage = (value / max) * 100;
    const pathColor = {
      emerald: "stroke-emerald-400",
      accent: "stroke-accent",
      "accent-secondary": "stroke-accent-secondary",
      ics: "stroke-ics",
      mk: "stroke-mk",
      pbli: "stroke-accent-secondary",
      pc: "stroke-pc",
      p: "stroke-p",
      sbp: "stroke-sbp",
      primary: "stroke-primary",
      foreground: "stroke-foreground",
    }[color];

    return (
      <LazyMotion features={domAnimation}>
        <m.div
          className={cn(
            gaugeChartClasses({ size }),
            "transition-all ease-in-out",
          )}
        >
          <svg viewBox="0 0 200 120" className="absolute inset-0">
            <path
              className={bgStrokeColor}
              strokeWidth={20}
              strokeLinecap="round"
              fill="none"
              d="M20,100 A60,60 0 0 1 180,100"
            />
            <m.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percentage / 100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={pathColor}
              strokeWidth={20}
              strokeLinecap="round"
              fill="none"
              d="M20,100 A60,60 0 0 1 180,100"
            />
          </svg>
          <div className={cn("absolute text-xs left-1/2 top-1/2 mt-3 -translate-x-1/2 -translate-y-1/2 transform", size === "sm" && "mt-6")}>
            {label}
          </div>
        </m.div>
      </LazyMotion>
    );
  },
);

GaugeChart.displayName = "GaugeChart";
export default GaugeChart;
