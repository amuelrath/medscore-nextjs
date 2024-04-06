"use client";
import { motion } from "framer-motion";
import { useMilestoneSelector } from ".";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Milestone } from "@/db/schema";
import { createMilestone, deleteMilestone } from "../../actions";
export default function MilestoneCard({
  competencyName,
  milestone,
}: {
  competencyName: string;
  milestone: Milestone;
}) {
  const { question, setSelectedMilestones, selectedMilestones } =
    useMilestoneSelector();

  const onSelect = async () => {
    if (selectedMilestones) {
      if (!selectedMilestones.includes(milestone)) {
        setSelectedMilestones([...selectedMilestones, milestone]);
      }
    } else {
      setSelectedMilestones([milestone]);
    }
    await createMilestone(milestone.id, question!.id);
    console.log(selectedMilestones);
  };

  const deselectMilestone = async () => {
    if (selectedMilestones) {
      if (selectedMilestones.includes(milestone)) {
        setSelectedMilestones([
          ...selectedMilestones.filter((m) => m !== milestone),
        ]);
      }
    } else {
      setSelectedMilestones([]);
    }
    await deleteMilestone(milestone.id, question!.id);
    console.log(selectedMilestones);
  };
  const formatTitle = () => {
    const name = milestone.name;
    const description = milestone.description;

    return `${name}: ${description}`;
  };

  return (
    <div className={cn("px-8")}>
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
          "w-full font-bold text-sm p-4 rounded-2xl border flex flex row justify-between items-center text-white",
          "bg-blue-800",
          selectedMilestones?.includes(milestone) ? "bg-black" : ""
        )}
      >
        <p>{formatTitle()}</p>
        <motion.div
          layoutId={`${milestone.id}-select`}
          animate={
            selectedMilestones?.includes(milestone)
              ? { rotate: 0 }
              : { rotate: 45 }
          }
          onClick={
            selectedMilestones?.includes(milestone)
              ? deselectMilestone
              : onSelect
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
  ICS: "bg-emerald-300",
  PC: "bg-violet-400",
  SBP: "bg-orange-400",
  PBLI: "bg-cyan-600",
  P: "bg-sky-400",
  MK: "bg-rose-500",
};
