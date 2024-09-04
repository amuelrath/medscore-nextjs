'use client';

import { useEvaluationForm } from '@/components/(evaluation)/evaluation-form/hooks';
import { Header } from '@/components/(evaluation)/evaluation-form/question-cards/header';
import { MultipleChoiceQuestion } from '@/components/(evaluation)/evaluation-form/question-cards/multiple-choice-question';
import { SingleChoiceQuestion } from '@/components/(evaluation)/evaluation-form/question-cards/single-choice-question';
import { WrittenQuestion } from '@/components/(evaluation)/evaluation-form/question-cards/written-question';
import { TODO } from '@/types';
import { ReactNode } from 'react';

type Accumulator = {
  components: ReactNode[];
  questionCount: number;
};

export function WebEvaluationForm({ responseId }: { responseId: string }) {
  const { form, methods } = useEvaluationForm({ responseId });

  const formComponents = form.formItems
    .sort((a, b) => a.position - b.position)
    .reduce<Accumulator>(
      (acc, f: TODO, index) => {
        const questionIndex = acc.questionCount;

        const registerQuestionId = methods.register(
          `answers.${questionIndex}.formItemId` as const,
          { value: f.id },
        );
        const registerQuestionType = methods.register(
          `answers.${questionIndex}.type` as const,
          { value: f.type },
        );
        const registerAnswerId = methods.register(
          `answers.${questionIndex}.id` as const,
        );

        let component: ReactNode;
        switch (f.type) {
          case 'MULTIPLE_CHOICE':
            component = (
              <MultipleChoiceQuestion
                key={f.id}
                options={f.options || []}
                registerQuestionId={registerQuestionId}
                registerQuestionType={registerQuestionType}
                registerAnswerId={registerAnswerId}
                text={f.text}
                control={methods.control}
                name={`answers.${questionIndex}.selectedOptionIds` as const}
              />
            );
            acc.questionCount += 1;
            break;
          case 'WRITTEN':
            component = (
              <WrittenQuestion
                key={f.id}
                registerQuestionId={registerQuestionId}
                registerQuestionType={registerQuestionType}
                registerAnswerId={registerAnswerId}
                control={methods.control}
                name={`answers.${questionIndex}.textValue` as const}
                text={f.text}
              />
            );
            acc.questionCount += 1;
            break;
          case 'SINGLE_CHOICE':
            component = (
              <SingleChoiceQuestion
                key={f.id}
                control={methods.control}
                registerQuestionId={registerQuestionId}
                registerQuestionType={registerQuestionType}
                registerAnswerId={registerAnswerId}
                name={`answers.${questionIndex}.selectedOptionId` as const}
                options={f.options || []}
                text={f.text}
              />
            );
            acc.questionCount += 1;
            break;
          case 'HEADER':
            component = (
              <Header key={f.id} text={f.text} description={f.description} />
            );
            break;
          case 'RANGE':
            throw new Error(`Item at index '${index}' is an unsupported type.`);
          default:
            throw new Error(`Item at index '${index}' is an unsupported type.`);
        }

        acc.components.push(component);
        return acc;
      },
      { components: [], questionCount: 0 },
    ).components;

  return (
    <main className="grid md:grid-cols-7 p-4 overflow-y-scroll h-[calc(100vh-40px)]">
      <div className="md:col-span-3 md:col-start-3 col-start-2 space-y-4">
        {formComponents}
      </div>
    </main>
  );
}
