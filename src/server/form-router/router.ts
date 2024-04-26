import { TRPCError } from "@trpc/server";
import { getAllForms } from "@/lib/server-only/forms/get-all-forms";
import { getOneForm } from "@/lib/server-only/forms/get-one-form";
import {
  ZFormGetAllFormsQuerySchema,
  ZFormGetOneFormQuerySchema,
} from "./schema";
import { publicProcedure, router } from "../trpc";

export const formRouter = router({
  getAllForms: publicProcedure
    .input(ZFormGetAllFormsQuerySchema)
    .query(({ input }) => {
      return getAllForms(input.userId);
    }),
  getOneForm: publicProcedure
    .input(ZFormGetOneFormQuerySchema)
    .query(({ input }) => {
      return getOneForm(input.formId, input.userId);
    }),
});
