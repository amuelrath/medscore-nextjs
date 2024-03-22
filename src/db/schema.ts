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
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "STUDENT", "FACULTY", "NONE"]);

export const competency = pgTable("competencies", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
});
export type Competency = typeof competency.$inferSelect;
export const competencyRelations = relations(competency, ({ many }) => ({
  subcompetencies: many(subcompetency),
}));

export const subcompetency = pgTable("subcompetencies", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  level: smallint("level").notNull(),
  competencyId: uuid("competency_id")
    .notNull()
    .references(() => competency.id),
  specialtyId: uuid("specialty_id")
    .notNull()
    .references(() => specialty.id),
});
export type Subcompetency = typeof subcompetency.$inferSelect;
export const subcompetencyRelations = relations(subcompetency, ({ one }) => ({
  competency: one(competency, {
    fields: [subcompetency.competencyId],
    references: [competency.id],
  }),
  specialty: one(specialty, {
    fields: [subcompetency.specialtyId],
    references: [specialty.id],
  }),
}));

export const milestone = pgTable("milestones", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // eg PC 1.2.3
  description: text("description").notNull(), // eg "demonstrates knowledge of patient care"
  level: smallint("level").notNull(), // eg 2
  sublevel: smallint("sublevel").notNull(), // eg 3
  subcompetencyId: uuid("subcompetency_id")
    .notNull()
    .references(() => subcompetency.id),
});
export type Milestone = typeof milestone.$inferSelect;
export const milestoneRelations = relations(milestone, ({ one, many }) => ({
  subcompetency: one(subcompetency, {
    fields: [milestone.subcompetencyId],
    references: [subcompetency.id],
  }),
  questions: many(milestonesOnQuestions),
}));

export const specialty = pgTable("specialties", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
});
export type Specialty = typeof specialty.$inferSelect;
export const specialtyRelations = relations(specialty, ({ many }) => ({
  subcompetency: many(subcompetency),
}));

export const program = pgTable("programs", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  specialtyId: uuid("specialty_id").references(() => specialty.id),
});
export type Program = typeof program.$inferSelect;
export const programRelations = relations(program, ({ one, many }) => ({
  specialty: one(specialty, {
    fields: [program.specialtyId],
    references: [specialty.id],
  }),
  users: many(user),
}));

export const user = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: roleEnum("role").notNull().default("NONE"),
  programId: uuid("program_id").references(() => program.id),
});
export type User = typeof user.$inferSelect;
export const userRelations = relations(user, ({ one, many }) => ({
  // we change this later to allow one user to belong to multiple programsa
  program: one(program, {
    fields: [user.programId],
    references: [program.id],
  }),
  evaluations: many(evaluation),
}));

export const evaluation = pgTable("evaluations", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  programId: uuid("program_id").references(() => program.id),
  creatorId: uuid("creator_id").references(() => user.id),
});
export type Evaluation = typeof evaluation.$inferSelect;
export type NewEvaluation = typeof evaluation.$inferInsert;
export const evaluationRelations = relations(evaluation, ({ one, many }) => ({
  program: one(program, {
    fields: [evaluation.programId],
    references: [program.id],
  }),
  creator: one(user, {
    fields: [evaluation.creatorId],
    references: [user.id],
  }),
  questions: many(question),
}));

// we change this later to allow multiple question types (open feedback)
export const question = pgTable("questions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  evaluationId: uuid("evaluation_id").references(() => evaluation.id),
});
export type Question = typeof question.$inferSelect;
export const questionRelations = relations(question, ({ one, many }) => ({
  evaluation: one(evaluation, {
    fields: [question.evaluationId],
    references: [evaluation.id],
  }),
  options: many(option),
  milestones: many(milestonesOnQuestions),
}));

export const option = pgTable("options", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  pointValue: decimal("point_value"),
  questionId: uuid("question_id").references(() => question.id),
});
export type Option = typeof option.$inferSelect;
export const optionRelations = relations(option, ({ one, many }) => ({
  question: one(question, {
    fields: [option.questionId],
    references: [question.id],
  }),
}));

export const milestonesOnQuestions = pgTable(
  "milestones_on_questions",
  {
    questionId: uuid("question_id")
      .notNull()
      .references(() => question.id),
    milestoneId: uuid("milestone_id")
      .notNull()
      .references(() => milestone.id),
  },
  (table) => {
    return {
      id: primaryKey({ columns: [table.milestoneId, table.questionId] }),
    };
  }
);
export type MilestonesOnQuestion = typeof milestonesOnQuestions.$inferSelect;
export const milestonesOnQuestionsRelations = relations(
  milestonesOnQuestions,
  ({ one }) => ({
    milestone: one(milestone, {
      fields: [milestonesOnQuestions.milestoneId],
      references: [milestone.id],
    }),
    question: one(question, {
      fields: [milestonesOnQuestions.questionId],
      references: [question.id],
    }),
  })
);
