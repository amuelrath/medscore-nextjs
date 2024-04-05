"use client";
import { delay, motion } from "framer-motion";
import { useMilestoneSelector } from ".";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Milestone } from "@/db/schema";
export default function MilestoneCard({
  competencyName,
  milestone,
}: {
  competencyName: string;
  milestone: Milestone;
}) {
  const {
    selectedCompetency,
    setSelectedCompetency,
    setSelectedSubcompetency,
    setSubcompetencyOptions,
    selectedSubcompetency,
    setSelectedMilestones,
    selectedMilestones,
  } = useMilestoneSelector();

  const onSelect = () => {
    if (!selectedMilestones?.includes(milestone)) {
      setSelectedMilestones((prev) => [...(prev || []), milestone]);
    }
  };

  const deselectMilestone = () => {
    if (selectedMilestones?.includes(milestone)) {
      setSelectedMilestones((prev) => prev?.filter((m) => m !== milestone));
    } else {
      return;
    }
  };
  const formatTitle = () => {
    const name = milestone.name;
    const description = milestone.description;

    return `${name}: ${description}`;
  };

  return (
    <div className={cn("px-8")} onClick={onSelect}>
      <motion.div
        layout="position"
        layoutId={milestone.id}
        variants={variants}
        initial={{
          opacity: 0,
          height: selectedMilestones?.includes(milestone) ? "22px" : "44px",
        }}
        animate={
          selectedMilestones?.includes(milestone) ? "selected" : "deselected"
        }
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        transition={{ duration: 0.1, delay: 0.3 }}
        whileHover={{ boxShadow: "0 6px 12px 0px rgba(0,0,0,0.2)" }}
        className={cn(
          "w-full font-bold text-sm cursor-pointer p-4 rounded-2xl border flex flex row justify-between items-center text-white",
          "bg-blue-800"
        )}
      >
        <p>{formatTitle()}</p>
        <XIcon
          onClick={deselectMilestone}
          className={cn(
            selectedMilestones?.includes(milestone)
              ? "opacity-100"
              : "opacity-0"
          )}
        />
      </motion.div>
    </div>
  );
}

const variants = {
  selected: {
    opacity: 1,
    height: "60px",
  },
  deselected: {
    opacity: 0.65,
    height: "60px",
  },
};

const colors: { [key: string]: string } = {
  ICS: "bg-emerald-300",
  PC: "bg-violet-400",
  SBP: "bg-orange-400",
  PBLI: "bg-cyan-600",
  P: "bg-sky-400",
  MK: "bg-rose-500",
};
