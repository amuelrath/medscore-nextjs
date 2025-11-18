'use client';

import { getAllFormsLite } from '@/actions/forms/get-all-forms-lite';
import { FormSectionHeaderButton } from '@/components/form-section-header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Loading from '@/components/ui/loading';
import { SearchInput } from '@/components/ui/search-input';
import { TFormType } from '@/db/schema';
import { FORM_TYPE_ICONS } from '@/features/forms-home/data/form-type-data';
import { truncate } from '@/lib/truncate';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon, SendHorizonalIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface FormCardProps {
  id: string;
  title: string;
  type: TFormType;
  countQuestions: number;
  isSelected: boolean;
  select: (id: string) => void;
}

function FormCard({
  id,
  title,
  countQuestions,
  isSelected,
  type,
  select,
}: FormCardProps) {
  const Icon = FORM_TYPE_ICONS[type];

  const selectForm = useCallback(() => {
    select(id);
  }, []);

  return (
    <button
      type="button"
      onClick={selectForm}
      className={cn(
        'p-2 w-full flex flex-row items-center rounded-md transition-colors border border-transparent hover:border-accent-secondary cursor-pointer justify-between',
        isSelected ? 'bg-primary/5' : 'bg-transparent hover:bg-transparent ',
      )}
    >
      <div className="w-full flex flex-row items-center text-start space-x-2">
        <span className="p-1.5 rounded-full bg-primary/10">
          <Icon size={20} className="text-primary/70" />
        </span>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{truncate(title, 40)}</span>
          <div className="flex space-x-1 text-neutral-500 text-xs">
            <span className="">{countQuestions} Questions</span>
            <span>•</span>
            <span>Changes 2 days ago</span>
          </div>
        </div>
      </div>
    </button>
  );
}

interface FormSelectFormProps {
  value?: string;
  handleAddComponent: (formId: string, type: TFormType, formTitle: string) => void;
}

function FormSelectForm({ value, handleAddComponent }: FormSelectFormProps) {
  // initialize state
  const [val, setVal] = useState<string>(value || '');
  const [searchValue, setSearchValue] = useState<string | null>(null);

  // get forms
  const {
    data: forms,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['forms'],
    queryFn: () =>
      getAllFormsLite({ userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const filteredForms = useMemo(
    () =>
      forms?.filter((f) => f.title.toLowerCase().includes(searchValue || '')) ||
      [],
    [forms, searchValue],
  );

  const select = useCallback((id: string) => {
    setVal(id);
  }, []);

  const handleSubmit = () => {
    // get the form's type too
    const form = forms?.find((f) => f.id === val) // fixme

    if (!form) return;

    const type = form.type
    const formTitle = form.title

    handleAddComponent(val, type, formTitle);
  };

  return (
    <>
      <div>
        <SearchInput
          size="sm"
          placeholder="Search forms. . ."
          onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
        />
        <ul className="overflow-y-scroll pt-2 h-72">
          {isLoading ? (
            <Loading />
          ) : (
            filteredForms?.map((f) => (
              <li key={f.id} className="p-1">
                <FormCard
                  id={f.id}
                  title={f.title}
                  type={f.type}
                  countQuestions={f.formItems.length}
                  isSelected={f.id === val}
                  select={select}
                />
              </li>
            ))
          )}
        </ul>
      </div>
      <hr className="w-full" />
      <div className="flex w-full flex-row items-center justify-end space-x-2">
        <DialogClose asChild>
          <Button type="submit" onClick={handleSubmit}>
            Confirm
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </div>
    </>
  );
}

export function FormSelectDialogTrigger({
  handleAddComponent,
}: {
  handleAddComponent: (formId: string, type: TFormType, formTitle: string) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <FormSectionHeaderButton LIcon={PlusIcon}>
          Add Component
        </FormSectionHeaderButton>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="pointer-events-none flex items-center space-x-2">
          <span className="p-1.5 rounded-full bg-primary/10">
            <SendHorizonalIcon size={16} className="text-foreground" />
          </span>
        </DialogTitle>
        <div className="space-y-1">
          <DialogTitle>
            <p>Select Form</p>
          </DialogTitle>
          <DialogDescription>
            Select the form you would like to add to this assessment.
          </DialogDescription>
        </div>
        <FormSelectForm handleAddComponent={handleAddComponent} />
      </DialogContent>
    </Dialog>
  );
}
