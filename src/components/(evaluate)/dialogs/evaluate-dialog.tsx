"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
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
import { cn } from "@/lib/utils";
import { LottieIconButton } from "@/components/ui/lottie-icon-button";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import QUESTIONAIRE from "public/icons/wired-flat-967-questionnaire.json";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "@/db/schema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Player } from "@lottiefiles/react-lottie-player";
import LOADING_SPINNER from "public/icons/system-regular-719-spinner-circle-black.json";

interface EvaluationContextValue {
  step: "code" | "select";
  setStep: (step: "code" | "select") => void;
  code: string;
  setCode: (code: string) => void;
  status: "idle" | "loading" | "success" | "error";
  setStatus: (status: "idle" | "loading" | "success" | "error") => void;
  students: User[];
  setStudents: (students: User[]) => void;
  selectedStudent: User | null;
  setSelectedStudent: (student: User | null) => void;
}

const EvaluationContext = createContext<EvaluationContextValue | undefined>(
  undefined
);

function useEvaluation() {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error("useEvaluation must be used within an EvaluationProvider");
  }
  return context;
}

export default function EvaluateDialog() {
  const router = useRouter();
  const [step, setStep] = useState<"code" | "select">("code");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const mutation = trpc.responses.verifyCode.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      setStudents(data.usersWithCode.map((u) => u.user));
      setStep("select");
    },
    onMutate: () => setStatus("loading"),
    onError: () => {
      setStatus("error");
      setCode("");
    },
  });

  const onCodeChange = (value: string) => {
    setCode(value);
    if (value.length === 6) {
      mutation.mutate({ code: value });
    }
  };

  const onEvaluateClick = async () => {
    if (!selectedStudent) throw new Error("No student selected");
    router.replace(`/evaluate/${selectedStudent.id}`);
  };

  const onCancelClick = () => {
    setStep("code");
    setCode("");
    setStatus("idle");
    mutation.reset();
  };

  const value = {
    step,
    setStep,
    code,
    setCode,
    status,
    setStatus,
    students,
    setStudents,
    selectedStudent,
    setSelectedStudent,
  };

  const dialogClasses = cn(
    "overflow-hidden",
    step === "code" ? "h-[246.4px]" : "h-[298.4px]"
  );

  return (
    <EvaluationContext.Provider value={value}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <LottieIconButton
            label="Evaluate"
            variant="hide"
            className="text-xl text-bold w text-notepad flex flex-col text-lg font-bold bg-gradient-to-t from-primary to-primary/70 hover:shadow-xl hover:-translate-y-1 transition-all w-60 h-32  rounded-md"
            icon={QUESTIONAIRE}
          />
        </AlertDialogTrigger>
        <motion.div
          layout
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <AlertDialogContent className={dialogClasses}>
            <Suspense
              fallback={
                <div className="flex flex-row items-center justify-center">
                  <Loading />
                </div>
              }
            >
              {step === "code" ? (
                <EvaluateForm />
              ) : (
                <SelectEvaluateeForm
                  onCancelClick={onCancelClick}
                  onEvaluateClick={onEvaluateClick}
                />
              )}
            </Suspense>
          </AlertDialogContent>
        </motion.div>
      </AlertDialog>
    </EvaluationContext.Provider>
  );
}

function EvaluateForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const spinnerRef = useRef<Player>(null);
  const { code, status, setCode } = useEvaluation();
  const loading = status === "loading";
  const error = status === "error";

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          <span className="text-xl font-bold">
            Please enter your Evaluation Access Code.
          </span>
        </AlertDialogTitle>
        <AlertDialogDescription>
          Enter the access code provided by your program administrator.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <hr />
      <div className="w-full flex flex-col items-center">
        <InputOTP
          ref={inputRef}
          onInputCapture={(e) => setCode(e.currentTarget.value)}
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
          {loading && (
            <Player
              src={LOADING_SPINNER}
              ref={spinnerRef}
              autoplay
              loop
              className="size-6 absolute top-2 left-32"
            />
          )}
        </InputOTP>
        {error && (
          <p className="mt-2 text-xs text-destructive text-center">
            That code was invalid or has expired. Please try again.
          </p>
        )}
      </div>
      <div className="w-full">
        <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
      </div>
    </>
  );
}

const SelectEvaluateeSchema = z.object({
  userId: z.string(),
});

function SelectEvaluateeForm({
  onCancelClick,
  onEvaluateClick,
}: {
  onCancelClick: () => void;
  onEvaluateClick: () => void;
}) {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<{ userId: string }>({
    resolver: zodResolver(SelectEvaluateeSchema),
    defaultValues: {
      userId: "",
    },
  });

  const { students, setSelectedStudent } = useEvaluation();

  const onSubmit = (formData: { userId: string }) => {
    const selected = students.find((u) => u.id === formData.userId);
    if (selected) setSelectedStudent(selected);
  };

  useEffect(() => {
    const storedStudent = localStorage.getItem("evaluatee");
    if (storedStudent) setSelectedStudent(JSON.parse(storedStudent));
  }, [setSelectedStudent]);

  return (
    <div className="w-full space-y-8">
      <AlertDialogHeader>
        <AlertDialogTitle>
          <h3 className="text-xl font-bold">Select Evaluatee.</h3>
        </AlertDialogTitle>
        <AlertDialogDescription>
          Who will you be evaluating today?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <hr />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center justify-center"
      >
        <Controller
          control={control}
          name="userId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full px-12">
                <SelectValue placeholder="Select a Student" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {`${student.firstName} ${student.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.userId && (
          <span className="text-destructive">Please select a Student.</span>
        )}

        <div className="w-full mt-2">
          <Button type="submit" className="w-full" onClick={onEvaluateClick}>
            Evaluate
          </Button>
          <AlertDialogCancel onClick={onCancelClick} className="w-full">
            Cancel
          </AlertDialogCancel>
        </div>
      </form>
    </div>
  );
}
