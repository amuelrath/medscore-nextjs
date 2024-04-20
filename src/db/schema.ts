import { relations, sql } from "drizzle-orm";
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
  alias,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "STUDENT", "FACULTY", "NONE"]);

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
    .references(() => competencies.id),
  specialtyId: uuid("specialty_id")
    .notNull()
    .references(() => specialties.id),
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
  })
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
    .references(() => subcompetencies.id),
});
export type Milestone = typeof milestones.$inferSelect;
export const milestoneRelations = relations(milestones, ({ one, many }) => ({
  subcompetencies: one(subcompetencies, {
    fields: [milestones.subcompetencyId],
    references: [subcompetencies.id],
  }),
  questions: many(milestonesOnQuestions),
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
  specialtyId: uuid("specialty_id").references(() => specialties.id),
});
export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export const programRelations = relations(programs, ({ one, many }) => ({
  specialties: one(specialties, {
    fields: [programs.specialtyId],
    references: [specialties.id],
  }),
  users: many(users),
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
  programId: uuid("program_id").references(() => programs.id),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export const userRelations = relations(users, ({ one, many }) => ({
  // we change this later to allow one users to belong to multiple programsa
  programs: one(programs, {
    fields: [users.programId],
    references: [programs.id],
  }),
  forms: many(forms),
}));

export const formVersions = pgTable(
  "form_versions",
  {
    versionNumber: integer("version_number").notNull().default(0),
    formId: uuid("form_id")
      .references(() => forms.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      id: primaryKey({ columns: [table.versionNumber, table.formId] }),
    };
  }
);
export type formVersion = typeof formVersions.$inferSelect;
export type NewformVersion = typeof formVersions.$inferInsert;
export const formVersionRelations = relations(formVersions, ({ one }) => ({
  forms: one(forms, {
    fields: [formVersions.formId],
    references: [forms.id],
  }),
}));

export const forms = pgTable("forms", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  lastOpenedAt: timestamp("last_opened_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  programId: uuid("program_id")
    .references(() => programs.id, {
      onDelete: "cascade",
    })
    .notNull(),

  creatorId: uuid("creator_id").references(() => users.id),
});
export type form = typeof forms.$inferSelect;
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
}));

export const questions = pgTable("questions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  feedback: boolean("feedback").notNull().default(false),
  position: integer("position"),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id),
  versionNumber: integer("version_number").notNull().default(0),
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
}));

export const feedback = pgTable("feedback", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id),
  versionNumber: integer("version_number").notNull().default(0),
});
export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
export const feedbackResponseRelations = relations(feedback, ({ one }) => ({
  question: one(questions, {
    fields: [feedback.questionId, feedback.versionNumber],
    references: [questions.id, questions.versionNumber],
  }),
}));

export const options = pgTable("options", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  position: integer("position"),
  pointValue: decimal("point_value"),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id),
  versionNumber: integer("version_number").notNull().default(0),
});
export type Option = typeof options.$inferSelect;
export type NewOption = typeof options.$inferInsert;
export const optionRelations = relations(options, ({ one }) => ({
  question: one(questions, {
    fields: [options.questionId, options.versionNumber],
    references: [questions.id, questions.versionNumber],
  }),
}));

export const milestonesOnQuestions = pgTable(
  "milestones_on_questions",
  {
    questionId: uuid("question_id").notNull(),
    milestoneId: uuid("milestone_id")
      .notNull()
      .references(() => milestones.id),
    versionNumber: integer("version_number").notNull(),
  },
  (table) => {
    return {
      id: primaryKey({
        columns: [table.questionId, table.milestoneId, table.versionNumber],
      }),
    };
  }
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
      fields: [
        milestonesOnQuestions.questionId,
        milestonesOnQuestions.versionNumber,
      ],
      references: [questions.id, questions.versionNumber],
    }),
  })
);

export const responses = pgTable("responses", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  creatorId: uuid("creator_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  formId: uuid("form_id").references(() => forms.id),
  versionNumber: integer("version_number").notNull(),
});
export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
export const responseRelations = relations(responses, ({ one, many }) => ({
  creator: one(users, {
    fields: [responses.creatorId],
    references: [users.id],
  }),
  form: one(formVersions, {
    fields: [responses.formId, responses.versionNumber],
    references: [formVersions.formId, formVersions.versionNumber],
  }),
}));

export const answers = pgTable("answers", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  optionId: uuid("option_id")
    .notNull()
    .references(() => options.id),
  responseId: uuid("response_id")
    .notNull()
    .references(() => responses.id),
});
export type Answer = typeof answers.$inferSelect;
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
