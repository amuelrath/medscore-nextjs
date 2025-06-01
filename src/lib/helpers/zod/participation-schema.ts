import { z } from 'zod';

export const ZPairSchema = z.object({
  evaluateeIds: z.array(z.string()).default([]),
  evaluatorId: z.array(z.string()).default([]),
  status: z.enum(['STARTED', 'NOT_STARTED', 'COMPLETED']),
});

export const ZParticipantsSchema = z.array(ZPairSchema);