import { relations, sql, max, eq, and, asc, avg, desc } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  decimal,
  uuid,
  smallint,
  pgEnum,
  timestamp,
  primaryKey,
  boolean,
  foreignKey,
  varchar,
  AnyPgColumn,
  json,
  pgView,
} from "drizzle-orm/pg-core";
import { DateToString } from "@/db/utils";
import { pgMaterializedView } from "drizzle-orm/pg-core/view";
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

export const formTags = pgTable("form_tags", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  tag: text("tag").notNull(),
  variant: text("variant").notNull().default("black"),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
});
export type FormTag = typeof formTags.$inferSelect;
export type NewFormTag = typeof formTags.$inferInsert;
export const formTagRelations = relations(formTags, ({ one }) => ({
  form: one(forms, {
    fields: [formTags.formId],
    references: [forms.id],
  }),
}));

export const forms = pgTable("forms", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull().default("Untitled Evaluation"),
  lastOpenedAt: timestamp("last_opened_at").notNull().defaultNow(),
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
  tags: many(formTags),
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
  optionId: uuid("option_id").references(() => options.id, {
    onDelete: "cascade",
  }),
  responseId: uuid("response_id")
    .notNull()
    .references(() => responses.id, { onDelete: "cascade" }),
  textValue: text("text_value"),
});
export type Answer = DateToString<typeof answers.$inferSelect>;
export type NewAnswer = typeof answers.$inferInsert;
export const answerRelations = relations(answers, ({ one }) => ({
  option: one(options, {
    fields: [answers.optionId],
    references: [options.id],
  }),
  response: one(responses, {
    fields: [answers.responseId],
    references: [responses.id],
  }),
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

// todo update materialized view for response info
export const answerTotalsView = pgView("answer_totals_view", {
  responseId: uuid("response_id").notNull(),
  responseCreatedAt: timestamp("response_created_at").notNull(), // for tracking a student's scores over time
  assessmentId: uuid("assessment_id").notNull(),
  assessmentCreatedAt: timestamp("assessment_created_at").notNull(), // for tracking a form's scores over time
  evaluateeId: uuid("evaluatee_id").notNull(),
  evaluatorId: uuid("evaluator_id").notNull(),
  formItemId: uuid("form_item_id").notNull(),
  formItemType: formItemTypeEnum("form_item_type").notNull(),
  selectedOptionId: uuid("selected_option_id"),
  pointsEarned: decimal("points_earned", { precision: 10, scale: 2 }),
  pointsAvailable: decimal("points_available", { precision: 10, scale: 2 }),
  textValue: text("text_value"),
  isNa: boolean("is_na").notNull(),
  isScored: boolean("is_scored").notNull(),
  milestoneId: uuid("milestone_id"),
  subcompetencyId: uuid("subcompetency_id"), // consider removing later, as we can get this info from the milestone id
  competencyId: uuid("competency_id"),
}).existing();
