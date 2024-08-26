import { z } from 'zod';

export const ZPairSchema = z.object({
  evaluateeIds: z.array(z.string()).default([]),
  evaluatorId: z.array(z.string()).default([]),
  status: z.enum(['STARTED', 'NOT_STARTED', 'COMPLETED']),
});

export const ZParticipantsSchema = z.array(ZPairSchema);

export const ZAssessorPoolParticipationSchema = z.object({
  evaluateeIds: z.array(z.string().uuid()), // people allowed to evaluate
  evaluatorIds: z.array(z.string().uuid()), // possible evaluatees
});

export const ZRespondeeParticipationSchema = z.array(z.string().uuid());

export type TSpecificPairParticipationSchema = z.infer<
  typeof ZParticipantsSchema
>;
export type TAssessorPoolParticipationSchema = z.infer<
  typeof ZAssessorPoolParticipationSchema
>;
export type TRespondeeParticipationSchema = z.infer<
  typeof ZRespondeeParticipationSchema
>;
