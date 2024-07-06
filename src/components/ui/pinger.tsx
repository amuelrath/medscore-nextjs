import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/helpers/utils";
import { cva, VariantProps } from "class-variance-authority";

const pingerVariants = cva("rounded-full", {
  variants: {
    variant: {
      red: "border-red-300 bg-red-400",
      yellow: "border-yellow-300 bg-yellow-400",
      emerald: "border-white bg-emerald-400",
    },
    size: {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-6 h-6",
    },
  },
  defaultVariants: {
    variant: "red",
    size: "md",
  },
});

export interface PingerProps extends VariantProps<typeof pingerVariants> {}

const Pinger = ({ variant, size }: PingerProps) => {
  const pingVariants = {
    ping: {
      scale: [1, 2, 2],
      opacity: [1, 0, 0],
      transition: {
        duration: 1,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 0.2,
      },
    },
  };

  return (
    <div className="relative">
      <div className="inset-0">
        <div className={cn("border", pingerVariants({ variant, size }))} />
      </div>
      <motion.div
        className={cn("absolute top-0", pingerVariants({ variant, size }))}
        variants={pingVariants}
        animate="ping"
      />
    </div>
  );
};

export default Pinger;
