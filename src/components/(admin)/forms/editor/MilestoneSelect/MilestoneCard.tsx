import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useMilestoneSelector } from "./index";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Milestone } from "@/db/schema";

const MilestoneCard = React.memo(({ milestone }: { milestone: Milestone }) => {
  const { setSelectedMilestoneIds, selectedMilestoneIds } =
    useMilestoneSelector();

  const isSelected = useMemo(
    () => selectedMilestoneIds?.some((a) => a.milestoneId === milestone.id),
    [selectedMilestoneIds, milestone.id],
  );

  const onSelect = useCallback(async () => {
    if (selectedMilestoneIds) {
      if (!isSelected) {
        setSelectedMilestoneIds([
          ...selectedMilestoneIds,
          { milestoneId: milestone.id },
        ]);
      }
    } else {
      setSelectedMilestoneIds([{ milestoneId: milestone.id }]);
    }
  }, [selectedMilestoneIds, isSelected, milestone.id, setSelectedMilestoneIds]);

  const deselectMilestone = useCallback(async () => {
    if (selectedMilestoneIds) {
      if (isSelected) {
        setSelectedMilestoneIds(
          selectedMilestoneIds.filter((a) => a.milestoneId !== milestone.id),
        );
      }
    } else {
      setSelectedMilestoneIds([]);
    }
  }, [selectedMilestoneIds, isSelected, milestone.id, setSelectedMilestoneIds]);

  const getCompetencyName = useCallback((input: string): string => {
    const spaceIndex = input.indexOf(" ");
    return spaceIndex !== -1 ? input.slice(0, spaceIndex) : "";
  }, []);

  const omitBeforePeriod = useCallback((inputString: string): string => {
    const periodIndex = inputString.indexOf(".");
    return periodIndex !== -1 ? inputString.slice(periodIndex + 1) : "";
  }, []);

  const formatTitle = useMemo(() => {
    const name = omitBeforePeriod(milestone.name);
    const description = milestone.description;
    return `${name}: ${description}`;
  }, [milestone.name, milestone.description, omitBeforePeriod]);

  return (
    <div
      className={cn("px-8")}
      onClick={isSelected ? deselectMilestone : onSelect}
    >
      <motion.div
        layout="position"
        layoutId={milestone.id}
        variants={variants}
        initial={{ opacity: 0, height: isSelected ? "22px" : "44px" }}
        animate={isSelected ? "selected" : "deselected"}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        transition={{ duration: 0.1 }}
        whileHover={{ boxShadow: "0 6px 12px 0px rgba(0,0,0,0.2)" }}
        className={cn(
          "row flex flex w-full items-center justify-between rounded-2xl border p-4 text-sm font-bold text-white mix-blend-multiply",
          colors[getCompetencyName(milestone.name)],
        )}
      >
        <p>{formatTitle}</p>
        <motion.div
          layoutId={`${milestone.id}-select`}
          animate={isSelected ? { rotate: 0 } : { rotate: 45 }}
        >
          <XIcon className={cn("size-5 cursor-pointer")} />
        </motion.div>
      </motion.div>
    </div>
  );
});

export default MilestoneCard;

const variants = {
  selected: { opacity: 1, height: "60px" },
  deselected: { opacity: 0.65, height: "60px" },
};

const colors: { [key: string]: string } = {
  ICS: "bg-emerald-600",
  PC: "bg-purple-600",
  SBP: "bg-orange-600",
  PBLI: "bg-cyan-600",
  P: "bg-sky-600",
  MK: "bg-rose-400",
};
