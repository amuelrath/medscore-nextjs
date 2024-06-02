"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { MilestoneIcon } from "lucide-react";
import { Control, useController } from "react-hook-form";
import { TFormRelate } from "@/db/types";
import { useFormValues } from "@/providers/form-values-provider";
import { Separator } from "@/components/ui/separator";
import CIRCLE_ARROW from "public/icons/circle-arrow.json";
import { LottieHover } from "@/components/ui/lottie-hover";
import { Tabs, TabContent, TabsProvider } from "@/components/ui/animated-tabs";
import { COMPETENCIES } from "@/db/constants";
import { Milestone } from "@/db/schema";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MilestoneBadge } from "@/components/(admin)/forms/responses/milestone-badge";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/app/_trpc/client";
import LOADER_DASHES from "public/icons/loader-dashes.json";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import Lottie from "lottie-react";

type Recommendation = {
  questionId: string;
  milestoneId: string;
  justification: string;
  score: string;
} | null;

export function SelectMilestoneDialogTrigger({
  index,
  question,
  control,
}: {
  index: number;
  control: Control<TFormRelate>;
  question: TFormRelate["questions"][0];
}) {
  // access the milestone values controller
  const { field } = useController({
    name: `questions.${index}.milestones`,
    control,
  });

  const { subcompetencies, form } = useFormValues();
  const [selectedSubcompetencyId, setSelectedSubcompetencyId] = useState<
    string | null
  >(null);
  const [values, setValues] = useState<string[] | undefined>(
    field.value.flatMap((m) => m.milestoneId),
  );

  // get the initial recommended milestone, if any
  const [recommenedMilestone, setRecommendedMilestone] =
    useState<Recommendation>(question.recommendedMilestone);

  // if one doesn't exist in the db, generate one
  const { mutateAsync: getRecommendedMilestone, isLoading } =
    trpc.ai.recommendMilestones.useMutation();

  // if the user clicks the regenerate button, generate a new recommendation
  const handleRegenerateClick = async () => {
    const result = await getRecommendedMilestone({
      id: question.id,
      text: question.text || "",
      formTitle: form.title,
    });

    return setRecommendedMilestone(result);
  };

  const handleSubcompetencyClick = (id: string) => {
    setSelectedSubcompetencyId((prevId) => (prevId === id ? null : id));
  };

  const getMilestone = (id: string | undefined) => {
    const allMilestones = subcompetencies.flatMap((sc) => sc.milestones);
    return allMilestones.find((m) => m.id === id);
  };

  const getSubcompetencyMilestones = (id: string) => {
    return subcompetencies.find((sc) => sc.id === id)?.milestones;
  };

  const getNumberOfMilestones = (id: string) => {
    const selectedMilestones = getSubcompetencyMilestones(id)?.filter((m) =>
      values?.includes(m.id),
    );
    return selectedMilestones?.length;
  };

  const handleMilestoneClick = (id: string) => {
    const updatedMilestones = field.value.some((m) => m.milestoneId === id)
      ? field.value.filter((m) => m.milestoneId !== id)
      : [...field.value, { milestoneId: id }];

    field.onChange(updatedMilestones);
    setValues(updatedMilestones.flatMap((m) => m.milestoneId));
  };

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "cursor-pointer rounded-full p-1 opacity-0 transition-all hover:bg-primary hover:text-white group-hover:opacity-100",
        )}
      >
        <MilestoneIcon size={"1rem"} />
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn("flex max-h-[90%] min-w-[75%] flex-col overflow-hidden")}
      >
        <div className={cn("flex h-1/4 flex-row")}>
          <div className={cn("flex flex-1 flex-col justify-between space-y-2")}>
            <div className={cn("flex flex-col")}>
              <p
                className={cn(
                  "text-md text-center font-bold tracking-wide text-gray-400",
                )}
              >
                QUESTION
              </p>

              {question.text ? (
                <p className={cn("px-4 text-center text-2xl")}>
                  <span className={cn("font-extrabold")}>&quot;</span>
                  {question.text}
                  <span className={cn("font-extrabold")}>&quot;</span>
                </p>
              ) : (
                <p className={cn("px-4 text-2xl font-light italic")}>
                  Empty Question
                </p>
              )}
            </div>
            <div className={cn("flex flex-row justify-center space-x-2")}>
              {values &&
                values.map((m) => {
                  const milestone = getMilestone(m);
                  return (
                    <MilestoneBadge
                      key={`badge-${m}`}
                      milestone={milestone as Milestone}
                    />
                  );
                })}
            </div>
          </div>
          <div className={cn("relative mx-4")}>
            <div className={cn("absolute inset-0 flex items-center")}>
              <Separator
                orientation={"vertical"}
                className={cn("w-full border")}
              />
            </div>
          </div>
          <div
            className={cn("flex h-40 flex-1 flex-col items-center space-y-2")}
          >
            <p
              className={cn(
                "text-md w-full text-center font-bold tracking-wide text-gray-400",
                isLoading && "animate-pulse"
              )}
            >
              RECOMMENDED MILESTONE
            </p>
            <AnimatePresence mode={"wait"}>
              {isLoading ? (
                <motion.div
                  layout={"preserve-aspect"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Lottie
                    animationData={LOADER_DASHES}
                    loop={true}
                    autoplay={true}
                    className={cn("size-[116px]")}
                  />
                </motion.div>
              ) : (
                <motion.div
                layout={"preserve-aspect"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("flex flex-col items-center space-y-2")}
                >
                  <div className={cn(" flex flex-row items-center space-x-2")}>
                    <p
                      className={cn(
                        "text-center text-3xl font-bold tracking-wide",
                      )}
                    >
                      {getMilestone(recommenedMilestone?.milestoneId)?.name}
                    </p>
                    <div
                      onClick={() => handleRegenerateClick()}
                      className={cn("size-8 cursor-pointer drop-shadow-lg")}
                    >
                      <LottieHover src={CIRCLE_ARROW} />
                    </div>
                  </div>
                  <p className={cn("px-4 text-center text-sm italic")}>
                    {
                      getMilestone(recommenedMilestone?.milestoneId)
                        ?.description
                    }
                  </p>
                  <div className={cn("flex flex-row space-x-2")}>
                    <div
                      className={cn(
                        "cursor-pointer rounded-full bg-emerald-500 px-2.5 py-0.5 text-white transition-all hover:bg-emerald-500/80",
                      )}
                    >
                      <div className={cn("select-none text-sm font-semibold")}>
                        Accept
                      </div>
                    </div>
                    <SeeWhyTooltip
                      score={recommenedMilestone?.score}
                      justification={recommenedMilestone?.justification}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <hr />
        <TabsProvider>
          <div
            className={cn(
              "flex h-[300px] w-full flex-1 flex-col items-center justify-center space-y-2",
            )}
          >
            <Tabs
              id={"competency-select"}
              size={"md"}
              tabs={Object.keys(COMPETENCIES).map((c) => ({
                label: c as string,
                id: c as string,
              }))}
            />
            {Object.entries(COMPETENCIES).map(([key, competency]) => {
              let sc = subcompetencies.filter(
                (sc) => sc.competencyId === competency.id,
              );

              return (
                <TabContent key={competency.id} id={key}>
                  <ScrollArea className={cn("h-[475px] w-full")}>
                    <ScrollBar />
                    <AnimatePresence
                      key={`animate-subcompetency`}
                      mode={"wait"}
                    >
                      {sc
                        .sort((a, b) => a.level - b.level)
                        .map((sc) => {
                          return (
                            <motion.div
                              layout={"preserve-aspect"}
                              layoutId={sc.id}
                              key={sc.id}
                              transition={{
                                duration: 0.3,
                                easings: ["anticipate", "easeInOut"],
                              }}
                            >
                              <div
                                className={cn(
                                  "sticky top-0 z-30 my-2 flex w-full select-none flex-row items-center space-x-2 px-10 transition-all hover:scale-105",
                                  selectedSubcompetencyId === sc.id
                                    ? "scale-105"
                                    : "",
                                )}
                              >
                                <p className={cn("text-lg font-bold")}>
                                  {sc.level}.
                                </p>
                                {getNumberOfMilestones(sc.id) !== 0 && (
                                  <Badge>{getNumberOfMilestones(sc.id)}</Badge>
                                )}
                                <div
                                  className={cn(
                                    "flex h-14 w-full cursor-pointer flex-row items-center justify-center rounded-full bg-foreground px-4 py-2 text-white transition-all",
                                  )}
                                  onClick={() =>
                                    handleSubcompetencyClick(sc.id)
                                  }
                                >
                                  <p
                                    className={cn(
                                      "truncate text-sm font-semibold",
                                    )}
                                  >
                                    {sc.name}
                                  </p>
                                </div>
                              </div>
                              {selectedSubcompetencyId === sc.id && (
                                <div className={cn("space-y-2 px-32 ")}>
                                  {getSubcompetencyMilestones(sc.id)
                                    ?.sort((a, b) => a.sublevel - b.sublevel)
                                    ?.sort((a, b) => a.level - b.level)
                                    .map((milestone, index) => (
                                      <motion.div
                                        layout
                                        layoutId={milestone.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: index * 0.05,
                                        }}
                                        onClick={() =>
                                          handleMilestoneClick(milestone.id)
                                        }
                                        key={milestone.id}
                                        className={cn(
                                          "my-2 w-full cursor-pointer select-none rounded-xl p-2 px-4 text-white transition-all hover:scale-105",
                                          values?.includes(milestone.id)
                                            ? "bg-accent"
                                            : "bg-accent/50",
                                        )}
                                      >
                                        <p
                                          className={cn(
                                            "font-bold tracking-wide",
                                          )}
                                        >
                                          {milestone.name}
                                        </p>
                                        <p>{milestone.description}</p>
                                      </motion.div>
                                    ))}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>
                  </ScrollArea>
                </TabContent>
              );
            })}
          </div>
        </TabsProvider>
      </DialogContent>
    </Dialog>
  );
}

function SeeWhyTooltip({
  justification,
  score,
}: {
  justification: string | undefined | null;
  score: string | undefined | null;
}) {
  const color = getBgColorFromPointValue(
    ((parseFloat(score || "0") || 0) * 100) / 80,
  );
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn(
            "cursor-pointer select-none rounded-full bg-foreground  px-2.5 py-0.5 text-white transition-all hover:bg-foreground/80",
          )}
        >
          <div className={cn("text-sm font-semibold")}>See Why</div>
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[450px] space-y-2")}>
        <div
          className={cn("flex flex-row items-center justify-center space-x-2")}
        >
          <p className={cn("text-lg font-bold")}>Match Score: </p>
          <p style={{ color }} className={cn("text-xl font-extrabold")}>
            {(parseFloat(score || "") * 100).toFixed(1)}
          </p>
        </div>
        <p className={cn("text-sm")}>
          {justification ? justification : "No justification provided."}
        </p>
      </PopoverContent>
    </Popover>
  );
}
