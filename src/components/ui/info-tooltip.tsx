import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface InfoTooltipProps {
  children: ReactNode;
}

export function InfoTooltip({ children }: InfoTooltipProps) {
  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <InfoCircledIcon className="size-3 hover:opacity-80 transition" />
      </TooltipTrigger>
      <TooltipContent className="text-sm w-[200px]" >
        {children}
      </TooltipContent>
    </Tooltip>
    </TooltipProvider>
  )
}

export function InfoTooltipHeader({ children }: { children: ReactNode}) {
  return (
    <p className="font-medium py-1" >
      {children}
    </p>
  )
}

export function InfoTooltipContent({ children}: {children:ReactNode}) {
  return (
    <p className="font-normal p-1 text-gray-500 text-xs hyphens-auto" >
      {children}
    </p>
  )
}