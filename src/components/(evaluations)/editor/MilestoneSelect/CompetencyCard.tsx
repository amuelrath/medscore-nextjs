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
import { TSubcompetencyRelate } from "@/db/types";
import ICS_ICON from "public/icons/wired-flat-2456-person-talking.json";
import SBP_ICON from "public/icons/wired-flat-1029-service.json";
import PC_ICON from "public/icons/wired-flat-1237-vaccination.json";
import PBLI_ICON from "public/icons/wired-flat-954-customer-insights.json";
import P_ICON from "public/icons/wired-flat-456-handshake-deal.json";
import MK_ICON from "public/icons/wired-flat-1231-medical-book.json";
import { LottieIconButton } from "@/components/ui/lottie-icon-button";
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

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [noSelectedMilestones, setNoSelectedMilestones] = useState<number>(0);
  useEffect(() => {
    if (selectedCompetencyId === competency.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedCompetencyId]);

  useEffect(() => {
    setNoSelectedMilestones(getNumberOfSelectedMilestones());
  }, [selectedMilestoneIds]);

  const getNumberOfSelectedMilestones = () => {
    let result = 0;
    let myMilestones = mySubcompetencies()
      .flatMap((sc) => sc.milestones)
      .flatMap((m) => m.id);
    selectedMilestoneIds?.forEach((a) => {
      if (myMilestones.some((m) => m === a.milestoneId)) {
        result++;
      }
    });
    return result;
  };

  const mySubcompetencies = () => {
    const result: TSubcompetencyRelate[] = [];
    if (subcompetencies) {
      subcompetencies.forEach((sc) => {
        if (sc.competencies.id === competency.id) result.push(sc);
      });
    }
    return result;
  };

  const onSelect = () => {
    if (selectedCompetencyId !== competency.id) {
      setSelectedCompetencyId(competency.id);
    }
  };

  return (
    <>
      <div onClick={onSelect}>
        <motion.div
          layout="position"
          layoutId={competency.id}
          variants={variants}
          initial={isSelected ? "selected" : "deselected"}
          animate={isSelected ? "selected" : "deselected"}
          transition={{ duration: 0.2 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          whileHover={{
            y: 0,
            boxShadow: "0 6px 12px 0px rgba(0,0,0,0.2)",
            opacity: 85,
          }}
          className={cn("rounded-2xl border cursor-pointer bg-white")}
          onClick={isSelected ? () => deselectCompetency() : () => onSelect()}
        >
          <div className={cn("p-4 text-primary")}>
            <div className={cn("flex flex-row justify-between items-center")}>
              <div className={cn("flex flex-row items-center space-x-2")}>
                <h3 className={cn("text-xl font-bold font-poppins")}>
                  {name[competency.name]}
                </h3>
                {noSelectedMilestones > 0 && (
                  <Badge className={cn("")}>{noSelectedMilestones}</Badge>
                )}
              </div>
              <motion.div layout transition={{ duration: 0.2 }}>
                {isSelected ? (
                  <XIcon />
                ) : (
                  <LottieIconButton
                    label=""
                    variant={"hide"}
                    icon={icon[competency.name]}
                    style={{ width: "72px", height: "72px" }}
                  />
                )}
              </motion.div>
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

const icon: { [key: string]: any } = {
  ICS: ICS_ICON,
  SBP: SBP_ICON,
  P: P_ICON,
  PBLI: PBLI_ICON,
  PC: PC_ICON,
  MK: MK_ICON,
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
    height: "95px",
  },
};
