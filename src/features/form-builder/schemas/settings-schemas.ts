import { z } from 'zod';

export const ZPassingCriteriaSchema = z.array(
  z.object({
    subcompetencyId: z.string().uuid(),
    threshold: z.number().min(0).max(1),
    levelThresholds: z.array(
      z.object({
        level: z.number().int().min(1).max(5),
        threshold: z.number().min(0).max(1),
      }),
    ),
  }),
);

export const ZManageAccessFormSchema = z
  .object({
    editAccess: z.union([
      z.literal('ME'),
      z.literal('FACULTY'),
      z.literal('CUSTOM'),
    ]),
    editAccessUserIds: z.array(z.string().uuid()).optional(),
  })
  .refine((data) => {
    if (data.editAccess !== 'CUSTOM') return true;
    return (data.editAccessUserIds?.length || 0) >= 1;
  });

export const ZFormBuilderSettingsSchema = z
  .object({
    editAccess: z.union([
      z.literal('ME'),
      z.literal('FACULTY'),
      z.literal('CUSTOM'),
    ]),
    editAccessUserIds: z.array(z.string().uuid()).optional(),
    enableScoring: z.boolean(),
    passingCriteria: ZPassingCriteriaSchema,
  })
  .refine((data) => {
    // if we have custom editors selected, there must be ids
    if (data.editAccess !== 'CUSTOM') return true; // todo i dont think this string means anything
    if ((data.editAccessUserIds?.length || 0) < 1)
      return { message: 'Must have at least one allowed editor.' };
  });
