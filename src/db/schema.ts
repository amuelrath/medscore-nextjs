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

export const roleEnum = pgEnum("role", ["ADMIN", "STUDENT", "FACULTY", "NONE"]);

export const behaviors = pgTable("behaviors", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  description: text("description").notNull(),
  subcompetencyId: uuid("subcompetency_id")
    .notNull()
    .references(() => subcompetencies.id),
});
export const Behvaior = typeof behaviors.$inferSelect;
export const behvaiorRelations = relations(behaviors, ({ one }) => ({
  subcompetency: one(subcompetencies, {
    fields: [behaviors.subcompetencyId],
    references: [subcompetencies.id],
  }),
}));

// MARK: Competencies
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

// MARK: Subcompetencies
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

// MARK: Milestones
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
  questions: many(milestonesOnQuestions),
}));

// MARK: Specialties
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

// MARK: Programs
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

// MARK: Users
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

// MARK: Users On Programs
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

// MARK: Forms
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
  questions: many(questions),
  tags: many(formTags),
  formCodes: many(formCodes),
}));

// MARK: Questions
export const questions = pgTable("questions", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  feedback: boolean("feedback").notNull().default(false),
  position: integer("position").notNull(),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
});
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export const questionRelations = relations(questions, ({ one, many }) => ({
  form: one(forms, {
    fields: [questions.formId],
    references: [forms.id],
  }),
  options: many(options),
  milestones: many(milestonesOnQuestions),
  recommendedMilestone: one(recommendedMilestones),
}));

// MARK: Options
export const options = pgTable("options", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  position: integer("position").notNull(),
  pointValue: decimal("point_value", { precision: 10, scale: 2 })
    .default("0.0")
    .notNull(),
  questionId: uuid("question_id")
    .notNull()
    .references((): AnyPgColumn => questions.id, { onDelete: "cascade" }),
});
export type Option = typeof options.$inferSelect;
export type NewOption = typeof options.$inferInsert;
export const optionRelations = relations(options, ({ one, many }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
  answers: many(answers),
}));

// MARK:  Milestones On Questions
export const milestonesOnQuestions = pgTable(
  "milestones_on_questions",
  {
    questionId: uuid("question_id")
      .notNull()
      .references((): AnyPgColumn => questions.id, { onDelete: "cascade" }),
    milestoneId: uuid("milestone_id")
      .notNull()
      .references((): AnyPgColumn => milestones.id),
  },
  (table) => {
    return {
      id: primaryKey({
        columns: [table.questionId, table.milestoneId],
      }),
      question: foreignKey({
        columns: [table.questionId],
        foreignColumns: [questions.id],
      }),
    };
  },
);
export type MilestonesOnQuestion = typeof milestonesOnQuestions.$inferSelect;
export type NewMilestoneOnQuestion = typeof milestonesOnQuestions.$inferInsert;
export const milestonesOnQuestionsRelations = relations(
  milestonesOnQuestions,
  ({ one }) => ({
    milestone: one(milestones, {
      fields: [milestonesOnQuestions.milestoneId],
      references: [milestones.id],
    }),
    question: one(questions, {
      fields: [milestonesOnQuestions.questionId],
      references: [questions.id],
    }),
  }),
);

// MARK: Responses
export const responses = pgTable("responses", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formCodeId: uuid("form_code_id")
    .notNull()
    .references(() => formCodes.id, { onDelete: "cascade" }),
  creatorId: uuid("creator_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  evaluateeId: uuid("evaluatee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  duration: integer("duration").notNull(),
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
  formCode: one(formCodes, {
    fields: [responses.formCodeId],
    references: [formCodes.id],
  }),
}));

// MARK: Answers
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
  feedback: text("feedback"),
  createdAt: timestamp("created_at"),
});
export type Answer = DateToString<typeof answers.$inferSelect>;
export type NewAnswer = typeof answers.$inferInsert;
export const answerRelations = relations(answers, ({ one, many }) => ({
  option: one(options, {
    fields: [answers.optionId],
    references: [options.id],
  }),
  response: one(responses, {
    fields: [answers.responseId],
    references: [responses.id],
  }),
}));

// MARK: Form Codes
export const formCodes = pgTable("form_codes", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 6 }).notNull(),
  title: text("title"),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  canceledAt: timestamp("canceled_at"),
  isDirectObservation: boolean("is_direct_observation")
    .notNull()
    .default(false),
});
export type FormCode = typeof formCodes.$inferSelect;
export type NewFormCode = typeof formCodes.$inferInsert;
export const formCodeRelations = relations(formCodes, ({ one, many }) => ({
  form: one(forms, {
    fields: [formCodes.formId],
    references: [forms.id],
  }),
  usersWithCode: many(formCodesOnUsers),
  responses: many(responses),
}));

// MARK: Form Codes on Users
export const formCodesOnUsers = pgTable(
  "form_codes_on_users",
  {
    formCodeId: uuid("form_code_id")
      .notNull()
      .references(() => formCodes.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => {
    return {
      id: primaryKey({
        columns: [table.formCodeId, table.userId],
      }),
    };
  },
);
export type FormCodeOnUser = typeof formCodesOnUsers.$inferSelect;
export type NewFormCodeOnUser = typeof formCodesOnUsers.$inferInsert;
export const formCodesOnUsersRelations = relations(
  formCodesOnUsers,
  ({ one }) => ({
    formCode: one(formCodes, {
      fields: [formCodesOnUsers.formCodeId],
      references: [formCodes.id],
    }),
    user: one(users, {
      fields: [formCodesOnUsers.userId],
      references: [users.id],
    }),
  }),
);

export const recommendedMilestones = pgTable("recommended_milestones", {
  id: uuid(`id`)
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
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
    question: one(questions, {
      fields: [recommendedMilestones.questionId],
      references: [questions.id],
    }),
    milestones: one(milestones, {
      fields: [recommendedMilestones.milestoneId],
      references: [milestones.id],
    }),
  }),
);

export const responsesView = pgMaterializedView("responses_view", {
  formId: uuid("form_id").notNull(),
  formCodeId: uuid("form_code_id").notNull(),
  formCodeCreatedAt: timestamp("form_code_created_at").notNull(),
  responseId: uuid("response_id").notNull(),
  evaluatorId: uuid("evaluator_id").notNull(),
  evaluatorFullName: text("evaluator_full_name").notNull(),
  evaluateeId: uuid("evaluatee_id").notNull(),
  evaluateeFullName: text("evaluatee_full_name").notNull(),
  questionId: uuid("question_id").notNull(),
  selectedOptionId: uuid("selected_option_id").notNull(),
  evaluatorFeedback: text("evaluator_feedback"),
  milestoneId: uuid("milestone_id"),
  milestoneDescription: text("milestone_description"),
  subcompetencyId: uuid("subcompetency_id"),
  subcompetencyName: text("subcompetency_name"),
  competencyId: uuid("competency_id"),
  competencyName: text("competency_name"),
  pointsEarned: decimal("point_value", { precision: 10, scale: 2 }),
  pointsAvailable: decimal("point_value", { precision: 10, scale: 2 }),
}).existing();
