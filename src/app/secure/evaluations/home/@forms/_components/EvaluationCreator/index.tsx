"use client";
import { Stepper, StepWrapper } from "@/components/ui/stepper";
import { createNewEvaluation } from "../_actions";
import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function EvaluationCreator() {
  const form = useForm<CreateEvaluationForm>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const onSubmit = () => {
    /*
    createNewEvaluation(
      form.getValues("title"),
      form.getValues("programId")
    ).then(() => form.reset());
    */
  };

  return (
    <>
      <div className="hover:text-white hover:bg-primary rounded-full p-1 transition-all">
        <PlusCircleIcon onClick={handleOpen} />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stepper isOpen={isOpen} onClose={handleClose} onSubmit={onSubmit}>
          <StepWrapper step={1}>
            <div className="w-full h-full flex flex-col items-center space-y-2">
              <Label htmlFor="title" className="text-xl font-bold">
                Choose a Title
              </Label>
              <Input {...form.register(`title`)} placeholder="Untitled Form" />
            </div>
          </StepWrapper>
          <StepWrapper step={2}>
            <div className="w-full h-full flex flex-col items-center space-y-2">
              <Label htmlFor="program" className="text-xl font-bold">
                Select a Program
              </Label>
              <Controller
                control={form.control}
                name="programId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        className={cn("hover:bg-gray-300")}
                        value="9718867b-fdf2-4542-97c2-d89825fc2012"
                      >
                        Family Medicine Residency
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </StepWrapper>
          <StepWrapper step={3}>3</StepWrapper>
          <StepWrapper step={4}>4</StepWrapper>
          <StepWrapper step={5}>5</StepWrapper>
        </Stepper>
      </form>
    </>
  );
}

type CreateEvaluationForm = {
  title: string;
  programId: string;
};
