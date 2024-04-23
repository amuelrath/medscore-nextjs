"use client";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
} from "react";
import { Dialog, DialogContent, DialogHeader } from "./dialog";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
interface StepWrapperProps {
  step: number;
  children: React.ReactNode;
}
interface StepperProps {
  submitMessage?: string;
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  stayOpen?: boolean;
}
const StepperContext = createContext<{
  currentStep: number;
  setCurrentStep: (step: number) => void;
}>({
  currentStep: 0,
  setCurrentStep: () => {},
});
export const useStepper = () => useContext(StepperContext);
export function StepWrapper({ step, children }: StepWrapperProps) {
  const { currentStep } = useStepper();
  return (
    <div style={{ display: step === currentStep ? "block" : "none" }}>
      {children}
    </div>
  );
}
export function Stepper({
  children,
  isOpen,
  onClose,
  title,
  onSubmit,
  stayOpen = false,
  submitMessage,
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const stepCount = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === StepWrapper
  ).length;
  const next = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, stepCount + 1));
  };
  const previous = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };
  const reset = () => {
    setCurrentStep(1);
  };
  const handleSubmit = () => {
    onSubmit();
    if (!stayOpen) {
      onClose();
      reset();
    } else if (currentStep !== stepCount) {
      next();
    }
  };
  return (
    <StepperContext.Provider value={{ currentStep, setCurrentStep }}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn("h-64 p-4 flex flex-col justify-between")}>
          <DialogHeader className={cn("")}>
            <h3 className={cn("font-bold text-xl text-center")}>{title}</h3>
            <div className={cn("flex items-center justify-center")}>
              {Array.from({ length: stepCount }).map((_, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={cn(
                      "w-6 h-6 flex items-center justify-center rounded-full transition-all",
                      currentStep > index ? "bg-green-500" : "bg-gray-300"
                    )}
                  >
                    <CheckIcon
                      size={"1rem"}
                      className={cn(
                        "text-black transition-transform",
                        currentStep > index
                          ? "opacity-100 rotate-0"
                          : "opacity-0 rotate-45"
                      )}
                    />
                  </div>
                  {index < stepCount - 1 && (
                    <div
                      className={cn(
                        "w-20 h-0.5",
                        currentStep > index + 1 ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </DialogHeader>
          <div className="w-full h-full">
            {Children.map(children, (child) => {
              if (isValidElement(child) && child.type === StepWrapper) {
                return child;
              }
              return null;
            })}
          </div>
          <div className={cn("flex flex-row justify-around")}>
            <PreviousTrigger onClick={previous} disabled={currentStep === 1}>
              Previous
            </PreviousTrigger>
            <NextTrigger onClick={next} disabled={currentStep === stepCount}>
              Next
            </NextTrigger>
            <SubmitTrigger
              onClick={handleSubmit}
              disabled={currentStep !== stepCount}
            >
              {submitMessage ?? "Submit"}
            </SubmitTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </StepperContext.Provider>
  );
}

interface TriggerProps {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function PreviousTrigger({ disabled, onClick, children }: TriggerProps) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

export function NextTrigger({ disabled, onClick, children }: TriggerProps) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

export function SubmitTrigger({ disabled, onClick, children }: TriggerProps) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}
