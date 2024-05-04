import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useMilestoneSelector } from "./index";
import { Competency } from "@/db/schema";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LottieIconButton } from "@/components/ui/lottie-icon-button";
import SubcompetencyCard from "./SubcompetencyCard";
import ICS_ICON from "public/icons/wired-flat-2456-person-talking.json";
import SBP_ICON from "public/icons/wired-flat-1029-service.json";
import PC_ICON from "public/icons/wired-flat-1237-vaccination.json";
import PBLI_ICON from "public/icons/wired-flat-954-customer-insights.json";
import P_ICON from "public/icons/wired-flat-456-handshake-deal.json";
import MK_ICON from "public/icons/wired-flat-1231-medical-book.json";
import { TSubcompetencyRelate } from "@/db/types";

const CompetencyCard = React.memo(
  ({ competency }: { competency: Competency }) => {
    const {
      subcompetencies,
      selectedCompetencyId,
      setSelectedCompetencyId,
      selectedMilestoneIds,
    } = useMilestoneSelector();

    const deselectCompetency = () => {
      setSelectedCompetencyId(undefined);
    };

    const isSelected = useMemo(
      () => selectedCompetencyId === competency.id,
      [selectedCompetencyId, competency.id],
    );

    const mySubcompetencies = useMemo(() => {
      const result: TSubcompetencyRelate[] = [];
      if (subcompetencies) {
        subcompetencies.forEach((sc) => {
          if (sc.competencies.id === competency.id) result.push(sc);
        });
      }
      return result;
    }, [subcompetencies, competency.id]);

    const getNumberOfSelectedMilestones = useMemo(() => {
      let result = 0;
      let myMilestones = mySubcompetencies
        .flatMap((sc) => sc.milestones)
        .flatMap((m) => m.id);
      selectedMilestoneIds?.forEach((a) => {
        if (myMilestones.some((m) => m === a.milestoneId)) {
          result++;
        }
      });
      return result;
    }, [selectedMilestoneIds, mySubcompetencies]);

    const noSelectedMilestones = useMemo(
      () => getNumberOfSelectedMilestones,
      [getNumberOfSelectedMilestones],
    );

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
              boxShadow: "0 6px 12px 0px rgba(0,0,0,0.4)",
              opacity: 85,
            }}
            className={cn(
              "cursor-pointer rounded-2xl bg-gradient-to-b from-foreground to-foreground/90",
            )}
            onClick={isSelected ? deselectCompetency : onSelect}
          >
            <div className={cn("p-4 text-white")}>
              <div className={cn("flex flex-row items-center space-x-2")}>
                <div className={cn("flex-col justify-center")}>
                  <h3
                    className={cn(
                      "font-poppins flex flex-col justify-center text-xl font-semibold",
                    )}
                  >
                    {name[competency.name]}
                  </h3>
                </div>
                <div>
                  {noSelectedMilestones > 0 && (
                    <Badge className={cn("")}>{noSelectedMilestones}</Badge>
                  )}
                </div>
              </div>
              {/*icon */}
            </div>
          </motion.div>
        </div>
        {isSelected &&
          mySubcompetencies.map((s) => (
            <SubcompetencyCard subcompetency={s} key={s.id} />
          ))}
      </>
    );
  },
);

export default CompetencyCard;

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
