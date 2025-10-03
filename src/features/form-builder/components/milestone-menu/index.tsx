import { useFormBuilderMilestones } from '@/features/form-builder/hooks/use-form-builder-milestones';
import { MilestoneCard } from '@/features/form-builder/components/milestone-menu/milestone-card';
import { SidebarCompetencyContent } from '@/features/form-builder/components/milestone-menu/sidebar-competency-content';
import { Accordion } from '@/components/ui/accordion';
import {
  DirectionAwareContent,
  DirectionAwareDots,
  DirectionAwareTabHeader,
  DirectionAwareTabsProvider,
} from '@/components/ui/direction-aware-carousel';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { COMPETENCIES } from '@/data/competencies-data';

export function MilestoneContent() {
  const { data, isLoading, isError } = useFormBuilderMilestones();

  const [searchValue, setSearchValue] = useState<string>('');
  const isSearching = searchValue.length > 0;

  if (isLoading) return <>loading</>;
  if (!data) return <>no data</>;

  const tabs = [
    {
      id: 0,
      label: 'Patient Care',
      content: (
        <SidebarCompetencyContent
          subcompetencies={data.filter(
            (s) => s.competencyId === COMPETENCIES.PC.id,
          )}
        />
      ),
    },
    {
      id: 1,
      label: 'Medical Knowledge',
      content: (
        <SidebarCompetencyContent
          subcompetencies={data.filter(
            (s) => s.competencyId === COMPETENCIES.MK.id,
          )}
        />
      ),
    },
    {
      id: 2,
      label: 'Interpersonal & Communication Skills',
      content: (
        <SidebarCompetencyContent
          subcompetencies={data.filter(
            (s) => s.competencyId === COMPETENCIES.ICS.id,
          )}
        />
      ),
    },
    {
      id: 3,
      label: 'Practice-Based Learning & Improvement',
      content: (
        <SidebarCompetencyContent
          subcompetencies={data.filter(
            (s) => s.competencyId === COMPETENCIES.PBLI.id,
          )}
        />
      ),
    },
    {
      id: 4,
      label: 'Systems-Based Practice',
      content: (
        <SidebarCompetencyContent
          subcompetencies={data.filter(
            (s) => s.competencyId === COMPETENCIES.SBP.id,
          )}
        />
      ),
    },
    {
      id: 5,
      label: 'Professionalism',
      content: (
        <SidebarCompetencyContent
          subcompetencies={data.filter(
            (s) => s.competencyId === COMPETENCIES.PROF.id,
          )}
        />
      ),
    },
  ];

  return (
    <div className="md:col-span-3 overflow-hidden flex flex-col col-span-1 bg-background">
      <DirectionAwareTabsProvider tabs={tabs}>
        <header className="w-full relative flex flex-row text-center text-sm h-10 mb-4 items-center ">
          <DirectionAwareTabHeader />
          <div className="absolute -bottom-2.5 left-[38%]">
            <DirectionAwareDots />
          </div>
        </header>
        <div className="relative w-full border-t">
          <Input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            variant="transparent"
            placeholder="Search All Milestones . . ."
            size="sm"
            className="pl-8"
          />
          <SearchIcon
            size={12}
            className="absolute left-3 top-[0.7rem] opacity-50"
          />
        </div>
        <hr />
        <div
          className={cn(
            'relative h-[56vh] space-y-4 flex-grow overflow-y-scroll overflow-x-hidden pl-4 pr-2',
            isSearching && 'pt-4',
          )}
        >
          {isSearching ? (
            data.map((s) => {
              const exactMatches = s.milestones.filter(
                (m) =>
                  m.description.includes(searchValue) ||
                  m.name.includes(searchValue),
              );

              return exactMatches.map((m) => (
                <MilestoneCard key={m.id} milestone={m} />
              ));
            })
          ) : (
            <Accordion type="multiple">
              <DirectionAwareContent />
            </Accordion>
          )}
        </div>
      </DirectionAwareTabsProvider>
    </div>
  );
}
