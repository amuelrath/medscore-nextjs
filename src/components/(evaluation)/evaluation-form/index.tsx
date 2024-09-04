'use client';

import { useEvaluationForm } from '@/components/(evaluation)/evaluation-form/hooks';
import { Header } from '@/components/(evaluation)/evaluation-form/question-cards/header';
import { MultipleChoiceQuestion } from '@/components/(evaluation)/evaluation-form/question-cards/multiple-choice-question';
import { SingleChoiceQuestion } from '@/components/(evaluation)/evaluation-form/question-cards/single-choice-question';
import { WrittenQuestion } from '@/components/(evaluation)/evaluation-form/question-cards/written-question';
import { TODO } from '@/types';
import { ReactNode, useEffect, useMemo, useState } from 'react';

export function WebEvaluationForm({ responseId }: { responseId: string }) {
  const { form, methods } = useEvaluationForm({ responseId });
  const [isFieldsRegistered, setIsFieldsRegistered] = useState(false);

  useEffect(() => {
    let questionCount = 0;
    form.formItems.forEach((f: TODO) => {
      methods.register(`answers.${questionCount}.formItemId` as const, {
        value: f.id,
      });
      methods.register(`answers.${questionCount}.type` as const, {
        value: f.type,
      });
      methods.register(`answers.${questionCount}.id` as const);

      if (f.type !== 'HEADER') {
        questionCount += 1;
      }
    });
    setIsFieldsRegistered(true);
  }, [form.formItems, methods]);

  const formComponents = useMemo(() => {
    let questionCount = 0;
    return form.formItems
      .sort((a, b) => a.position - b.position)
      .map((f: TODO): ReactNode => {
        const questionIndex = questionCount;

        let component: ReactNode;
        switch (f.type) {
          case 'MULTIPLE_CHOICE':
            component = (
              <MultipleChoiceQuestion
                key={f.id}
                questionIndex={questionIndex}
                options={f.options || []}
                text={f.text}
                control={methods.control}
                name={`answers.${questionIndex}.selectedOptionIds` as const}
              />
            );
            questionCount += 1;
            break;
          case 'WRITTEN':
            component = (
              <WrittenQuestion
                key={f.id}
                control={methods.control}
                name={`answers.${questionIndex}.textValue` as const}
                text={f.text}
              />
            );
            questionCount += 1;
            break;
          case 'SINGLE_CHOICE':
            component = (
              <SingleChoiceQuestion
                key={f.id}
                questionIndex={questionIndex}
                control={methods.control}
                name={`answers.${questionIndex}.selectedOptionId` as const}
                options={f.options || []}
                text={f.text}
              />
            );
            questionCount += 1;
            break;
          case 'HEADER':
            component = (
              <Header key={f.id} text={f.text} description={f.description} />
            );
            break;
          case 'RANGE':
          default:
            throw new Error(`Item of type '${f.type}' is unsupported.`);
        }

        return component;
      });
  }, [form.formItems, methods]);

  if (!isFieldsRegistered) {
    return null; // or a loading indicator
  }

  return (
    <main className="grid md:grid-cols-7 w-full p-4 overflow-y-scroll h-[calc(100vh-40px)]">
      <div className="md:col-span-3 md:col-start-3 col-start-2 space-y-4">
        {formComponents}
      </div>
    </main>
  );
}
