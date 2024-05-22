"use client";
import { cn } from "@/lib/utils";
import { ResponseDetailsButton } from "./response-details-button";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import WaterfallAnimation from "@/components/ui/waterfall-animation";
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";
import React, { useMemo } from "react";
import { ChangeIndicator } from "@/components/ui/percent-change-indicator";
import { DynamicEyeball } from "@/components/ui/lottie/eyeball";
import { useAllFormVersions } from "@/providers/all-form-versions-provider";
import { useSelectedContext } from "@/providers/selected-values-provider";
import { CompetencyGauges } from "@/components/(admin)/forms/responses/competency-gauges";
import { calculatePercentChange } from "@/lib/responses/calculatePercentChange";
import { calculateCompetencyPercentages } from "@/lib/responses/calculateCompetencyPercentages";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ResponseOverviewCard() {
  const { versions } = useAllFormVersions();
  const { selectedVersion, selectedResponse } = useSelectedContext();
  const points = useMemo(() => {
    return calculatePointsEarnedAndAvailable(
      selectedVersion?.questions,
      selectedResponse?.answers,
    );
  }, [selectedVersion?.questions, selectedResponse?.answers]);

  const competencyPercentages = useMemo(() => {
    return calculateCompetencyPercentages(
      selectedVersion?.questions,
      selectedResponse?.answers,
    );
  }, [selectedVersion?.questions, selectedResponse?.answers]);

  const currentScore = useMemo(() => {
    return (points?.pointsEarned || 0) / (points?.pointsAvailable || 0);
  }, [points]);

  const scoreBgColor = useMemo(() => {
    return getBgColorFromPointValue(currentScore || 1);
  }, [currentScore]);

  const percentChanges = useMemo(() => {
    return calculatePercentChange(
      selectedResponse?.evaluatee.id || "",
      versions,
      selectedVersion?.id || "",
    );
  }, [selectedVersion?.id, versions, selectedResponse?.evaluatee.id]);

  if (!selectedResponse?.id)
    return (
      <div className={cn("h-52 px-4")} key={selectedVersion?.id}>
        <header className={cn("flex flex-row items-center justify-between")}>
          <h4 className={cn(" text-2xl font-bold tracking-wide")}>Overview</h4>
        </header>
        <div
          className={cn(
            " mt-10 flex h-full w-full flex-col items-center justify-start",
          )}
        >
          <DynamicEyeball className={cn("size-20 drop-shadow-lg")} />
          <p>Select a response to see results.</p>
        </div>
      </div>
    );

  return (
    <WaterfallAnimation speed={0.1}>
      <div className={cn("h-52 px-4")}>
        <header className={cn("flex items-center justify-between pb-2")}>
          <h4 className={cn(" text-xl font-bold")}>Response Overview</h4>
          <ResponseDetailsButton />
        </header>
        <div className={cn("flex flex-col items-center space-y-4")}>
          {competencyPercentages && (
            <CompetencyGauges
              competencyPercentages={competencyPercentages}
              versions={versions}
            />
          )}
          <hr className={cn("w-full bg-primary text-primary")} />
          <div
            className={cn("grid w-full grid-cols-2 divide-x drop-shadow-lg")}
          >
            <div className={cn("flex items-center justify-center")}>
              <p className={cn(" pr-2 text-5xl font-bold tracking-wider")}>
                <span style={{ color: scoreBgColor }}>
                  {points?.pointsEarned}
                </span>
                {`/${points?.pointsAvailable}`}
              </p>
            </div>
            <div className={cn("grid grid-cols-1 gap-2 pl-2")}>
              <div className={cn("flex flex-col items-end")}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className={cn("flex flex-col items-end")}>
                      <p className={cn(" text-sm font-bold text-gray-400")}>
                        &Delta; PREVIOUS
                      </p>
                      <ChangeIndicator
                        percentChange={
                          Number(
                            percentChanges?.percentChangeFromPrevious.toFixed(
                              1,
                            ),
                          ) || 0
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent className={cn("w-96")}>
                      <p>
                        This value represents the percentage change in the score
                        compared to the previous form administration. A positive
                        value indicates an increase, while a negative value
                        indicates a decrease in the score. Note that this is not
                        the actual difference between the two scores, but rather
                        the change expressed as a percentage of the previous
                        score.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className={cn("flex flex-col items-end")}>
                {percentChanges?.percentChangeFromFirst !==
                percentChanges?.percentChangeFromPrevious ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className={cn("flex flex-col items-end")}>
                        <p className={cn(" text-sm font-bold text-gray-400")}>
                          &Delta; OVERALL
                        </p>
                        <ChangeIndicator
                          percentChange={
                            Number(
                              percentChanges?.percentChangeFromFirst.toFixed(1),
                            ) || 0
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent className={cn("w-96")}>
                        <p>
                          This value represents the percentage change in the
                          score compared to the first form administration. A
                          positive value indicates an increase, while a negative
                          value indicates a decrease in the score. Note that
                          this is not the actual difference between the two
                          scores, but rather the change expressed as a
                          percentage of the previous score.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <>
                    <p className={cn(" text-sm font-bold text-gray-400")}>
                      &Delta; OVERALL
                    </p>
                    <p className={cn("text-xs font-bold italic")}>
                      No Overall Change.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WaterfallAnimation>
  );
}
