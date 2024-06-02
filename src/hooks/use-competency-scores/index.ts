import { useMemo } from "react";
import { useSelectedContext } from "@/providers/selected-values-provider";
import { useAllFormVersions } from "@/providers/all-form-versions-provider";
import { calculateCompetencyScoreData } from "@/lib/responses/calculateCompetencyScoreData";
import { COMPETENCIES } from "@/db/constants";
import { calculatePercentChange } from "@/lib/responses/calculatePercentChange";

export function useCompetencyScores() {
  const { versions } = useAllFormVersions();
  const { selectedResponse, selectedVersion } = useSelectedContext();

  const scores = useMemo(() => {
    return Object.keys(COMPETENCIES).map((key) => {
      return {
        name: key as keyof typeof COMPETENCIES,
        score: calculateCompetencyScoreData(
          selectedVersion?.id || "",
          selectedResponse?.evaluatee.id || "",
          key as keyof typeof COMPETENCIES,
          versions,
        ),
      } as unknown as {
        name: keyof typeof COMPETENCIES;
        score: {
          pointsEarned: number;
          pointsAvailable: number;
        };
      };
    });
  }, [selectedResponse?.evaluatee.id, selectedVersion?.id, versions]);

  const allScores = useMemo(() => {
    return Object.keys(COMPETENCIES).map((key) => {
      return {
        name: key as keyof typeof COMPETENCIES,
        scores: calculateCompetencyScoreData(
          selectedVersion?.id || "",
          selectedResponse?.evaluatee.id || "",
          key as keyof typeof COMPETENCIES,
          versions,
        ),
      };
    });
  }, [selectedResponse?.evaluatee.id, selectedVersion?.id, versions]);

  const percentages = useMemo(() => {
    return Object.keys(COMPETENCIES).map((key) => {
      return {
        name: key,
        score: calculatePercentChange(
          selectedResponse?.evaluatee.id || "",
          versions,
          selectedVersion?.id || "",
          key as keyof typeof COMPETENCIES,
        ),
      } as unknown as {
        name: keyof typeof COMPETENCIES;
        score: {
          percentChangeFromPrevious: number;
          percentChangeFromFirst: number;
        } | null;
      };
    });
  }, [selectedResponse?.evaluatee.id, selectedVersion?.id, versions]);

  return { scores, percentages, allScores };
}
