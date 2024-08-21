import { formTypeColors } from "@/components/(admin)/forms/home/create-form-dialog";
import { formTypeIcon } from "@/components/(admin)/forms/home/form-card";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CountdownTimer } from "@/components/ui/countdown";
import { TFormType, TResponseStatus } from "@/db/schema";
import { getInitials } from "@/lib/get-initials";
import { getFullName } from "@/lib/helpers/getFullName";
import { cn } from "@/lib/helpers/utils";
import { truncate } from "@/lib/truncate";
import { RequestsResult } from "@/server/actions/assessments/get-all-requests";
import { ArrowRightIcon, ClipboardListIcon, ClockIcon } from "lucide-react";
import { ReactNode } from "react";
import { Pie, PieChart } from "recharts";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ResponseProps {
  responseId: string;
  formTitle: string;
  formType: TFormType;
  responseCreatedAt: Date;
  status: "COMPLETED" | "STARTED" | "NOT_STARTED";
  evaluateeName?: string;
  assessmentExpiresAt: Date;
}

export function ResponseTable({ children }: { children: ReactNode }) {
  return (
    <Card className="row-span-1 col-span-2 mr-[5px] mt-[1px] relative flex flex-col">
      {children}
    </Card>
  );
}

export function ResponseTableHeader({ children }: { children: ReactNode }) {
  return (
    <span className="flex flex-row w-full min-h-10 max-h-10 items-center border-b border-b-border px-2 overflow-hidden">
      {children}
    </span>
  );
}

export function ResponseTableNotification({ requests }: { requests: number }) {
  if (requests < 0) return <></>;
  return (
    <span className="py-0.5 px-1.5 aspect-square relative rounded-full bg-destructive font-mono text-xs text-white">
      <p className="">{requests}</p>
    </span>
  );
}

export function ResponseTableContent({ children }: { children: ReactNode }) {
  return (
    <ul className="flex-grow relative overflow-y-scroll mb-[6px] shadow-inner space-y-4 px-2 py-2">
      {children}
    </ul>
  );
}

export function ResponseTableRow({ ...response }: ResponseProps) {
  const Icon = formTypeIcon[response.formType];

  return (
    <li className="grid grid-cols-12 h-14 mb-2 select-none hover:border-border border border-transparent rounded-md p-2 transition">
      <span
        className={cn(
          "col-span-1 h-full justify-center flex flex-col",
          response.status === "COMPLETED" && "grayscale",
        )}
      >
        <Icon
          size={12}
          className={cn(
            formTypeColors[response.formType].text,
            formTypeColors[response.formType].border,
            "p-2 rounded-full size-8",
          )}
        />
      </span>
      <span className="col-span-6  h-full flex flex-col justify-center">
        <p className="text-sm font-medium text-nowrap text-left">
          {truncate(response.formTitle, 40)}
        </p>
        <p className="text-sm text-nowrap items-center text-left text-neutral-500">
          <span className="flex flex-row space-x-1 items-center">
            <ClockIcon className="text-neutral-400" size={14} />
            <CountdownTimer
              targetDate={response.assessmentExpiresAt}
              showSeconds={false}
            />
          </span>
        </p>
      </span>
      <span className="col-span-2 h-full flex flex-row justify-start items-center">
        <Avatar
          className="hover:scale-125 transition"
          tooltip={response.evaluateeName}
          content={getInitials(response.evaluateeName)}
        />
      </span>
      <span className="col-span-3 h-full flex items-center justify-end">
        <Button
          className={cn(
            "text-center bg-card hover:bg-primary/5 text-foreground border border-border overflow-hidden origin-center",
          )}
          variant="expandIcon"
          Icon={ArrowRightIcon}
          iconPlacement="right"
          size="xs"
        >
          <p>
            {(() => {
              switch (response.status) {
                case "COMPLETED":
                  return "Review";
                case "NOT_STARTED":
                  return "Begin";
                case "STARTED":
                  return "Resume";
              }
            })()}
          </p>
        </Button>
      </span>
    </li>
  );
}

const chartConfig = {
  COMPLETED: {
    label: "Completed",
    color: "hsl(var(--accent-secondary)",
  },
  STARTED: {
    label: "Started",
    color: "#f59e0b",
  },
  NOT_STARTED: {
    label: "Not Started",
    color: "#525252",
  },
} satisfies ChartConfig;

type AssessmentStatusPieChartData = {
  status: TResponseStatus;
  count: number;
}[];

export function AssessmentStatusPieChart({
  data,
}: {
  data: AssessmentStatusPieChartData;
}) {
  return (
    <ChartContainer config={chartConfig} className="min-w-[50px] min-h-[50px]">
      <PieChart
        margin={{
          bottom: 12,
          right: 13,
        }}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie data={data} dataKey="count" nameKey="status" innerRadius={7} />
      </PieChart>
    </ChartContainer>
  );
}

const getFill = (status: string) => {
  switch (status) {
    case "STARTED":
      return "hsl(var(--accent)";
    case "NOT_STARTED":
      return "hsl(var(--primary))";
    case "COMPLETED":
      return "hsl(var(--accent-secondary)";
  }
};
const transformStatusData = (
  responses: RequestsResult[0]["responses"],
): AssessmentStatusPieChartData => {
  const statusCounts = responses.reduce(
    (acc, response) => {
      acc[response.status] = (acc[response.status] || 0) + 1;
      return acc;
    },
    {} as Record<TResponseStatus, number>,
  );

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status as TResponseStatus,
    fill: getFill(status),
    count,
  }));
};

interface AssessmentRequestTableRowProps {
  request: RequestsResult[0];
}

export function AssessmentRequestTableRow({
  request,
}: AssessmentRequestTableRowProps) {
  const uniqueRespondees = new Map(
    request.responses.map((r) => [
      getFullName(r.respondee),
      {
        content: getInitials(getFullName(r.respondee)),
        tooltip: getFullName(r.respondee),
        className: "bg-primary",
      },
    ]),
  );

  const requestedRespondeeAvatarData = Array.from(uniqueRespondees.values());

  return (
    <li className="grid grid-cols-12 h-14 mb-2 select-none hover:border-border border border-transparent rounded-md py-2 ml-1.5 pr-2 transition">
      <div
        className={cn(
          "col-span-1 h-full items-start justify-center flex flex-col",
        )}
      >
        <AssessmentStatusPieChart
          data={transformStatusData(request.responses)}
        />
      </div>
      <span className="col-span-3 h-full flex flex-col justify-center">
        <p className="text-sm font-medium text-nowrap text-left">
          {truncate(request.title, 18)}
        </p>
        <p className="text-sm text-nowrap items-center text-left mb-3 text-neutral-500">
          <span className="flex flex-row space-x-1 items-center">
            <ClipboardListIcon className="text-neutral-400" size={14} />
            <p>{truncate(request.form.title, 18)}</p>
          </span>
        </p>
      </span>
      <span className="col-span-3 h-full flex flex-col justify-end">
        <p className="text-sm text-nowrap items-center text-left mb-3 text-neutral-500">
          <span className="flex flex-row space-x-1 items-center">
            <ClockIcon className="text-neutral-400" size={14} />
            <CountdownTimer
              targetDate={request.expiresAt}
              showSeconds={false}
            />
          </span>
        </p>
      </span>
      <span className="col-span-2 h-full pb-3 flex flex-row justify-start items-center">
        <AvatarStack avatars={requestedRespondeeAvatarData} />
      </span>
      <span className="col-span-3 h-full space-x-2 flex items-center justify-end">
        <Button
          className={cn(
            "text-center mb-3 bg-card hover:bg-primary/5 text-foreground border border-border overflow-hidden origin-center",
          )}
          variant="expandIcon"
          Icon={ArrowRightIcon}
          iconPlacement="right"
          size="xs"
        >
          <p>Details</p>
        </Button>
       <AssessmentRequestPopover assessmentId={request.id} />
      </span>
    </li>
  );
}


function AssessmentRequestPopover({ assessmentId }: { assessmentId: string }) {

  // const { mutate: cancelAssessmentMutation } = useMutation({})
  // const { mutate: deleteAssessmentMutation } = useMutation({})

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className={cn(
            "text-center mb-3 bg-card hover:bg-primary/5 text-foreground border border-border overflow-hidden origin-center",
          )}
          size="xs"
        >
          <DotsHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>

      </PopoverContent>
    </Popover>
  )

}