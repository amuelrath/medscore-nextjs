"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useState, useRef } from "react";
import LOADING_SPINNER from "public/icons/system-regular-719-spinner-circle-black.json";
import RECENT_RESPONSES from "public/icons/wired-flat-1334-order-history.json";
import QUESTIONAIRE from "public/icons/wired-flat-967-questionnaire.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { LottieIconButton } from "@/components/ui/lottie-icon-button";

export default function EvaluateDialog() {
  const router = useRouter();
  const [step, setStep] = useState<"code" | "select">("code");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [selectedEvaluatee, setSelectedEvaluatee] = useState<string>("");
  const verifyCode = trpc.responses.verifyCode.useMutation({
    onSuccess: () => {
      setError(false);
      setLoading(false);
      setStep("select");
    },
    onMutate: () => setLoading(true),
    onError: () => {
      setError(true);
      setLoading(false);
      setCode("");
    },
    retry: false,
  });
  const onAnimationComplete = () => {
    setStep("select");
  };

  const onCodeChange = (value: string) => {
    setCode(value);
    if (value.length === 6) {
      verifyCode.mutate({ code: value });
    }
  };

  const onEvaluateeSelect = (value: string) => {
    setSelectedEvaluatee(value);
  };

  const onEvaluateClick = async () => {
    if (!verifyCode.data)
      throw new Error("Something went wrong. Please try again.");
    router.replace(`/evaluate/${verifyCode.data.formVersionId}`);
  };

  const onCancelClick = () => {
    setStep("code");
    setCode("");
    setSelectedEvaluatee("");
    setError(false);
    verifyCode.reset();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <LottieIconButton
          label="Evaluate"
          variant="hide"
          className="text-xl text-bold w text-white text-lg font-bold ring-2 ring-primary hover:shadow-xl hover:-translate-y-2 transition-all w-60 h-32  bg-accent-secondary rounded-md"
          icon={QUESTIONAIRE}
        />
      </AlertDialogTrigger>
      <motion.div
        layout="preserve-aspect"
        transition={{ duration: 0.3 }}
        className={cn("overflow-hidden")}
        onAnimationComplete={onAnimationComplete}
      >
        <AlertDialogContent
          className={cn(
            step === "code" ? "h-[246.4px]" : "h-[298.4px]",
            "overflow-hidden"
          )}
        >
          {step === "code" ? (
            <EvaluateForm
              code={code}
              loading={loading}
              error={error}
              onCodeChange={onCodeChange}
            />
          ) : (
            <SelectEvaluateeForm
              onCancelClick={onCancelClick}
              selectedEvaluatee={selectedEvaluatee}
              onEvaluateeSelect={onEvaluateeSelect}
              onEvaluateClick={onEvaluateClick}
            />
          )}
        </AlertDialogContent>
      </motion.div>
    </AlertDialog>
  );
}

interface EvaluateFormProps {
  code: string;
  loading: boolean;
  error: boolean;
  onCodeChange: (value: string) => void;
}

function EvaluateForm({
  code,
  loading,
  error,
  onCodeChange,
}: EvaluateFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const spinnerRef = useRef<Player>(null);

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          <h3 className={cn("text-xl font-bold")}>
            Please enter your Evaluation Access Code.
          </h3>
          <AlertDialogDescription>
            Enter the access code provided by your program administrator.
          </AlertDialogDescription>
        </AlertDialogTitle>
        <hr />
      </AlertDialogHeader>
      <div className={cn("w-full flex flex-col items-center")}>
        <InputOTP
          ref={inputRef}
          onInputCapture={(e) => onCodeChange(e.currentTarget.value)}
          disabled={loading}
          value={code}
          maxLength={6}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} autoFocus />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
          {loading ? (
            <Player
              src={LOADING_SPINNER}
              ref={spinnerRef}
              autoplay
              loop
              className={cn("size-6 absolute top-2 left-32")}
            />
          ) : null}
        </InputOTP>
        {error ? (
          <p className={cn("mt-2 text-xs text-destructive text-center")}>
            That code was invalid or has expired. Please try again.
          </p>
        ) : null}
      </div>
      <div className="w-full">
        <AlertDialogCancel className={cn("w-full")}>Cancel</AlertDialogCancel>
      </div>
    </>
  );
}

interface SelectEvaluateeFormProps {
  onCancelClick: () => void;
  selectedEvaluatee: string;
  onEvaluateeSelect: (value: string) => void;
  onEvaluateClick: () => void;
}

function SelectEvaluateeForm({
  onCancelClick,
  selectedEvaluatee,
  onEvaluateeSelect,
  onEvaluateClick,
}: SelectEvaluateeFormProps) {
  return (
    <div className={cn("w-full space-y-8")}>
      <AlertDialogHeader>
        <AlertDialogTitle>
          <h3 className={cn("text-xl font-bold")}>Select Evaluatee.</h3>
          <AlertDialogDescription>
            Who will you be evaluating today?
          </AlertDialogDescription>
        </AlertDialogTitle>
        <hr />
      </AlertDialogHeader>
      <div className={cn("w-full flex flex-col items-center justify-center")}>
        <Select value={selectedEvaluatee} onValueChange={onEvaluateeSelect}>
          <SelectTrigger className="w-full px-12">
            <SelectValue placeholder="Select a Student" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="item-1">Charles Fuckwad</SelectItem>
            <SelectItem value="item-2">Nilly Bundlebee</SelectItem>
            <SelectItem value="item-3">Reducious McLaughlin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full mt-2">
        <Button className={cn("w-full")} onClick={onEvaluateClick}>
          Evaluate
        </Button>
        <AlertDialogCancel onClick={onCancelClick} className={cn("w-full")}>
          Cancel
        </AlertDialogCancel>
      </div>
    </div>
  );
}
