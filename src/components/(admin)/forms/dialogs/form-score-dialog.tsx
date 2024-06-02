"use client";

import { useSelectedContext } from "@/providers/selected-values-provider";
import React, { ReactNode } from "react";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { useAllFormVersions } from "@/providers/all-form-versions-provider";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SeeMoreButton } from "@/components/ui/see-more-button";
import { getFullName } from "@/lib/getFullName";
import { User } from "@/db/schema";
import { ChangeIndicator } from "@/components/ui/percent-change-indicator";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import { useFormScores } from "@/hooks/use-form-scores";
import { CompetencyRadarChart } from "@/components/(admin)/forms/responses/competency-radar-chart";
const DynamicScoreChart = dynamic(() =>
  import("@/components/(admin)/forms/responses/score-chart").then(
    (module) => module.ScoreChart,
  ),
);

export function FormScoreDialog({ children }: { children: ReactNode }) {
  const { versions } = useAllFormVersions();
  const { selectedResponse, selectedVersion } = useSelectedContext();
  const evaluatee = selectedResponse?.evaluatee;
  const { score, percentages } = useFormScores();

  const bgColor = getBgColorFromPointValue(
    score.pointsEarned / score.pointsAvailable,
  );

  if (!versions) return <>No Versions.</>;
  if (!selectedVersion) return <>Error! Form version not found.</>;
  if (!selectedVersion.questions) return <>No questions in this form!</>;
  if (!selectedResponse) return <>No responses found!</>;
  if (!selectedResponse.answers) return <>This response has no content.</>;

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn("max-h-[95%] min-w-[90%]")}
      >
        <DialogHeader>
          <div className={cn("flex flex-col divide-y-2")}>
            <div>
              <DialogTitle
                className={cn("flex flex-row items-start justify-between")}
              >
                <p className={cn("mb-1 text-4xl font-bold text-gray-800")}>
                  {selectedVersion.title}
                </p>
                <SeeMoreButton
                  label={"See Insights"}
                  className={
                    "mr-8 bg-foreground text-xl font-extrabold text-white"
                  }
                  size={"sm"}
                  iconStyles={"size-10"}
                />
              </DialogTitle>
            </div>

            <div
              className={cn(
                "flex flex-row items-center justify-around space-x-2 pt-2 text-3xl font-bold ",
              )}
            >
              <p className={cn("line-clamp-1 text-gray-500")}>
                {getFullName(evaluatee || ({} as User)).toUpperCase()}
              </p>
              <Separator orientation={"vertical"} />
              <div className={cn("flex items-center justify-center")}>
                <p
                  className={cn(
                    "line-clamp-1 text-2xl font-bold tracking-wider",
                  )}
                >
                  <span style={{ color: bgColor }}>{score.pointsEarned}</span>
                  {`/${score.pointsAvailable}`}
                </p>
              </div>
              <Separator orientation={"vertical"} />
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className={cn("flex flex-col items-end")}>
                      <p className={cn(" text-sm font-bold text-gray-400")}>
                        &Delta; PREVIOUS
                      </p>
                      <ChangeIndicator
                        percentChange={
                          Number(
                            percentages?.percentChangeFromPrevious.toFixed(1),
                          ) || 0
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent className={cn("w-96 font-normal")}>
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
              <Separator orientation={"vertical"} />

              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className={cn("flex flex-col items-end")}>
                      <p className={cn(" text-sm font-bold text-gray-400")}>
                        &Delta; OVERALL
                      </p>
                      <ChangeIndicator
                        percentChange={
                          Number(
                            percentages?.percentChangeFromFirst.toFixed(1),
                          ) || 0
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent className={cn("w-96 font-normal")}>
                      <p>
                        This value represents the percentage change in the score
                        compared to the first form administration. A positive
                        value indicates an increase, while a negative value
                        indicates a decrease in the score. Note that this is not
                        the actual difference between the two scores, but rather
                        the change expressed as a percentage of the original
                        score.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className={cn("flex flex-row space-x-4")}>
          <div className={cn("h-80 w-1/2")}>
            <DynamicScoreChart
              evaluateeId={selectedResponse.evaluatee.id}
              currentFormVersionId={selectedVersion.id}
              versions={versions}
            />
          </div>
          <div className={cn("flex h-80 w-1/2 flex-row justify-center")}>
            <CompetencyRadarChart />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
