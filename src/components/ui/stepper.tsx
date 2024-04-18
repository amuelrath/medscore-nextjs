"use client";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface StepWrapperProps {
  step: number;
  children: React.ReactNode;
}

interface StepperProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
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
export function Stepper({ children, isOpen, onClose, title }: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const stepCount = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === StepWrapper
  ).length;

  const next = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, stepCount));
  };

  const previous = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const progressPercentage = (currentStep / stepCount) * 100;

  return (
    <StepperContext.Provider value={{ currentStep, setCurrentStep }}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className={cn("w-[100%] h-96 p-4 flex flex-col justify-between")}
        >
          <DialogHeader className={cn("")}>
            <h3 className={cn("font-bold text-xl")}>{title}</h3>
            <Progress
              className={cn("bg-accent-secondary mt-6")}
              value={progressPercentage}
              max={100}
            />
          </DialogHeader>
          {Children.map(children, (child) => {
            if (isValidElement(child) && child.type === StepWrapper) {
              return child;
            }
            return null;
          })}
          <div className={cn("flex flex-row justify-around")}>
            <Button onClick={previous} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button onClick={next} disabled={currentStep === stepCount}>
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </StepperContext.Provider>
  );
}
