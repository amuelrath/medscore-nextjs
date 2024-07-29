import React from "react";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { Separator } from "@/components/ui/separator";
import { getColorFromNormal } from "@/lib/helpers/get-color-from-normal";

type SubcompetencyScoreProps = {
  subcompetencyScoreData: {
    id: string;
    name: string;
    abbrevName: string;
    percentScore: number;
  }[];
};

export function SubcompetencyScoreOverview({
  subcompetencyScoreData,
}: SubcompetencyScoreProps) {
  return (
    <div className="flex select-none flex-col space-y-2 p-4 overflow-y-scroll h-full">
      {subcompetencyScoreData.map((scd) => (
        <EnhancedTooltip
          delay={0}
          key={scd.id}
          description={`${(scd.percentScore * 100).toFixed(1)}%`}
        >
          <div className="space-y-1">
            <div className="grid grid-cols-5 place-items-center gap-2">
              <div className="col-span-1 flex h-full flex-row items-center space-x-2">
                <p className="text-nowrap text-sm font-semibold">
                  {scd.abbrevName}
                </p>
                <Separator orientation="vertical" className="w-[0.5px]" />
              </div>
              <p className="col-span-4 text-xs text-neutral-500">{scd.name}</p>
            </div>
            <div className="relative pt-1">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-2 w-full rounded-md bg-gray-200">
                  <div
                    className="h-2 rounded-md transition-all"
                    style={{
                      width: `${scd.percentScore * 100}%`,
                      backgroundColor: getColorFromNormal(scd.percentScore),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </EnhancedTooltip>
      ))}
    </div>
  );
}
