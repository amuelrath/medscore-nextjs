import { Sidebar } from "@/components/(admin)/forms/responses/common/sidebar";
import { MainContent } from "@/components/(admin)/forms/responses/common/main-content";
import { OverallResponseData } from "@/components/(admin)/forms/responses/common/overall-response-data";

export function ResponseSummary() {
  return (
    <main className="flex h-full flex-row">
      <Sidebar />
      <div className="flex h-full w-full flex-col">
        <div className="flex h-full w-full flex-row space-x-4 pb-12 p-4">
          <MainContent />
          <div className="flex flex-grow flex-col space-y-12 pt-[22.5px]">
            <OverallResponseData />

          </div>
        </div>
      </div>
    </main>
  );
}
