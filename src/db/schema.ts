import { DateToString } from "@/db/utils";
import { relations, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  decimal,
  foreignKey,
  integer,
  json,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  pgView,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["ADMIN", "STUDENT", "FACULTY", "NONE"]);
export const formItemTypeEnum = pgEnum("form_item_type", [
  "RANGE",
  "MULTIPLE_CHOICE",
  "SINGLE_CHOICE",
  "HEADER",
  "WRITTEN",
]);
export const ZFormEnum = z.enum([
  "RANGE",
  "MULTIPLE_CHOICE",
  "SINGLE_CHOICE",
  "HEADER",
  "WRITTEN",
]);
export type TFormItemType = z.infer<typeof ZFormEnum>;

export const formTypeEnum = pgEnum("form_type", [
  "OSCE",
  "SURVEY",
  "QUIZ",
  "DIRECT_OBSERVATION",
]);
export const ZFormTypeEnum = z.enum([
  "OSCE",
  "SURVEY",
  "QUIZ",
  "DIRECT_OBSERVATION",
]);
export type TFormType = z.infer<typeof ZFormTypeEnum>;

export const behaviors = pgTable("behaviors", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  description: text("description").notNull(),
  subcompetencyId: uuid("subcompetency_id")
    .notNull()
    .references(() => subcompetencies.id),
});

// TODO remove at some point
export const Behavior = typeof behaviors.$inferSelect;
export const behaviorRelations = relations(behaviors, ({ one }) => ({
  subcompetency: one(subcompetencies, {
    fields: [behaviors.subcompetencyId],
    references: [subcompetencies.id],
  }),
}));

export const competencies = pgTable("competencies", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
});
export type Competency = typeof competencies.$inferSelect;
export const competencyRelations = relations(competencies, ({ many }) => ({
  subcompetencies: many(subcompetencies),
}));

export const subcompetencies = pgTable("subcompetencies", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  level: smallint("level").notNull(),
  competencyId: uuid("competency_id")
    .notNull()
    .references((): AnyPgColumn => competencies.id),
  specialtyId: uuid("specialty_id")
    .notNull()
    .references((): AnyPgColumn => specialties.id),
});
export type Subcompetency = typeof subcompetencies.$inferSelect;
export const subcompetencyRelations = relations(
  subcompetencies,
  ({ one, many }) => ({
    competencies: one(competencies, {
      fields: [subcompetencies.competencyId],
      references: [competencies.id],
    }),
    specialties: one(specialties, {
      fields: [subcompetencies.specialtyId],
      references: [specialties.id],
    }),
    milestones: many(milestones),
    behaviors: many(behaviors),
  }),
);

export const milestones = pgTable("milestones", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // eg PC 1.2.3
  description: text("description").notNull(), // eg "demonstrates knowledge of patient care"
  level: smallint("level").notNull(), // eg 2
  sublevel: smallint("sublevel").notNull(), // eg 3
  subcompetencyId: uuid("subcompetency_id")
    .notNull()
    .references((): AnyPgColumn => subcompetencies.id),
  metadata: json("metadata"),
});
export type Milestone = typeof milestones.$inferSelect;
export const milestoneRelations = relations(milestones, ({ one, many }) => ({
  subcompetencies: one(subcompetencies, {
    fields: [milestones.subcompetencyId],
    references: [subcompetencies.id],
  }),
  questions: many(milestonesOnFormItems),
}));

export const specialties = pgTable("specialties", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
});
export type Specialty = typeof specialties.$inferSelect;
export const specialtyRelations = relations(specialties, ({ many }) => ({
  subcompetencies: many(subcompetencies),
}));

export const programs = pgTable("programs", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  specialtyId: uuid("specialty_id").references(
    (): AnyPgColumn => specialties.id,
  ),
});
export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export const programRelations = relations(programs, ({ one, many }) => ({
  specialties: one(specialties, {
    fields: [programs.specialtyId],
    references: [specialties.id],
  }),
  users: many(usersOnPrograms),
  forms: many(forms),
  roles: many(programRoles)
}));

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: roleEnum("role").notNull().default("NONE"),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export const userRelations = relations(users, ({ many }) => ({
  programs: many(usersOnPrograms),
  forms: many(forms),
  roles: many(rolesOnUsers)
}));

export const usersOnPrograms = pgTable("users_on_programs", {
  userId: uuid("user_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  programId: uuid("program_id")
    .notNull()
    .references((): AnyPgColumn => programs.id),
});
export type UserOnProgram = typeof usersOnPrograms.$inferSelect;
export type NewUserOnProgram = typeof usersOnPrograms.$inferInsert;
export const usersOnProgramsRelations = relations(
  usersOnPrograms,
  ({ one }) => ({
    user: one(users, {
      fields: [usersOnPrograms.userId],
      references: [users.id],
    }),
    program: one(programs, {
      fields: [usersOnPrograms.programId],
      references: [programs.id],
    }),
  }),
);

// todo more expansive role permissions
export const programRoles = pgTable("program_roles", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  roleName: text("role_name"),
  isAdmin: boolean("is_admin"),
  isStudent: boolean("is_student"),
  isOwner: boolean("is_owner"),
});
export type ProgramRole = typeof programRoles.$inferSelect;
export type NewProgramRole = typeof programRoles.$inferInsert;
export const programRoleRelations = relations(programRoles, ({ one }) => ({
  program: one(programs, {
    fields: [programRoles.programId],
    references: [programs.id],
  }),
}));

export const rolesOnUsers = pgTable(
  "roles_on_users",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    roleId: uuid("role_id")
      .notNull()
      .references(() => programRoles.id),
  },
  (table) => {
    return {
      id: primaryKey({
        columns: [table.userId, table.roleId],
      }),
    };
  },
);
export type RoleOnUser = typeof rolesOnUsers.$inferSelect;
export type NewRoleOnUser = typeof rolesOnUsers.$inferInsert;
export const rolesOnUserRelations = relations(rolesOnUsers, ({ one }) => ({
  user: one(users, {
    fields: [rolesOnUsers.userId],
    references: [users.id],
  }),
  role: one(programRoles, {
    fields: [rolesOnUsers.roleId],
    references: [programRoles.id],
  }),
}));

export const forms = pgTable("forms", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull().default("Untitled Evaluation"),
  lastOpenedAt: timestamp("last_opened_at").notNull().defaultNow(),
  type: formTypeEnum("type").notNull(),
  settings: jsonb("settings"),
  programId: uuid("program_id")
    .references((): AnyPgColumn => programs.id)
    .notNull(),
  creatorId: uuid("creator_id").references((): AnyPgColumn => users.id),
});
export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
export const formRelations = relations(forms, ({ one, many }) => ({
  programs: one(programs, {
    fields: [forms.programId],
    references: [programs.id],
  }),
  creator: one(users, {
    fields: [forms.creatorId],
    references: [users.id],
  }),
  formItems: many(formItems),
  assessments: many(assessments),
}));

export const formItems = pgTable("form_items", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  text: text("text"),
  description: text("description"),
  type: formItemTypeEnum("type").notNull(),
  position: integer("position").notNull(),
  isRequired: boolean("is_required").default(true),
  isScored: boolean("is_scored").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // todo how to figure out updatedAt
});
export type FormItem = typeof formItems.$inferSelect;
export type NewFormItem = typeof formItems.$inferInsert;
export const formItemRelations = relations(formItems, ({ one, many }) => ({
  form: one(forms, {
    fields: [formItems.formId],
    references: [forms.id],
  }),
  options: many(options),
  milestones: many(milestonesOnFormItems),
  recommendedMilestone: one(recommendedMilestones),
}));

export const options = pgTable("options", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  position: integer("position").notNull(),
  pointValue: decimal("point_value", { precision: 10, scale: 2 }),
  isNa: boolean("is_na").notNull().default(false),
  formItemId: uuid("form_item_id")
    .notNull()
    .references((): AnyPgColumn => formItems.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type Option = typeof options.$inferSelect;
export type NewOption = typeof options.$inferInsert;
export const optionRelations = relations(options, ({ one, many }) => ({
  formItem: one(formItems, {
    fields: [options.formItemId],
    references: [formItems.id],
  }),
  answers: many(answers),
}));

// MARK:  Milestones On Questions
export const milestonesOnFormItems = pgTable(
  "milestones_on_form_items",
  {
    formItemId: uuid("form_item_id")
      .notNull()
      .references((): AnyPgColumn => formItems.id, { onDelete: "cascade" }),
    milestoneId: uuid("milestone_id")
      .notNull()
      .references((): AnyPgColumn => milestones.id),
  },
  (table) => {
    return {
      id: primaryKey({
        columns: [table.formItemId, table.milestoneId],
      }),
      question: foreignKey({
        columns: [table.formItemId],
        foreignColumns: [formItems.id],
      }),
    };
  },
);
export type MilestonesOnFormItem = typeof milestonesOnFormItems.$inferSelect;
export type NewMilestoneOnFormItem = typeof milestonesOnFormItems.$inferInsert;
export const milestonesOnFormItemRelations = relations(
  milestonesOnFormItems,
  ({ one }) => ({
    milestone: one(milestones, {
      fields: [milestonesOnFormItems.milestoneId],
      references: [milestones.id],
    }),
    formItem: one(formItems, {
      fields: [milestonesOnFormItems.formItemId],
      references: [formItems.id],
    }),
  }),
);

export const responses = pgTable("responses", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  creatorId: uuid("creator_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  evaluateeId: uuid("evaluatee_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  duration: integer("duration"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type Response = DateToString<typeof responses.$inferSelect>;
export type NewResponse = typeof responses.$inferInsert;
export const responseRelations = relations(responses, ({ one, many }) => ({
  creator: one(users, {
    fields: [responses.creatorId],
    references: [users.id],
  }),
  answers: many(answers),
  evaluatee: one(users, {
    fields: [responses.evaluateeId],
    references: [users.id],
  }),
  assessment: one(assessments, {
    fields: [responses.assessmentId],
    references: [assessments.id],
  }),
}));

export const answers = pgTable("answers", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  selectedOptionIds: uuid("selected_option_ids")
    .references(() => options.id)
    .array(), // Array of option UUIDs
  responseId: uuid("response_id")
    .notNull()
    .references(() => responses.id, { onDelete: "cascade" }),
  formItemId: uuid("form_item_id")
    .notNull()
    .references(() => formItems.id, { onDelete: "cascade" }),
  textValue: text("text_value"),
});

export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;

export const answerRelations = relations(answers, ({ one, many }) => ({
  response: one(responses, {
    fields: [answers.responseId],
    references: [responses.id],
  }),
  formItem: one(formItems, {
    fields: [answers.formItemId],
    references: [formItems.id],
  }),
  selectedOptions: many(options),
}));

export const assessments = pgTable("assessments", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 6 }).notNull(),
  title: text("title").notNull(),
  startsAt: timestamp("starts_at").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  canceledAt: timestamp("canceled_at"),
  isDirectObservation: boolean("is_direct_observation")
    .notNull()
    .default(false),
});
export type Assessment = typeof assessments.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;
export const assessmentRelations = relations(assessments, ({ one, many }) => ({
  form: one(forms, {
    fields: [assessments.formId],
    references: [forms.id],
  }),
  evaluatees: many(assessmentsOnEvaluatees),
  responses: many(responses),
}));

export const assessmentsOnEvaluatees = pgTable(
  "assessments_on_evaluatees",
  {
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => {
    return {
      id: primaryKey({
        columns: [table.assessmentId, table.userId],
      }),
    };
  },
);
export type AssessmentOnEvaluatee = typeof assessmentsOnEvaluatees.$inferSelect;
export type NewAssessmentOnEvaluatee =
  typeof assessmentsOnEvaluatees.$inferInsert;
export const assessmentsOnEvaluateesRelations = relations(
  assessmentsOnEvaluatees,
  ({ one }) => ({
    assessment: one(assessments, {
      fields: [assessmentsOnEvaluatees.assessmentId],
      references: [assessments.id],
    }),
    user: one(users, {
      fields: [assessmentsOnEvaluatees.userId],
      references: [users.id],
    }),
  }),
);

export const recommendedMilestones = pgTable("recommended_milestones", {
  id: uuid(`id`)
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formItemId: uuid("form_item_id")
    .notNull()
    .references(() => formItems.id, { onDelete: "cascade" }),
  milestoneId: uuid("milestone_id")
    .notNull()
    .references(() => milestones.id),
  justification: text("justification").notNull(),
  score: integer("score").notNull(),
  isPositiveClassification: boolean("is_positive_classification"),
});
export type RecommendedMilestone = typeof recommendedMilestones.$inferSelect;
export type NewRecommendedMilestone = typeof recommendedMilestones.$inferInsert;
export const recommendedMilestoneRelations = relations(
  recommendedMilestones,
  ({ one }) => ({
    formItem: one(formItems, {
      fields: [recommendedMilestones.formItemId],
      references: [formItems.id],
    }),
    milestones: one(milestones, {
      fields: [recommendedMilestones.milestoneId],
      references: [milestones.id],
    }),
  }),
);

export const responseQuestionScoresView = pgView(
  "response_question_scores_view",
  {
    responseId: uuid("response_id")
      .references(() => responses.id)
      .notNull(),
    questionId: uuid("question_id")
      .references(() => formItems.id)
      .notNull(),
    pointsEarned: decimal("points_earned", { precision: 10, scale: 2 }),
    pointsAvailable: decimal("points_available", { precision: 10, scale: 2 }),
    milestoneIds: uuid("milestone_ids").array(),
    textValue: text("text_value"),
  },
).existing();

export const overallCompetencySummaryView = pgView(
  "overall_competency_summary_view",
  {
    evaluateeId: uuid("evaluatee_id")
      .references(() => users.id)
      .notNull(),
    competencyId: uuid("competency_id")
      .references(() => competencies.id)
      .notNull(),
    competencyName: text("competency_name").notNull(),
    avgScore: numeric("average_percentage_score").notNull(),
  },
).existing();

export const subcompetencyAverageScoreView = pgView(
  "subcompetency_average_score_view",
  {
    evaluateeId: uuid("evaluatee_id")
      .references(() => users.id)
      .notNull(),
    competencyId: uuid("competency_id")
      .references(() => competencies.id)
      .notNull(),
    competencyName: text("competency_name").notNull(),
    subcompetencyId: uuid("subcompetency_id")
      .references(() => subcompetencies.id)
      .notNull(),
    subcompetencyName: text("subcompetency_name").notNull(),
    avgScore: numeric("average_percentage_score").notNull(),
  },
).existing();

export const questionAverageScoreView = pgView("question_average_score_view", {
  responseId: uuid("response_id")
    .references(() => responses.id)
    .notNull(),
  questionId: uuid("question_id")
    .references(() => formItems.id)
    .notNull(),
  avgScore: decimal("points_earned", { precision: 10, scale: 2 }), // average of pointsEarned/available
}).existing();

export const responseCompetencyScoreView = pgView(
  "response_competency_scores_view",
  {
    responseId: uuid("response_id")
      .references(() => responses.id)
      .notNull(),
    evaluateeId: uuid("evaluatee_id").references(() => users.id), // can be null
    responseCreatedAt: timestamp("response_created_at").notNull(),
    competencyScores: jsonb("competency_scores").notNull(),
  },
).existing();

export const responseScoreView = pgView("response_score_view", {
  responseId: uuid("response_id")
    .references(() => responses.id)
    .notNull(),
  responseCreatedAt: timestamp("response_created_at").notNull(),
  totalPointsEarned: decimal("total_points_earned", {
    precision: 10,
    scale: 2,
  }),
  totalPointsAvailable: decimal("total_points_available", {
    precision: 10,
    scale: 2,
  }),
  responseDuration: integer("response_duration"),
}).existing();

export const responseAverageScoreView = pgView("response_average_score_view", {
  responseId: uuid("response_id")
    .references(() => responses.id)
    .notNull(),
  avgScore: decimal("points_earned", { precision: 10, scale: 2 }), // average of pointsEarned/available
}).existing();

// =============================================================================
//                           JSONB Column Validation
// =============================================================================

export const ZCompetencyScoresSchema = z.object({
  competencies: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      pointsEarned: z.number(),
      pointsAvailable: z.number(),
      subcompetencies: z.array(
        z.object({
          id: z.string().uuid(),
          name: z.string(),
          pointsEarned: z.number(),
          pointsAvailable: z.number(),
          abbrevName: z.string(),
          milestones: z.array(
            z.object({
              id: z.string().uuid(),
              name: z.string(),
              level: z.number(),
              sublevel: z.number(),
              pointsEarned: z.number(),
              pointsAvailable: z.number(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export type TCompetencyScoreSchema = z.infer<typeof ZCompetencyScoresSchema>;

export type TCompetencyScores = {
  responseId: string;
  responseCreatedAt: Date;
} & TCompetencyScoreSchema;
