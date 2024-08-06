import { formTypeColors } from "@/components/(admin)/forms/home/create-form-dialog";
import { formTypeIcon } from "@/components/(admin)/forms/home/form-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TFormType } from "@/db/schema";
import { cn } from "@/lib/helpers/utils";
import { truncate } from "@/lib/truncate";
import { formatDate } from "date-fns";
import { ReactNode } from "react";

interface ResponseProps {
  responseId: string;
  formTitle: string;
  formType: TFormType;
  responseCreatedAt: Date;
  status: "COMPLETED" | "STARTED" | "NOT_STARTED";
  evaluateeName?: string;
}

export function ResponseTable({ children }: { children: ReactNode }) {
  return (
    <Card className="row-span-2 mr-[5px] mt-[1px] relative flex flex-col col-span-1">
      {children}
    </Card>
  );
}

export function ResponseTableHeader({ children }: { children: ReactNode }) {
  return (
    <span className="flex flex-row w-full items-center border-b border-b-neutral-300 p-2">
      {children}
    </span>
  );
}

export function ResponseTableNotification({ requests }: { requests: number }) {
  if (requests < 0) return <></>;
  return (
    <span className="py-0.5 px-1 relative rounded-full bg-destructive font-mono text-xs text-white">
      <p className="">{requests}</p>
    </span>
  );
}

export function ResponseTableContent({ children }: { children: ReactNode }) {
  return (
    <ul className="flex-grow overflow-y-scroll mb-[6px] shadow-inner space-y-4 px-2 py-4">
      {children}
    </ul>
  );
}

export function ResponseTableRow({ ...response }: ResponseProps) {
  const Icon = formTypeIcon[response.formType];

  return (
    <li className="grid grid-cols-12 mb-4 select-none hover:border-border border border-transparent rounded-md p-2 transition">
      <span
        className={cn(
          "col-span-2 flex flex-col",
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
      <span className="col-span-7 flex flex-col justify-center">
        <p className="text-xs font-medium text-nowrap text-left">
          {truncate(response.formTitle, 24)}
        </p>
        {
          <p className="text-2xs text-nowrap text-left text-neutral-400">
            {response.status === "COMPLETED" ? (
              <span className="flex flex-row space-x-1">
                <p>{formatDate(response.responseCreatedAt, "MM/dd/yyyy")}</p>
                <Separator orientation="vertical" />
                <p>{truncate(response.evaluateeName || "", 15)}</p>
              </span>
            ) : (
              response.evaluateeName
            )}
          </p>
        }
      </span>
      <span className="col-span-3 flex items-center justify-end">
        <Separator orientation="vertical" className="w-[0.5px]" />
        <Button
          className={cn(
            "w-full text-neutral-600 flex justify-end space-x-1 text-2xs hover:text-neutral-600/80 transition-colors",
          )}
          variant="link"
          size="xs"
        >
          <p className="w-2/3">
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
