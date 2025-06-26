import {
  HomeLayout,
  HomeLayoutContent,
  HomeLayoutHeader,
  HomeLayoutTitle,
} from '@/components/ui/home-layout';

export default function EvaluateHomePage() {
  return (
    <HomeLayout>
      <HomeLayoutHeader>
        <HomeLayoutTitle>Evaluations</HomeLayoutTitle>
      </HomeLayoutHeader>
      <HomeLayoutContent>content here</HomeLayoutContent>
    </HomeLayout>
  );
}
