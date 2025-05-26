import { DiscussionContent } from '@/components/(admin)/forms/form-builder/assessment-sidebar/discussion-content';
import { MetricsContent } from '@/components/(admin)/forms/form-builder/assessment-sidebar/metrics-content';
import {
  DirectionAwareContent,
  DirectionAwareTabs,
  DirectionAwareTabsProvider,
} from '@/components/ui/direction-aware-tabs';


const tabs = [
  {
    id: 0,
    label: 'Metrics',
    content: <MetricsContent />,
  },
  {
    id: 1,
    label: 'Discussion',
    content: <DiscussionContent />,
  },
];

export function AssessmentSidebar() {
  return (
    <aside className="col-span-3 bg-white border-l flex-grow h-[calc(100vh-40px)]">
      <header className="grid grid-cols-3 px-2 items-center h-14 p-4">
        <p className="col-start-2 col-span-1 text-lg text-center font-semibold">
          Assessment
        </p>
      </header>
      <DirectionAwareTabsProvider bubbleId="assessment-sidebar" tabs={tabs}>
        <DirectionAwareTabs />
        <DirectionAwareContent />
      </DirectionAwareTabsProvider>
    </aside>
  );
}
