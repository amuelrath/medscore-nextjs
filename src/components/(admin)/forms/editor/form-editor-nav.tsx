"use client";
import { cn } from "@/lib/utils";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { Input } from "@/components/ui/input";
import { SaveFormButton } from "@/components/(admin)/forms/editor/save-form-button";
import { AdministerDialog } from "@/components/(admin)/forms/dialogs/administer-dialog";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import { isSavingAtom } from "./atoms";
import { ManageDialog } from "@/components/(admin)/forms/editor/manage-dialog";

export const FormEditorNav = () => {
  const { getValues, register } = useFormContext<TFormSchema>();
  const title = getValues(`title`);
  const [isSaving] = useAtom(isSavingAtom);

  return (
    <div className="flex h-16 w-full flex-row items-center justify-between border-b border-accent-secondary bg-card px-8">
      <div className={cn("flex flex-row items-center space-x-2 ")}>
        <Input
          className={cn(
            "bg-blue-950 bg-opacity-5 text-xl font-semibold shadow-inner backdrop-blur-3xl",
          )}
          defaultValue={title}
          {...register("title")}
        />
        <DirectionAwareTabs />
        <SaveFormButton isSaving={isSaving} />
      </div>
      <div className={cn("flex flex-row space-x-2")}>
        <AdministerDialog />
        <ManageDialog />
      </div>
    </div>
  );
};
