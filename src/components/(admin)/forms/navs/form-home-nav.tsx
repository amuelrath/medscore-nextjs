import { cn } from "@/lib/utils";
import { CreateFormDialogTrigger } from "@/components/(admin)/forms/dialogs/create-form-dialog-trigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FormHomeNav({ onSearchChange }: { onSearchChange: (value: string) => void }) {

  const handleChange = (value: string) => {
    onSearchChange(value)
  }

  return (
    <nav className={cn("z-40 w-full py-4 flex flex-row items-center space-x-4 justify-between")}>
      <div className={cn("flex flex-row items-center space-x-8")} >
    <h3 className={cn("font-bold xs:text-2xl text-3xl text-neutral-700")}>My Forms</h3>
      <Input onChange={e => handleChange(e.target.value)} className={cn("w-72 shadow-inner")} placeholder="Search Forms..."  />
      </div>
      <CreateFormDialogTrigger asChild>
        <Button className={cn("w-48")} variant={"accent"}>New Form</Button>
      </CreateFormDialogTrigger>
    </nav>
  )
}