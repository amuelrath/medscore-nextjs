"use client";
import { TFormRelate, TSubcompetencyRelate } from "@/db/types";
import { v4 } from "uuid";
import { cn } from "@/lib/utils";
import { Controller, FormProvider, useForm } from "react-hook-form";
import QuestionCards from "@/components/(evaluations)/editor/questions";
import NavBar from "@/components/ui/top-navbar";
import SaveFormButton from "@/components/(evaluations)/editor/save-form-button";
import Section from "@/components/ui/section";
import {
  AnimatedTabs,
  TabContent,
  TabsProvider,
} from "@/components/ui/animated-tabs";
import ResponsesSection from "@/components/(evaluations)/sections/form-responses";
import { FormValuesContext } from "@/providers/form-values-provider";

const tabs = [
  {
    id: "editor",
    label: "Editor",
  },
  {
    id: "responses",
    label: "Responses",
  },
];

export default function Editor({
  form,
  subcompetencies,
}: {
  form: TFormRelate;
  subcompetencies: TSubcompetencyRelate[];
}) {
  const methods = useForm<TFormRelate>({
    defaultValues: form || {
      form: {
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

  const onSubmit = (data: TFormRelate) => {
    // save evaluation
  };
  return (
    <TabsProvider>
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
                        "text-lg text-white bg-primary hover:text-white/70 transition-all"
                      )}
                    />
                  )}
                />
              </div>
            </NavBar.Title>
            <NavBar.Subtitle>
              <div className={cn("flex items-center space-x-2")}>
                <AnimatedTabs tabs={tabs} size={"xs"} />
                <SaveFormButton />
              </div>
            </NavBar.Subtitle>
          </NavBar.Heading>
        </NavBar>
        <Section>
          <TabContent id="editor">
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="pb-[16rem]"
            >
              <QuestionCards subcompetencies={subcompetencies || []} />
            </form>
          </TabContent>
          <TabContent id="responses">
            <FormValuesContext.Provider value={{ form }}>
              <ResponsesSection />
            </FormValuesContext.Provider>
          </TabContent>
        </Section>
      </FormProvider>
    </TabsProvider>
  );
}
