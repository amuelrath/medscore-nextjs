'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LottieHover } from '@/components/ui/lottie-hover';
import { cn } from '@/lib/utils';
import { createForm } from '@/features/forms-home/actions/forms/create-form';
import { FormsLiteResult } from '@/actions/forms/get-all-forms-lite';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ADD from 'public/icons/add-card-teal.json';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { DEFAULT_FORM_NAME } from '@/features/form-builder/data/default-settings-data';
import { FORM_TYPE_ICONS } from '@/features/forms-home/data/form-type-data';

type FormType = 'OSCE' | 'EVALUATION' | 'DIRECT_OBSERVATION';
const formTypes: FormType[] = ['OSCE', 'EVALUATION', 'DIRECT_OBSERVATION'];

const formTypeDescriptions = {
  OSCE: 'OSCE: Structured clinical examination for assessing practical skills and competencies.',
  EVALUATION:
    'Evaluation: Create focused performance reviews tailored to your program.',
  DIRECT_OBSERVATION:
    'Direct Observation: Real-time assessment of performance in a clinical setting.',
};

export function CreateFormDialog() {
  const {
    mutateCreateForm,
    setSelectedType,
    selectedType,
    setHovering,
    hovering,
  } = useCreateFormDialog();

  const handleSelect = (type: FormType) => {
    setSelectedType(type);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="xs"
          className={cn('font-semibold')}
          variant="accent-secondary"
        >
          <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn('flex flex-row items-center space-x-2')}
          >
            <LottieHover
              loop={false}
              isHovering={hovering}
              size="xs"
              src={ADD}
            />
            <span className={cn('text-teal-900')}>New Form</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="pointer-events-none flex items-center space-x-2">
            <span className="p-1.5 rounded-full bg-primary/10">
              <LottieHover
                loop={false}
                isHovering={false}
                size="xs"
                src={ADD}
              />
            </span>
          </DialogTitle>
          <div className="space-y-1">
            <DialogTitle>
              <p>Create New Form</p>
            </DialogTitle>
            <DialogDescription>
              Select the form type that best fits your requirements.
            </DialogDescription>
          </div>
        </DialogHeader>
        <hr />
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-row space-x-4 items-center justify-center">
            {formTypes.map((formType) => (
              <FormTypeCard
                key={formType}
                type={formType}
                isSelected={formType === selectedType}
                handleSelect={handleSelect}
              />
            ))}
          </div>
          <div className="flex min-h-[40px] pb-2 w-full items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {selectedType && (
                <motion.div
                  key={selectedType}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ ease: 'easeInOut', duration: 0.15 }}
                  className="absolute origin-center text-sm"
                >
                  <div className="flex flex-col pr-8">
                    <span className="text-lg font-bold">
                      {formTypeDescriptions[selectedType].split(':')[0]}:
                    </span>
                    <p className="text-wrap">
                      {formTypeDescriptions[selectedType].split(':')[1]}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <hr className="w-full mb-2" />
          <div className="flex w-full flex-row items-center justify-end space-x-2">
            <Button onClick={() => mutateCreateForm()}>Create</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ZCreateFormSchema = z.object({
  title: z.string(),
  type: z.enum(['OSCE', 'DIRECT_OBSERVATION', 'EVALUATION']),
  programId: z.string(),
});

const useCreateFormDialog = () => {
  const router = useRouter();
  const [hovering, setHovering] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<FormType>('OSCE');

  const createFormParams = {
    title: DEFAULT_FORM_NAME[selectedType],
    type: selectedType,
    programId: 'a5d6ff06-c3c5-44c1-9bb3-8d9641b87081', // todo fixme
  };

  const queryClient = useQueryClient();
  const { mutate: mutateCreateForm } = useMutation({
    mutationFn: () => createForm(ZCreateFormSchema.parse(createFormParams)),
    onSuccess: (newFormData) => {
      if (!newFormData) return toast.error('Something went wrong.');
      // put the data in the query cache, redirect to /forms/{id}
      queryClient.setQueryData(
        ['forms'],
        (oldData: FormsLiteResult): FormsLiteResult => [
          ...oldData,
          newFormData,
        ],
      );

      return router.push(`/forms/${newFormData.id}`);
    },
    onError: () => toast.error('Something went wrong.'),
  });

  return {
    hovering,
    setHovering,
    selectedType,
    setSelectedType,
    mutateCreateForm,
  };
};

// should i put this in its own file so it isn't affected by the use client?
function FormTypeCard({
  isSelected,
  type,
  handleSelect,
}: {
  isSelected: boolean;
  type: FormType;
  handleSelect: (val: FormType) => void;
}) {
  const Icon = FORM_TYPE_ICONS[type];
  return (
    <div className="flex w-full cursor-pointer select-none flex-col space-y-2">
      <Card
        onClick={() => handleSelect(type)}
        className={cn(
          'flex h-28 w-full items-center justify-center p-8 shadow-sm transition-all duration-200',
          isSelected && `ring-2 ring-offset-2 ring-primary`,
        )}
      >
        <Icon size={64} strokeWidth={1} className="text-primary" />
      </Card>
      <p className="text-center text-xs font-light">
        {formTypeDescriptions[type].split(':')[0]}
      </p>
    </div>
  );
}
