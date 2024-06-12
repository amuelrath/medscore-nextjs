"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
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
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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
    <AlertDialog>
      <AlertDialogTrigger asChild={asChild}>{children}</AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader className={cn("flex text-start")}>
          <AlertDialogTitle>
            Create New Form
            <AlertDialogDescription>
              Create a New Competency-Based Assessment.
            </AlertDialogDescription>
          </AlertDialogTitle>
        </AlertDialogHeader>
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
              <span className="text-red-500">{errors.title.message}</span>
            )}
          </div>
          <div>
            <Label>Program</Label>
            <Controller
              control={control}
              name="program"
              rules={{ required: "Please select a program" }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <>
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a5d6ff06-c3c5-44c1-9bb3-8d9641b87081">
                        Family Medicine Residency
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {error && (
                    <span className="text-red-500">{error.message}</span>
                  )}
                </>
              )}
            />
          </div>
          <div className={cn("flex w-full flex-col space-y-2")}>
            <AlertDialogAction
              type={"submit"}
              className={cn("bg-foreground text-background")}
            >
              Create
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
