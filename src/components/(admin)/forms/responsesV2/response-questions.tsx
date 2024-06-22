import { useResponseContext } from "@/components/(admin)/forms/providers/response-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnswerCard } from "@/components/(admin)/forms/responsesV2/answer-card";

export function ResponseQuestions() {
  const { selectedVersion, selectedResponse } = useResponseContext();

  if (!selectedVersion || !selectedResponse) {
    return <div>Please select a response</div>;
  }

  const questions = selectedVersion.questions;

  return (
    <ScrollArea className="mt-12 pb-32 h-[88.5vh] overflow-y-hidden px-4">
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