import { Main } from "@/components/ui/main";
import { ResponsesContent } from "@/components/(admin)/forms/responses/responses-content";

export function Responses({ formId }: { formId: string }) {
  return (
    <Main>
        <ResponsesContent />
    </Main>
  );
}

