"use client";

import { ResponseSidebar } from "@/components/(admin)/forms/responsesV2/response-sidebar";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { useResponseContext } from "@/components/(admin)/forms/providers/response-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponseCard } from "@/components/(admin)/forms/responsesV2/response-card";
import { VersionSelectChart } from "@/components/(admin)/forms/responsesV2/version-average-chart";
import { formatDate } from "date-fns";

interface Grouped<T> {
  [key: string]: T[];
}

export function InfoSidebar() {
  const { versions, selectedResponseId, setSelectedResponseId } =
    useResponseContext();

  // Flatten all responses from all versions
  const allResponses = versions.flatMap((version) =>
    version.responses.map((response) => ({
      ...response,
      versionTitle: version.title,
    })),
  );

  // Group responses by formVersionId
  const groupedResponses: Grouped<(typeof allResponses)[0]> =
    allResponses.reduce(
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
    <ResponseSidebar>
      <VersionSelectChart formId={versions[0].formId} />
      <ScrollArea className="h-[54vh]">
        {sortedVersionIds.map((versionId) => {
          const versionResponses = groupedResponses[versionId];
          const versionTitle = versionResponses[0].versionTitle; // TODO allow user to change title of a form version?
          const versionDate =  formatDate(versionResponses[0].createdAt, "MMMM d, yyyy")

          return (
            <div key={versionId}>
              <hr />
              <h3 className="mt-4 mb-1 text-center text-xl font-extrabold drop-shadow-lg text-neutral-700">
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
                    <p className="mt-1 text-xs text-gray-500">
                    </p>
                  </div>
                ))}
            </div>
          );
        })}
      </ScrollArea>
    </ResponseSidebar>
  );
}

// TODO get the actual level of the subcompetency? Or at least do this in the report.
function ResponseCardRadialChart() {
  const data = [
    {
      competency: "ICS",
      A: 32,
    },
    {
      competency: "SBP",
      A: 65,
    },
    {
      competency: "P",
      A: 23,
    },
    {
      competency: "MK",
      A: 96,
    },
    {
      competency: "PC",
      A: 44,
    },
    {
      competency: "PBLI",
      A: 77,
    },
  ];

  return (
    <ResponsiveContainer
      className={
        "opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      }
      width={"100%"}
      height={"100%"}
    >
      <RadarChart data={data}>
        <PolarAngleAxis className={"text-2xs"} dataKey="competency" />
        <PolarGrid />
        <Radar
          dataKey={"A"}
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
