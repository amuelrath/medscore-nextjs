import { useFormValues } from "@/providers/form-values-provider";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

// must be in the editor to use
export function useFormVersions() {
  const { form } = useFormValues();
  const searchParams = useSearchParams();
  const selectedVersionIdParam = searchParams.get("versionId");

  const { data: allVersions, isLoading } = trpc.forms.versions.useQuery({
    formId: form.id,
  });

  const selectedVersionId = selectedVersionIdParam?.toString() || "";

  return { allVersions, isLoading, selectedVersionId };
}
