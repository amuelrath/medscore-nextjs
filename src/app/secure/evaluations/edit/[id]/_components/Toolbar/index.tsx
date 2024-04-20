import { cn } from "@/lib/utils";
import { SaveButton } from "./SaveButton";
export default function EditorToolbar() {
  return (
    <div className={cn("flex flex-row space-x-2")}>
      <SaveButton />
    </div>
  );
}
