import {
  ResponseTable,
  ResponseTableContent,
  ResponseTableHeader,
  ResponseTableNotification,
  ResponseTableRow,
} from "@/components/(admin)/forms/home/response-table";
import LetterPullup from "@/components/ui/letter-pull-up";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getFullName } from "@/lib/helpers/getFullName";
import { getAllUserResponses } from "@/server/actions/responses/get-all-user-responses";
import { useQuery } from "@tanstack/react-query";
import { isBefore } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { HistoryIcon, InboxIcon } from "lucide-react";
import { useState } from "react";

type Tabs = "REQUESTS" | "COMPLETED";

export function IncomingRequests() {
  const { data: responses, isLoading } = useQuery({
    queryKey: ["user", "responses"],
    queryFn: () => getAllUserResponses(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const [activeTab, setActiveTab] = useState<Tabs>("REQUESTS");
  const [search, setSearch] = useState<string | undefined>(undefined);

  if (isLoading || !responses)
    return <Skeleton className="h-full w-full pb-10" />;

  const handleSearch = (value: string | undefined) => {
    setSearch(value?.toLowerCase());
  };

  const now = new Date();
  const requested = responses
    .filter((r) => r.status === "NOT_STARTED" || r.status === "STARTED")
    .filter((r) => isBefore(now, r.assessment.expiresAt))
    .filter(
      (r) =>
        r.assessment.form.title.toLowerCase().includes(search || "") ||
        getFullName(r.evaluatee)
          ?.toLowerCase()
          .includes(search || ""),
    )
    .map((r) => ({
      responseId: r.id,
      formTitle: r.assessment.form.title,
      formType: r.assessment.form.type,
      responseCreatedAt: r.createdAt,
      status: r.status,
      evaluateeName: getFullName(r.evaluatee),
      assessmentExpiresAt: r.assessment.expiresAt,
    }));

  const completed = responses
    .filter((r) => r.status === "COMPLETED")
    .filter(
      (r) =>
        r.assessment.form.title.toLowerCase().includes(search || "") ||
        getFullName(r.evaluatee)
          ?.toLowerCase()
          .includes(search || ""),
    )
    .map((r) => ({
      responseId: r.id,
      formTitle: r.assessment.form.title,
      formType: r.assessment.form.type,
      responseCreatedAt: r.createdAt,
      status: r.status,
      evaluateeName: getFullName(r.evaluatee),
      assessmentExpiresAt: r.assessment.expiresAt,
    }));

  const CompletedRows = completed
    .sort(
      (a, b) => b.responseCreatedAt.getTime() - a.responseCreatedAt.getTime(),
    )
    .map((r) => <ResponseTableRow key={r.responseId} {...r} />);

  const RequestedHeader = (
    <>
      <InboxIcon className="size-5 opacity-70" />
      <LetterPullup
        key={activeTab}
        delay={0.01}
        fontWeight="semibold"
        size="lg"
        words="Incoming Requests"
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
        delay={0.01}
        fontWeight="semibold"
        words="Previous Responses"
      />
    </>
  );

  const RequestedRows = requested.map((r) => (
    <ResponseTableRow key={r.responseId} {...r} />
  ));

  return (
    <ResponseTable>
      <ResponseTableHeader>
        <span className="flex text-md flex-row w-full space-x-2 font-semibold text-neutral-600 items-center">
          {activeTab === "COMPLETED" ? CompletedHeader : RequestedHeader}
        </span>
        <Select
          onValueChange={(val: Tabs) => setActiveTab(val)}
          defaultValue={activeTab}
        >
          <SelectTrigger className="w-12 ring-transparent transition-none focus-visible:ring-transparent focus:ring-transparent border-0 text-xs bg-transparent"></SelectTrigger>
          <SelectContent>
            <SelectItem value="REQUESTS">Incoming Requests</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </ResponseTableHeader>
      <ResponseTableContent>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
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
  );
}

const NoDataRequested = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      {/*<span className="mr-28 -mt-[85px]">*/}
      {/*  <CompletedTodoIllustration height={275} width={275} />*/}
      {/*</span>*/}
      <span className="opacity-80 text-center">
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
    <div className="flex justify-start items-center flex-col">
      {/*<span className="mr-28 -mt-[85px]">*/}
      {/*  <CompletedTodoIllustration height={275} width={275} />*/}
      {/*</span>*/}
      <span className="opacity-80 text-center">
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
