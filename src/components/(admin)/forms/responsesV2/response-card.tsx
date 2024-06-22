import { cn } from "@/lib/utils";
import { StarIcon, TrashIcon, UploadIcon } from "lucide-react";

interface ResponseCardProps {
  response: {
    id: string;
    creator: {
      firstName: string;
      lastName: string;
    };
    evaluatee: {
      firstName: string;
      lastName: string;
    };
    versionTitle: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function ResponseCard({ response, isSelected, onSelect }: ResponseCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer select-none items-center justify-between rounded-md p-3 transition-all",
        isSelected ? "bg-accent-secondary/20 ring ring-blue-200/20" : "hover:bg-accent-secondary/10"
      )}
    >
      <div className="flex flex-col justify-center">
        <p className="text-md font-medium">{`${response.evaluatee.firstName} ${response.evaluatee.lastName}`}</p>
        <p
          className="text-xs font-normal text-neutral-500">{`${response.creator.firstName} ${response.creator.lastName}`}</p>
      </div>
      <div className="flex flex-row space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
        <StarIcon size={14} />
        <UploadIcon size={14} />
        <TrashIcon size={14} />
      </div>
    </div>
  );
}