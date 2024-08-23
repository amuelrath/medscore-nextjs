import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { VariantProps } from 'class-variance-authority';
import { ReactNode, useState } from 'react';

interface ConfirmInterceptorProps {
  children: ReactNode;
  onConfirm: () => void;
  title: string;
  description: string;
  asChild?: boolean;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  confirmText?: string;
}

function ConfirmDialog({
  children,
  onConfirm,
  title,
  description,
  asChild = true,
  buttonVariant = 'default',
  confirmText = 'Confirm',
}: ConfirmInterceptorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={buttonVariant} onClick={handleConfirm}>
            {confirmText}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
