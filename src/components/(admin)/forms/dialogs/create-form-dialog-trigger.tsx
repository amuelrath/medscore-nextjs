"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectValue } from "@radix-ui/react-select";
import { ReactNode } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createForm } from "@/server/actions/forms/create-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/ui/form-error-message";

const createFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  program: z.string().min(1, { message: "Program is required" }),
});

export function CreateFormDialogTrigger({
  children,
  asChild,
}: {
  children: ReactNode;
  asChild?: boolean;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
  });
  const queryClient = useQueryClient();
  const createFormMutation = useMutation({
    mutationFn: createForm,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["forms", "lite"],
      });
      toast.success("Form created successfully");
    },
  });

  const handleCreateForm = async (data: z.infer<typeof createFormSchema>) => {
    console.log(data);
    createFormMutation.mutate({
      title: data.title,
      programId: data.program,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className={cn("flex text-start")}>
          <DialogTitle>New Form</DialogTitle>
          <DialogDescription>
            Create a New Competency-Based Assessment.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleCreateForm)}
          className={cn("space-y-4")}
        >
          <div>
            <Label>Title</Label>
            <Input
              {...register("title")}
              placeholder="Enter a Descriptive Title"
            />
            {errors.title && (
              <FormErrorMessage message={errors.title.message} />
            )}
          </div>
          <div>
            <Label>Program</Label>
            <Controller
              control={control}
              name="program"
              rules={{ required: "Please select a program" }}
              render={({ field }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a5d6ff06-c3c5-44c1-9bb3-8d9641b87081">
                        Family Medicine Residency
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.program && (
                    <FormErrorMessage message={errors.program.message} />
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-row items-center justify-end space-x-2">
            <Button className="w-[100px]">Create</Button>
            <DialogClose asChild>
              <Button variant={"secondary"}>Close</Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
