import { Sidebar } from "@/components/(admin)/forms/responses/common/sidebar";
import { MainContent } from "@/components/(admin)/forms/responses/common/main-content";
import { ResponseInformationCard } from "@/components/(admin)/forms/responses/common/response-information-card";
import { AssessmentDisplay } from "@/components/(admin)/forms/responses/common/assessment-display";

export function ResponseSummary() {
  return (
    <main className="flex h-full flex-row">
      <Sidebar />
      <div className="grid w-full gap-4 pb-7  mx-4 mt-4 grid-cols-8">
        <div className="col-span-6">
          <MainContent />
        </div>
        <div className="col-span-2 flex flex-col space-y-4">
          <ResponseInformationCard />
          <AssessmentDisplay />
        </div>
      </div>
    </main>
  );
}
