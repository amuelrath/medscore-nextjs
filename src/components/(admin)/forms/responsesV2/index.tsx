import { Main } from "@/components/ui/main";
import { ResponseProvider} from "@/components/(admin)/forms/providers/response-provider";
import { ResponsesContent } from "@/components/(admin)/forms/responsesV2/responses-content";

export function ResponsesV2({ formId }: { formId: string }) {
  return (
    <Main>
      <ResponseProvider formId={formId}>
        <ResponsesContent />
      </ResponseProvider>
    </Main>
  );
}

