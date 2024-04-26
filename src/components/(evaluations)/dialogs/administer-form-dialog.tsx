import { useFormValues } from "@/providers/form-values-provider";
import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";

const administerDialogSchema = z.object({
  endDateTime: z.date(),
  evaluatedStudentIds: z.array(z.string()),
});

type AdministerDialogFormData = z.infer<typeof administerDialogSchema>;

export default function AdministerDialog() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdministerDialogFormData>({
    resolver: zodResolver(administerDialogSchema),
  });

  const { form } = useFormValues();

  const onSubmit = (data: AdministerDialogFormData) => {
    console.log(data);
  };
  const options = form.programs.users?.map((s) => ({
    label: `${s.firstName} ${s.lastName}`,
    value: s.id,
  }));

  return (
    <Dialog.DialogPortal>
      <motion.div>
        <Dialog.DialogContent className={cn("rounded-md")}>
          <Dialog.DialogTitle>
            {`Administer "${form.title}"`}
            <Dialog.DialogDescription>
              Answer the following questions to collect responses for this
              evaluation.
            </Dialog.DialogDescription>
          </Dialog.DialogTitle>
          <hr />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={cn("pb-2 space-y-4")}>
              <div>
                <Label>For how long should the evaluation be active?</Label>
                <Input type="datetime-local" {...register("endDateTime")} />
                {errors.endDateTime && (
                  <span className="text-red-500">
                    {errors.endDateTime.message}
                  </span>
                )}
              </div>
              <div>
                <Label>Who will be evaluated?</Label>
                <MultiSelect
                  options={options as unknown[]}
                  name="evaluatedStudentIds"
                />
                {errors.evaluatedStudentIds && (
                  <span className="text-red-500">
                    {errors.evaluatedStudentIds.message}
                  </span>
                )}
              </div>
              <div className={cn("flex justify-center")}>
                <Button variant={"default"} type="submit">
                  Collect Responses
                </Button>
              </div>
            </div>
          </form>{" "}
        </Dialog.DialogContent>
      </motion.div>
    </Dialog.DialogPortal>
  );
}
