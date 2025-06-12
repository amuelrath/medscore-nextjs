import { z } from 'zod';

export const ZPairSchema = z.object({
  evaluateeIds: z.array(z.string()).default([]),
  evaluatorId: z.array(z.string()).default([]),
  status: z.enum(['STARTED', 'NOT_STARTED', 'COMPLETED']),
});
export const ZParticipantsSchema = z.array(ZPairSchema);
export const ZRequestResponseFormSchema = z
  .object({
    formId: z.array(z.string().uuid()).max(1),
    title: z.string().optional(),
    formType: z.enum(['OSCE', 'EVALUATION', 'DIRECT_OBSERVATION']).nullable(),
    startsAt: z.string(),
    expiresAt: z.string(),
    participants: ZParticipantsSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.formType === ('OSCE' || 'EVALUATION')) {
        return (data.participants?.length || 0) > 0;
      }
      return true;
    },
    {
      message:
        'EVALUATION or OSCE form type must have specific pair participants',
      path: ['specificPairParticipants'],
    },
  );