export const ROUTES = {
  AUTH: {
    AUTH: "auth",
  },
  APP: "/",
  SECURE: {
    DASHBOARD: {
      DASHBOARD: "secure/dashboard",
    },
    EVALUATIONS: {
      EDIT: {
        ID: (value: string) => ({
          ID: `secure/evaluations/edit/[id]/${value}`,
        }),
      },
      HOME: "secure/evaluations/home",
    },
    PROFILE: {
      PROFILE: "secure/profile",
    },
    PROGRAM: {
      PROGRAM: "secure/program",
    },
    REPORTS: {
      REPORTS: "secure/reports",
    },
  },
};
