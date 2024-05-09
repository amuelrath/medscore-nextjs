import { getFormVersion } from "../actions/responses/get-form-version";
import { verifyCode } from "../actions/responses/verify-code";
import { publicProcedure, router } from "../trpc";
import {
  ZResponseGetFormVersionQuerySchema,
  ZResponseSchema,
  ZResponseVerifyCodeMutationSchema,
} from "./schema";
import { submitResponse } from "@/server/actions/responses/submit-response";
import { TResponseSchema } from "@/db/types";

export const responseRouter = router({
  verifyCode: publicProcedure
    .input(ZResponseVerifyCodeMutationSchema)
    .mutation(({ input }) => {
      return verifyCode(input.code);
    }),
  getFormById: publicProcedure
    .input(ZResponseGetFormVersionQuerySchema)
    .query(({ input }) => {
      return getFormVersion(input.formId);
    }),
  submitResponse: publicProcedure
    .input(ZResponseSchema)
    .mutation(({ input }) => {
      return submitResponse(input as unknown as TResponseSchema);
    }),
});
