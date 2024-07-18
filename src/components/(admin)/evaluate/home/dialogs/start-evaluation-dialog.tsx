"use client";

import { ReactNode, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Lottie from "lottie-react";
import SPINNER from "public/icons/system-regular-719-spinner-circle-black.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  verifyCode,
  VerifyCodeResult,
} from "@/server/actions/evaluate/verify-code";
import { getFullName } from "@/lib/helpers/getFullName";
import { chooseEvaluatee } from "@/server/actions/evaluate/update-evaluatee";

const formSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
  evaluateeId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function StartEvaluationDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formCodeData, setFormCodeData] = useState<
    VerifyCodeResult | undefined
  >(undefined);
  const [step, setStep] = useState<"code" | "select">("code");

  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (validationError) {
      setError("code", { message: validationError });
    }
  }, [validationError, setError]);

  const onSubmitCode = async (data: FormValues) => {
    if (isLoading) return;
    setIsLoading(true);
    setValidationError(null);

    try {
      const verifyCodeData = await verifyCode({
        code: data.code,
        creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      }); // TODO FIXME
      setFormCodeData(verifyCodeData);
      setStep("select");
    } catch (error) {
      if (error instanceof Error) {
        setValidationError("That code no longer exists.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOption = async (data: FormValues) => {
    if (!formCodeData)
      return setValidationError(
        "Something went wrong. Please try again later.",
      );
    if (!data.evaluateeId) return setValidationError("Select an evaluatee.");
    await chooseEvaluatee(formCodeData.response.id, data.evaluateeId);
    router.push(`/evaluate/${formCodeData.response.id}`);
    setOpen(false);
    reset();
    setStep("code");
  };

  useEffect(() => {
    if (!open) {
      reset();
      setStep("code");
    }
  }, [open, reset, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hide">{children}</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Begin Assessment</DialogTitle>
          <DialogDescription>
            {step === "code"
              ? "Enter the six-digit code provided by an administrator to proceed."
              : "Select an option to continue."}
          </DialogDescription>
        </DialogHeader>
        <LazyMotion features={domAnimation}>
          <m.form
            animate={{ height: step === "code" ? "auto" : "150px" }}
            className="overflow-hidden"
            onSubmit={handleSubmit(
              step === "code" ? onSubmitCode : onSubmitOption,
            )}
          >
            <div className="flex flex-col items-center space-y-4 p-1">
              {step === "code" ? (
                <div className="relative">
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <InputOTP
                        maxLength={6}
                        onComplete={() => {
                          if (field.value?.length === 6) {
                            handleSubmit(onSubmitCode)();
                          }
                        }}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        disabled={isLoading}
                      >
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
                    )}
                  />
                  {isLoading && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <Lottie
                        animationData={SPINNER}
                        loop={true}
                        style={{ width: 24, height: 24 }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <Controller
                  name="evaluateeId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {formCodeData?.assessment.evaluatees
                          ?.filter((student) => student.user.role === "STUDENT")
                          .map((student) => (
                            <SelectItem
                              key={student.userId}
                              value={student.userId}
                            >
                              {getFullName(student.user)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {(errors.code || validationError) && (
                <FormErrorMessage
                  message={errors.code?.message || validationError || ""}
                />
              )}
              {step === "select" && (
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              )}
            </div>
          </m.form>
        </LazyMotion>
      </DialogContent>
    </Dialog>
  );
}
