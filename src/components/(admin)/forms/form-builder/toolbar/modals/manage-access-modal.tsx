'use client';

import { useFormBuilderStore } from '@/components/(admin)/forms/form-builder/store';
import { Button } from '@/components/ui/button';
import {
  CardRadioGroup,
  CardRadioGroupItem,
  CardRadioItemDescription,
  CardRadioItemIcon,
  CardRadioItemLabel,
} from '@/components/ui/card-radio-group';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserSelect } from '@/components/ui/user-select';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  BookUserIcon,
  EyeOffIcon,
  ScanFaceIcon,
  UsersIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const ZManageAccessFormSchema = z
  .object({
    editAccess: z.union([
      z.literal('ME'),
      z.literal('FACULTY'),
      z.literal('CUSTOM'),
    ]),
    editAccessUserIds: z.array(z.string().uuid()).optional(),
  })
  .refine((data) => {
    if (data.editAccess !== 'CUSTOM') return true;
    return (data.editAccessUserIds?.length || 0) >= 1;
  });

export type TManageAccessFormSchema = z.infer<typeof ZManageAccessFormSchema>;

function ManageAccessForm() {
  const params = useParams();
  const formId = params.formId.toString();

  const { setSettings, settings } = useFormBuilderStore();

  const { control, handleSubmit, watch } = useForm<TManageAccessFormSchema>({
    defaultValues: settings,
    resolver: zodResolver(ZManageAccessFormSchema),
  });

  const submitFn = (data: TManageAccessFormSchema) => {
    setSettings({
      ...settings,
      editAccess: data.editAccess,
      editAccessUserIds: data.editAccessUserIds,
    });
  };

  const selection = watch('editAccess');
  const isCustom = selection === 'CUSTOM';

  return (
    <form onSubmit={handleSubmit(submitFn)} className="space-y-4">
      <Controller
        control={control}
        name="editAccess"
        render={({ field }) => (
          <CardRadioGroup
            orientation="vertical"
            value={field.value}
            onValueChange={field.onChange}
          >
            <CardRadioGroupItem value="ME">
              <CardRadioItemDescription>
                Only you can edit and administer this form.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{EyeOffIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>Just Me</CardRadioItemLabel>
            </CardRadioGroupItem>
            <CardRadioGroupItem value="FACULTY">
              <CardRadioItemDescription>
                Only faculty in your program can edit and administer this form.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{UsersIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>Faculty</CardRadioItemLabel>
            </CardRadioGroupItem>
            <CardRadioGroupItem value="CUSTOM">
              <CardRadioItemDescription>
                Only people you choose can edit and administer this form.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{BookUserIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>People I Choose</CardRadioItemLabel>
              <motion.div
                animate={{
                  height: isCustom ? '44.8px' : '0px',
                  opacity: isCustom ? 1 : 0,
                }}
                transition={{ duration: 0.1 }}
                className="w-full space-y-3"
              >
                {isCustom && (
                  <>
                    <hr />
                    <UserSelect
                      formId={formId}
                      control={control}
                      name="editAccessUserIds"
                      placeholder="Search People..."
                    />
                  </>
                )}
              </motion.div>
            </CardRadioGroupItem>
          </CardRadioGroup>
        )}
      />
      <hr className="w-full" />
      <div className="flex w-full flex-row items-center justify-end space-x-2">
        <Button type="submit">Confirm</Button>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </div>
    </form>
  );
}

interface ManageAccessModalProps {
  children: ReactNode;
}

export function ManageAccessModal({ children }: ManageAccessModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="pointer-events-none flex items-center space-x-2">
          <span className="p-1.5 rounded-full bg-primary/10">
            <ScanFaceIcon size={16} className="text-foreground" />
          </span>
        </DialogTitle>
        <div className="space-y-1">
          <DialogTitle>
            <p>Manage Edit Access</p>
          </DialogTitle>
          <DialogDescription>
            Configure who can edit this form.
          </DialogDescription>
        </div>
        <hr />
        <ManageAccessForm />
      </DialogContent>
    </Dialog>
  );
}
