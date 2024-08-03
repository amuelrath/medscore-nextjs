"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LottieHover } from "@/components/ui/lottie-hover";
import { cn } from "@/lib/helpers/utils";
import { createForm } from "@/server/actions/forms/create-form";
import { FormsLiteResult } from "@/server/actions/forms/get-all-forms-lite";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import {
  ClipboardIcon,
  EyeIcon,
  FileQuestionIcon,
  TestTubeIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ADD from "public/icons/add-card-teal.json";
import ASSIGNMENT_ICON from "public/icons/assessment-accent-secondary.json";
import EYE_ICON from "public/icons/eye-primary.json";
import QUESTION_MARK_ICON from "public/icons/help-accent.json";
import SCIENCE_ICON from "public/icons/science-lavender.json";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const formTypeIcon = {
  OSCE: ASSIGNMENT_ICON,
  SURVEY: QUESTION_MARK_ICON,
  DIRECT_OBSERVATION: EYE_ICON,
  QUIZ: SCIENCE_ICON,
};

type FormType = "OSCE" | "SURVEY" | "QUIZ" | "DIRECT_OBSERVATION";
const formTypes: FormType[] = ["OSCE", "SURVEY", "QUIZ", "DIRECT_OBSERVATION"];

export const formTypeContent = {
  OSCE: ClipboardIcon,
  SURVEY: FileQuestionIcon,
  DIRECT_OBSERVATION: EyeIcon,
  QUIZ: TestTubeIcon,
};

const formTypeDescriptions = {
  OSCE: "OSCE: Structured clinical examination for assessing practical skills and competencies.",
  SURVEY:
    "Survey: Collect data and insights through a series of questions. Milestone mapping is disabled.",
  QUIZ: "Quiz: Test trainee knowledge with scored questions.",
  DIRECT_OBSERVATION:
    "Direct Observation: Real-time assessment of performance in a clinical setting.",
};

export function CreateFormDialog() {
  const {
    mutateCreateForm,
    setSelectedType,
    selectedType,
    setHovering,
    hovering,
  } = useCreateFormDialog();

  const handleSelect = (type: FormType) => {
    setSelectedType(type);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="xs" className={cn("font-semibold")} variant="accent">
          <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn("flex flex-row items-center space-x-2")}
          >
            <LottieHover
              loop={false}
              isHovering={hovering}
              size={"xs"}
              src={ADD}
            />
            <span className={cn("text-teal-900")}>New Form</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="min-h-[400px] min-w-[550px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="pointer-events-none flex items-center space-x-2">
            <LottieHover
              loop={false}
              isHovering={false}
              size={"xs"}
              src={ADD}
            />
            <p>Create New Form</p>
          </DialogTitle>
          <DialogDescription>
            Select the form type that best fits your requirements.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6">
          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
            {formTypes.map((formType) => (
              <FormTypeCard
                key={formType}
                type={formType}
                isSelected={formType === selectedType}
                handleSelect={handleSelect}
              />
            ))}
          </div>
          <div className="flex min-h-[40px] w-full items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {selectedType && (
                <motion.p
                  key={selectedType}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ ease: "easeInOut", duration: 0.15 }}
                  className="absolute origin-center text-sm"
                >
                  <div className="flex flex-col pr-8">
                    <span className="text-lg font-bold">
                      {formTypeDescriptions[selectedType].split(":")[0]}:
                    </span>
                    <p className="text-wrap">
                      {formTypeDescriptions[selectedType].split(":")[1]}
                    </p>
                  </div>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <hr className="w-full " />
          <div className="flex w-full flex-row items-center justify-end space-x-2">
            <Button onClick={() => mutateCreateForm()}>Create</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ZCreateFormSchema = z.object({
  title: z.string(),
  type: z.enum(["OSCE", "SURVEY", "DIRECT_OBSERVATION", "QUIZ"]),
  programId: z.string(),
});

const useCreateFormDialog = () => {
  const router = useRouter();
  const [hovering, setHovering] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<FormType>("OSCE");

  const createFormParams = {
    title: "Untitled Form",
    type: selectedType,
    programId: "a5d6ff06-c3c5-44c1-9bb3-8d9641b87081",
  };

  const queryClient = useQueryClient();
  const { mutate: mutateCreateForm } = useMutation({
    mutationFn: () => createForm(ZCreateFormSchema.parse(createFormParams)),
    onSuccess: (newFormData) => {
      if (!newFormData) return toast.error("Something went wrong.");
      // put the data in the query cache, redirect to /forms/{id}
      queryClient.setQueryData(
        ["forms"],
        (oldData: FormsLiteResult): FormsLiteResult => {
          return [...oldData, newFormData];
        },
      );

      return router.push(`/forms/${newFormData.id}`);
    },
    onError: () => {
      return toast.error("Something went wrong.");
    },
  });

  return {
    hovering,
    setHovering,
    selectedType,
    setSelectedType,
    mutateCreateForm,
  };
};

export const formTypeColors = {
  OSCE: {
    text: "text-accent-secondary",
    ring: "ring-accent-secondary",
    bg: "border-accent-secondary/40",
    foreground: "text-teal-900",
    color: "hsl(var(--accent-secondary))",
  },
  SURVEY: {
    text: "text-accent",
    ring: "ring-accent",
    bg: "border-accent/40",
    foreground: "text-teal-900",
    color: "hsl(var(--accent))",
  },
  QUIZ: {
    text: "text-lavender",
    ring: "ring-lavender",
    bg: "border-lavender/50",
    foreground: "text-purple-900",
    color: "hsl(var(--lavender))",
  },
  DIRECT_OBSERVATION: {
    text: "text-primary",
    ring: "ring-primary",
    bg: "border-primary/40",
    foreground: "text-teal-950",
    color: "hsl(var(--primary))",
  },
};

// should i put this in its own file so it isn't affected by the use client?
function FormTypeCard({
  isSelected,
  type,
  handleSelect,
}: {
  isSelected: boolean;
  type: FormType;
  handleSelect: (type: FormType) => void;
}) {
  const icon = formTypeIcon[type];
  const ref = useRef<any>(null);

  return (
    <div
      onClick={() => !isSelected && ref.current.goToAndPlay(1)}
      className="col-span-1 flex w-full cursor-pointer select-none flex-col space-y-2"
    >
      <Card
        onClick={() => handleSelect(type)}
        className={cn(
          "col-span-1 flex h-28 w-full items-center justify-center p-4 shadow-sm transition-all duration-200",
          formTypeColors[type].text,
          isSelected && `ring-2 ring-offset-2 ${formTypeColors[type].ring}`,
        )}
      >
        <Lottie
          animationData={icon}
          lottieRef={ref}
          loop={0}
          autoplay={false}
          color={formTypeColors[type].color}
        />
      </Card>
      <p className="text-center text-xs font-light">
        {formTypeDescriptions[type].split(":")[0]}
      </p>
    </div>
  );
}
