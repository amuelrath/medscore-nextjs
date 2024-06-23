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
  numeric,
} from "drizzle-orm/pg-core";
import { DateToString } from "@/db/utils";

export const roleEnum = pgEnum("role", ["ADMIN", "STUDENT", "FACULTY", "NONE"]);

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
    competencyPerformanceSummaries: many(competencyPerformanceSummaries),
  }),
);

// MARK: Milestones
export const milestones = pgTable("milestones", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // eg PC 1.2.3
  description: text("description").notNull(), // eg "demonstrates knowledge of patient care"
  simpleDescription: text("simple_description").notNull(),
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
  formVersions: many(formVersions),
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
  competencyPerformanceSummaries: many(competencyPerformanceSummaries),
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
export type Newform = typeof forms.$inferInsert;
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
  versions: many(formVersions),
  tags: many(formTags),
}));

// MARK: Questions
export const questions = pgTable("questions", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  simpleDescription: text("simple_description"),
  feedback: boolean("feedback").notNull().default(false),
  position: integer("position").notNull(),
  metadata: json("metadata"),
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
  formVersionId: uuid("form_version_id")
    .notNull()
    .references(() => formVersions.id, { onDelete: "cascade" }),
  creatorId: uuid("creator_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  evaluateeId: uuid("evaluatee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type Response = DateToString<typeof responses.$inferSelect>;
export type NewResponse = typeof responses.$inferInsert;
export const responseRelations = relations(responses, ({ one, many }) => ({
  // connect to form version
  creator: one(users, {
    fields: [responses.creatorId],
    references: [users.id],
  }),
  answers: many(answers),
  evaluatee: one(users, {
    fields: [responses.evaluateeId],
    references: [users.id],
  }),
  formVersions: one(formVersions, {
    fields: [responses.formVersionId],
    references: [formVersions.id],
  }),
  competencyScores: many(competencyScores),
}));

// COMPETENCY SCORES
export const competencyScores = pgTable("competency_scores", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  responseId: uuid("response_id")
    .notNull()
    .references(() => responses.id, { onDelete: "cascade" }),
  competencyId: uuid("competency_id")
    .notNull()
    .references(() => competencies.id),
  score: text("score").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type CompetencyScore = typeof competencyScores.$inferSelect;
export type NewCompetencyScore = typeof competencyScores.$inferInsert;
export const competencyScoreRelations = relations(
  competencyScores,
  ({ one }) => ({
    response: one(responses, {
      fields: [competencyScores.responseId],
      references: [responses.id],
    }),
    competency: one(competencies, {
      fields: [competencyScores.competencyId],
      references: [competencies.id],
    }),
  }),
);

// MARK: Answers
export const answers = pgTable("answers", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  questionVersionId: uuid("question_version_id")
    .notNull()
    .references(() => questionVersions.id, { onDelete: "cascade" }),
  optionVersionId: uuid("option_version_id").references(
    () => optionVersions.id,
    { onDelete: "cascade" },
  ),
  responseId: uuid("response_id")
    .notNull()
    .references(() => responses.id, { onDelete: "cascade" }),
  feedback: text("feedback"),
  createdAt: timestamp("created_at"),
});
export type Answer = DateToString<typeof answers.$inferSelect>;
export type NewAnswer = typeof answers.$inferInsert;
export const answerRelations = relations(answers, ({ one, many }) => ({
  optionVersion: one(optionVersions, {
    fields: [answers.optionVersionId],
    references: [optionVersions.id],
  }),
  questionVersions: one(questionVersions, {
    fields: [answers.questionVersionId],
    references: [questionVersions.id],
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
  formVersionId: uuid("form_version_id")
    .notNull()
    .references(() => formVersions.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 6 }).notNull(),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
export type FormCode = typeof formCodes.$inferSelect;
export type NewFormCode = typeof formCodes.$inferInsert;
export const formCodeRelations = relations(formCodes, ({ one, many }) => ({
  form: one(formVersions, {
    fields: [formCodes.formVersionId],
    references: [formVersions.id],
  }),
  usersWithCode: many(formCodesOnUsers),
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

// MARK: Form Versions
export const formVersions = pgTable("form_versions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type FormVersion = typeof formVersions.$inferSelect;
export type NewFormVersion = typeof formVersions.$inferInsert;
export const formVersionRelations = relations(
  formVersions,
  ({ one, many }) => ({
    form: one(forms, {
      fields: [formVersions.formId],
      references: [forms.id],
    }),
    questions: many(questionVersions),
    code: one(formCodes, {
      fields: [formVersions.id],
      references: [formCodes.formVersionId],
    }),
    usersWithCode: many(formCodesOnUsers),
    program: one(programs, {
      fields: [formVersions.programId],
      references: [programs.id],
    }),
    responses: many(responses),
    competencyPerformanceSummaries: many(competencyPerformanceSummaries),
  }),
);

// MARK: Question Versions
export const questionVersions = pgTable("question_versions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formVersionId: uuid("form_version_id")
    .notNull()
    .references(() => formVersions.id, { onDelete: "cascade" }),
  text: text("text"),
  feedback: boolean("feedback").notNull(),
  position: integer("position").notNull(),
});
export type QuestionVersion = typeof questionVersions.$inferSelect;
export type NewQuestionVersion = typeof questionVersions.$inferInsert;
export const questionVersionRelations = relations(
  questionVersions,
  ({ one, many }) => ({
    formVersion: one(formVersions, {
      fields: [questionVersions.formVersionId],
      references: [formVersions.id],
    }),
    options: many(optionVersions),
    milestones: many(milestoneOnQuestionVersions),
    answers: many(answers),
  }),
);

// MARK: Option Versions
export const optionVersions = pgTable("option_versions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  questionVersionId: uuid("question_version_id")
    .notNull()
    .references(() => questionVersions.id, { onDelete: "cascade" }),
  text: text("text"),
  position: integer("position").notNull(),
  pointValue: decimal("point_value").notNull(),
});
export type OptionVersion = typeof optionVersions.$inferSelect;
export type NewOptionVersion = typeof optionVersions.$inferInsert;
export const optionVersionRelations = relations(
  optionVersions,
  ({ one, many }) => ({
    question: one(questionVersions, {
      fields: [optionVersions.questionVersionId],
      references: [questionVersions.id],
    }),
    answers: many(answers),
  }),
);

// MARK: Milestones On Question Versions
export const milestoneOnQuestionVersions = pgTable(
  "milestones_on_questions_versions",
  {
    questionVersionId: uuid("question_version_id")
      .notNull()
      .references(() => questionVersions.id, { onDelete: "cascade" }),
    milestoneId: uuid("milestone_id")
      .notNull()
      .references(() => milestones.id),
  },
  (table) => {
    return {
      id: primaryKey({
        columns: [table.questionVersionId, table.milestoneId],
      }),
    };
  },
);
export type MilestoneOnQuestionVersion =
  typeof milestoneOnQuestionVersions.$inferSelect;
export type NewMilestoneOnQuestionVersion =
  typeof milestoneOnQuestionVersions.$inferInsert;
export const milestoneOnQuestionVersionRelations = relations(
  milestoneOnQuestionVersions,
  ({ one }) => ({
    question: one(questionVersions, {
      fields: [milestoneOnQuestionVersions.questionVersionId],
      references: [questionVersions.id],
    }),
    milestone: one(milestones, {
      fields: [milestoneOnQuestionVersions.milestoneId],
      references: [milestones.id],
    }),
  }),
);

export const competencyPerformanceSummaries = pgTable(
  "competency_performance_summaries",
  {
    evaluateeId: uuid("evaluatee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    formVersionId: uuid("form_version_id")
      .notNull()
      .references(() => formVersions.id, { onDelete: "cascade" }),
    competencyId: uuid("competency_id")
      .notNull()
      .references(() => competencies.id),
    strengths: text("strengths"),
    weaknesses: text("weaknesses"),
    feedback: text("feedback"),
  },
  (table) => {
    return {
      id: primaryKey({
        columns: [table.evaluateeId, table.formVersionId, table.competencyId],
      }),
    };
  },
);
export type CompetencyPerformanceSummary =
  typeof competencyPerformanceSummaries.$inferSelect;
export type NewCompetencyPerformanceSummary =
  typeof competencyPerformanceSummaries.$inferInsert;
export const competencyPerformanceSummaryRelations = relations(
  competencyPerformanceSummaries,
  ({ one }) => ({
    evaluatee: one(users, {
      fields: [competencyPerformanceSummaries.evaluateeId],
      references: [users.id],
    }),
    formVersion: one(formVersions, {
      fields: [competencyPerformanceSummaries.formVersionId],
      references: [formVersions.id],
    }),
    competency: one(competencies, {
      fields: [competencyPerformanceSummaries.competencyId],
      references: [competencies.id],
    }),
  }),
);

export const recommendedMilestones = pgTable(
  "recommended_milestones",
  {
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    milestoneId: uuid("milestone_id")
      .notNull()
      .references(() => milestones.id),
    justification: text("justification").notNull(),
    score: text("score").notNull(),
  },
  (table) => {
    return {
      id: primaryKey({ columns: [table.questionId, table.milestoneId] }),
    };
  },
);
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

export const studentResponseBaseView = pgView("student_response_base", {
  responseId: uuid("response_id").primaryKey(),
  userId: uuid("user_id"),
  formVersionId: uuid("form_version_id"),
  formId: uuid("form_id"),
  formVersionTitle: text("form_version_title"),
  evaluatorId: uuid("evaluator_id"),
  createdAt: timestamp("created_at"),
}).existing();

// View for user details
export const userDetailsView = pgView("user_details", {
  userId: uuid("user_id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
}).existing();

// View for question and milestone details
export const questionMilestoneView = pgView("question_milestone", {
  responseId: uuid("response_id").notNull(),
  questionVersionId: uuid("question_version_id").notNull(),
  questionText: text("question_text").notNull(),
  selectedOptionVersionId: uuid("selected_option_version_id").notNull(),
  milestoneId: uuid("milestone_id").notNull(),
  milestoneName: text("milestone_name").notNull(),
  milestoneLevel: integer("milestone_level").notNull(),
  subcompetencyId: uuid("subcompetency_id").notNull(),
  subcompetencyName: text("subcompetency_name").notNull(),
  subcompetencyLevel: integer("subcompetency_level").notNull(),
  competencyId: uuid("competency_id").notNull(),
  competencyName: text("competency_name").notNull(),
  pointsAvailable: numeric("points_available").notNull(),
  pointsEarned: numeric("points_earned").notNull(),
}).existing();

// Main view combining all data
export type StudentPerformanceView = {
  responseId: string;
  userId: string;
  formVersionId: string;
  formId: string;
  formVersionTitle: string;
  evaluatorId: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  evaluatorFirstName: string;
  evaluatorLastName: string;
  totalPointsAvailable: string;
  totalPointsEarned: string;
};
export const studentPerformanceView = pgView("student_performance", {
  responseId: uuid("response_id").primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  formVersionId: uuid("form_version_id").notNull(),
  formId: uuid("form_id").notNull(),
  formVersionTitle: text("form_version_title").notNull(),
  evaluatorId: uuid("evaluator_id").notNull(),
  createdAt: timestamp("created_at").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  evaluatorFirstName: text("evaluator_first_name").notNull(),
  evaluatorLastName: text("evaluator_last_name").notNull(),
  totalPointsAvailable: numeric("total_points_available").notNull(),
  totalPointsEarned: numeric("total_points_earned").notNull(),
}).existing();
