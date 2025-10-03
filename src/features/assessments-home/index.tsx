import {
  HomeLayout,
  HomeLayoutContent,
  HomeLayoutHeader,
  HomeLayoutTitle,
} from '@/components/ui/home-layout';

export function AssessmentsHome() {
  return (
    <HomeLayout>
      <HomeLayoutHeader>
        <HomeLayoutTitle>Assessments</HomeLayoutTitle>
      </HomeLayoutHeader>
      <HomeLayoutContent>content here</HomeLayoutContent>
    </HomeLayout>
  );
}
