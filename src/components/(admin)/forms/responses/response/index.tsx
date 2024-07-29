"use client";
import { useAtomValue } from "jotai";
import { selectedResponseIdAtom } from "@/store/form-atoms";
import { TFormItemType } from "@/db/schema";
import { isBefore } from "date-fns";
import useGetSelectedResponse from "@/hooks/queries/use-get-selected-response";
import { Xwrapper } from "react-xarrows";
import { useMemo, useRef } from "react";
import { useFormResultInEditor } from "@/hooks/queries/use-form-result-in-editor";
import { getFullName } from "@/lib/helpers/getFullName";
import { AnswerCard } from "@/components/(admin)/forms/responses/response/answer-card";
import { CommentCard } from "@/components/(admin)/forms/responses/response/comment-card";

export function Response() {
  const selectedResponseId = useAtomValue(selectedResponseIdAtom);
  const { response } = useGetSelectedResponse();
  const { formResult } = useFormResultInEditor();
  //const updateXarrow = useXarrow();
  const scrollRef = useRef<HTMLDivElement>(null);

  const answers = useMemo(
    () =>
      response?.answers
        .sort((a, b) => a.formItem.position - b.formItem.position)
        .filter((a) =>
          isBefore(new Date(a.formItem.createdAt), response.createdAt),
        )
        .filter((a) => a.formItem.type !== "HEADER"),
    [response],
  );

  const evaluatorName = useMemo(
    () =>
      getFullName(
        formResult?.programs.users.find(
          (u) => u.user.id === response?.creatorId,
        )?.user,
      ),
    [formResult?.programs.users, response?.creatorId],
  );

  if (!formResult) return <>form not found</>;
  if (!response) return <>no selected res.</>;

  if (!evaluatorName) return <>error finding evaluator</>;

  return (
    <Xwrapper>
      <div
        ref={scrollRef}
        className="ml-[4px] mr-[2px] mt-[2px] grid h-[78vh] grid-cols-3 gap-x-4 overflow-y-scroll p-4 pt-4"
      >
        <div key={selectedResponseId} className="col-span-2 space-y-4">
          {answers?.map((ans) => {
            const validOptions = ans.formItem.options.filter((o) =>
              isBefore(new Date(o.createdAt), response.createdAt),
            );

            return (
              <div id={ans.id} key={ans.id}>
                <AnswerCard
                  id={ans.formItem.id}
                  text={ans.formItem.text}
                  type={ans.formItem.type as TFormItemType}
                  options={validOptions.map((o) => ({
                    ...o,
                    isSelected: !!ans.selectedOptionIds?.includes(o.id),
                  }))}
                  textValue={ans.textValue}
                />
              </div>
            );
          })}
        </div>
        <div className="relative col-span-1 rounded-md bg-primary/5">
          {answers
            ?.filter((a) => a.formItem.type !== "WRITTEN")
            .map(
              (ans) =>
                ans.textValue && (
                  <CommentCard
                    key={ans.id}
                    evaluatorName={evaluatorName}
                    id={`comment-${ans.id}`}
                    text={ans.textValue}
                    answerId={ans.formItem.id}
                  />
                ),
            )}
        </div>
      </div>
    </Xwrapper>
  );
}

