import { getFormVersion } from "../actions/responses/get-form-version";
import { verifyCode } from "../actions/responses/verify-code";
import { publicProcedure, router } from "../trpc";
import {
  ZResponseGetFormVersionQuerySchema,
  ZResponseVerifyCodeMutationSchema,
} from "./schema";

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
});
