"use client";
import { cn } from "@/lib/utils";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { useFormContext } from "react-hook-form";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import SaveFormButton from "@/components/(admin)/forms/editor/save-form-button";
import { Input } from "@/components/ui/input";
import { AdministerDialog } from "@/components/(admin)/forms/dialogs/administer-dialog";
import { LottieHover } from "@/components/ui/lottie-hover";
import CALENDAR from 'public/icons/calendar-teal.json'
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Glass } from "@/components/ui/glass";

export default function FormEditorNav() {
  const methods = useFormContext<FormResult>();
  const form = methods.getValues()
  const [hovering, setHovering] = useState<boolean>(false)

  return (
    <div className={cn("fixed top-[65px] px-8 z-40 h-16 w-full")}>
      <Glass className="flex flex-row justify-between">
        <div className={cn("flex flex-row items-center space-x-2")}>
          <Input
            className={cn("text-xl shadow-inner font-semibold bg-blue-950 bg-opacity-5 backdrop-blur-3xl")}
            defaultValue={form.title}
            {...methods.register("title")}
          />
          <DirectionAwareTabs />
          <SaveFormButton />
        </div>
          <div className={cn("flex flex-row space-x-2")}>
            <AdministerDialog />
            <Button variant={"accent-secondary"} className={cn("w-36")}>
              <div
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={cn("flex flex-row items-center space-x-2")}>
                <LottieHover loop={false} isHovering={hovering} size={"sm"} src={CALENDAR} />
                <span className={cn("text-teal-900 font-semibold")}>Manage</span>
              </div>
            </Button>
          </div>
      </Glass>

    </div>
  );
}
