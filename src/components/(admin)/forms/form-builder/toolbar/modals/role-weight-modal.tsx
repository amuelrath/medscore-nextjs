'use client';

import { RoleWeightTable } from '@/components/(admin)/forms/form-builder/toolbar/role-weight-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { WeightIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface RoleWeightModalProps {
  children: ReactNode;
}

export function RoleWeightModal({ children }: RoleWeightModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="min-w-[50vw]"
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
            <WeightIcon size={16} className="text-foreground" />
          </span>
        </DialogTitle>
        <DialogHeader className="flex flex-row justify-between items-end">
          <div className="space-y-1">
            <DialogTitle>
              <p>Manage Role Weights</p>
            </DialogTitle>
            <DialogDescription>
              Adjust the score impact depending on the evaluator&apos;s role.
            </DialogDescription>
          </div>
        </DialogHeader>
        <RoleWeightTable />
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
