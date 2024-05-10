import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import SelectedFormVersionsProvider from "@/providers/selected-form-version-provider";
import { FormResponsesSidebar } from "@/components/(admin)/forms/navs/form-responses-sidebar";
import { ResponseEditor } from "@/components/(admin)/forms/responses/response-editor";
import SelectedResponseIdProvider from "@/providers/selected-response-id-provider";
// TODO Add Skeleton Loaders
export default function Responses() {
  return (
    <div className={cn("mt-6")}>
      <SelectedFormVersionsProvider>
        <SelectedResponseIdProvider>
          <FormResponsesSidebar />
          <Card className={cn("ml-[25.5%] h-[570px] bg-background")}>
            <ResponseEditor />
          </Card>
        </SelectedResponseIdProvider>
      </SelectedFormVersionsProvider>
    </div>
  );
}
