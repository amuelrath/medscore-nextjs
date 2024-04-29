import z from "zod";

export const ZResponseVerifyCodeMutationSchema = z.object({
  code: z.string(),
});

export const ZResponseGetFormVersionQuerySchema = z.object({
  formId: z.string(),
});
