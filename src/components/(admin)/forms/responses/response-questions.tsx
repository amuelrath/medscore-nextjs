import { useResponseContext } from "@/components/(admin)/forms/providers/response-provider";
import { AnswerCard } from "@/components/(admin)/forms/responses/answer-card";
import { NoResponseSelected } from "@/components/(admin)/forms/responses/errors/no-response-selected";

export function ResponseQuestions() {
  const { selectedVersion, selectedResponse } = useResponseContext();

  if (!selectedVersion || !selectedResponse) {
    return <NoResponseSelected />;
  }

  const questions = selectedVersion.questions;

  return (
      <ul className="mt-12 h-[88.5vh] overflow-y-scroll px-4 pb-32">
        {questions
          .sort((a, b) => a.position - b.position)
          .map((q) => (
            <li key={q.id} className="mb-4">
              <AnswerCard
                id={q.id}
                position={q.position}
                text={q.text}
                options={q.options}
                readonly
              />
            </li>
          ))}
      </ul>
  );
}

