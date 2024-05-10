import z from "zod";

export const ZFormGetAllFormsQuerySchema = z.object({
  userId: z.string(),
});

export const ZFormGetOneFormQuerySchema = z.object({
  formId: z.string(),
  userId: z.string(),
});

export const ZFormAdministerFormMutationSchema = z.object({
  formId: z.string(),
  studentIds: z.array(z.string()),
  expiresAt: z.string(),
});

export const ZFormGetFormStatusQuerySchema = z.object({
  formId: z.string(),
});

export const ZFormCancelAdministerFormMutationSchema = z.object({
  formId: z.string(),
});

export const ZFormCreateNewFormMutationSchema = z.object({
  title: z.string(),
  programId: z.string(),
});

export const ZFormDeleteFormMutationSchema = z.object({
  formId: z.string(),
});

export const ZFormGetFormSubcompetenciesQuerySchema = z.object({
  formId: z.string(),
});

export const ZFormGetVersionsQuerySchema = z.object({
  formId: z.string(),
})
