import { useFormValues } from "@/providers/form-values-provider";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

export const useCurrentResponse = () => {
  const { form } = useFormValues();
  const searchParams = useSearchParams();
  const selectedVersionId = searchParams.get("versionId");
  const selectedResponseId = searchParams.get("responseId");

  const { data: allVersions, isLoading } = trpc.forms.versions.useQuery(
    { formId: form.id as string },
    { enabled: !!selectedVersionId },
  );

  const formVersion = allVersions?.find((v) => v.id === selectedVersionId);
  const response = formVersion?.responses.find(
    (r) => r.id === selectedResponseId,
  );

  return {
    formVersion,
    response,
    selectedResponseId,
    selectedVersionId,
    isLoading,
  };
};
