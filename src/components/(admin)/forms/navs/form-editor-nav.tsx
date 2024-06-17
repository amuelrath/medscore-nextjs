"use client";
import { cn } from "@/lib/utils";
import { AnalysisButton } from "@/components/(admin)/forms/responses/analysis-button";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { useFormContext } from "react-hook-form";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import SaveFormButton from "@/components/(admin)/forms/editor/save-form-button";
import { Input } from "@/components/ui/input";
import { AdministerDialog } from "@/components/(admin)/forms/dialogs/new-administer-dialog";
import { LottieHover } from "@/components/ui/lottie-hover";
import CALENDAR from 'public/icons/calendar-white.json'
import { Button } from "@/components/ui/button";
import PEN from "public/icons/pencil-white.json";
import { useState } from "react";

export default function FormEditorNav() {
  const methods = useFormContext<FormResult>();
  const form = methods.getValues()
  const [hovering, setHovering] = useState<boolean>(false)

  return (
    <div className={cn("fixed top-[57px] z-40 h-16 w-full")}>
      <nav className="no-scrollbar  flex flex-row items-center justify-between overflow-y-hidden border-b bg-transparent backdrop-blur-sm p-2 px-4 shadow-md">
        <div className={cn("flex flex-row items-center space-x-2")}>
          <Input
            className={cn("text-xl font-semibold")}
            defaultValue={form.title}
            {...methods.register("title")}
          />
          <DirectionAwareTabs />
          <SaveFormButton />
        </div>
        <div className={cn("fixed right-2 top-[10px]")}>
          <div className={cn("flex flex-row space-x-2")}>

            <AdministerDialog />
            <Button variant={"foreground"} className={cn("w-36")}>
              <div
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={cn("flex flex-row items-center space-x-2")}>
                <LottieHover loop={false} isHovering={hovering} size={"sm"} src={CALENDAR} />
                <span>Manage</span>
              </div>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
