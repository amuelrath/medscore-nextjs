import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormErrorMessage } from '@/components/ui/form-error-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/helpers/utils';
import React, { FormEvent } from 'react';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

interface InputDialogProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  label: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
  onSubmit: (data: TFieldValues) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function InputDialog<TFieldValues extends FieldValues>({
  name,
  form,
  label,
  children,
  title,
  submitLabel = 'Submit',
  description,
  onSubmit,
  open,
  setOpen,
}: InputDialogProps<TFieldValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleSubmission = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit((data) => {
      onSubmit(data);
      if (Object.keys(form.formState.errors).length === 0) {
        setOpen(false);
      }
    })();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmission}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor={name} variant="light" className="text-left">
                {label}
              </Label>
              <Input
                id={name}
                className={cn(errors[name] && 'border-destructive')}
                ref={register(name).ref}
                onChange={register(name).onChange}
                name={register(name).name}
              />
            {errors[name] && (
              <FormErrorMessage message={errors[name]?.message as string} />
            )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
