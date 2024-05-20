import { useFormValues } from "@/providers/form-values-provider";
import { trpc } from "@/app/_trpc/client";
import { useMemo } from "react";

// must be in the editor to use
export function useAllFormVersionsSuspenseQueryResult() {
  const { form } = useFormValues();

  const unmemoizedAllVersions = trpc.forms.versions.useSuspenseQuery({
    formId: form.id,
  })[1].data;

  const versions = useMemo(
    () => unmemoizedAllVersions,
    [unmemoizedAllVersions],
  );

  return { versions };
}
