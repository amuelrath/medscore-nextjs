import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

import { getCurrentPrograms } from "../actions/users/get-current-programs";
import { ZUserGetCurrentProgramsQuerySchema } from "./schema";

export const userRouter = router({
  getCurrentPrograms: publicProcedure
    .input(ZUserGetCurrentProgramsQuerySchema)
    .query(({ input }) => {
      return getCurrentPrograms(input.userId);
    }),
});
