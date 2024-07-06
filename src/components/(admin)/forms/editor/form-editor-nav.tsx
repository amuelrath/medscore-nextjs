"use client";
import { cn } from "@/lib/helpers/utils";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { Input } from "@/components/ui/input";
import { SaveFormButton } from "@/components/(admin)/forms/editor/save-form-button";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import { isSavingAtom } from "./atoms";
import { AdministerDialog } from "@/components/(admin)/forms/dialogs/administer-dialog";
import { StartObservationDialog } from "@/components/(admin)/forms/dialogs/start-observation-dialog";

export const FormEditorNav = () => {
  const { getValues, register } = useFormContext<TFormSchema>();
  const title = getValues(`title`);
  const formId = getValues(`id`)
  const [isSaving] = useAtom(isSavingAtom);

  return (
    <div className="flex h-16 w-full flex-row items-center justify-between border-b border-accent-secondary bg-card px-3">
      <div className={cn("flex flex-row items-center space-x-2")}>
        <Input
          className={cn("bg-blue-800/5 text-xl font-semibold shadow-inner")}
          defaultValue={title}
          {...register("title")}
        />
        <DirectionAwareTabs />
        <SaveFormButton isSaving={isSaving} />
      </div>
      <div className={cn("flex flex-row space-x-2")}>
        <AdministerDialog />
        <StartObservationDialog formId={formId} />
      </div>
    </div>
  );
};
