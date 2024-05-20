"use client";
import {
  FC,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";
import GaugeChart from "@/components/ui/gauge";
import { COMPETENCIES } from "@/db/constants";
import ICS from "public/icons/ics-bubbles-icon.json";
import SBP from "public/icons/sbp-nodes-icon.json";
import P from "public/icons/p-icon.json";
import MK from "public/icons/mk-mask-icon.json";
import PC from "public/icons/pc-heart-icon.json";
import PBLI from "public/icons/pbli-icon.json";
import { getFilteredQuestionsAndAnswers } from "@/lib/responses/utils";
import { FormVersionsResult } from "@/db/types";
import dynamic from "next/dynamic";
import { useSelectedContext } from "@/providers/selected-values-provider";
const COMPETENCY_ICONS = {
  ICS,
  SBP,
  P,
  MK,
  PC,
  PBLI,
};

const DynamicCompetencyScoreDialogTrigger = dynamic(
  () =>
    import("@/components/(admin)/forms/dialogs/competency-score-dialog").then(
      (module) => module.CompetencyScoreDialogTrigger,
    ),
  { ssr: false },
);

interface CompetencyGaugeProps {
  competencyName: keyof typeof COMPETENCIES;
  competencyPercentage: number;
}

export const CompetencyGauge: FC<CompetencyGaugeProps> = memo(
  ({ competencyName, competencyPercentage }) => {
    const ref = useRef<Player>(null);
    const [hovering, setHovering] = useState<boolean>(false);

    useEffect(() => {
      if (hovering) {
        ref.current?.setLoop(true);
        ref.current?.play();
      } else {
        ref.current?.stop();
      }
    }, [hovering]);

    const handleHoverEnter = useCallback(() => {
      setHovering(true);
    }, []);

    const handleHoverExit = useCallback(() => {
      setHovering(false);
    }, []);

    const iconSrc = COMPETENCY_ICONS[competencyName];

    return (
      <DynamicCompetencyScoreDialogTrigger competencyName={competencyName}>
        <div onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverExit}>
          <Suspense fallback={<div className="size-8" />}>
            <GaugeChart
              value={competencyPercentage}
              size="xs"
              color="foreground"
              icon={<Player ref={ref} src={iconSrc} className={cn("size-8")} />}
            />
          </Suspense>
        </div>
      </DynamicCompetencyScoreDialogTrigger>
    );
  },
);

interface CompetencyGaugesProps {
  competencyPercentages: Record<string, number>;
  versions: FormVersionsResult;
}

export const CompetencyGauges: FC<CompetencyGaugesProps> = memo(
  ({ competencyPercentages }) => {
    const { selectedVersion, selectedResponse } = useSelectedContext();

    const competenciesWithQuestions = useMemo(() => {
      if (!selectedVersion || !selectedResponse) {
        return [];
      }

      return Object.keys(COMPETENCIES).filter((competencyName) => {
        const { filteredQuestions: questions } = getFilteredQuestionsAndAnswers(
          competencyName as keyof typeof COMPETENCIES,
          selectedVersion.questions,
          selectedResponse.answers,
        );
        if (!questions) return false;
        return questions.length > 0;
      });
    }, [selectedVersion, selectedResponse]);

    if (!selectedVersion || !selectedResponse) {
      return null; // or render a loading state
    }

    return (
      <div className="grid grid-cols-3 gap-4 gap-x-10">
        {competenciesWithQuestions.map((competencyName) => {
          const competencyId =
            COMPETENCIES[competencyName as keyof typeof COMPETENCIES].id;
          return (
            <CompetencyGauge
              key={competencyId}
              competencyName={competencyName as keyof typeof COMPETENCIES}
              competencyPercentage={competencyPercentages[competencyName]}
            />
          );
        })}
      </div>
    );
  },
);

CompetencyGauges.displayName = "CompetencyGauges";
CompetencyGauge.displayName = "CompetencyGauge";
