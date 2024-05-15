import { useEffect, useMemo, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import STICKY_NOTE from "public/icons/system-regular-152-sticky-note.json";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/animated-radio-group";
import { TQuestionRelate } from "@/db/types";
import { m, LazyMotion, AnimatePresence, domAnimation } from "framer-motion";
import { Answer } from "@/db/schema";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import { MilestoneBadge } from "@/components/(admin)/forms/responses/milestone-badge";

export function QuestionResponseCard({
  question,
  index,
  answers,
  locked,
}: {
  question: TQuestionRelate | undefined | null;
  index: number;
  answers: Answer[];
  locked: boolean;
}) {
  const lottieRef = useRef<Player>(null);
  const [hovering, setHovering] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Find the answer for the current question
  const answer = useMemo(
    () => answers.find((a) => a.questionVersionId === question?.id),
    [answers, question?.id],
  );

  // Set the default selected option based on the answer
  useEffect(() => {
    if (answer) {
      setSelectedOption(answer.optionVersionId);
      setFeedbackOpen(!!answer.feedback);
    }
  }, [answer]);

  const getPointsEarnedAsFraction = useMemo(() => {
    if (
      !question ||
      !answer ||
      question.options.find((o) => o.pointValue === null || undefined)
    )
      return;

    const selectedOption = question.options.find(
      (o) => o.id === answer.optionVersionId,
    );
    const maxPointsAvailable = Number(
      question.options.sort(
        (a, b) => Number(b.pointValue) - Number(a.pointValue),
      )[0].pointValue,
    );

    const bgColor = getBgColorFromPointValue(
      Number(selectedOption?.pointValue) / maxPointsAvailable,
    );

    return (
      <p className="text-lg font-bold tracking-widest">
        <span style={{ color: bgColor }}>{selectedOption?.pointValue}</span>
        {`/${maxPointsAvailable}`}
      </p>
    );
  }, [question, answer]);

  // Handle Icon Hover Animation
  useEffect(() => {
    if (lottieRef.current && hovering) {
      lottieRef.current.play();
    }
  }, [hovering]);

  const feedbackPlaceholder = useMemo(
    () =>
      question?.feedback
        ? "Please provide feedback... (Required)"
        : "Comments or Feedback...",
    [question?.feedback],
  );

  const options = useMemo(() => {
    if (!question) return [];

    return question.options
      .sort((a, b) => a.position - b.position)
      .map((o) => ({
        value: o.id,
        label: o.text || "",
        pointValue: parseFloat(o.pointValue),
        position: o.position,
      }));
  }, [question]);

  if (!question) return <>Error getting this question!</>;

  return (
    <LazyMotion features={domAnimation}>
      <m.div layout>
        <Card>
          <CardContent
            className={cn("flex select-none flex-col space-y-4 p-4")}
          >
            <CardTitle className="font-poppins flex items-center justify-between text-lg font-medium">
              <>
                <div className={cn("flex flex-row items-center space-x-2")}>
                  <p className={cn("font-poppins font-bold")}>{index + 1}.</p>
                  <p> {question.text}</p>
                </div>
                <div className={cn("flex flex-col justify-center")}>
                  <div
                    className={cn(
                      "font-poppins flex flex-row items-center justify-end space-x-1 text-xs",
                    )}
                  >
                    {getPointsEarnedAsFraction}
                    <p className={cn("font-bold tracking-wide text-gray-400")}>
                      POINTS EARNED
                    </p>
                  </div>
                  <div className={cn("flex justify-end")}>
                    {question.milestones.map((m) => (
                      <MilestoneBadge
                        key={`${question.id}-${m.milestoneId}`}
                        milestone={m.milestone}
                      />
                    ))}
                  </div>
                </div>
                {!question.feedback && !locked && (
                  <div
                    onClick={() => setFeedbackOpen(!feedbackOpen)}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                  >
                    <Player
                      src={STICKY_NOTE}
                      hover
                      autoplay
                      className={cn(
                        "size-6 cursor-pointer transition-opacity hover:opacity-70",
                      )}
                    />
                  </div>
                )}
              </>
            </CardTitle>
            <RadioGroup
              options={options}
              value={selectedOption || "ERROR_NO_VALUE"}
              onChange={(value) => {
                if (!locked) {
                  setSelectedOption(value);
                }
              }}
              name={`answers.${index}.optionVersionId`}
            />

            <AnimatePresence>
              {(feedbackOpen || answer?.feedback) && (
                <m.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Textarea
                    rows={4}
                    placeholder={feedbackPlaceholder}
                    className={cn("mt-2 resize-none")}
                    value={answer?.feedback || ""}
                    readOnly
                  />
                </m.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </m.div>
    </LazyMotion>
  );
}
