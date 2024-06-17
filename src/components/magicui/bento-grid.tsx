"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { random } from "lodash";
export interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon: any;
  iconSize?: string
  description: string;
  href?: string;
  onClick?: () => void;
  cta: ReactNode | string;
}
const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[18rem] lg:gap-4 md:gap-4 xs:gap-4 xs:grid-cols-1  md:grid-cols-5 lg:grid-cols-7",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  iconSize,
  description,
  cta,
  onClick,
}: BentoCardProps) => (
  <motion.div
    key={name}
    onClick={onClick}
    initial={{ opacity: 0, y: random(7, 25) }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "group relative col-span-3 flex flex-col justify-end overflow-hidden rounded select-none",
      // light styles
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
  >
    <div className={cn("absolute top-0 h-full w-full")} >{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className={`${iconSize || "size-12"} origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75` }/>
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
        {name}
      </h3>
      <p className="max-w-lg text-neutral-400 mix-blend-difference">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="cursor-pointer pointer-events-auto">
        <p>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </p>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </motion.div>
);

export { BentoCard, BentoGrid };
