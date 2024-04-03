import { relations, sql, InferSelectModel } from "drizzle-orm";
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
export const subcompetencyRelations = relations(subcompetencies, ({ one }) => ({
  competencies: one(competencies, {
    fields: [subcompetencies.competencyId],
    references: [competencies.id],
  }),
  specialties: one(specialties, {
    fields: [subcompetencies.specialtyId],
    references: [specialties.id],
  }),
}));

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
  evaluations: many(evaluations),
}));

export const evaluations = pgTable("evaluations", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  programId: uuid("program_id")
    .references(() => programs.id, {
      onDelete: "cascade",
    })
    .notNull(),

  creatorId: uuid("creator_id").references(() => users.id),
});
export type Evaluation = InferSelectModel<typeof evaluations>;
export type NewEvaluation = typeof evaluations.$inferInsert;
export const evaluationRelations = relations(evaluations, ({ one, many }) => ({
  programs: one(programs, {
    fields: [evaluations.programId],
    references: [programs.id],
  }),
  creator: one(users, {
    fields: [evaluations.creatorId],
    references: [users.id],
  }),
  questions: many(questions),
}));

// we change this later to allow multiple questions types (open feedback)
export const questions = pgTable("questions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  position: integer("position"),
  evaluationId: uuid("evaluation_id")
    .references(() => evaluations.id, {
      onDelete: "cascade",
    })
    .notNull(),
});
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export const questionRelations = relations(questions, ({ one, many }) => ({
  evaluations: one(evaluations, {
    fields: [questions.evaluationId],
    references: [evaluations.id],
  }),
  options: many(options),
  milestones: many(milestonesOnQuestions),
}));

export const options = pgTable("options", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  position: integer("position"),
  pointValue: decimal("point_value"),
  questionId: uuid("question_id")
    .references(() => questions.id, {
      onDelete: "cascade",
    })
    .notNull(),
});
export type Option = typeof options.$inferSelect;
export type NewOption = typeof options.$inferInsert;
export const optionRelations = relations(options, ({ one }) => ({
  questions: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
}));

export const milestonesOnQuestions = pgTable(
  "milestones_on_questions",
  {
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id),
    milestoneId: uuid("milestone_id")
      .notNull()
      .references(() => milestones.id),
  },
  (table) => {
    return {
      id: primaryKey({ columns: [table.milestoneId, table.questionId] }),
    };
  }
);
export type MilestonesOnQuestion = typeof milestonesOnQuestions.$inferSelect;
export type NewMilestoneOnQuestion = typeof milestonesOnQuestions.$inferInsert;
export const milestonesOnQuestionsRelations = relations(
  milestonesOnQuestions,
  ({ one }) => ({
    milestones: one(milestones, {
      fields: [milestonesOnQuestions.milestoneId],
      references: [milestones.id],
    }),
    questions: one(questions, {
      fields: [milestonesOnQuestions.questionId],
      references: [questions.id],
    }),
  })
);
