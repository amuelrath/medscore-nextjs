import { z } from 'zod';

export const ZRequestStatus = z.enum(['STARTED', 'NOT_STARTED', 'COMPLETED']);
export const ZPairSchema = z.object({
  type: z.literal('PAIR'),
  requests: z.array(
    z.object({
      respondeeId: z.string().uuid(),
      evaluateeIds: z.array(z.string().uuid()),
      status: ZRequestStatus,
    }),
  ),
});
export type TPairSchema = z.infer<typeof ZPairSchema>;

export const ZSelfSchema = z.object({
  type: z.literal('SELF'),
  requests: z.array(
    z.object({
      respondeeId: z.string().uuid(),
      status: ZRequestStatus,
    }),
  ),
});
export type TSelfSchema = z.infer<typeof ZSelfSchema>;

export const ZParticipantsSchema = z.discriminatedUnion('type', [
  ZPairSchema,
  ZSelfSchema,
]);
export type TParticipantsSchema = z.infer<typeof ZParticipantsSchema>;

export const ZAssessmentComponentSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  title: z.string().min(1, { message: "Component title required." }),

  // settings
  saveAndQuit: z.boolean(),
  multipleResponses: z.boolean(),
  revisions: z.boolean(),
  startsAt: z.string().min(1, "Enter a starting time."),
  expiresAt: z.string().min(1, "Enter an ending time."),
});
export type TAssessmentComponentSchema = z.infer<
  typeof ZAssessmentComponentSchema
>;

export const ZAssessmentSchema = z.object({
  // details step
  components: z.array(ZAssessmentComponentSchema).min(1, { message: "At least one component required." }),

  // participants step
  participants: ZParticipantsSchema,

  // deploy step
  title: z.string().min(1, 'Group must have a title.'),
});
export type TAssessmentSchema = z.infer<typeof ZAssessmentSchema>;

export const ZAssessmentDetailsStepSchema = ZAssessmentSchema.pick({
  components: true,
});
export type TAssessmentDetailsStepSchema = z.infer<
  typeof ZAssessmentDetailsStepSchema
>;
