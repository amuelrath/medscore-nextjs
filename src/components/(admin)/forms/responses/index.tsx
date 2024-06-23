import { Main } from "@/components/ui/main";
import { ResponseProvider} from "@/components/(admin)/forms/providers/response-provider";
import { ResponsesContent } from "@/components/(admin)/forms/responses/responses-content";

export function Responses({ formId }: { formId: string }) {
  return (
    <Main>
      <ResponseProvider formId={formId}>
        <ResponsesContent />
      </ResponseProvider>
    </Main>
  );
}

