import { z } from "zod";

export const ZUserGetCurrentProgramsQuerySchema = z.object({
  userId: z.string(),
});
