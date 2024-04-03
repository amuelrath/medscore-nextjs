"use client";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Option } from "@/db/schema";
import { deleteOption, updateOption } from "../../actions";

// tood: debounce this stuff
export function Option({ option }: { option: Option }) {
  const handleRemoveOption = async () => {
    await deleteOption(option.id);
  };

  const handleTextChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateOption(option.id, { text: e.target.value });
  };

  const handlePointValueChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await updateOption(option.id, { pointValue: e.target.value });
  };
  return (
    <div className={cn("flex items-center space-x-2 group w-full")}>
      <Input
        defaultValue={option.text || ""}
        onChange={handleTextChange}
        className={cn("p-2 border rounded-md")}
        placeholder={"Option"}
      />
      <Input
        placeholder="Points"
        defaultValue={Number(option.pointValue).toFixed(1)}
        onChange={handlePointValueChange}
        type="number"
        className={cn(
          "w-12 text-center border rounded-md p-1 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
      />
      <div
        className={cn(
          "group-hover:opacity-100 opacity-0 hover:bg-primary hover:text-white rounded-full transition-all p-1"
        )}
      >
        <Trash2Icon className={cn("size-4")} onClick={handleRemoveOption} />
      </div>
    </div>
  );
}

export default function OptionList({ options }: { options: Option[] }) {
  return (
    <div className={cn("space-y-2")}>
      {options.map((option) => (
        <div>
          <Option key={option.id} option={option} />
        </div>
      ))}
    </div>
  );
}
