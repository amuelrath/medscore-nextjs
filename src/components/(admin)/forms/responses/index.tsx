import { Sidebar } from "@/components/(admin)/forms/responses/common/sidebar";
import { MainContent } from "@/components/(admin)/forms/responses/common/main-content";
import { ResponseInformationCard } from "@/components/(admin)/forms/responses/common/response-information-card";
import { ActiveAssessmentsCard } from "@/components/(admin)/forms/responses/common/active-assessments-card";

export function ResponseSummary() {
  return (
    <main className="flex h-full flex-row">
      <Sidebar />
      <div className="grid w-full gap-4  pb-7  mx-4 mt-4 grid-cols-8">
        <div className="col-span-6">
          <MainContent />
        </div>
        <div className="col-span-2 flex  flex-col space-y-4">
          <ResponseInformationCard />
          <ActiveAssessmentsCard />
        </div>
      </div>
    </main>
  );
}
