import { BoxIcon, ClipboardPenIcon, EyeIcon, type LucideIcon } from 'lucide-react';
import type { TFormType } from '@/db/schema';

export const FORM_TYPE_ICONS: Record<TFormType,  LucideIcon> = {
  STATION: BoxIcon,
  SURVEY: EyeIcon,
  EVALUATION: ClipboardPenIcon,
};

export const FORM_TYPE_ASSIGNMENT_DESCRIPTIONS: Record<TFormType,  string> = {
  STATION: "A request will be sent to each evaluator for each evaluatee.",
  SURVEY: "A request will be sent to each respondent.",
  EVALUATION: "A request will be sent to each evaluator for each evaluatee.",
}