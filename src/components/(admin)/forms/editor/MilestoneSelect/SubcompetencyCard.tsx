import React, { memo, useMemo } from "react";
import { useMilestoneSelector } from "./index";
import { motion } from "framer-motion";
import { TSubcompetencyRelate } from "@/db/types";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import MilestoneCard from "./MilestoneCard";
import { Badge } from "@/components/ui/badge";

const SubcompetencyCard = memo(
  ({ subcompetency }: { subcompetency: TSubcompetencyRelate }) => {
    const {
      setSelectedSubcompetencyId,
      selectedSubcompetencyId,
      selectedMilestoneIds,
    } = useMilestoneSelector();

    const isSelected = useMemo(
      () => selectedSubcompetencyId === subcompetency.id,
      [selectedSubcompetencyId, subcompetency.id],
    );

    const formatTitle = useMemo(() => {
      const name = subcompetency.name;
      const level = subcompetency.level;
      const competencyName = subcompetency.competencies.name;
      return `${competencyName} ${level}: ${name}`;
    }, [subcompetency]);

    const onSelect = () => {
      if (selectedSubcompetencyId !== subcompetency.id) {
        setSelectedSubcompetencyId(subcompetency.id);
      }
    };

    const deselectSubcompetency = () => {
      setSelectedSubcompetencyId(undefined);
    };

    const milestones = subcompetency.milestones;

    const getNumberOfSelectedMilestones = useMemo(() => {
      let result = 0;
      for (const m of milestones) {
        if (selectedMilestoneIds?.some((a) => a.milestoneId === m.id)) result++;
      }
      return result;
    }, [milestones, selectedMilestoneIds]);

    return (
      <>
        <div
          className={cn("p-2")}
          onClick={isSelected ? deselectSubcompetency : onSelect}
        >
          <motion.div
            layout="position"
            layoutId={subcompetency.id}
            variants={variants}
            initial={isSelected ? "selected" : "deselected"}
            animate={isSelected ? "selected" : "deselected"}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.3 }}
            whileHover={{ boxShadow: "0 6px 12px 0px rgba(0,0,0,0.2)" }}
            className={cn(
              "flex h-12 w-full cursor-pointer flex-row items-center justify-between rounded-2xl border p-4 font-bold text-white",
              colors[subcompetency.competencies.name],
            )}
          >
            <p>{formatTitle}</p>
            <div className={cn("flex flex-row items-center space-x-2")}>
              {getNumberOfSelectedMilestones > 0 && (
                <Badge>{getNumberOfSelectedMilestones}</Badge>
              )}
              <motion.div animate={isSelected ? { rotate: 0 } : { rotate: 45 }}>
                <XIcon />
              </motion.div>
            </div>
          </motion.div>
        </div>
        {isSelected ? (
          milestones.map((m) => <MilestoneCard milestone={m} key={m.id} />)
        ) : (
          <></>
        )}
      </>
    );
  },
);

SubcompetencyCard.displayName = "SubcompetencyCard";
export default SubcompetencyCard;

const colors: { [key: string]: string } = {
  ICS: "bg-emerald-800",
  PC: "bg-violet-700",
  SBP: "bg-orange-700",
  PBLI: "bg-cyan-700",
  P: "bg-sky-700",
  MK: "bg-rose-500",
};

const variants = {
  selected: { opacity: 1, height: "45px" },
  deselected: { height: "60px" },
};
