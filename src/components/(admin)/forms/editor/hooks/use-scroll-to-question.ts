import { useCallback, useRef, useEffect } from "react";

interface ScrollToQuestionHookProps {
  selectedQuestionId: string | undefined;
}

export const useScrollToQuestion = ({
  selectedQuestionId,
}: ScrollToQuestionHookProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToQuestion = useCallback((id: string) => {
    if (containerRef.current && questionRefs.current[id]) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const questionRect = questionRefs.current[id]!.getBoundingClientRect();

      const scrollTop =
        questionRect.top +
        containerRef.current.scrollTop -
        containerRect.top -
        15;

      containerRef.current.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (selectedQuestionId) {
      // Delay the scroll to ensure the layout has updated
      setTimeout(() => scrollToQuestion(selectedQuestionId), 100);
    }
  }, [selectedQuestionId, scrollToQuestion]);

  return {
    containerRef,
    questionRefs,
  };
};
