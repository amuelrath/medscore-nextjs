'use client';

import {
  FormSectionHeader,
  FormSectionHeaderContent,
  FormSectionHeaderIcon,
  FormSectionHeaderTitle,
} from '@/components/form-section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getAllFormsLite } from '@/actions/forms/get-all-forms-lite';
import { truncate } from '@/lib/truncate';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  CheckIcon,
  ChevronsUpDown,
  FileIcon,
  FileStackIcon,
  RotateCcwIcon,
  SearchIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAssessmentWizardStore } from '@/features/assessment-wizard/store';

function FormSelectPopover() {
  return <div>test</div>;
}

interface FormSelectComboboxProps {
  value?: string | undefined;
  onChange?: (value: string | undefined) => void;
}

export function FormSelectCombobox({ value, onChange }: FormSelectComboboxProps) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<string | undefined>(value);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const {
    data: forms,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['forms'],
    queryFn: () =>
      getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  useEffect(() => {
    if (onChange) {
      onChange(val);
    }
  }, [val, onChange]);

  const handleFormSelect = (formId: string | undefined) => {
    setVal(formId);
  };

  if (!forms) return null;

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="absolute top-0 right-0"
        >
          Add Form
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-[300px] flex flex-col p-0">
        <div className="sticky top-[0.01px] bg-white rounded-t-md flex flex-row space-x-2 px-2 items-center border-b">
          <SearchIcon className="opacity-50" size={16} />
          <Input
            placeholder="Search forms..."
            variant="transparent"
            size="sm"
            value={searchValue || ''}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex-grow flex flex-col h-52 mb-1 overflow-y-scroll scrollbar scrollbar-track-transparent pb-4 scrollbar-thumb-neutral-300">
          {forms
            .filter((f) =>
              f.title.toLowerCase().includes(searchValue?.toLowerCase() || ''),
            )
            ?.map((f) => (
              <Button
                key={f.id}
                variant="hide"
                className="justify-between min-h-10 h-10 rounded-none hover:bg-primary/5 border-b border-border flex-shrink-0"
                onClick={() => {
                  if (val === f.id) {
                    handleFormSelect(undefined);
                  } else {
                    handleFormSelect(f.id);
                  }
                }}
              >
                <p className="text-xs">{truncate(f.title, 40)}</p>
                {val === f.id && (
                  <CheckIcon
                    size={16}
                    className="opacity-50 text-accent-secondary"
                  />
                )}
              </Button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AssessmentFormTemplateSection() {
  const selectedComponentId = useAssessmentWizardStore(
    (state) => state.selectedComponentId,
  );

  const component = useAssessmentWizardStore((state) =>
    state.components.find((a) => a.id === selectedComponentId),
  );

  const updateComponent = useAssessmentWizardStore(
    (state) => state.updateComponent,
  );


  // todo fixme
  if (!component) return 'No Component Selected';

  return (
    <div className="space-y-1">
      <FormSectionHeader>
        <FormSectionHeaderContent>
          <FormSectionHeaderIcon Icon={FileStackIcon} />
          <FormSectionHeaderTitle>Forms</FormSectionHeaderTitle>
        </FormSectionHeaderContent>
      </FormSectionHeader>
      <div className="space-y-2">
        <FormSelectCombobox value={component.formId} onChange={(val) => {
          updateComponent(selectedComponentId, { formId: val })
        }} />
      </div>
    </div>
  );
}
