"use client";

import { selectedResponseIdAtom } from "@/store/form-atoms";
import { useAtomValue } from "jotai";
import {
  TCompetencyScores,
  TCompetencyScoreSchema,
  ZCompetencyScoresSchema,
} from "@/db/schema";
import {
  CompetencyScores,
  getRowsByCompetencyId,
} from "@/components/(admin)/forms/responses/competency/competency-scores";
import { useGetResponseCompetencyScores } from "@/hooks/queries/use-get-response-competency-scores";
import React, { useCallback, useRef } from "react";

export function Competency() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToCompetency = useCallback((competencyRef: React.RefObject<HTMLDivElement>) => {
    if (competencyRef.current && containerRef.current) {
      const competencyTop = competencyRef.current.offsetTop;
      containerRef.current.scrollTo({
        top: competencyTop,
        behavior: 'smooth'
      });
    }
  }, []);


  const selectedResponseId = useAtomValue(selectedResponseIdAtom);
  const {
    responseCompetencyScores,
    isLoading: isResponseCompetencyScoresLoading,
  } = useGetResponseCompetencyScores();

  if (!responseCompetencyScores) return <>No data</>;

  // parse the jsonb
  const scores: TCompetencyScores[] = responseCompetencyScores.map((row) => {
    const competencyScores: TCompetencyScoreSchema =
      ZCompetencyScoresSchema.parse(row.competencyScores);
    return {
      responseId: row.responseId,
      responseCreatedAt: row.responseCreatedAt,
      ...competencyScores,
    };
  });

  // go through all of the rows and get only the ids of the tested competencies
  const relevantCompetencyIds = [
    ...new Set(scores.flatMap((row) => row.competencies.map((c) => c.id))),
  ];

  if (!selectedResponseId) return <>No selected id</>;

  return (
    <div ref={containerRef} className="relative mt-[2px] mr-[2px] px-4 h-[78vh] space-y-6 overflow-y-scroll pb-32">
      {relevantCompetencyIds.map((id) => (
        <CompetencyScores
          key={id}
          competencyId={id}
          competencyScores={getRowsByCompetencyId(id, scores)}
          selectedResponseId={selectedResponseId}
          onNameClick={scrollToCompetency}
        />
      ))}
    </div>
  );
}
