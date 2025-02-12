'use client';

import { useEvaluationForm } from '@/components/(evaluation)/evaluation-form/hooks';
import { Header } from '@/components/(evaluation)/evaluation-form/question-cards/header';
import { MultipleChoiceQuestion } from '@/components/(evaluation)/evaluation-form/question-cards/multiple-choice-question';
import { SingleChoiceQuestion } from '@/components/(evaluation)/evaluation-form/question-cards/single-choice-question';
import { WrittenQuestion } from '@/components/(evaluation)/evaluation-form/question-cards/written-question';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/db/schema';
import { getInitials } from '@/lib/helpers/get-initials';
import { getFullName } from '@/lib/helpers/get-full-name';
import { TODO } from '@/types';
import { ClipboardListIcon } from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';

export function WebEvaluationForm({ responseId }: { responseId: string }) {
  const { form, methods, response, submitForm } = useEvaluationForm({
    responseId,
  });
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
      .map((f): ReactNode => {
        const questionIndex = questionCount;

        let component: ReactNode;
        switch (f.type) {
          case 'MULTIPLE_CHOICE':
            component = (
              <MultipleChoiceQuestion
                key={f.id}
                options={f.options || []}
                required={f.isRequired}
                text={f.text}
                control={methods.control}
                name={`answers.${questionIndex}.selectedOptionIds`}
              />
            );
            questionCount += 1;
            break;
          case 'WRITTEN':
            component = (
              <WrittenQuestion
                key={f.id}
                control={methods.control}
                required={f.isRequired}
                name={`answers.${questionIndex}.textValue`}
                text={f.text}
              />
            );
            questionCount += 1;
            break;
          case 'SINGLE_CHOICE':
            component = (
              <SingleChoiceQuestion
                key={f.id}
                control={methods.control}
                required
                name={`answers.${questionIndex}.selectedOptionId`}
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
    <main className="">
      <WebEvaluationFormHeader
        title={form.title}
        evaluatee={response.evaluatee}
        onSaveAndQuitClick={submitForm}
      />
      <div className="grid md:grid-cols-7 p-4 w-full overflow-y-scroll h-[calc(100vh-96px)]">
        <div className="md:col-span-3 md:col-start-3 col-start-2 space-y-4">
          {formComponents}
        </div>
      </div>
    </main>
  );
}

interface WebEvaluationFormHeaderProps {
  title: string;
  evaluatee: Pick<User, 'id' | 'firstName' | 'lastName'>;
  onSaveAndQuitClick?: () => void;
}

function WebEvaluationFormHeader({
  title,
  evaluatee,
  onSaveAndQuitClick,
}: WebEvaluationFormHeaderProps) {
  const evaluateeName = getFullName(evaluatee);
  const evaluateeInitials = getInitials(evaluateeName);
  return (
    <header className="flex h-12 col-span-full w-full flex-row items-center justify-between border-b border-neutral-300 bg-card/50 p-1 px-2">
      <div className="flex flex-row space-x-4 items-center">
        <h2 className="text-2xl flex items-center space-x-1 font-semibold">
          <ClipboardListIcon className="opacity-50" />
          <p>{title}</p>
        </h2>
        <Avatar size="sm" content={evaluateeInitials} tooltip={evaluateeName} />
      </div>

      <div className="flex flex-row items-center space-x-2">
        <Button size="sm" onClick={onSaveAndQuitClick}>
          Submit
        </Button>
        <Button type="button" variant="secondary" size="sm">
          Save & Quit
        </Button>
      </div>
    </header>
  );
}
