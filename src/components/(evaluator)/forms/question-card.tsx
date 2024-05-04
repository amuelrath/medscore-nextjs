"use client";
import { TQuestionRelate } from "@/db/types";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import STICKY_NOTE from "public/icons/system-regular-152-sticky-note.json";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroupProvider,
  RadioGroupItem,
} from "@/components/ui/animated-radio-group";

export function QuestionCard({
  question,
  index,
}: {
  question: TQuestionRelate;
  index: number;
}) {
  const animationControls = useAnimation();
  const lottieRef = useRef<Player>(null);
  const [hovering, setHovering] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(question.feedback);
  const [feedback, setFeedback] = useState<string>("");
  const [cardHeight, setCardHeight] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

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
      <Card ref={cardRef}>
        <CardContent className={cn("flex flex-col space-y-4 p-4")}>
          <CardTitle className="font-poppins flex items-center justify-between text-lg tracking-wide">
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
          <RadioGroupProvider>
            {question.options
              .sort((a, b) => a.position - b.position)
              .map((o) => {
                const pointValue = parseFloat(o.pointValue);
                const normalizedValue = (pointValue + 1) / 2; // Normalize from -1 to 1 range to 0 to 1 range
                const hue = Math.round(normalizedValue * 90); // Map the normalized value to a hue from 0 to 120 (green to red)
                const bgColor = `hsl(${hue}, 70%, 90%)`; // Generate the HSL color string

                return (
                  <RadioGroupItem
                    key={o.id}
                    label={o.text}
                    value={o.id}
                    className={cn("bg-opacity-60")}
                    style={{ backgroundColor: bgColor }}
                  />
                );
              })}
          </RadioGroupProvider>
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
