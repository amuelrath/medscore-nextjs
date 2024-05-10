import { useEffect, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import STICKY_NOTE from "public/icons/system-regular-152-sticky-note.json";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/animated-radio-group";
import { TQuestionRelate } from "@/db/types";
import { motion, AnimatePresence } from "framer-motion";
import { Answer } from "@/db/schema";

export function QuestionResponseCard({
  question,
  index,
  answers,
  locked,
}: {
  question: TQuestionRelate;
  index: number;
  answers: Answer[];
  locked: boolean;
}) {
  const lottieRef = useRef<Player>(null);
  const [hovering, setHovering] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Find the answer for the current question
  const answer = answers.find((a) => a.questionVersionId === question.id);

  // Set the default selected option based on the answer
  useEffect(() => {
    if (answer) {
      setSelectedOption(answer.optionVersionId);
      setFeedbackOpen(!!answer.feedback);
    }
  }, [answer]);

  // Handle Icon Hover Animation
  useEffect(() => {
    if (lottieRef.current && hovering) {
      lottieRef.current.play();
    }
  }, [hovering]);

  const isFeedbackRequired = question.feedback;
  const feedbackPlaceholder = isFeedbackRequired
    ? "Please provide feedback... (Required)"
    : "Comments or Feedback...";

  return (
    <motion.div layout>
      <Card>
        <CardContent className={cn("flex select-none flex-col space-y-4 p-4")}>
          <CardTitle className="font-poppins flex items-center justify-between text-lg">
            <>
              {`${question.text}`}
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
            options={question.options
              .sort((a, b) => a.position - b.position)
              .map((o) => ({
                value: o.id,
                label: o.text || "",
                pointValue: parseFloat(o.pointValue),
              }))}
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
              <motion.div
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
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
