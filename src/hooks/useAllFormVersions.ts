import { useFormValues } from "@/providers/form-values-provider";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { useMemo } from "react";

// must be in the editor to use
export function useAllFormVersions() {
  const { form } = useFormValues();
  const searchParams = useSearchParams();
  const selectedVersionIdParam = searchParams.get("versionId");

  const unmemoizedAllVersions = trpc.forms.versions.useSuspenseQuery({
    formId: form.id,
  })[1].data;

  const selectedVersionId = selectedVersionIdParam?.toString() || "";

  const allVersions = useMemo(
    () => unmemoizedAllVersions,
    [unmemoizedAllVersions],
  );

  return { allVersions, selectedVersionId };
}
