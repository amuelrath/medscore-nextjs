import { useResponseContext } from "@/components/(admin)/forms/providers/response-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnswerCard } from "@/components/(admin)/forms/responses/answer-card";
import { NoResponseSelected } from "@/components/(admin)/forms/responses/no-response-selected";

export function ResponseQuestions() {
  const { selectedVersion, selectedResponse } = useResponseContext();

  if (!selectedVersion || !selectedResponse) {
    return <NoResponseSelected />;
  }

  const questions = selectedVersion.questions;

  return (
    <ScrollArea className="mt-12 h-[88.5vh] overflow-y-hidden px-4 pb-32">
      <ul>
        {questions
          .sort((a, b) => a.position - b.position)
          .map((q) => (
            <li key={q.id} className="mb-4">
              <AnswerCard question={q} />
            </li>
          ))}
      </ul>
    </ScrollArea>
  );
}

