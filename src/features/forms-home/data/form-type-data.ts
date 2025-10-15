import { ClipboardPenIcon, ClipboardPlusIcon, EyeIcon } from 'lucide-react';

export const FORM_TYPE_ICONS = {
  STATION: ClipboardPlusIcon,
  SURVEY: EyeIcon,
  EVALUATION: ClipboardPenIcon,
};
export const FORM_TYPE_COLORS = {
  OSCE: {
    text: 'text-accent-secondary/90',
    ring: 'ring-accent-secondary',
    bg: 'border-accent-secondary/40',
    border: 'bg-accent-secondary/20',
    color: 'hsl(var(--accent-secondary))',
  },
  EVALUATION: {
    text: 'text-accent/90',
    ring: 'ring-accent',
    bg: 'border-accent/40',
    border: 'bg-accent/20',
    color: 'hsl(var(--accent))',
  },
  DIRECT_OBSERVATION: {
    text: 'text-primary/90',
    ring: 'ring-primary',
    bg: 'border-primary/40',
    border: 'bg-primary/20',
    color: 'hsl(var(--primary))',
  },
};