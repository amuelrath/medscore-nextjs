'use client';

import {
  HomeLayout,
  HomeLayoutContent,
  HomeLayoutContentCard,
  HomeLayoutHeader,
  HomeLayoutTitle,
} from '@/components/home-layout';
import { ProgressSteps } from '@/components/progress-steps';
import { Button } from '@/components/ui/button';
import { ZAssessmentDetailsStepSchema } from '@/features/assessment-wizard/schemas/wizard-schemas';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';
import { useMultistepFormContext } from '@/hooks/use-multistep-form-context';

const steps = ['Details', 'Participants', 'Review & Deploy'];

export function AssessmentWizard() {
  const { previous, step, currentStepIndex, isFirstStep, isLastStep } =
    useMultistepFormContext();

  const components = useAssessmentWizardStore((s) => s.components);

  const submit = () => {
    const result = ZAssessmentDetailsStepSchema.safeParse({ components });

    // Success - use result.data
    const validatedData = result.data;
    // Process validated data here
    console.log(validatedData);
  };

  return (
    <HomeLayout>
      <HomeLayoutHeader className="w-[70%] flex flex-row justify-between pr-2">
        <HomeLayoutTitle>New Assessment</HomeLayoutTitle>
        <ProgressSteps stepLabels={steps} currentStepIndex={currentStepIndex} />
      </HomeLayoutHeader>
      <HomeLayoutContent className="flex flex-row flex-grow">
        <div className="basis-[70%] flex-grow flex flex-col">
          <HomeLayoutContentCard className="flex flex-col justify-center">
            <div className="flex-grow">{step}</div>
          </HomeLayoutContentCard>
          <div className="pt-4 self-end space-x-4">
            <Button
              disabled={isFirstStep}
              variant="secondary"
              onClick={previous}
            >
              Back
            </Button>
            <Button className="w-24" onClick={submit}>
              {isLastStep ? 'Submit' : 'Continue'}
            </Button>
          </div>
        </div>
        <div className="p-12 space-y-2 basis-[30%]">
          {/* step info */}
          <p className="text-2xl font-medium text-muted-foreground text-wrap">
            Wizard Step Tips
          </p>
          <p className="font-light text-muted-foreground text-wrap">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem modi
            tenetur veritatis.
          </p>
        </div>
      </HomeLayoutContent>
    </HomeLayout>
  );
}
