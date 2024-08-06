import { CompletedTodoIllustration } from "@/components/illustrations/completed-todo-illustration";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserResponses } from "@/server/actions/responses/get-all-user-responses";
import { Skeleton } from "@/components/ui/skeleton";
import { getFullName } from "@/lib/helpers/getFullName";
import {
  ResponseTable,
  ResponseTableContent,
  ResponseTableHeader,
  ResponseTableNotification,
  ResponseTableRow
} from "@/components/(admin)/forms/home/response-table";
import { CircleSlash, HistoryIcon } from "lucide-react";
import LetterPullup from "@/components/ui/letter-pull-up";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";

type Tabs = "REQUESTS" | "COMPLETED";

export function EvaluateSection() {
  const { data: responses, isLoading } = useQuery({
    queryKey: ["user", "responses"],
    queryFn: () => getAllUserResponses(),
    staleTime: 1000 * 60 * 5 // 5 min
  });

  const [activeTab, setActiveTab] = useState<Tabs>("REQUESTS");

  if (isLoading || !responses) return <Skeleton className="h-full pb-10" />;

  const requested = responses
    .filter((r) => r.status === "NOT_STARTED" || r.status === "STARTED")
    .map((r) => ({
      responseId: r.id,
      formTitle: r.assessment.form.title,
      formType: r.assessment.form.type,
      responseCreatedAt: r.createdAt,
      status: r.status,
      evaluateeName: getFullName(r.evaluatee)
    }));

  const completed = responses
    .filter((r) => r.status === "COMPLETED")
    .map((r) => ({
      responseId: r.id,
      formTitle: r.assessment.form.title,
      formType: r.assessment.form.type,
      responseCreatedAt: r.createdAt,
      status: r.status,
      evaluateeName: getFullName(r.evaluatee)
    }));

  const CompletedRows = completed
    .sort(
      (a, b) => b.responseCreatedAt.getTime() - a.responseCreatedAt.getTime()
    )
    .map((r) => <ResponseTableRow key={r.responseId} {...r} />);

  const RequestedHeader = (
    <>
      <CircleSlash className="size-5 opacity-70" />
      <LetterPullup
        key={activeTab}
        fontWeight="semibold"
        size="lg"
        words="Requests"
      />
      <ResponseTableNotification requests={requested.length} />
    </>
  );

  const CompletedHeader = (
    <>
      <HistoryIcon className="size-5 opacity-70" />
      <LetterPullup
        key={activeTab}
        size="lg"
        fontWeight="semibold"
        words="Previous Responses"
      />
    </>
  );

  const RequestedRows = requested.map((r) => (
    <ResponseTableRow key={r.responseId} {...r} />
  ));


  return (
    <div className="h-full pb-10">
      <div className="grid grid-cols-2 gap-4 grid-rows-2 h-full w-full">
        <ResponseTable>
          <ResponseTableHeader>
            <span className="flex text-md flex-row w-full space-x-2 font-semibold text-neutral-600 items-center">
              {activeTab === "COMPLETED" ? CompletedHeader : RequestedHeader}
            </span>

            <Select
              onValueChange={(val: Tabs) => setActiveTab(val)}
              defaultValue={activeTab}
            >
              <SelectTrigger
                className="w-12 ring-transparent transition-none focus-visible:ring-transparent focus:ring-transparent border-0 text-xs bg-white"></SelectTrigger>
              <SelectContent>
                <SelectItem value="REQUESTS">Requested</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </ResponseTableHeader>
          <ResponseTableContent>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "COMPLETED" ? (
                  completed.length > 0 ? (
                    CompletedRows
                  ) : (
                    <NoDataCompleted />
                  )
                ) : requested.length > 0 ? (
                  RequestedRows
                ) : (
                  <NoDataRequested />
                )}
              </motion.div>
            </AnimatePresence>
          </ResponseTableContent>
        </ResponseTable>
      </div>
    </div>
  );
}

const NoDataRequested = () => {
  return (
    <div className="flex-grow relative flex items-center pt-12 flex-col">
      <span className="mr-28">
        <CompletedTodoIllustration height={325} width={325} />
      </span>
      <span className="absolute opacity-80 text-center bottom-6">
        <p className="text-md  font-semibold">You&apos;re all caught up!</p>
        <p className="text-xs text-neutral-500">
          No action required at this time.
        </p>
      </span>
    </div>
  );
};
const NoDataCompleted = () => {
  return (
    <div className="flex-grow relative flex items-center pt-12 flex-col">
      <span className="mr-28">
        <CompletedTodoIllustration height={325} width={325} />
      </span>
      <span className="absolute opacity-80 text-center bottom-4">
        <p className="text-md font-semibold">
          You haven&apos;t responded to any forms.
        </p>
        <p className="text-sm text-neutral-500">
          Submitted responses will appear here.
        </p>
      </span>
    </div>
  );
};