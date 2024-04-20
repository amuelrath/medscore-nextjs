"use client";
import { VersionedEvaluation } from "@/db/client-types";
import { v4 } from "uuid";
import { cn } from "@/lib/utils";
import { Controller, FormProvider, useForm } from "react-hook-form";
import QuestionCards from "./Questions";
import { saveEvaluation } from "../_actions";
import NavBar from "@/components/ui/top-navbar";
import EditorToolbar from "../Toolbar";
import Section from "@/components/ui/section";

export default function Editor({
  defaultValues,
}: {
  defaultValues: VersionedEvaluation;
}) {
  const methods = useForm<VersionedEvaluation>({
    defaultValues: defaultValues || {
      evaluation: {
        id: v4(),
        title: "Untitled Evaluation",
        programId: "",
        questions: [
          {
            id: v4(),
            text: "",
            options: [
              {
                id: v4(),
                text: "",
              },
              {
                id: v4(),
                text: "",
              },
            ],
          },
        ],
      },
    },
  });

  const onSubmit = (data: VersionedEvaluation) => {
    saveEvaluation(data);
  };

  const subcompetencies = defaultValues?.programs.specialties?.subcompetencies;

  return (
    <FormProvider {...methods}>
      <NavBar>
        <NavBar.Heading>
          <NavBar.Title>
            <div className={cn("w-[50rem] cursor-default")}>
              <Controller
                name={"title"}
                control={methods.control}
                render={({ field }) => (
                  <input
                    {...field}
                    className={cn(
                      "text-2xl text-white bg-primary hover:text-white/70 transition-all"
                    )}
                  />
                )}
              />
            </div>
          </NavBar.Title>
          <NavBar.Subtitle>
            <EditorToolbar />
          </NavBar.Subtitle>
        </NavBar.Heading>
      </NavBar>
      <Section>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <QuestionCards subcompetencies={subcompetencies || []} />
        </form>
      </Section>
    </FormProvider>
  );
}
