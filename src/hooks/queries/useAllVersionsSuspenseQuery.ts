import { getAllVersions } from "@/server/actions/forms/get-all-versions";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useAllVersionsSuspenseQuery({ formId }: { formId: string }) {
  // query!
  const { data: versions } = useSuspenseQuery({
    queryKey: ["all-versions", formId],
    queryFn: () => getAllVersions({ formId }),
  });
  return { versions };
}
