"use client";
import { trpc } from "@/app/_trpc/client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import STICKY_NOTE from "public/icons/system-regular-152-sticky-note.json";
import Loading from "@/components/ui/loading";
import { TQuestionRelate } from "@/db/types";
import { useEffect, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/db/schema";
import { Section } from "@/components/ui/section";

export default function EvaluateIdPage({ params }: { params: { id: string } }) {
  // TODO Verify that the form is still active. Or that the session the form was loaded on hasn't expired.
  // TODO Use localstorage to hold onto the evaluatee's id. Kill the context.
  // TODO Add alert on attempt page refresh. If refresh, redirect to home page.

  const form = trpc.responses.getFormById.useQuery({
    formId: params.id,
  });

  const getEvaluatee = () => {
    if (typeof window !== "undefined") {
      try {
        const evaluateeString = window.localStorage.getItem("evaluatee");
        if (evaluateeString) {
          return JSON.parse(evaluateeString) as User;
        }
      } catch (error) {
        console.error("Error parsing evaluatee from localStorage:", error);
      }
    }
    return null;
  };

  const evaluatee = getEvaluatee();

  if (form.isLoading) {
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center mt-[25%]"
        )}
      >
        <Loading />
      </div>
    );
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-[57px] w-full h-12 bg-background z-20 shadow-md p-2 flex flex-col items-end justify-center"
        )}
      >
        <p className={cn("text-xs font-bold text-gray-500 tracking-wider")}>
          EVALUATING
        </p>
        <p
          className={cn("font-regular")}
        >{`${evaluatee?.firstName} ${evaluatee?.lastName}`}</p>
      </header>
      <Section>
        <div
          className={cn(
            "flex flex-col h-full w-full space-y-4 lg:px-32 sm:px-4 pt-4 pb-40 no-scrollbar"
          )}
        >
          <AnimatePresence>
            {form.data &&
              form.data.questions &&
              form.data.questions
                .filter((q) => q !== null)
                .sort((a, b) => a.position - b.position)
                .map((q, index) => (
                  <QuestionCard
                    key={q.id}
                    index={index}
                    question={q as unknown as TQuestionRelate}
                  />
                ))}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}

function QuestionCard({
  question,
  index,
}: {
  question: TQuestionRelate;
  index: number;
}) {
  const animationControls = useAnimation();
  const lottieRef = useRef<Player>(null);
  const [hovering, setHovering] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(question.feedback);
  const [feedback, setFeedback] = useState<string>("");
  const [cardHeight, setCardHeight] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animationControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.1 * index },
    });
  }, []);

  useEffect(() => {
    if (lottieRef.current && hovering) {
      lottieRef.current.play();
    }
  }, [hovering]);

  useEffect(() => {
    if (cardRef.current) {
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [feedbackOpen, feedback]);

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
      <Card className={cn("group")} ref={cardRef}>
        <CardContent className={cn("flex flex-col space-y-4 p-4")}>
          <CardTitle className="text-xl font-poppins ">{`${question.text}`}</CardTitle>
          <div className={cn("space-y-2")}>
            {question.options
              .sort((a, b) => a.position - b.position)
              .map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOptionId(o.id)}
                  className={cn(
                    "transition-all font-poppins border cursor-pointer flex flex-row items-center justify-start space-x-1 rounded-md p-2",
                    selectedOptionId === o.id
                      ? "bg-foreground text-white"
                      : "bg-white text-primary hover:bg-foreground/10"
                  )}
                >
                  <p className={cn("text-lg")}>{o.text}</p>
                </div>
              ))}
          </div>
          <div
            className={cn(
              "flex flex-row items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity"
            )}
          >
            {!question.feedback && (
              <div onClick={() => setFeedbackOpen(!feedbackOpen)}>
                <Player
                  src={STICKY_NOTE}
                  ref={lottieRef}
                  className={cn(
                    "size-6 cursor-pointer  hover:opacity-70 transition-opacity"
                  )}
                />
              </div>
            )}
          </div>
          {feedbackOpen && (
            <Textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={
                question.feedback
                  ? "Please provide feedback..."
                  : "Comments or Feedback..."
              }
              className={cn("mt-2 resize-none")}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
