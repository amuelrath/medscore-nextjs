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
import { createAssessment } from '@/features/assessment-wizard/actions/create-assessment';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';
import { useMultistepFormContext } from '@/hooks/use-multistep-form-context';
import { truncate } from '@/lib/truncate';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const steps = ['Build Assessment', 'Review & Deploy'];

export function AssessmentWizard() {
  const router = useRouter()

  const { previous, step, currentStepIndex, isFirstStep, isLastStep } =
    useMultistepFormContext();

  const details = useAssessmentWizardStore((s) => s.details);
  const components = useAssessmentWizardStore((s) => s.components);

  const { mutate: mutateCreateAssessment, isPending } = useMutation({
    mutationFn: createAssessment,
    onSuccess: (data, variables, ctx) => {
      toast.success('Assessment created successfully.');
      router.push("/assessments")
    },
    onError: (error, variables, ctx) => {
      toast.error("Something went wrong. Please refresh.")
    },
  });

  const handleSubmit = () => {
    mutateCreateAssessment({
      assessment: {
        details,
        components,
      },
      creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
    });
  };

  // guard the route
  useEffect(() => {
    // If no title (or other required field), redirect back
    if (!details.title) {
      router.push('/assessments'); // or wherever they start
      toast.info("Click 'New Assessment' to get started.")
    }
  }, [details.title, router]);

  if (!details.title) {
    return null;
  }

  return (
    <HomeLayout>
      <HomeLayoutHeader className="w-[70%] flex flex-row justify-between pr-2">
        <HomeLayoutTitle>{truncate(details.title, 35)}</HomeLayoutTitle>
        <ProgressSteps stepLabels={steps} currentStepIndex={currentStepIndex} />
      </HomeLayoutHeader>
      <HomeLayoutContent className="flex flex-row flex-grow">
        <div className="basis-[70%] flex-grow flex flex-col">
          {/* main step content */}
          <HomeLayoutContentCard className="flex flex-col justify-center">
            <div className="flex-grow">{step}</div>
          </HomeLayoutContentCard>
          {/* forward and back buttons */}
          <div className="pt-4 flex self-end space-x-4 select-none">
            <Button
              disabled={isFirstStep}
              variant="secondary"
              onClick={previous}
            >
              Back
            </Button>
            {isLastStep ? (
              <Button
                className="w-36 overflow-hidden"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2Icon size={18} className="animate-spin" />
                ) : (
                  'Send Requests'
                )}
              </Button>
            ) : (
              <Button className="w-36" type="submit" form="current-step">
                Continue
              </Button>
            )}
          </div>
        </div>
        <div className="p-12 space-y-2 basis-[30%] select-none" />
      </HomeLayoutContent>
    </HomeLayout>
  );
}
