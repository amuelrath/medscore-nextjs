import { AssessmentWizard } from '@/features/assessment-wizard';
import { AssessmentDetailsForm } from '@/features/assessment-wizard/components/details-step';
import { MultistepFormProvider } from '@/hooks/use-multistep-form-context';

function AssessmentParticipantsForm() {
  return <div>step two</div>;
}

function AssessmentReviewAndDeployForm() {
  return <div>step three</div>;
}

const stepComponents = [
  <AssessmentDetailsForm key="details" />,
  <AssessmentParticipantsForm key="participants" />,
  <AssessmentReviewAndDeployForm key="review" />,
];

export default function AssessmentWizardPage() {
  return (
    <MultistepFormProvider steps={stepComponents}>
      <AssessmentWizard />
    </MultistepFormProvider>
  );
}
