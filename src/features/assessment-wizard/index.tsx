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
import { useMultistepFormContext } from '@/hooks/use-multistep-form-context';

interface Tip {
  label: string;
  text: string;
}

const tips: Tip[] = [
  {
    label: "Details",
    text: "Configure baseline details of your new assessment."
  },
  {
    label: "Details",
    text: "Add forms to your assessment and configure titles, durations, and settings for each."
  },
  {
    label: "Assignment",
    text: "Assign participants based on your assessment type. For pair assessments, match evaluators with evaluatees. For single assessments, select respondents."
  },
  {
    label: "Review & Deploy",
    text: "Review all generated requests before deployment. You can edit individual assignments or adjust timing before sending."
  }
]

const steps = ['Details', 'Assignment', 'Review & Deploy'];


export function AssessmentWizard() {
  const { previous, step, currentStepIndex, isFirstStep, isLastStep } =
    useMultistepFormContext();

  return (
    <HomeLayout>
      <HomeLayoutHeader className="w-[70%] flex flex-row justify-between pr-2">
        <HomeLayoutTitle>New Assessment</HomeLayoutTitle>
        <ProgressSteps stepLabels={steps} currentStepIndex={currentStepIndex} />
      </HomeLayoutHeader>
      <HomeLayoutContent className="flex flex-row flex-grow">
        <div className="basis-[70%] flex-grow flex flex-col">
          {/* main step content */}
          <HomeLayoutContentCard className="flex flex-col justify-center">
            <div className="flex-grow">{step}</div>
          </HomeLayoutContentCard>
          {/* forward and back buttons */}
          <div className="pt-4 self-end space-x-4 select-none">
            <Button
              disabled={isFirstStep}
              variant="secondary"
              onClick={previous}
            >
              Back
            </Button>
            <Button className="w-24" type="submit" form="current-step">
              {isLastStep ? 'Submit' : 'Continue'}
            </Button>
          </div>
        </div>
        <div className="p-12 space-y-2 basis-[30%] select-none">
          {/* step tips */}
          <p className="text-2xl font-medium text-muted-foreground text-wrap">
            {tips[currentStepIndex].label}
          </p>
          <p className="font-light text-muted-foreground text-wrap">
            {tips[currentStepIndex].text}
          </p>
        </div>
      </HomeLayoutContent>
    </HomeLayout>
  );
}
