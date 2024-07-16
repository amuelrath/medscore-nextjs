import { ResponseSelectSidebar } from "@/components/(admin)/forms/responses/response-select-sidebar";
import { ResponseHeader } from "@/components/(admin)/forms/responses/response-header";
import { MainContent } from "@/components/(admin)/forms/responses/main-content";
import { CompetencyRadarChart } from "@/components/(admin)/forms/responses/competency-radar-chart";
import { PreviousResponsesCard } from "@/components/(admin)/forms/responses/previous-responses-card";


export function ResponseSummary({ formId }: { formId: string }) {
  return (
    <main className="flex h-full flex-row pb-8">
      <ResponseSelectSidebar formId={formId} />
      <div className="flex h-full w-full flex-col pb-14">
        <ResponseHeader />
        <div className="flex h-full w-full flex-row space-x-4 p-4">
          <MainContent />
          <div className="flex flex-grow flex-col space-y-4 pt-[31px]">
            <CompetencyRadarChart />
            <PreviousResponsesCard />
          </div>
        </div>
      </div>
    </main>
  );
}
