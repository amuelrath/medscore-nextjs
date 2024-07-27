"use client";

import { cn } from "@/lib/helpers/utils";
import { motion } from "framer-motion";

interface LetterPullupProps {
  className?: string;
  words: string;
  delay?: number;
  size?:
    | "2xs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl";
  fontWeight?: "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold"
}

export default function LetterPullup({
  className,
  words,
  delay=0.01,
  size = "sm",
  fontWeight="normal"
}: LetterPullupProps) {
  const letters = words.split("");

  const pullupVariant = {
    initial: { y: 10, opacity: 0 },
    animate: (i: any) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * (delay ? delay : 0.05), // By default, delay each letter's animation by 0.05 seconds
      },
    }),
  };

  return (
    <div className={cn("flex", className)}>
      {letters.map((letter, i) => (
        <motion.h1
          key={i}
          variants={pullupVariant}
          initial="initial"
          animate="animate"
          custom={i}
          className={cn(
            `font-display text-${size} font-${fontWeight} tracking-[-0.02em] text-black dark:text-white`,
          )}
        >
          {letter === " " ? <span>&nbsp;</span> : letter}
        </motion.h1>
      ))}
    </div>
  );
}
