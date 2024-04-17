"use client";
import { motion } from "framer-motion";
import { useMilestoneSelector } from "./index";
import { Competency } from "@/db/schema";
import { cn } from "@/lib/utils";
import {
  BrainIcon,
  CogIcon,
  HandshakeIcon,
  ShapesIcon,
  SpeechIcon,
  StethoscopeIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import SubcompetencyCard from "./SubcompetencyCard";
import { Badge } from "@/components/ui/badge";
export default function CompetencyCard({
  competency,
}: {
  competency: Competency;
}) {
  const {
    subcompetencies,
    selectedCompetencyId,
    setSelectedCompetencyId,
    selectedMilestoneIds,
  } = useMilestoneSelector();

  const deselectCompetency = () => {
    setSelectedCompetencyId(undefined);
  };

  const color = () => {
    switch (competency.name) {
      case "ICS":
        return "bg-emerald-500";
      case "PC":
        return "bg-violet-700";
      case "SBP":
        return "bg-orange-600";
      case "PBLI":
        return "bg-cyan-800";
      case "P":
        return "bg-sky-600";
      case "MK":
        return "bg-rose-700";
    }
  };
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    if (selectedCompetencyId === competency.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedCompetencyId]);

  const mySubcompetencies = () => {
    const result = [];
    if (subcompetencies) {
      for (const s of subcompetencies) {
        if (s.competencyId === competency.id) {
          result.push(s);
        }
      }
    }
    return result;
  };

  const onSelect = () => {
    if (selectedCompetencyId !== competency.id) {
      setSelectedCompetencyId(competency.id);
    }
  };

  const getNumberOfSelectedMilestones = () => {
    let result = 0;
    for (const s of mySubcompetencies()) {
      const milestones = s.milestones;
      for (const m of milestones) {
        if (selectedMilestoneIds?.includes(m.id)) result++;
      }
      return result;
    }
  };

  const numberOfSelectedMilestones = getNumberOfSelectedMilestones() || 0;

  return (
    <>
      <div onClick={onSelect}>
        <motion.div
          layout="position"
          layoutId={competency.id}
          variants={variants}
          initial={isSelected ? "selected" : "deselected"}
          animate={isSelected ? "selected" : "deselected"}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          whileHover={{
            y: -5,
            boxShadow: "0 6px 12px 6px rgba(0,0,0,0.2)",
            opacity: 85,
          }}
          className={cn("h-32 rounded-2xl border cursor-pointer bg-notepad")}
          onClick={isSelected ? () => deselectCompetency() : () => onSelect()}
        >
          <div className={cn("p-4 text-black")}>
            <div className={cn("flex flex-row justify-between items-center")}>
              <div className={cn("flex flex-row items-center space-x-2")}>
                <h3 className={cn("text-xl font-bold font-poppins")}>
                  {name[competency.name]}
                </h3>
                {numberOfSelectedMilestones > 0 && (
                  <Badge className={cn("")}>{numberOfSelectedMilestones}</Badge>
                )}
              </div>
              {isSelected ? (
                <div className={cn("cursor-pointer")}>
                  <XIcon />
                </div>
              ) : (
                icon[competency.name]
              )}
            </div>
          </div>
        </motion.div>
      </div>
      {isSelected &&
        mySubcompetencies().map((s) => (
          <SubcompetencyCard subcompetency={s} key={s.id} />
        ))}
    </>
  );
}

const icon: { [key: string]: JSX.Element } = {
  ICS: <SpeechIcon className="size-16" />,
  SBP: <CogIcon className="size-16" />,
  P: <HandshakeIcon className="size-16" />,
  PBLI: <ShapesIcon className="size-16" />,
  PC: <StethoscopeIcon className="size-16" />,
  MK: <BrainIcon className="size-16" />,
};

const name: { [key: string]: string } = {
  ICS: "Interpersonal & Communication Skills",
  SBP: "Systems-Based Practice",
  P: "Professionalism",
  PBLI: "Practice-Based Learning & Improvement",
  PC: "Patient Care",
  MK: "Medical Knowledge",
};

const variants = {
  selected: {
    opacity: 1,
    height: "60px",
  },
  deselected: {
    height: "128px",
  },
};
