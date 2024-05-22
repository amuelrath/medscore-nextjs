"use client";
import { useFormValues } from "@/providers/form-values-provider";
import { Button } from "@/components/ui/button";
import Pinger from "@/components/ui/pinger";
import QUESTIONAIRE_ICON from "public/icons/wired-flat-967-questionnaire.json";
const DialogContent = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogContent),
);
const DialogDescription = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogDescription),
);
const DialogTitle = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogTitle),
);
const DialogPortal = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogPortal),
);
const Dialog = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.Dialog),
);
const DialogTrigger = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogTrigger),
);
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { trpc } from "@/app/_trpc/client";
import Loading from "@/components/ui/loading";
import COPY_ICON from "public/icons/system-regular-99-copy.json";
const InputOTP = dynamic(() =>
  import("@/components/ui/input-otp").then((mod) => mod.InputOTP),
);
const InputOTPGroup = dynamic(() =>
  import("@/components/ui/input-otp").then((mod) => mod.InputOTPGroup),
);
const InputOTPSeparator = dynamic(() =>
  import("@/components/ui/input-otp").then((mod) => mod.InputOTPSeparator),
);
const InputOTPSlot = dynamic(() =>
  import("@/components/ui/input-otp").then((mod) => mod.InputOTPSlot),
);
import Lottie from "lottie-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/formatDate";
import dynamic from "next/dynamic";
import { DynamicLottieIconButton } from "@/components/ui/lottie-icon-button";

const administerDialogSchema = z.object({
  endDateTime: z.string(),
  evaluatedStudentIds: z.array(z.string()),
});

type AdministerDialogFormData = z.infer<typeof administerDialogSchema>;
// TODO Truncate Title
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
  const [hover, setHover] = useState<boolean>(false);
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

  const lottieRef = useRef<any>(null);
  useEffect(() => {
    if (hover) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [hover]);

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
    <Dialog modal>
      <DialogTrigger asChild>
        <div className="relative">
          <DynamicLottieIconButton
            icon={QUESTIONAIRE_ICON}
            label="Administer"
          />
          {isActive && (
            <div className="absolute -right-[4px] -top-[4px]">
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
            onOpenAutoFocus={(e) => e.preventDefault()}
            className={cn(
              "min-w-[600px] rounded-md",
              isActive ? "h-[252px]" : "h-[335px]",
            )}
          >
            <DialogTitle>
              {isActive ? (
                <>
                  <div className={cn("text-md flex space-x-2")}>
                    <div className="flex flex-row space-x-1.5">
                      <p> {`"${form.title}"`}</p>
                      <p className="font-semibold">is active until</p>
                      <p className="font-semibold">
                        {formatDate(cache?.expiresAt || "")}
                      </p>
                    </div>
                    <div className={cn("absolute -right-1 -top-1")}>
                      <Pinger variant={"emerald"} size={"md"} />
                    </div>
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
                  <div className="flex h-40 items-center justify-center">
                    <Loading size="md" />
                  </div>
                ) : (
                  <div className={cn("space-y-4 pb-2")}>
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
                              value?.includes(option.value as string),
                            )}
                            onChange={(selectedOptions) =>
                              onChange(
                                selectedOptions.map(
                                  (option) =>
                                    (option as { value: string }).value,
                                ),
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
                    <Lottie
                      autoplay={false}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                      animationData={COPY_ICON}
                      lottieRef={lottieRef}
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
