"use client";
import { useResponseContext } from "@/components/(admin)/forms/providers/response-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponseCard } from "@/components/(admin)/forms/responses/response-card";
import { VersionAverageChart } from "@/components/(admin)/forms/responses/version-average-chart";
import { formatDate } from "date-fns";
import { Glass } from "@/components/ui/glass";
interface Grouped<T> {
  [key: string]: T[];
}

export function InfoSidebar() {
  const { versions, selectedResponseId, setSelectedResponseId } =
    useResponseContext();

  if (!versions || versions.length === 0) {
    return <div>this error is impossible to see.</div>;
  }

  // Flatten all responses from all versions
  const allResponses = versions.flatMap((version) =>
    version.responses.map((response) => ({
      ...response,
      versionTitle: version.title,
    })),
  );

  if (!allResponses) return <>No Responses to this Form</>;

  // Group responses by formVersionId
  const groupedResponses: Grouped<(typeof allResponses)[0]> =
    allResponses?.reduce(
      (groups, response) => {
        const responseKey = response.formVersionId;
        return {
          ...groups,
          [responseKey]: [...(groups[responseKey] || []), response],
        };
      },
      {} as Grouped<(typeof allResponses)[0]>,
    );

  // Sort formVersionIds based on the latest response in each group
  const sortedVersionIds = Object.keys(groupedResponses).sort((a, b) => {
    const latestA = groupedResponses[a].reduce(
      (latest, response) =>
        response.createdAt > latest ? response.createdAt : latest,
      new Date(0),
    );
    const latestB = groupedResponses[b].reduce(
      (latest, response) =>
        response.createdAt > latest ? response.createdAt : latest,
      new Date(0),
    );
    return latestB.getTime() - latestA.getTime();
  });

  return (
    <Glass className="col-span-2">
      <VersionAverageChart formId={versions[0]?.formId} />
      <ScrollArea className="h-[52vh]">
        {sortedVersionIds.map((versionId) => {
          const versionResponses = groupedResponses[versionId];
          const versionTitle = versionResponses[0].versionTitle; // TODO allow user to change title of a form version?
          const versionDate = formatDate(
            versionResponses[0].createdAt,
            "MMMM d, yyyy",
          );

          return (
            <div key={versionId}>
              <hr />
              <h3 className="mb-1 mt-4 text-center text-xl font-extrabold text-neutral-700 drop-shadow-lg">
                {versionDate}
              </h3>
              {versionResponses
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((response) => (
                  <div className="px-4" key={response.id}>
                    <ResponseCard
                      response={response}
                      isSelected={selectedResponseId === response.id}
                      onSelect={() => setSelectedResponseId(response.id)}
                    />
                    <p className="mt-1 text-xs text-gray-500"></p>
                  </div>
                ))}
            </div>
          );
        })}
      </ScrollArea>
    </Glass>
  );
}
