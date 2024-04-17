"use client";
import { motion } from "framer-motion";
import { useMilestoneSelector } from ".";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Milestone } from "@/db/schema";
export default function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const { setSelectedMilestoneIds, selectedMilestoneIds } =
    useMilestoneSelector();

  const onSelect = async () => {
    if (selectedMilestoneIds) {
      if (!selectedMilestoneIds.includes(milestone.id)) {
        setSelectedMilestoneIds([...selectedMilestoneIds, milestone.id]);
      }
    } else {
      setSelectedMilestoneIds([milestone.id]);
    }
  };

  const deselectMilestone = async () => {
    if (selectedMilestoneIds) {
      if (selectedMilestoneIds.includes(milestone.id)) {
        setSelectedMilestoneIds([
          ...selectedMilestoneIds.filter((m) => m !== milestone.id),
        ]);
      }
    } else {
      setSelectedMilestoneIds([]);
    }
  };

  function getCompetencyName(input: string): string {
    const spaceIndex = input.indexOf(" ");

    if (spaceIndex !== -1) {
      return input.slice(0, spaceIndex);
    } else {
      return "";
    }
  }

  function omitBeforePeriod(inputString: string): string {
    const periodIndex = inputString.indexOf(".");

    if (periodIndex !== -1) {
      return inputString.slice(periodIndex + 1);
    } else {
      return "";
    }
  }
  const formatTitle = () => {
    const name = omitBeforePeriod(milestone.name);
    const description = milestone.description;

    return `${name}: ${description}`;
  };

  return (
    <div
      className={cn("px-8")}
      onClick={
        selectedMilestoneIds?.includes(milestone.id)
          ? deselectMilestone
          : onSelect
      }
    >
      <motion.div
        layout="position"
        layoutId={milestone.id}
        variants={variants}
        initial={{
          opacity: 0,
          height: selectedMilestoneIds?.includes(milestone.id)
            ? "22px"
            : "44px",
        }}
        animate={
          selectedMilestoneIds?.includes(milestone.id)
            ? "selected"
            : "deselected"
        }
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        transition={{ duration: 0.1 }}
        whileHover={{ boxShadow: "0 6px 12px 0px rgba(0,0,0,0.2)" }}
        className={cn(
          "w-full font-bold text-sm p-4 rounded-2xl border flex flex row justify-between items-center text-white mix-blend-multiply",
          colors[getCompetencyName(milestone.name)]
        )}
      >
        <p>{formatTitle()}</p>
        <motion.div
          layoutId={`${milestone.id}-select`}
          animate={
            selectedMilestoneIds?.includes(milestone.id)
              ? { rotate: 0 }
              : { rotate: 45 }
          }
        >
          <XIcon className={cn("size-5 cursor-pointer")} />
        </motion.div>
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
  ICS: "bg-emerald-600",
  PC: "bg-purple-600",
  SBP: "bg-orange-600",
  PBLI: "bg-cyan-600",
  P: "bg-sky-600",
  MK: "bg-rose-400",
};
