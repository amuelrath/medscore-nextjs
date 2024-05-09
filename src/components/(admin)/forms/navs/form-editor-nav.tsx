import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import SaveFormButton from "@/components/(admin)/forms/editor/save-form-button";
import { useFormContext } from "react-hook-form";
import { TFormRelate } from "@/db/types";
import { saveForm } from "@/server/actions/forms/save-form";

export default function FormEditorNav() {
  const methods = useFormContext<TFormRelate>();
  const handleSave = () => {
    saveForm(methods.getValues()).catch((e) =>
      console.debug("Error Saving Form: ", e),
    );
  };
  return (
    <nav className="h-18 sticky top-[57px] z-40 flex flex-row items-center space-x-2 border-b bg-background p-2 px-8 drop-shadow-sm">
      <div className={cn("cursor-default")}>
        <Controller
          name={"title"}
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              className={cn("bg-inherit text-xl font-semibold")}
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
    </nav>
  );
}

const tabs = [
  { id: "editor", label: "Editor" },
  { id: "responses", label: "Responses" },
];
