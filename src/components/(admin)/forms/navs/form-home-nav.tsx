import { cn } from "@/lib/utils";
import { CreateFormDialogTrigger } from "@/components/(admin)/forms/dialogs/create-form-dialog-trigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, FilterOption } from "@/components/ui/filter-button";
import { FormTag } from "@/db/schema";
import { XIcon } from "lucide-react";
export interface Tag {
  tag: string;
  variant: string;
}
interface FormHomeNavProps {
  tags: Tag[] | undefined;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: any) => void;
}

export function FormHomeNav({
  tags,
  onSearchChange,
  onFilterChange,
}: FormHomeNavProps) {
  const handleChange = (value: string) => {
    onSearchChange(value);
  };

  // Create a Set of unique tags based on tag.tag
  const uniqueTags = tags?.filter(
    (tag, index, self) => index === self.findIndex((t) => t.tag === tag.tag),
  );

  return (
    <nav
      className={cn(
        "z-40 flex w-full flex-row items-center justify-between space-x-4 py-4",
      )}
    >
      <div className={cn("flex flex-row items-center space-x-8")}>
        <h3 className={cn("text-3xl font-bold text-neutral-700 xs:text-2xl")}>
          My Forms
        </h3>
        <div className="flex flex-row items-center space-x-2">
          <Input
            onChange={(e) => handleChange(e.target.value)}
            className={cn("w-72 shadow-inner")}
            placeholder="Search Forms..."
          />
          <Filter>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium">Filter</h3>
              <XIcon size={16} className="text-neutral-500 cursor-pointer" />
            </div>
            <div className="h-full w-full space-x-2 rounded-sm border p-2">
              {uniqueTags?.map((tag) => (
                <FilterOption key={tag.tag} tag={tag} />
              ))}
            </div>
          </Filter>
        </div>
      </div>
      <CreateFormDialogTrigger asChild>
        <Button className={cn("w-48")} variant={"accent"}>
          New Form
        </Button>
      </CreateFormDialogTrigger>
    </nav>
  );
}
