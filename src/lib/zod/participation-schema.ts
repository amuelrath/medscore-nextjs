import { z } from "zod";

export const ZPairSchema = z.object({
  evaluateeIds: z.array(z.string().uuid()),
  evaluatorId: z.array(z.string().uuid()),
});

export const ZSpecificPairParticipationSchema = z.array(ZPairSchema);

export const ZAssessorPoolParticipationSchema = z.object({
  evaluateeIds: z.array(z.string().uuid()), // people allowed to evaluate
  evaluatorIds: z.array(z.string().uuid()), // possible evaluatees
});

export const ZRespondeeParticipationSchema = z.array(z.string().uuid());

export type TSpecificPairParticipationSchema = z.infer<typeof ZSpecificPairParticipationSchema>
export type TAssessorPoolParticipationSchema = z.infer<typeof ZAssessorPoolParticipationSchema>
export type TRespondeeParticipationSchema = z.infer<typeof ZRespondeeParticipationSchema>
