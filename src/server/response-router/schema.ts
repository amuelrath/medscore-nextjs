import z from "zod";

export const ZResponseVerifyCodeMutationSchema = z.object({
  code: z.string(),
});

export const ZResponseGetFormVersionQuerySchema = z.object({
  formId: z.string(),
});

export const ZAnswerSchema = z.object({
  questionVersionId: z.string(),
  optionVersionId: z.string().optional(),
  feedback: z.string().optional(),
});

export const ZResponseSchema = z.object({
  formVersionId: z.string(),
  creatorId: z.string(),
  evaluateeId: z.string(),
  answers: z.array(ZAnswerSchema),
});
