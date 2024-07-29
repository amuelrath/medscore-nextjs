import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Xarrow from "react-xarrows";

interface CommentCardProps {
  id: string;
  text: string;
  answerId: string;
  evaluatorName: string;
}

export function CommentCard({ id, text, answerId, evaluatorName }: CommentCardProps) {
  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const answerElement = document.getElementById(answerId);
    const commentElement = commentRef.current;
    const scrollContainer = commentElement?.closest(".overflow-y-scroll");

    if (answerElement && commentElement && scrollContainer) {
      const answerRect = answerElement.getBoundingClientRect();
      const scrollContainerRect = scrollContainer.getBoundingClientRect();
      const topOffset =
        answerRect.top - scrollContainerRect.top + scrollContainer.scrollTop;
      commentElement.style.top = `${topOffset}px`;
    }
  }, [answerId]);

  return (
    <div id={id} ref={commentRef} className="absolute left-0 w-full ml-2 pr-4">
      <Card className="w-full border-l-4 border-y-0 border-r-0 border-l-primary/50 p-2">
        <div className="flex flex-row items-center space-x-1 text-sm">
          <span className="size-5 rounded-full bg-primary/5" />
          <p>{evaluatorName}</p>
        </div>
        <CardContent className="mt-1 p-2">
          <p className="text-xs">{text}</p>
        </CardContent>
      </Card>
      <Xarrow
        start={answerId}
        end={id}
        color="gray"
        headSize={0}
        strokeWidth={1}
        curveness={0.3}
        startAnchor="right"
        endAnchor="left"
      />
    </div>
  );
}