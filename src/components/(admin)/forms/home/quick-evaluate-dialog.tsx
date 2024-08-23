'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LottieHover } from '@/components/ui/lottie-hover';
import PEN_ICON from 'public/icons/pencil-teal.json';
import { useState } from 'react';

export function QuickEvaluateDialog() {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          variant="accent-secondary"
          size="xs"
          className="flex font-semibold text-teal-900 items-center space-x-2"
        >
          <LottieHover size="xs" isHovering={hover} src={PEN_ICON} />
          <p>Quick Evaluate</p>
        </Button>
      </DialogTrigger>
      <DialogContent noCloseButton>
        <DialogHeader>
          <DialogTitle className="pointer-events-none flex items-center space-x-2">
            <LottieHover
              loop={false}
              isHovering={false}
              size="xs"
              src={PEN_ICON}
            />
            <p>Quick Evaluate</p>
          </DialogTitle>
          <DialogDescription>
            Choose what you would like to do.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
