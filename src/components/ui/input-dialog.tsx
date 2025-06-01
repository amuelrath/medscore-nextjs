import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormErrorMessage } from '@/components/ui/form-error-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/helpers/utils';
import { EditIcon, LucideProps } from 'lucide-react';
import React, {
  FormEvent,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

interface InputDialogProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  placeholder?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
  onSubmit: (data: TFieldValues) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  asChild?: boolean;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}

export function InputDialog<TFieldValues extends FieldValues>({
  name,
  form,
  placeholder,
  children,
  title,
  submitLabel = 'Submit',
  description,
  onSubmit,
  open,
  setOpen,
  asChild = true,
  Icon = EditIcon,
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
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle className="pointer-events-none flex items-center space-x-2">
          <span className="p-1.5 rounded-full bg-primary/10">
            <Icon size={16} className="text-foreground" />
          </span>
        </DialogTitle>
        <div className="space-y-1">
          <DialogTitle>
            <p>{title}</p>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>
        <hr />
        <form onSubmit={handleSubmission}>
          <div className="pb-4">
            <div className="flex flex-col space-y-2">

              <Input
                id={name}
                className={cn(errors[name] && 'border-destructive')}
                placeholder={placeholder}
                ref={register(name).ref}
                onChange={register(name).onChange}
                name={register(name).name}
              />
              {errors[name] && (
                <FormErrorMessage message={errors[name]?.message as string} />
              )}
            </div>
          </div>
<hr/>
          <DialogFooter className="mt-4" >
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
