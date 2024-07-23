import { useAtomValue } from "jotai/index";
import { selectedResponseIdAtom } from "@/store/form-atoms";
import { useQuery } from "@tanstack/react-query";
import { getResponse } from "@/server/actions/responses/get-response";

export default function useGetSelectedResponseAnswers() {
  const selectedResponseId = useAtomValue(selectedResponseIdAtom);
  const { data: response, isLoading, isError, ...rest } = useQuery({
    queryKey: ["response", selectedResponseId, "answers"],
    queryFn: () => getResponse(selectedResponseId!), // only query when defined
    enabled: !!selectedResponseId,
  });

  return { response, isLoading, isError, ...rest }
}