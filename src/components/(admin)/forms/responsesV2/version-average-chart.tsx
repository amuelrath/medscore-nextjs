import {
  DotProps,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getOverallResponsePerformance } from "@/server/actions/views/get-overall-response-performance";
import { StudentPerformanceView } from "@/db/schema";
import { formatDate } from "date-fns";

export function VersionAverageChart({
  formId,
}: {
  formId: string
}) {
  const { data: view } = useQuery({
    queryKey: ["performance-view", formId],
    queryFn: () => getOverallResponsePerformance({ formId }),
    enabled: !!formId,
  });

  const data = useMemo(() => {
    return transformStudentPerformanceData(view);
  }, [view]);

  const yValues = data?.map((item) => item.y) || [];
  const minY = yValues.length > 0 ? Math.min(...yValues) + 5 : 0;
  const maxY = yValues.length > 0 ? Math.max(...yValues) : 100;

  return (
    <div className="relative -mt-6">
      <ResponsiveContainer width={"100%"} height={175}>
        <LineChart data={data} margin={{ left: 20, right: 20, top: 30 }}>
          <XAxis
            dataKey="x"
            className={"text-2xs"}
            tickFormatter={(value) =>
              formatDate(new Date().setTime(value), "MMM dd")
            }
          />
          <YAxis
            hide
            domain={[minY, maxY]}
            tickFormatter={(value) => `${value.toFixed(2)}%`}
            className="text-2xs"
          />
          <Tooltip
            labelClassName={"text-xs"}
            wrapperClassName={"rounded-lg text-xs"}
            labelFormatter={(value) =>
              `${formatDate(new Date(value), "MMM dd, yyyy")}`
            }
            animationEasing={"ease-in-out"}
            formatter={(value: number, name: string) => {
              if (name === "y") {
                return [`${value.toFixed(1)}%`, "Avg Score"];
              }
              return [value, name];
            }}
          />
          <Line
            className={"drop-shadow-xl"}
            dataKey="y"
            stroke="hsl(170, 79%, 39%)"
            strokeWidth={3.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface Data {
  x: number;
  y: number;
}

function CustomizedDot({
  cx,
  cy,
  payload,
  onClick,
  selected,
}: DotProps & {
  onClick: (value: number) => void;
  selected: number | null;
  payload?: Data;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selected === payload!.x;

  const handleClick = () => {
    onClick(payload!.x);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const dotVariants = {
    selected: { scale: 1.3, transition: { duration: 0.2 } },
    hover: { scale: 0.9, transition: { duration: 0.2 } },
    initial: { scale: 0.6 },
  };

  return (
    <svg
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      x={cx! - 12}
      y={cy! - 12}
      width={100}
      height={100}
    >
      <motion.circle
        layoutId={"inner-circle"}
        cx={12}
        cy={12}
        r={isHovered || isSelected ? 8 : 7.5}
        fill={"hsl(170, 79%, 39%)"}
        variants={dotVariants}
        initial="initial"
        animate={isSelected ? "selected" : isHovered ? "hover" : "initial"}
        className={"cursor-pointer"}
      />
    </svg>
  );
}

interface AggregatedData {
  x: number; // Unix timestamp (milliseconds)
  y: number; // Average score as percentage
}

function transformStudentPerformanceData(
  data: StudentPerformanceView[] | undefined,
): AggregatedData[] | undefined {
  if (!data) return undefined;

  // Step 1: Aggregate data by formVersionId
  const aggregatedByVersion = data.reduce(
    (acc, item) => {
      if (!acc[item.formVersionId]) {
        acc[item.formVersionId] = [];
      }
      acc[item.formVersionId].push(item);
      return acc;
    },
    {} as Record<string, StudentPerformanceView[]>,
  );

  // Step 2 & 3: Order by createdAt and transform
  const transformedData = Object.values(aggregatedByVersion).map(
    (versionData) => {
      // Sort by createdAt
      versionData.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      // Get the latest createdAt for this version
      const latestDate = new Date(
        versionData[versionData.length - 1].createdAt,
      );

      // Calculate average score as percentage
      const totalScores = versionData.reduce((sum, item) => {
        return (
          sum +
          (Number(item.totalPointsEarned) / Number(item.totalPointsAvailable)) *
            100
        );
      }, 0);
      const averageScore = totalScores / versionData.length;

      return {
        x: latestDate.getTime(), // Use Unix timestamp for sorting
        y: Number(averageScore.toFixed(1)), // Round to 1 decimal places
      };
    },
  );

  // Sort the final array by date
  return transformedData.sort((a, b) => a.x - b.x);
}
