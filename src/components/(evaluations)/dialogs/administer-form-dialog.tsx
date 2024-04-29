"use client";
import { useFormValues } from "@/providers/form-values-provider";
import { Button } from "@/components/ui/button";
import Pinger from "@/components/ui/pinger";
import QUESTIONAIRE_ICON from "public/icons/wired-flat-967-questionnaire.json";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogPortal,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRef } from "react";
import { trpc } from "@/app/_trpc/client";
import Loading from "@/components/ui/loading";
import COPY_ICON from "public/icons/system-regular-99-copy.json";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Player } from "@lottiefiles/react-lottie-player";
import { toast } from "sonner";
import { LottieIconButton } from "@/components/ui/lottie-icon-button";

const administerDialogSchema = z.object({
  endDateTime: z.string(),
  evaluatedStudentIds: z.array(z.string()),
});

type AdministerDialogFormData = z.infer<typeof administerDialogSchema>;

export default function AdministerDialog() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdministerDialogFormData>({
    resolver: zodResolver(administerDialogSchema),
  });

  const { form } = useFormValues();
  const utils = trpc.useUtils();
  const { data: cache } = trpc.forms.status.useQuery({ formId: form.id });
  const stopAdminister = trpc.forms.stopAdminister.useMutation({
    onSuccess() {
      utils.forms.status.invalidate();
    },
  });
  const startAdminister = trpc.forms.administer.useMutation({
    onSuccess() {
      utils.forms.status.invalidate();
    },
  });

  const lottieRef = useRef<Player>(null);

  const onSubmit = (data: AdministerDialogFormData) => {
    startAdminister.mutate({
      formId: form.id,
      studentIds: data.evaluatedStudentIds,
      expiresAt: data.endDateTime,
    });
  };

  const options =
    form.programs.users
      ?.filter((s) => s.user.role === "STUDENT")
      .map((s) => ({
        label: `${s.user.firstName} ${s.user.lastName}`,
        value: s.user.id,
      })) || [];

  const cancelFormCode = () => {
    stopAdminister.mutate({ formId: form.id });
  };

  const isActive = cache?.expiresAt && new Date() < new Date(cache.expiresAt);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative">
          <LottieIconButton icon={QUESTIONAIRE_ICON} label="Administer" />
          {isActive && (
            <div className="absolute top-4 right-1 z-40">
              <Pinger variant={"emerald"} size={"sm"} />
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogPortal>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
          layout="preserve-aspect"
        >
          <DialogContent
            className={cn("rounded-md", isActive ? "h-[252px]" : "h-[335px]")}
          >
            <DialogTitle>
              {isActive ? (
                <>
                  <div className={cn("flex space-x-4")}>
                    <div className="flex">
                      {`"${form.title}" `}
                      <p className="font-light mx-2">is active until</p>
                      <p className="font-semibold">
                        {formatExpiresAt(cache?.expiresAt || "")}
                      </p>
                    </div>
                    <Pinger variant={"emerald"} size={"md"} />
                  </div>
                  <DialogDescription>
                    <p>Share this code with Evaluators to collect responses.</p>
                  </DialogDescription>
                </>
              ) : (
                `Administer "${form.title}"`
              )}
              <DialogDescription>
                {isActive
                  ? ""
                  : "Answer the following questions to collect responses for this evaluation."}
              </DialogDescription>
            </DialogTitle>

            <hr />
            {!isActive ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                {startAdminister.isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loading size="md" />
                  </div>
                ) : (
                  <div className={cn("pb-2 space-y-4")}>
                    <div>
                      <Label>
                        For how long should the evaluation be active?
                      </Label>
                      <Input
                        type="datetime-local"
                        {...register("endDateTime")}
                      />
                      {errors.endDateTime && (
                        <span className="text-red-500">
                          {errors.endDateTime.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label>Who will be evaluated?</Label>
                      <Controller
                        name="evaluatedStudentIds"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <MultiSelect
                            options={options}
                            value={options.filter((option) =>
                              value?.includes(option.value as string)
                            )}
                            onChange={(selectedOptions) =>
                              onChange(
                                selectedOptions.map(
                                  (option) =>
                                    (option as { value: string }).value
                                )
                              )
                            }
                          />
                        )}
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
                )}
              </form>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <div className={cn("flex flex-row items-center space-x-2")}>
                  <div>
                    <InputOTP maxLength={6} value={cache?.code}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button
                    size={"sm"}
                    onClick={() => {
                      navigator.clipboard.writeText(cache?.code || "");
                      toast.info("Code copied to clipboard");
                    }}
                  >
                    <Player
                      src={COPY_ICON}
                      ref={lottieRef}
                      hover
                      style={{ width: 24, height: 24 }}
                    />
                  </Button>
                </div>
                <Button onClick={cancelFormCode} variant={"destructive"}>
                  Stop Collecting Responses
                </Button>
              </div>
            )}
          </DialogContent>
        </motion.div>
      </DialogPortal>
    </Dialog>
  );
}

const formatExpiresAt = (expiresAt: string) => {
  if (!expiresAt) return "";

  const expiresAtDate = new Date(expiresAt);
  const now = new Date();
  const diffTime = expiresAtDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  if (diffDays === 1) {
    return `Today at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  } else if (diffDays === 2) {
    return `Tomorrow at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  } else if (diffDays > 2 && diffDays <= 7) {
    return `${expiresAtDate.toLocaleDateString([], {
      weekday: "long",
    })} at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  } else {
    return `${expiresAtDate.toLocaleDateString([], {
      month: "2-digit",
      day: "2-digit",
    })} at ${expiresAtDate.toLocaleTimeString([], timeFormat)}`;
  }
};
