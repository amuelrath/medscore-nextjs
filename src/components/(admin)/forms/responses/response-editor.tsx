"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import EYE_BLINKING from "public/icons/wired-flat-69-eye.json";
import { cn } from "@/lib/utils";
import { useSelectedFormVersion } from "@/providers/selected-form-version-provider";
import { useSelectedResponseId } from "@/providers/selected-response-id-provider";
import { QuestionCard } from "@/components/(evaluator)/forms/question-card";
import { TQuestionRelate } from "@/db/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";
import { QuestionResponseCard } from "@/components/(admin)/forms/responses/question-response-card";
import { Answer } from "@/db/schema";
import { useEffect, useRef } from "react";
import WaterfallAnimation from "@/components/ui/waterfall-animation";

export function ResponseEditor() {
  const { formVersion } = useSelectedFormVersion();
  const { selectedResponseId } = useSelectedResponseId();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const response = formVersion?.responses.find(
    (r) => r.id === selectedResponseId,
  );

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [selectedResponseId]);

  return (
    <div className={cn("flex h-full w-full scroll-p-4 justify-center p-8")}>
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center",
        )}
      >
        {!selectedResponseId || !formVersion?.responses ? (
          <>
            <Player
              src={EYE_BLINKING}
              autoplay
              loop
              speed={0.7}
              className={cn("size-24 drop-shadow-lg")}
            />
            <p className={"font-poppins"}>Select a response to get started. </p>
          </>
        ) : (
          <ScrollArea ref={scrollAreaRef} className={cn("h-[570px] w-full scroll-p-4")}>
            <ScrollAreaScrollbar />
            <WaterfallAnimation>
              {formVersion?.questions.map((q, index) => (
                <div key={q.id} className={cn("mb-4 mr-4")}>
                  <QuestionResponseCard
                    locked={true}
                    answers={response?.answers || ([{}] as Answer[])}
                    question={q as unknown as TQuestionRelate}
                    index={index}
                  />
                </div>
              ))}
            </WaterfallAnimation>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
