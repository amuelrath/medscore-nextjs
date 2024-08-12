import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetFormAssessments } from "@/hooks/queries/use-get-form-assessments";
import { cn } from "@/lib/helpers/utils";
import { selectedAssessmentIdAtom } from "@/store/form-atoms";
import { formatDate, isBefore } from "date-fns";
import { useAtom } from "jotai/index";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

function AssessmentSelect() {
  const [open, setOpen] = React.useState(false);
  const [selectedAssessmentId, setSelectedFormCodeId] = useAtom(
    selectedAssessmentIdAtom,
  );

  const { assessments } = useGetFormAssessments();

  const selectedAssessment = assessments?.find(
    (a) => a.id === selectedAssessmentId,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className="group flex h-12 w-full flex-row items-center justify-between rounded-md border border-neutral-300 bg-primary/5 px-4 font-medium text-neutral-600 transition-all hover:border-neutral-600"
        >
          <div className="truncate flex flex-col items-start text-sm">
            <p>
              {selectedAssessment
                ? selectedAssessment.title
                : "Select Assessment"}
            </p>
            {selectedAssessment && (
              <p className="opacity-50 text-xs">
                {formatDate(selectedAssessment.startsAt, "MM/dd/yyyy")}
              </p>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 border-border bg-card p-0 py-2">
        <Command className="bg-inherit">
          <CommandInput
            className="text-xs font-light"
            placeholder="Search administrations..."
          />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No administration found.</CommandEmpty>
              <CommandGroup>
                {assessments
                  ?.filter((fc) => isBefore(fc.startsAt, new Date()))
                  ?.sort(
                    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
                  )
                  .map((fc) => (
                    <CommandItem
                      key={fc.id}
                      value={`${fc.title}-${fc.id}`} // Combine title and id for uniqueness
                      onSelect={() => {
                        setSelectedFormCodeId(fc.id);
                        setOpen(false);
                      }}
                      className="my-1 flex flex-row items-center justify-between px-2 text-xs"
                    >
                      <div className="flex flex-col">
                        <p className="truncate text-wrap font-medium text-neutral-500">
                          {fc.title}
                        </p>
                        <p className=" opacity-50">
                          {formatDate(fc.startsAt, "MM/dd/yyyy")}
                        </p>
                      </div>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedAssessmentId === fc.id
                            ? "text-accent-secondary opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { AssessmentSelect };
