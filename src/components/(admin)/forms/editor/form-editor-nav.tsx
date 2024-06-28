"use client";
import {  useState } from "react";
import { cn } from "@/lib/utils";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveFormButton } from "@/components/(admin)/forms/editor/save-form-button";
import { AdministerDialog } from "@/components/(admin)/forms/dialogs/administer-dialog";
import { LottieHover } from "@/components/ui/lottie-hover";
import CALENDAR from "public/icons/calendar-teal.json";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFormContext } from "react-hook-form";
import { useSaveContext } from "@/components/(admin)/forms/editor/save-context";

export const FormEditorNav = () => {
  const { getValues, register } = useFormContext<TFormSchema>();
  const title = getValues(`title`);
  const [hovering, setHovering] = useState<boolean>(false);
  const { isSaving } = useSaveContext()
  return (
      <div className="flex h-16 border-b border-neutral-300 bg-card w-full flex-row items-center justify-between px-8">
        <div className={cn("flex flex-row items-center space-x-2 ")}>
          <Input
            className={cn(
              "bg-blue-950 bg-opacity-5 text-xl font-semibold shadow-inner backdrop-blur-3xl",
            )}
            defaultValue={title}
            {...register("title")}
          />
          <DirectionAwareTabs />
          <SaveFormButton  isSaving={isSaving} />
        </div>
        <div className={cn("flex flex-row space-x-2")}>
          <AdministerDialog />
          <Button variant="accent-secondary" className={cn("w-36")}>
            <div
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className={cn("flex flex-row items-center space-x-2")}
            >
              <LottieHover
                loop={false}
                isHovering={hovering}
                size="sm"
                src={CALENDAR}
              />
              <span className={cn("font-semibold text-teal-900")}>Manage</span>
            </div>
          </Button>
        </div>
      </div>
  );
};
