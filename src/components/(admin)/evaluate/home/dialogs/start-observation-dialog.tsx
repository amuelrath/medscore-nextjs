"use client";
import { LottieHover } from "@/components/ui/lottie-hover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EYE from "public/icons/eye-teal.json";
import { ReactNode, Suspense, useState } from "react";
import {
  InEditorForm,
  NotInEditorForm,
} from "@/components/(admin)/evaluate/home/forms/start-observation-form";
import Loading from "@/components/ui/loading";

// if the dialog has a formId in props, then we know we are in the editor
// if not, then we must alter the form so that we can select the form

type StartObservationDialogProps = {
  formId?: string;
  children?: ReactNode;
};

export function StartObservationDialog({
  formId,
  children,
}: StartObservationDialogProps) {
  const [hovering, setHovering] = useState<boolean>(false);

  // check if formId is in props
  const isInEditor = !!formId;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isInEditor ? (
          <Button size="xs" variant="accent-secondary">
            <div
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className="flex flex-row items-center space-x-2"
            >
              <LottieHover
                inSpeed={0.5}
                outSpeed={1}
                loop={false}
                isHovering={hovering}
                size="xs"
                src={EYE}
              />
              <span className="font-semibold text-teal-900">
                Start Observation
              </span>
            </div>
          </Button>
        ) : (
          <Button variant="hide">{children}</Button>
        )}
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="w-full">
          <DialogTitle className="w-full">Start Direct Observation</DialogTitle>
          <DialogDescription>
            Assess students on-demand in live clinical encounters.
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<Loading />}>
          {isInEditor ? <InEditorForm formId={formId} /> : <NotInEditorForm />}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
