"use client";
import { useMilestoneSelector } from ".";
import { motion } from "framer-motion";
import { ClientSubcompetency } from "@/db/client-types";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function SubcompetencyCard({
  subcompetency,
}: {
  subcompetency: ClientSubcompetency;
}) {
  const {
    setSelectedSubcompetency,
    setMilestoneOptions,
    selectedSubcompetency,
  } = useMilestoneSelector();
  const [selected, setSelected] = useState(false);

  const formatTitle = () => {
    const name = subcompetency.name;
    const level = subcompetency.level;
    const competencyName = subcompetency.competencies.name;

    return `${competencyName} ${level}: ${name}`;
  };

  const onSelect = () => {
    if (selectedSubcompetency?.id !== subcompetency.id) {
      setSelectedSubcompetency(subcompetency);
    }
  };

  useEffect(() => {
    setSelected(selectedSubcompetency?.id === subcompetency.id);
  }, [selectedSubcompetency]);

  const deselectSubcompetency = () => {
    setSelectedSubcompetency(undefined);
  };
  return (
    <div className={cn("px-2")} onClick={onSelect}>
      <motion.div
        layout="position"
        layoutId={subcompetency.id}
        variants={variants}
        initial={selected ? "selected" : "deselected"}
        animate={selected ? "selected" : "deselected"}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        transition={{ duration: 0.3 }}
        whileHover={{
          boxShadow: "0 6px 12px 0px rgba(0,0,0,0.2)",
        }}
        className={cn(
          "w-full font-bold cursor-pointer p-4 h-12 rounded-2xl border flex flex row justify-between items-center text-white",
          colors[subcompetency.competencies.name]
        )}
      >
        <p>{formatTitle()}</p>
        <XIcon onClick={deselectSubcompetency} />
      </motion.div>
    </div>
  );
}

const colors: { [key: string]: string } = {
  ICS: "bg-emerald-300",
  PC: "bg-violet-500",
  SBP: "bg-orange-400",
  PBLI: "bg-cyan-600",
  P: "bg-sky-400",
  MK: "bg-rose-500",
};

const variants = {
  selected: {
    opacity: 1,
    height: "44px",
  },
  deselected: {
    height: "72px",
  },
};
