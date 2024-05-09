import { getAllForms } from "../actions/forms/get-all-forms";
import { getOneForm } from "../actions/forms/get-one-form";
import { administerForm } from "../actions/forms/administer-form";
import {
  ZFormAdministerFormMutationSchema,
  ZFormCancelAdministerFormMutationSchema,
  ZFormCreateNewFormMutationSchema,
  ZFormDeleteFormMutationSchema,
  ZFormGetAllFormsQuerySchema,
  ZFormGetFormStatusQuerySchema,
  ZFormGetFormSubcompetenciesQuerySchema,
  ZFormGetOneFormQuerySchema,
  ZFormGetResponsesQuerySchema,
} from "./schema";
import { publicProcedure, router } from "../trpc";
import { getFormStatus } from "../actions/forms/get-form-status";
import { cancelAdministerForm } from "../actions/forms/cancel-administer-form";
import { createForm } from "../actions/forms/create-form";
import { deleteForm } from "../actions/forms/delete-form";
import { subcompetencies } from "@/db/schema";
import { getSubcompetencies } from "../actions/forms/get-subcompetencies";
import { getResponses } from "@/server/actions/forms/get-responses";

export const formRouter = router({
  all: publicProcedure.input(ZFormGetAllFormsQuerySchema).query(({ input }) => {
    return getAllForms(input.userId);
  }),
  byId: publicProcedure.input(ZFormGetOneFormQuerySchema).query(({ input }) => {
    return getOneForm(input.formId, input.userId);
  }),
  administer: publicProcedure
    .input(ZFormAdministerFormMutationSchema)
    .mutation(({ input }) => {
      return administerForm(
        input.formId,
        input.studentIds,
        new Date(input.expiresAt),
      );
    }),
  status: publicProcedure
    .input(ZFormGetFormStatusQuerySchema)
    .query(({ input }) => getFormStatus(input.formId)),
  stopAdminister: publicProcedure
    .input(ZFormCancelAdministerFormMutationSchema)
    .mutation(({ input }) => {
      return cancelAdministerForm(input.formId);
    }),
  insert: publicProcedure
    .input(ZFormCreateNewFormMutationSchema)
    .mutation(({ input }) => {
      return createForm(input.title, input.programId);
    }),
  delete: publicProcedure
    .input(ZFormDeleteFormMutationSchema)
    .mutation(({ input }) => {
      return deleteForm(input.formId);
    }),
  subcompetencies: publicProcedure
    .input(ZFormGetFormSubcompetenciesQuerySchema)
    .query(({ input }) => {
      return getSubcompetencies(input.formId);
    }),
  responses: publicProcedure
    .input(ZFormGetResponsesQuerySchema)
    .query(({ input }) => {
      return getResponses(input.formId);
    }),
});
