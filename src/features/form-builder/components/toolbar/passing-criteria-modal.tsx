'use client';

import { useFormBuilderMilestones } from '@/features/form-builder/hooks/use-form-builder-milestones';
import { SubcompetencyAccordion } from '@/features/form-builder/components/toolbar/subcompetency-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Loading from '@/components/ui/loading';
import { BookCheckIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface PassingCriteriaModalProps {
  children: ReactNode;
}

export function PassingCriteriaModal({ children }: PassingCriteriaModalProps) {
  const { data, isLoading, isError } = useFormBuilderMilestones();

  if (isLoading || isError || !data) return <Loading />;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="min-w-[79vw]"
        onKeyDown={(e) => {
          if (
            ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
          ) {
            e.stopPropagation();
          }
        }}
      >
        <DialogTitle className="pointer-events-none flex items-center space-x-2">
          <span className="p-1.5 rounded-full bg-primary/10">
            <BookCheckIcon size={16} className="text-foreground" />
          </span>
        </DialogTitle>
        <DialogHeader className="flex flex-row justify-between items-end">
          <div className="space-y-1">
            <DialogTitle>
              <p>Manage Passing Criteria</p>
            </DialogTitle>
            <DialogDescription>
              Set thresholds to determine competency achievement.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="max-h-[63vh] overflow-y-auto snap-y snap-mandatory">
          <SubcompetencyAccordion subcompetencies={data} />
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" form="passing-criteria-form">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
