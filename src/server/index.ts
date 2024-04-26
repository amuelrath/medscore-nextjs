import { router } from "./trpc";
import { formRouter } from "./form-router/router";

export const appRouter = router({
  forms: formRouter,
});

export type AppRouter = typeof appRouter;
