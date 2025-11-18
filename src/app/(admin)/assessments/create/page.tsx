import { AssessmentWizard } from '@/features/assessment-wizard';
import { AssessmentComponentsForm } from '@/features/assessment-wizard/components/components-step';
import { AssessmentReviewAndDeployForm } from '@/features/assessment-wizard/components/review-step';
import { MultistepFormProvider } from '@/hooks/use-multistep-form-context';

const stepComponents = [
  <AssessmentComponentsForm key="components" />,
  <AssessmentReviewAndDeployForm key="review" />,
];

export default function AssessmentWizardPage() {
  return (
    <MultistepFormProvider steps={stepComponents}>
      <AssessmentWizard />
    </MultistepFormProvider>
  );
}
