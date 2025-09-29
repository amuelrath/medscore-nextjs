import { z } from 'zod';

export const ZPairSchema = z
  .object({
    evaluateeIds: z.array(z.string()).default([]),
    evaluatorId: z.array(z.string()).default([]),
    status: z.enum(['STARTED', 'NOT_STARTED', 'COMPLETED']),
  })


export const ZParticipantsSchema = z.array(ZPairSchema).min(1);

export const ZAssessmentSchema = z
  .object({
    formId: z.string().uuid(),
    title: z.string().min(1),
    startsAt: z.string(),
    expiresAt: z.string(),
    participants: ZParticipantsSchema,
    timeLimit: z.union([z.literal('NONE'), z.literal('CUSTOM')]),
    customLimit: z.union([
      z.coerce.number().min(1).describe('number of minutes allowed'),
      z.undefined(),
    ]),
    saveAndQuit: z.boolean(),
    multipleResponses: z.boolean(),
    revisions: z.boolean(),
  })
  .refine((data) => {
    // ensure that if there is a CUSTOM limit, a number is present
    if (data.timeLimit === 'CUSTOM') {
      return data.customLimit && data.customLimit > 0;
    }

    return true;
  });
