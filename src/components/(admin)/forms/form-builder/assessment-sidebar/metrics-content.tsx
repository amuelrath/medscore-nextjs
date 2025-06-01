'use client';

import { CompetencyRadarChart } from '@/components/(admin)/forms/form-builder/assessment-sidebar/competency-radar-chart';
import { LevelBarChart } from '@/components/(admin)/forms/form-builder/assessment-sidebar/level-bar-chart';
import { useFormBuilderMilestones } from '@/components/(admin)/forms/form-builder/hooks/use-form-builder-milestones';
import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import {
  isChoiceItem,
  isRangeItem,
  TFormItemSchema,
} from '@/components/(admin)/forms/form-builder/types';
import { COMPETENCIES } from '@/lib/constants/common';
import { SubcompetencyResult } from '@/server/actions/forms/get-subcompetencies';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

export function MetricsContent() {
  const items = useFormBuilderStore(useShallow((state) => state.items));
  const settings = useFormBuilderStore((state) => state.settings);

  const scoringEnabled = settings.enableScoring;

  const {
    data: subcompetencies,
    isLoading,
    isError,
  } = useFormBuilderMilestones();

  const data = useMemo(
    () =>
      getMilestoneDistributionsByPoints({
        items,
        subcompetencies,
        scoringEnabled,
      }),
    [items, scoringEnabled, subcompetencies],
  );
  if (isLoading) return <>x</>;

  return (
    <div className="px-4 space-y-2.5 py-3">
      <div className="border p-2 space-y-2 rounded-sm shadow-sm">
        <p className="text-xs opacity-70 font-medium">Competency Coverage</p>
        <CompetencyRadarChart data={data.competencyDistribution} />
      </div>

      <div className="border p-2 space-y-2 rounded-sm shadow-sm">
        <p className="text-xs opacity-70 font-medium">Level Coverage</p>
        <LevelBarChart data={data.levelDistribution} />
      </div>
      <div className="border p-2 space-y-2 rounded-sm shadow-sm">
        <p className="text-xs opacity-70 font-medium">Total Points</p>
        <p className="text-5xl text-center font-medium">{data.totalPoints}</p>
      </div>
    </div>
  );
}

const getMaxPointsForItem = (item: TFormItemSchema): number => {
  const isChoice = isChoiceItem(item);
  const isRange = isRangeItem(item);

  const canHavePoints = isChoice || isRange;
  if (!canHavePoints) return 0;
  if (!item.isScored) return 0;

  switch (item.type) {
    case 'MULTIPLE_CHOICE':
      if (!item.isScored) return 0;
      return item.options.reduce((acc, curr) => {
        if (curr.isNa) return acc;
        return acc + (curr.pointValue || 0);
      }, 0);

    case 'RANGE':
      if (!item.isScored) return 0;
      return item.maxValue;

    case 'SINGLE_CHOICE':
      // eslint-disable-next-line no-case-declarations
      const validOptions = item.options.filter(
        (o) => !o.isNa && o.pointValue !== null,
      );
      return Math.max(...validOptions.map((o) => o.pointValue!));
    default:
      return 0;
  }
};

const getMilestoneDistributionsByPoints = ({
  items,
  subcompetencies,
  scoringEnabled,
}: {
  items: TFormItemSchema[];
  scoringEnabled: boolean;
  subcompetencies?: SubcompetencyResult;
}) => {
  if (!items || !subcompetencies || !scoringEnabled)
    return {
      levelDistribution: {},
      competencyDistribution: {},
      totalPoints: 0,
    };

  const sortedItems = items.sort();
  const milestones = subcompetencies.flatMap((s) => s.milestones);

  // Filter items that can have points and create a map of item to its max points
  const scorableItems = sortedItems.filter((item) => {
    const isChoice = isChoiceItem(item);
    const isRange = isRangeItem(item);
    return isChoice || isRange;
  });

  const itemPointsMap = new Map(
    scorableItems.map((item) => [item, getMaxPointsForItem(item)]),
  );

  // Create maps for looking up milestone levels and competencies
  const idToSubcompetencyLevelMap = new Map(
    milestones.map((m) => [
      m.id,
      subcompetencies.find((s) => s.id === m.subcompetencyId)!.level,
    ]),
  );

  const idToCompetencyMap = new Map(
    milestones.map((m) => [
      m.id,
      subcompetencies.find((s) => s.id === m.subcompetencyId)!.competencyId,
    ]),
  );

  // Get all milestone IDs and their corresponding levels
  const itemMilestoneMapping = scorableItems.flatMap((item) =>
    (item.milestoneIds || []).map((id) => ({
      points: itemPointsMap.get(item) || 0,
      level: idToSubcompetencyLevelMap.get(id),
      competencyId: idToCompetencyMap.get(id),
    })),
  );

  // Calculate level distribution based on points
  const levelDistribution = itemMilestoneMapping.reduce(
    (acc, { level, points }) => {
      if (level !== undefined) {
        acc[level] = (acc[level] || 0) + points;
      }
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
  );

  // Calculate competency distribution based on points
  const competencyDistribution = itemMilestoneMapping.reduce(
    (acc, { competencyId, points }) => {
      if (competencyId !== undefined) {
        const compName = Object.values(COMPETENCIES).find(
          (v) => v.id === competencyId,
        )!.abbrev;
        acc[compName] = (acc[compName] || 0) + points;
      }
      return acc;
    },
    { PC: 0, MK: 0, PBLI: 0, PROF: 0, SBP: 0, ICS: 0 } as Record<
      string,
      number
    >,
  );

  const totalPoints = Array.from(itemPointsMap.values()).reduce(
    (sum, points) => Number((sum + points).toFixed(2)),
    0,
  );

  return { levelDistribution, competencyDistribution, totalPoints };
};
