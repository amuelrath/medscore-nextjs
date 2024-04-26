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
  foreignKey,
  unique,
  varchar,
  UniqueConstraint,
  uniqueKeyName,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "STUDENT", "FACULTY", "NONE"]);
export const operationEnum = pgEnum("operation", [
  "INSERT",
  "UPDATE",
  "DELETE",
]);

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
  })
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
    (): AnyPgColumn => specialties.id
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
  programId: uuid("program_id").references((): AnyPgColumn => programs.id),
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
  })
);

// MARK: Form History
export const formHistory = pgTable("form_history", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formId: uuid("form_id")
    .notNull()
    .references((): AnyPgColumn => forms.id),
  title: text("title").notNull().default("Untitled Evaluation"),
  lastOpenedAt: timestamp("last_opened_at"),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  programId: uuid("program_id")
    .notNull()
    .references((): AnyPgColumn => programs.id),
  creatorId: uuid("creator_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  operation: operationEnum("operation").notNull().default("INSERT"),
});
export type FormHistory = typeof formHistory.$inferSelect;
export type NewFormHistory = typeof formHistory.$inferInsert;
export const formHistoryRelations = relations(formHistory, ({ one }) => ({
  form: one(forms, {
    fields: [formHistory.formId],
    references: [forms.id],
  }),
  creator: one(users, {
    fields: [formHistory.creatorId],
    references: [users.id],
  }),
  program: one(programs, {
    fields: [formHistory.programId],
    references: [programs.id],
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
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
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
  history: many(formHistory),
  responses: many(responses),
}));

// MARK: Question History
export const questionHistory = pgTable("question_history", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  questionId: uuid("question_id")
    .notNull()
    .references((): AnyPgColumn => questions.id),
  formId: uuid("form_id")
    .notNull()
    .references((): AnyPgColumn => forms.id),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  text: text("text"),
  feedback: boolean("feedback").notNull().default(false),
  position: integer("position"),
  operation: operationEnum("operation").notNull().default("INSERT"),
});
export type QuestionHistory = typeof questionHistory.$inferSelect;
export type NewQuestionHistory = typeof questionHistory.$inferInsert;
export const questionHistoryRelations = relations(
  questionHistory,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionHistory.questionId],
      references: [questions.id],
    }),
    form: one(forms, {
      fields: [questionHistory.formId],
      references: [forms.id],
    }),
  })
);

// MARK: Questions
export const questions = pgTable("questions", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  text: text("text"),
  feedback: boolean("feedback").notNull().default(false),
  position: integer("position").notNull(),
  formId: uuid("form_id")
    .notNull()
    .references((): AnyPgColumn => forms.id, { onDelete: "cascade" }),
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
  history: many(questionHistory),
}));

// MARK: Option History
export const optionHistory = pgTable("option_history", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  optionId: uuid("option_id")
    .notNull()
    .references((): AnyPgColumn => options.id),
  questionId: uuid("question_id")
    .notNull()
    .references((): AnyPgColumn => questions.id),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  text: text("text"),
  position: integer("position").notNull(),
  pointValue: decimal("point_value").default("0.0").notNull(),
  operation: operationEnum("operation").notNull().default("INSERT"),
});
export type OptionHistory = typeof optionHistory.$inferSelect;
export type NewOptionHistory = typeof optionHistory.$inferInsert;
export const optionHistoryRelations = relations(optionHistory, ({ one }) => ({
  option: one(options, {
    fields: [optionHistory.optionId],
    references: [options.id],
  }),
  question: one(questions, {
    fields: [optionHistory.questionId],
    references: [questions.id],
  }),
}));

// MARK: Options
export const options = pgTable("options", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text"),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  position: integer("position").notNull(),
  pointValue: decimal("point_value").default("0.0").notNull(),
  questionId: uuid("question_id")
    .notNull()
    .references((): AnyPgColumn => questions.id),
});
export type Option = typeof options.$inferSelect;
export type NewOption = typeof options.$inferInsert;
export const optionRelations = relations(options, ({ one, many }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
  history: many(optionHistory),
}));

// MARK: MoQ History
export const milestonesOnQuestionsHistory = pgTable(
  "milestones_on_questions_history",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    questionId: uuid("question_id")
      .notNull()
      .references((): AnyPgColumn => questions.id),
    milestoneId: uuid("milestone_id")
      .notNull()
      .references((): AnyPgColumn => milestones.id),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    deletedAt: timestamp("deleted_at"),
    operation: operationEnum("operation").notNull().default("INSERT"),
  },
  (table) => {
    return {
      question: foreignKey({
        columns: [table.questionId],
        foreignColumns: [questions.id],
      }),
      milestone: foreignKey({
        columns: [table.milestoneId],
        foreignColumns: [milestones.id],
      }),
    };
  }
);
export type MilestonesOnQuestionHistory =
  typeof milestonesOnQuestionsHistory.$inferSelect;
export type NewMilestonesOnQuestionHistory =
  typeof milestonesOnQuestionsHistory.$inferInsert;
export const milestonesOnQuestionsHistoryRelations = relations(
  milestonesOnQuestionsHistory,
  ({ one }) => ({
    milestone: one(milestones, {
      fields: [milestonesOnQuestionsHistory.milestoneId],
      references: [milestones.id],
    }),
    question: one(questions, {
      fields: [milestonesOnQuestionsHistory.questionId],
      references: [questions.id],
    }),
  })
);

// MARK:  Milestones On Questions
export const milestonesOnQuestions = pgTable(
  "milestones_on_questions",
  {
    questionId: uuid("question_id")
      .notNull()
      .references((): AnyPgColumn => questions.id),
    milestoneId: uuid("milestone_id")
      .notNull()
      .references((): AnyPgColumn => milestones.id),
    deletedAt: timestamp("deleted_at"),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
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
  }
);
export type MilestonesOnQuestion = typeof milestonesOnQuestions.$inferSelect;
export type NewMilestoneOnQuestion = typeof milestonesOnQuestions.$inferInsert;
export const milestonesOnQuestionsRelations = relations(
  milestonesOnQuestions,
  ({ one, many }) => ({
    milestone: one(milestones, {
      fields: [milestonesOnQuestions.milestoneId],
      references: [milestones.id],
    }),
    question: one(questions, {
      fields: [milestonesOnQuestions.questionId],
      references: [questions.id],
    }),
    history: many(milestonesOnQuestionsHistory),
  })
);

// MARK: Response History
export const responseHistory = pgTable("response_history", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  responseId: uuid("response_id")
    .notNull()
    .references(() => responses.id),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull(),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  operation: operationEnum("operation").notNull().default("INSERT"),
});
export type ResponseHistory = typeof responseHistory.$inferSelect;
export type NewResponseHistory = typeof responseHistory.$inferInsert;
export const responseHistoryRelations = relations(
  responseHistory,
  ({ one }) => ({
    response: one(responses, {
      fields: [responseHistory.responseId],
      references: [responses.id],
    }),
    creator: one(users, {
      fields: [responseHistory.creatorId],
      references: [users.id],
    }),
    form: one(forms, {
      fields: [responseHistory.formId],
      references: [forms.id],
    }),
  })
);

// MARK: Responses
export const responses = pgTable(
  "responses",
  {
    id: uuid("id")
      .notNull()
      .default(sql`gen_random_uuid()`),
    creatorId: uuid("creator_id")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    deletedAt: timestamp("deleted_at"),
    formId: uuid("form_id")
      .notNull()
      .references(() => forms.id),
  },
  (table) => {
    return {
      pk: primaryKey(table.id),
      form: foreignKey({
        columns: [table.formId],
        foreignColumns: [forms.id],
      }),
    };
  }
);
export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
export const responseRelations = relations(responses, ({ one, many }) => ({
  creator: one(users, {
    fields: [responses.creatorId],
    references: [users.id],
  }),
  form: one(forms, {
    fields: [responses.formId],
    references: [forms.id],
  }),
  history: many(responseHistory),
  answers: many(answers),
}));

// MARK: Answer History
export const answerHistory = pgTable("answer_history", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  answerId: uuid("answer_id")
    .notNull()
    .references(() => answers.id),
  optionId: uuid("option_id")
    .notNull()
    .references(() => options.id),
  responseId: uuid("response_id")
    .notNull()
    .references(() => responses.id),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  operation: operationEnum("operation").notNull().default("INSERT"),
});
export type AnswerHistory = typeof answerHistory.$inferSelect;
export type NewAnswerHistory = typeof answerHistory.$inferInsert;
export const answerHistoryRelations = relations(answerHistory, ({ one }) => ({
  answer: one(answers, {
    fields: [answerHistory.answerId],
    references: [answers.id],
  }),
  option: one(options, {
    fields: [answerHistory.optionId],
    references: [options.id],
  }),
  response: one(responses, {
    fields: [answerHistory.responseId],
    references: [responses.id],
  }),
}));

// MARK: Answers
export const answers = pgTable(
  "answers",
  {
    id: uuid("id")
      .notNull()
      .default(sql`gen_random_uuid()`),
    optionId: uuid("option_id")
      .notNull()
      .references(() => options.id),
    responseId: uuid("response_id")
      .notNull()
      .references(() => responses.id),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => {
    return {
      pk: primaryKey(table.id),
      response: foreignKey({
        columns: [table.responseId],
        foreignColumns: [responses.id],
      }),
      option: foreignKey({
        columns: [table.optionId],
        foreignColumns: [options.id],
      }),
    };
  }
);
export type Answer = typeof answers.$inferSelect;
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
  history: many(answerHistory),
}));

// MARK: Form Code History
export const formCodeHistory = pgTable("form_code_history", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formCodeId: uuid("form_code_id")
    .notNull()
    .references(() => formCodes.id),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  operation: operationEnum("operation").notNull().default("INSERT"),
});
export type FormCodeHistory = typeof formCodeHistory.$inferSelect;
export type NewFormCodeHistory = typeof formCodeHistory.$inferInsert;
export const formCodeHistoryRelations = relations(
  formCodeHistory,
  ({ one }) => ({
    formCode: one(formCodes, {
      fields: [formCodeHistory.formCodeId],
      references: [formCodes.id],
    }),
    form: one(forms, {
      fields: [formCodeHistory.formId],
      references: [forms.id],
    }),
  })
);

// MARK: Form Codes
export const formCodes = pgTable("form_codes", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});
export type FormCode = typeof formCodes.$inferSelect;
export type NewFormCode = typeof formCodes.$inferInsert;
export const formCodeRelations = relations(formCodes, ({ one, many }) => ({
  form: one(forms, {
    fields: [formCodes.formId],
    references: [forms.id],
  }),
  history: many(formCodeHistory),
  usersWithCode: many(formCodesOnUsers),
}));

// MARK: Form Codes on Users History
export const formCodesOnUsersHistory = pgTable("form_codes_on_users_history", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formCodeId: uuid("form_code_id")
    .notNull()
    .references(() => formCodes.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  operation: operationEnum("operation").notNull().default("INSERT"),
});
export type FormCodeOnUserHistory = typeof formCodesOnUsersHistory.$inferSelect;
export type NewFormCodeOnUserHistory =
  typeof formCodesOnUsersHistory.$inferInsert;
export const formCodesOnUsersHistoryRelations = relations(
  formCodesOnUsersHistory,
  ({ one }) => ({
    formCode: one(formCodes, {
      fields: [formCodesOnUsersHistory.formCodeId],
      references: [formCodes.id],
    }),
    user: one(users, {
      fields: [formCodesOnUsersHistory.userId],
      references: [users.id],
    }),
  })
);

// MARK: Form Codes on Users
export const formCodesOnUsers = pgTable("form_codes_on_users", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formCodeId: uuid("form_code_id")
    .notNull()
    .references((): AnyPgColumn => formCodes.id),
  userId: uuid("user_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});
export type FormCodeOnUser = typeof formCodesOnUsers.$inferSelect;
export type NewFormCodeOnUser = typeof formCodesOnUsers.$inferInsert;
export const formCodesOnUsersRelations = relations(
  formCodesOnUsers,
  ({ one, many }) => ({
    formCode: one(formCodes, {
      fields: [formCodesOnUsers.formCodeId],
      references: [formCodes.id],
    }),
    user: one(users, {
      fields: [formCodesOnUsers.userId],
      references: [users.id],
    }),
    history: many(formCodesOnUsersHistory),
  })
);
