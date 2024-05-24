import { router } from "./trpc";
import { formRouter } from "./form-router/router";
import { userRouter } from "./user-router/router";
import { responseRouter } from "./response-router/router";
import { aiRouter } from "@/server/ai-router/router";
export const appRouter = router({
  forms: formRouter,
  users: userRouter,
  responses: responseRouter,
  ai: aiRouter
});

export type AppRouter = typeof appRouter;
