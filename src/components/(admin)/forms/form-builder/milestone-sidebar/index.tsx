import { SidebarCompetencyContent } from '@/components/(admin)/forms/form-builder/milestone-sidebar/sidebar-competency-content';
import { SearchContent } from '@/components/(admin)/forms/form-builder/milestone-sidebar/sidebar-search-content';
import { Accordion } from '@/components/ui/accordion';
import {
  DirectionAwareContent,
  DirectionAwareDots,
  DirectionAwareTabHeader,
  DirectionAwareTabsProvider,
} from '@/components/ui/direction-aware-carousel';
import { COMPETENCIES } from '@/lib/constants/common';
import { getSubcompetencies } from '@/server/actions/forms/get-subcompetencies';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export function useFormBuilderMilestones() {
  // First we should get the form's id from search params
  const params = useParams();
  const formId = params.formId.toString();

  // Get the subcompetency data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['milestones', formId], // TODO use specialty id instead of formId
    queryFn: () => getSubcompetencies({ formId }),
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  return { data, isLoading, isError };
}

export function FormBuilderMilestoneMenu() {
  const { data, isLoading, isError } = useFormBuilderMilestones();

  if (isLoading) return <>loading</>;
  if (!data) return <>no data</>;

  const tabs = [
    {
      id: 0,
      label: 'Search',
      content: <SearchContent subcompetencies={data} />,
    },
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
    <div className="md:col-span-3 overflow-hidden flex flex-col p-2 col-span-1 bg-background border-l">
      <DirectionAwareTabsProvider tabs={tabs}>
        <header className="w-full relative flex flex-row text-center px-2 h-14 mb-4 items-center ">
          <DirectionAwareTabHeader />
          <div className="absolute -bottom-2.5 left-[38%]">
            <DirectionAwareDots />
          </div>
        </header>
        <hr />
        <div className="max-h-[490px] flex-grow overflow-y-scroll overflow-x-hidden">
          {/* TODO make this responsive!! */}
          <Accordion type="multiple">
            <DirectionAwareContent />
          </Accordion>
        </div>
      </DirectionAwareTabsProvider>
    </div>
  );
}
