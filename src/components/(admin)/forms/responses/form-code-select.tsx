import * as React from "react";
import { useAtom } from "jotai/index";
import { selectedFormCodeIdAtom } from "@/store/responses-atoms";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/helpers/utils";
import { isBefore } from "date-fns";
import { useFormResult } from "@/hooks/queries/use-form-result";

function FormCodeSelect({ formId }: { formId: string }) {
  const [open, setOpen] = React.useState(false);
  const [selectedFormCodeId, setSelectedFormCodeId] = useAtom(
    selectedFormCodeIdAtom,
  );

  const { formResult } = useFormResult(formId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className="group flex h-7 w-full flex-row items-center justify-between rounded-md border border-neutral-300 bg-blue-800/5  px-4 font-medium text-neutral-600 transition-all hover:border-neutral-600"
        >
          <p className="truncate text-sm">
            {selectedFormCodeId
              ? formResult?.formCodes?.find(
                  (fc) => fc.id === selectedFormCodeId,
                )?.title
              : "Select an Administration"}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-card p-0 py-2">
        <Command className="bg-inherit">
          <CommandInput
            className="text-xs font-light"
            placeholder="Search administrations..."
          />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No administration found.</CommandEmpty>
              <CommandGroup>
                {formResult?.formCodes
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
                      <p className="truncate text-wrap font-medium text-neutral-500">
                        {fc.title}
                      </p>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedFormCodeId === fc.id
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

export { FormCodeSelect };
