"use client";
import React, { RefObject, useState } from "react";
import Masonry from "react-masonry-css";
import { ResponseResult } from "@/server/actions/responses/get-response";
import { SubcompetencyResult } from "@/server/actions/forms/get-subcompetencies";
import { TFormItemType } from "@/db/schema";
import { isBefore } from "date-fns";
import { cn } from "@/lib/helpers/utils";
import { ChevronUp } from "lucide-react";
import { m } from "framer-motion";
import { AnswerCard } from "@/components/(admin)/forms/responses/response/answer-card";

const MotionChevronUp = m(ChevronUp);

interface SubcompetencyQuestionsProps {
  subcompetencyId: string;
  subcompetencies: SubcompetencyResult;
  response: ResponseResult;
}

export function SubcompetencyQuestions({
  response,
  subcompetencies,
  subcompetencyId,
}: SubcompetencyQuestionsProps) {
  const [open, setOpen] = useState<boolean>(false);


  const subcompetency = subcompetencies.find((sc) => sc.id === subcompetencyId);
  if (!subcompetency)
    throw new Error(
      `Tried rendering questions for a subcompetency that doesn't exist: ${subcompetencyId}`,
    );

  const subcompetencyMilestoneIds = subcompetency.milestones
    .map((m) => m.id)
    .filter((id): id is string => id !== null);

  const subcompetencyQuestions = response.answers.filter((a) =>
    a.formItem.milestones.some((m) =>
      subcompetencyMilestoneIds.includes(m.milestoneId),
    ),
  );

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
  };

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "sticky top-[33px] z-10 rounded select-none bg-white transition-all",
          open
            ? "[box-shadow:0_8px_12px_1px_rgba(0,0,0,.05)]  scale-[102%] rounded-b"
            : "scale-[100%]",
        )}
      >
        <div
          onMouseDown={() => setOpen(!open)}
          className="flex cursor-pointer flex-row items-center justify-between pr-4"
        >
          <h2 className="px-2 py-1 text-md font text-neutral-600">
            {`${subcompetency.competencies.name} ${subcompetency.level}: ${subcompetency.name}`}
          </h2>
          <MotionChevronUp
            className="rounded-lg opacity-50 transition-colors hover:text-neutral-500"
            size={24}
            animate={{ rotate: open ? 180 : 0 }}
          />
        </div>
      </div>
      <m.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.2, delay: open ? 0.1 : 0 },
        }}
        className="overflow-hidden"
      >
        <div >
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto rounded-md bg-primary/5"
            columnClassName="bg-clip-padding pt-2"
          >
            {subcompetencyQuestions
              .sort((a, b) => a.formItem.position - b.formItem.position)
              .filter((a) =>
                isBefore(new Date(a.formItem.createdAt), response.createdAt),
              )
              .filter((a) => a.formItem.type !== "HEADER")
              .map((ans) => {
                const validOptions = ans.formItem.options.filter((o) =>
                  isBefore(new Date(o.createdAt), response.createdAt),
                );

                const milestoneIds = ans.formItem.milestones.map(
                  (m) => m.milestoneId,
                );
                const milestones = subcompetencies
                  .flatMap((sc) => sc.milestones)
                  .filter((m) => milestoneIds.includes(m.id));

                return (
                  <div key={ans.formItem.id} className="mx-2 mb-4">
                    <AnswerCard
                      id={ans.formItem.id}
                      text={ans.formItem.text}
                      type={ans.formItem.type as TFormItemType}
                      options={validOptions.map((o) => ({
                        ...o,
                        isSelected: !!ans.selectedOptionIds?.includes(o.id),
                      }))}
                      textValue={ans.textValue}
                      milestones={milestones}
                      noBorder
                    />
                  </div>
                );
              })}
          </Masonry>
        </div>
      </m.div>
    </div>
  );
}
