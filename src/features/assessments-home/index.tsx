import {
  HomeLayout,
  HomeLayoutContent,
  HomeLayoutHeader,
  HomeLayoutTitle,
} from '@/components/ui/home-layout';
import { NewAssessmentDialogTrigger } from '@/features/assessments-home/components/new-assessment-dialog';

export function AssessmentsHome() {
  return (
    <HomeLayout>
      <HomeLayoutHeader>
        <HomeLayoutTitle>Assessments</HomeLayoutTitle>
        <div className="col-start-4">
        <NewAssessmentDialogTrigger />
        </div>
      </HomeLayoutHeader>
      <HomeLayoutContent>content here</HomeLayoutContent>
    </HomeLayout>
  );
}
