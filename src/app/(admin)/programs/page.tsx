import {
  HomeLayout,
  HomeLayoutContent,
  HomeLayoutHeader,
  HomeLayoutTitle,
} from '@/components/ui/home-layout';

export default function ProgramsHomePage() {
  return (
    <HomeLayout>
      <HomeLayoutHeader>
        <HomeLayoutTitle>My Program</HomeLayoutTitle>
      </HomeLayoutHeader>
      <HomeLayoutContent>content here</HomeLayoutContent>
    </HomeLayout>
  );
}
