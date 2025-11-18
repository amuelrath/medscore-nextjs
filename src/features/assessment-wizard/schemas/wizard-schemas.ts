import { ZFormTypeEnum } from '@/db/schema';
import { isBefore } from 'date-fns';
import { z } from 'zod';

export const ZAssessmentDetailsStepSchema = z.object({
  title: z.string().min(1, 'Enter a title for this assessment.'),
  startsAt: z.string().min(1, 'Enter a starting date and time.'),
  expiresAt: z.string().min(1, 'Enter an ending date and time.'),
});
export type TAssessmentDetailsStepSchema = z.infer<
  typeof ZAssessmentDetailsStepSchema
>;

// todo refine to ensure we dont mismatch assignments and types
export const ZAssessmentComponentSchema = z
  .object({
    id: z.string().uuid(),
    formId: z.string().uuid(),
    type: ZFormTypeEnum,
    title: z.string().min(1, { message: 'Component title required.' }),
    formTitle: z.string(),

    // settings
    saveAndQuit: z.boolean(),
    multipleResponses: z.boolean(),
    revisions: z.boolean(),
    startsAt: z.string().min(1, 'Enter a starting time.'),
    expiresAt: z.string().min(1, 'Enter an ending time.'),

    // assignments
    respondeeIds: z.array(z.string().uuid()),
    evaluateeIds: z.array(z.string().uuid()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'EVALUATION' || data.type === 'STATION') {
      if (data.respondeeIds.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one evaluator is required.',
          path: ['respondeeIds'],
        });
      }
      if (data.evaluateeIds?.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one evaluatee is required.',
          path: ['evaluateeIds'],
        });
      }
    }

    if (data.type === 'SURVEY') {
      if (data.respondeeIds.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one respondent is required.',
          path: ['respondeeIds'],
        });
      }
    }

    // closesAt must be before opensAt
    if (isBefore(data.expiresAt, data.startsAt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'End time must be after start time.',
        path: ['expiresAt'],
      });
    }
  });
export type TAssessmentComponentSchema = z.infer<
  typeof ZAssessmentComponentSchema
>;

export const ZAssessmentSchema = z.object({
  // details step
  details: ZAssessmentDetailsStepSchema,

  // components step
  components: z
    .array(ZAssessmentComponentSchema)
    .min(1, { message: 'At least one component required.' }),
});
export type TAssessmentSchema = z.infer<typeof ZAssessmentSchema>;

export const ZAssessmentComponentsStepSchema = ZAssessmentSchema.pick({
  components: true,
});
export type TAssessmentComponentsStepSchema = z.infer<
  typeof ZAssessmentComponentsStepSchema
>;
