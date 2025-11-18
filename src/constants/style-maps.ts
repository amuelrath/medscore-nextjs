import { TRoleEnum } from '@/db/schema';
import { AvatarColor } from '@/components/ui/avatar';

export const AVATAR_ROLE_COLOR_MAP: Record<TRoleEnum, AvatarColor> = {
  "STUDENT": "accent",
  "FACULTY": "primary",
  "ADMIN": "primary",
  "NONE": "accent"
} as const