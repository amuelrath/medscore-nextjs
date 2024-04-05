"use client";
import { motion } from "framer-motion";
import { useMilestoneSelector } from ".";
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
export default function CompetencyCard({
  competency,
}: {
  competency: Competency;
}) {
  const { selectedCompetency, setSelectedCompetency } = useMilestoneSelector();
  const [selected, setSelected] = useState<boolean>(false);

  const deselectCompetency = () => {
    setSelectedCompetency(undefined);
    setSelected(false);
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

  const onSelect = () => {
    if (selectedCompetency?.id !== competency.id) {
      setSelectedCompetency(competency);
    }
  };

  useEffect(() => {
    setSelected(selectedCompetency?.id === competency.id);
  }, [selectedCompetency]);

  return (
    <div onClick={onSelect}>
      <motion.div
        layout="position"
        layoutId={competency.id}
        variants={variants}
        initial={selected ? "selected" : "deselected"}
        animate={selected ? "selected" : "deselected"}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        whileHover={{
          y: -5,
          boxShadow: "0 6px 12px 6px rgba(0,0,0,0.2)",
          opacity: 85,
        }}
        className={cn("h-32 rounded-2xl border", color())}
        onSelect={onSelect}
      >
        <div className={cn("p-4 text-white")}>
          <div className={cn("flex flex-row justify-between items-center")}>
            <h3 className={cn("text-xl font-bold font-poppins")}>
              {name[competency.name]}
            </h3>
            {selectedCompetency?.id === competency.id ? (
              <div className={cn("cursor-pointer")}>
                <XIcon onClick={deselectCompetency} />
              </div>
            ) : (
              icon[competency.name]
            )}
          </div>
        </div>
      </motion.div>
    </div>
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
