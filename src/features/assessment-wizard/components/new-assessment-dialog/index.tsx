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
import { ZManageAccessFormSchema } from '@/features/form-builder/schemas/settings-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  BookDashedIcon,
  BookUserIcon, BoxesIcon, BoxIcon,
  EyeOffIcon,
  SendHorizonalIcon,
  UsersIcon,
} from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const ZNewAssessmentSchema = z.object({
  type: z.union([
    z.literal('TEMPLATE'), // create an assessment from a template
    z.literal('PAIR'), // participants in evaluatee/evaluator pairs. response affects the evaluatee's grade.
    z.literal('SELF'), // no evaluator/evaluatee. response affects the respondee's grade.
  ]),
});

type TNewAssessmentSchema = z.infer<typeof ZNewAssessmentSchema>;

function NewAssessmentDialogForm() {
  const { control, handleSubmit, watch } = useForm<TNewAssessmentSchema>({
    resolver: zodResolver(ZManageAccessFormSchema),
  });


  const submitFn = (data: TNewAssessmentSchema) => {
    console.log(data);
  // TODO ensure we RESET useAssessmentWizardStore and set the selected type
  };

  const selection = watch('type');
  const isTemplate = selection === 'TEMPLATE';

  return (
    <form onSubmit={handleSubmit(submitFn)} className="space-y-4">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <CardRadioGroup
            orientation="vertical"
            value={field.value}
            onValueChange={field.onChange}
          >
            <CardRadioGroupItem value="SELF">
              <CardRadioItemDescription>
                Self evaluations or general surveys.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{BoxesIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>Survey</CardRadioItemLabel>
            </CardRadioGroupItem>
            <CardRadioGroupItem value="PAIR">
              <CardRadioItemDescription>
                OSCEs, individual evaluations, or one-time assessments.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{BoxIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>Evaluation</CardRadioItemLabel>
            </CardRadioGroupItem>
            <CardRadioGroupItem value="TEMPLATE">
              <CardRadioItemDescription>
                Use saved templates from previous assessments to speed up creation.
              </CardRadioItemDescription>
              <CardRadioItemIcon>{BookDashedIcon}</CardRadioItemIcon>
              <CardRadioItemLabel>From Template</CardRadioItemLabel>
              <motion.div
                className="w-full space-y-3"
                animate={{
                  height: isTemplate ? '44.8px' : '0px',
                  opacity: isTemplate ? 1 : 0,
                }}
                transition={{ duration: 0.1 }}
              >
                {isTemplate && (
                  <>
                    <hr />
                    {/* assessment template options */}
                    template options here!!
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

export function NewAssessmentDialogTrigger() {
  return (
    <Dialog>
      <DialogTrigger asChild >
        <Button size="sm" variant="accent-secondary" className="flex space-x-2">
          <SendHorizonalIcon size={16} />
          <span>New Assessment</span>
        </Button>
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
            <p>New Assessment</p>
          </DialogTitle>
          <DialogDescription>
            Select the type of assessment you would like to create.
          </DialogDescription>
        </div>
        <hr />
        <NewAssessmentDialogForm />
      </DialogContent>
    </Dialog>
  );
}
