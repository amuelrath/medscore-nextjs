import { Controller, useFormContext } from "react-hook-form";
import { TQuestionRelate, TResponseSchema } from "@/db/types";
import { useAnimation, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import STICKY_NOTE from "public/icons/system-regular-152-sticky-note.json";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/animated-radio-group";

export function QuestionCard({
  question,
  index,
}: {
  question: TQuestionRelate;
  index: number;
}) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TResponseSchema>();
  const animationControls = useAnimation();
  const lottieRef = useRef<Player>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(question.feedback);
  const [cardHeight, setCardHeight] = useState(0);

  // Set the questionId field when the component mounts
  useEffect(() => {
    setValue(`answers.${index}.questionVersionId`, question.id);
  }, [index, question.id, setValue]);

  // Card In Animation?
  useEffect(() => {
    animationControls
      .start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.1 * index },
      })
      .then(() => null);
  }, [animationControls, index]);

  // TODO Change to be on icon hover rather than card hover.
  // Handle Icon Hover Animation
  useEffect(() => {
    if (lottieRef.current && hovering) {
      lottieRef.current.play();
    }
  }, [hovering]);

  // Handle Card Expansion
  useEffect(() => {
    if (cardRef.current) {
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [feedbackOpen, errors.answers?.[index]]);

  const isFeedbackRequired = question.feedback;
  const feedbackPlaceholder = isFeedbackRequired
    ? "Please provide feedback... (Required)"
    : "Comments or Feedback...";

  return (
    <motion.div
      layoutId={question.id}
      layout
      animate={{
        height: cardHeight,
      }}
      transition={{ duration: 0.1 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Card
        ref={cardRef}
        className={cn(
          errors?.answers?.[index]?.optionVersionId &&
            "border-2 border-destructive",
        )}
      >
        <CardContent className={cn("flex select-none flex-col space-y-4 p-4")}>
          <CardTitle className="font-poppins flex items-center justify-between text-lg">
            <>
              {`${question.text}`}
              {!question.feedback && (
                <div onClick={() => setFeedbackOpen(!feedbackOpen)}>
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
          <Controller
            name={`answers.${index}.optionVersionId`}
            rules={{ required: "This field is required" }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <RadioGroup
                  options={question.options.map((o) => ({
                    value: o.id,
                    label: o.text || "",
                    pointValue: parseFloat(o.pointValue),
                  }))}
                  value={field.value || "ERROR_NO_VALUE"}
                  onChange={field.onChange}
                  name={`answers.${index}.optionVersionId`}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </>
            )}
          />

          {feedbackOpen && (
            <>
              <Textarea
                rows={4}
                placeholder={feedbackPlaceholder}
                className={cn("mt-2 resize-none")}
                {...register(`answers.${index}.feedback`, {
                  required: isFeedbackRequired,
                })}
              />
              {errors.answers?.[index]?.feedback && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.answers[index]?.feedback?.message}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
