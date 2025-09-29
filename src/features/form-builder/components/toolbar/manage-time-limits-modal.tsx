'use client';

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
import { Input } from '@/components/ui/input';
import { ZManageTimeLimitsFormSchema } from '@/features/form-builder/schemas/settings-schemas';
import { useFormBuilderStore } from '@/features/form-builder/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { HourglassIcon, TimerIcon, TimerOffIcon, TimerResetIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

type TManageTimeLimitsFormSchema = z.infer<typeof ZManageTimeLimitsFormSchema>;

function ManageTimeLimitsForm() {
  const { setSettings, settings } = useFormBuilderStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<TManageTimeLimitsFormSchema>({
    defaultValues: {
      timeLimit: settings.timeLimits.timeLimit,
      customLimit: settings.timeLimits.customLimit,
    },
    resolver: zodResolver(ZManageTimeLimitsFormSchema),
  });

  const submitFn = (data: TManageTimeLimitsFormSchema) => {
    console.log('submitted!', data);
    console.log('settings before: ', settings);
    setSettings({
      ...settings,
      timeLimits: data
    });
  };

  console.log('settings after:', settings);


  const selection = watch('timeLimit');
  const isCustom = selection === 'CUSTOM';

  return (
    <form onSubmit={handleSubmit(submitFn)} className="space-y-4">
      <Controller
        control={control}
        name="timeLimit"
        render={({ field }) => (
          <CardRadioGroup
            orientation="vertical"
            value={field.value}
            onValueChange={field.onChange}
          >
            <CardRadioGroupItem value="NONE">
              <CardRadioItemDescription>
                No time limit will be enforced.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{TimerOffIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>None</CardRadioItemLabel>
            </CardRadioGroupItem>
            <CardRadioGroupItem value="CUSTOM">
              <CardRadioItemDescription>
                Set a custom time limit.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{TimerIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>Custom Time Limit</CardRadioItemLabel>
              <motion.div
                className="w-full space-y-3"
                animate={{
                  height: isCustom ? '50px' : '0px',
                  opacity: isCustom ? 1 : 0,
                }}
                transition={{ duration: 0.1 }}
              >
                {isCustom && (
                  <>
                    <hr className="mb-3" />
                    <Controller
                      control={control}
                      name="customLimit"
                      render={({ field }) => (
                        <Input
                          {...field}
                          format={(val) => val ? `${val} min` : val}
                          placeholder="Time Limit"
                          value={field.value}
                          onChange={e => field.onChange(Number(e.target.value))}
                          min="1"
                          step="1"
                        />
                      )}
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
        <DialogClose asChild>
          <Button type="submit">Confirm</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </div>
    </form>
  );
}

export function ManageTimeLimitsModal({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="pointer-events-none flex items-center space-x-2">
          <span className="p-1.5 rounded-full bg-primary/10">
            <HourglassIcon size={16} className="text-foreground" />
          </span>
        </DialogTitle>
        <div className="space-y-1">
          <DialogTitle>
            <p>Manage Time Limits</p>
          </DialogTitle>
          <DialogDescription>
            Configure time limits for responses.
          </DialogDescription>
        </div>
        <hr />
        <ManageTimeLimitsForm />
      </DialogContent>
    </Dialog>
  );
}
