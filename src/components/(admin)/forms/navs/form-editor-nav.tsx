import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import SaveFormButton from "@/components/(admin)/forms/editor/save-form-button";
import { useFormContext } from "react-hook-form";
import { TFormRelate } from "@/db/types";
import { saveForm } from "@/server/actions/forms/save-form";
import AdministerDialog from "@/components/(admin)/forms/dialogs/administer-form-dialog";
import { AnalysisButton } from "@/components/(admin)/forms/responses/analysis-button";

export default function FormEditorNav() {
  const methods = useFormContext<TFormRelate>();
  const handleSave = () => {
    saveForm(methods.getValues()).catch((e) =>
      console.debug("Error Saving Form: ", e),
    );
  };
  return (
    <nav className="no-scrollbar overflow-y-hidden h-18 sticky top-[57px] z-40 flex flex-row items-center justify-between border-b bg-background p-2 px-4 drop-shadow-sm">
      <div className={cn("space-x-2 flex flex-row items-center")}>
        <div className={cn("cursor-default")}>
          <Controller
            name={"title"}
            control={methods.control}
            render={({ field }) => (
              <Input
                {...field}
                className={cn("w-[212px] bg-inherit text-xl font-semibold")}
              />
            )}
          />
        </div>

        <div className={cn("flex items-center space-x-2")}>
          <AnimatedTabs tabs={tabs} size={"xs"} />
          <div onClick={() => handleSave}>
            <SaveFormButton />
          </div>
        </div>
      </div>
      <div className={cn("fixed right-2 top-[10px]")}>
        <div className={cn('flex flex-row space-x-2')} >
        <AdministerDialog />
        <AnalysisButton />
        </div>
      </div>
    </nav>
  );
}

const tabs = [
  { id: "editor", label: "Editor" },
  { id: "responses", label: "Responses" },
];
