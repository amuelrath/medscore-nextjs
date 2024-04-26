import { z } from "zod";

export const ZFormGetAllFormsQuerySchema = z.object({
  userId: z.string(),
});

export const ZFormGetOneFormQuerySchema = z.object({
  formId: z.string(),
  userId: z.string(),
});
