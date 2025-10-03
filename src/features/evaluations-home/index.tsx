import {
  HomeLayout,
  HomeLayoutContent,
  HomeLayoutContentCard,
  HomeLayoutHeader,
  HomeLayoutTitle,
} from '@/components/home-layout';

export function EvaluationsHome() {
  return (
    <HomeLayout>
      <HomeLayoutHeader>
        <HomeLayoutTitle>Evaluations</HomeLayoutTitle>
      </HomeLayoutHeader>
      <HomeLayoutContent>
        <HomeLayoutContentCard>content here</HomeLayoutContentCard>
      </HomeLayoutContent>
    </HomeLayout>
  );
}
