"use client";
import { useMilestoneSelector } from ".";
import { motion } from "framer-motion";
import { ClientSubcompetency } from "@/db/client-types";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import MilestoneCard from "./MilestoneCard";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function SubcompetencyCard({
  subcompetency,
}: {
  subcompetency: ClientSubcompetency;
}) {
  const {
    setSelectedSubcompetencyId,
    selectedSubcompetencyId,
    selectedMilestoneIds,
  } = useMilestoneSelector();

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const formatTitle = () => {
    const name = subcompetency.name;
    const level = subcompetency.level;
    const competencyName = subcompetency.competencies.name;

    return `${competencyName} ${level}: ${name}`;
  };

  useEffect(() => {
    if (selectedSubcompetencyId === subcompetency.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedSubcompetencyId]);

  const onSelect = () => {
    if (selectedSubcompetencyId !== subcompetency.id) {
      setSelectedSubcompetencyId(subcompetency.id);
    }
  };

  const deselectSubcompetency = () => {
    setSelectedSubcompetencyId(undefined);
  };

  const milestones = subcompetency.milestones;
  const getNumberOfSelectedMilestones = () => {
    let result = 0;
    for (const m of milestones) {
      if (selectedMilestoneIds?.some((a) => a.milestoneId === m.id)) result++;
    }
    return result;
  };
  const numberOfSelectedMilestones = getNumberOfSelectedMilestones();

  return (
    <>
      <div
        className={cn("px-2")}
        onClick={isSelected ? () => deselectSubcompetency() : () => onSelect()}
      >
        <motion.div
          layout="position"
          layoutId={subcompetency.id}
          variants={variants}
          initial={isSelected ? "selected" : "deselected"}
          animate={isSelected ? "selected" : "deselected"}
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
          <div className={cn("flex flex-row items-center space-x-2")}>
            {numberOfSelectedMilestones > 0 && (
              <Badge>{getNumberOfSelectedMilestones()}</Badge>
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
}

const colors: { [key: string]: string } = {
  ICS: "bg-emerald-800",
  PC: "bg-violet-700",
  SBP: "bg-orange-700",
  PBLI: "bg-cyan-700",
  P: "bg-sky-700",
  MK: "bg-rose-500",
};

const variants = {
  selected: {
    opacity: 1,
    height: "45px",
  },
  deselected: {
    height: "60px",
  },
};
