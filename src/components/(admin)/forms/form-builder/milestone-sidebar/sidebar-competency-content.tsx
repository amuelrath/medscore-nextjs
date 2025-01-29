import { MilestoneCard } from '@/components/(admin)/forms/form-builder/milestone-sidebar/milestone-card';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SubcompetencyResult } from '@/server/actions/forms/get-subcompetencies';

export function SidebarCompetencyContent({
  subcompetencies,
}: {
  subcompetencies: SubcompetencyResult;
}) {
  return (
    <div className="relative flex-grow">
      {subcompetencies
        .sort((a, b) => a.level - b.level)
        .map((s) => (
          <AccordionItem value={s.id}>
            <AccordionTrigger className="flex flex-row items-center space-x-6">
              <span className="size-6 text-xs flex items-center flex-row justify-center aspect-square rounded-full border text-black/90">
                {s.level}
              </span>
              <p className="text-xs text-left text-black/90  flex-grow">{s.name}</p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {s.milestones.map((m) => (
                  <MilestoneCard key={m.id} milestone={m} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </div>
  );
}
