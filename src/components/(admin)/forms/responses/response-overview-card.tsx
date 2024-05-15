"use client";
import { cn } from "@/lib/utils";
import { ResponseDetailsButton } from "./response-details-button";
import { TFormVersion, TQuestionRelate } from "@/db/types";
import { Answer } from "@/db/schema";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import EYE_ICON from "public/icons/wired-flat-69-eye.json";
import { Player } from "@lottiefiles/react-lottie-player";
import WaterfallAnimation from "@/components/ui/waterfall-animation";
import { CompetencyGauges } from "@/components/(admin)/forms/responses/competency-gauges";
import { useCurrentResponseAndForm } from "@/hooks/useCurrentResponseAndForm";
import Loading from "@/components/ui/loading";
import { getPointsEarnedAndAvailable } from "@/lib/responses/utils";
import {
  getPercentChange,
  getCompetencyPercentages,
} from "@/lib/responses/percentChangeCalculator";
import { useMemo } from "react";
import { useAllFormVersions } from "@/hooks/useAllFormVersions";
import { ChangeIndicator } from "@/components/ui/percent-change-indicator";

export function ResponseOverviewCard() {
  const { allVersions } = useAllFormVersions();
  const { formVersion, selectedResponseId, response, selectedVersionId } =
    useCurrentResponseAndForm();

  const points = useMemo(() => {
    return getPointsEarnedAndAvailable(
      formVersion?.questions as unknown as TQuestionRelate[],
      response?.answers as unknown as Answer[],
    );
  }, [formVersion?.questions, response?.answers]);

  const competencyPercentages = useMemo(() => {
    return getCompetencyPercentages(
      formVersion?.questions as unknown as TQuestionRelate[],
      response?.answers as unknown as Answer[],
    );
  }, [formVersion?.questions, response?.answers]);

  const currentScore =
    (points?.pointsEarned || 0) / (points?.pointsAvailable || 0);

  const scoreBgColor = getBgColorFromPointValue(currentScore || 1);

  const percentChanges = useMemo(() => {
    return getPercentChange(
      response?.evaluatee.id || "",
      allVersions as unknown as TFormVersion[],
      selectedVersionId || "",
    );
  }, [allVersions, response?.evaluatee.id, selectedVersionId]);

  if (!selectedResponseId)
    return (
      <div className={cn("h-52 px-4")}>
        <header className={cn("flex flex-row items-center justify-between")}>
          <h4 className={cn("font-poppins text-2xl font-bold tracking-wide")}>
            Overview
          </h4>
        </header>
        <div
          className={cn(
            "font-poppins mt-10 flex h-full w-full flex-col items-center justify-start",
          )}
        >
          <Player
            src={EYE_ICON}
            autoplay
            loop
            speed={0.7}
            className={cn("size-20 drop-shadow-lg")}
          />
          <p>Select a response to see results.</p>
        </div>
      </div>
    );

  return (
    <WaterfallAnimation speed={0.1}>
      <div className={cn("h-52 px-4")}>
        <header className={cn("flex items-center justify-between pb-2")}>
          <h4 className={cn("font-poppins text-xl font-bold")}>
            Response Overview
          </h4>
          <ResponseDetailsButton />
        </header>
        <div className={cn("flex flex-col items-center space-y-4")}>
          {competencyPercentages && (
            <CompetencyGauges competencyPercentages={competencyPercentages} />
          )}
          <hr className={cn("w-full bg-primary text-primary")} />
          <div
            className={cn("grid w-full grid-cols-2 divide-x drop-shadow-lg")}
          >
            <div className={cn("flex items-center justify-center")}>
              <p
                className={cn(
                  "font-poppins pr-2 text-5xl font-bold tracking-wider",
                )}
              >
                <span style={{ color: scoreBgColor }}>
                  {points?.pointsEarned}
                </span>
                {`/${points?.pointsAvailable}`}
              </p>
            </div>
            <div className={cn("grid grid-cols-1 gap-2 pl-2")}>
              <div className={cn("flex flex-col items-end")}>
                <p
                  className={cn("font-poppins text-sm font-bold text-gray-400")}
                >
                  &Delta; PREVIOUS
                </p>
                <ChangeIndicator
                  percentChange={
                    Number(
                      percentChanges?.percentChangeFromPrevious.toFixed(1),
                    ) || 0
                  }
                />
              </div>
              <div className={cn("flex flex-col items-end")}>
                <p
                  className={cn("font-poppins text-sm font-bold text-gray-400")}
                >
                  &Delta; OVERALL
                </p>
                {percentChanges?.percentChangeFromFirst !==
                percentChanges?.percentChangeFromPrevious ? (
                  <ChangeIndicator
                    percentChange={
                      Number(
                        percentChanges?.percentChangeFromFirst.toFixed(1),
                      ) || 0
                    }
                  />
                ) : (
                  <p className={cn("font-poppins text-xs italic")}>
                    No Overall Change.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WaterfallAnimation>
  );
}
