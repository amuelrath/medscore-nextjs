import { cn } from "@/lib/utils";
import { CreateFormDialogTrigger } from "@/components/(admin)/forms/dialogs/create-form-dialog-trigger";
import { Button } from "@/components/ui/button";

export function FormHomeHeader() {
  return (
    <header className={cn("z-40 flex flex-row items-center space-x-4 py-4")}>
      <h3 className={cn("text-3xl font-bold text-neutral-700 xs:text-2xl")}>
        My Forms
      </h3>
      <CreateFormDialogTrigger asChild>
        <Button className={cn("w-32")} size={"sm"} variant={"accent"}>
          New Form
        </Button>
      </CreateFormDialogTrigger>
    </header>
  );
}
