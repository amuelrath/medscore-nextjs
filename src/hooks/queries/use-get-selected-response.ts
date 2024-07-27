import { useAtomValue } from "jotai/index";
import { selectedResponseIdAtom } from "@/store/form-atoms";
import { useQuery } from "@tanstack/react-query";
import { getResponse } from "@/server/actions/responses/get-response";

export default function useGetSelectedResponse() {
  const selectedResponseId = useAtomValue(selectedResponseIdAtom);
  const { data: response, isLoading, isError, ...rest } = useQuery({
    queryKey: ["response", selectedResponseId, "answers"],
    queryFn: () => getResponse(selectedResponseId!), // only query when defined
    enabled: !!selectedResponseId,
    staleTime: 1000 * 60 * 10 // 10 min
  });

  return { selectedResponseId, response, isLoading, isError, ...rest }
}