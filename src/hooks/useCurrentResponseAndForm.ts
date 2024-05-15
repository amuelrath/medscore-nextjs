import { useSearchParams } from "next/navigation";
import { useAllFormVersions } from "@/hooks/useAllFormVersions";

export const useCurrentResponseAndForm = () => {
  const searchParams = useSearchParams();
  const selectedVersionId = searchParams.get("versionId");
  const selectedResponseId = searchParams.get("responseId");

  const { allVersions } = useAllFormVersions();

  const formVersion = allVersions?.find((v) => v.id === selectedVersionId);
  const response = formVersion?.responses.find(
    (r) => r.id === selectedResponseId,
  );

  return {
    formVersion,
    response,
    selectedResponseId,
    selectedVersionId,
  };
};
