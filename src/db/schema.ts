import { ZFormBuilderSettingsSchema } from '@/components/(admin)/forms/form-builder/types';
import { relations, sql } from 'drizzle-orm';
import {
  AnyPgColumn,
  boolean,
  decimal,
  foreignKey,
  integer,
  json,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const roleEnum = pgEnum('role', ['ADMIN', 'STUDENT', 'FACULTY', 'NONE']);

export const responseStatusEnum = pgEnum('response_status', [
  'STARTED',
  'NOT_STARTED',
  'COMPLETED',
]);

export type TResponseStatus = 'STARTED' | 'NOT_STARTED' | 'COMPLETED';

export const formItemTypeEnum = pgEnum('form_item_type', [
  'MULTIPLE_CHOICE',
  'SINGLE_CHOICE',
  'HEADER',
  'WRITTEN',
  'RANGE',
  'PARAGRAPH',
]);

export type TFormItemType =
  | 'MULTIPLE_CHOICE'
  | 'SINGLE_CHOICE'
  | 'HEADER'
  | 'WRITTEN'
  | 'RANGE'
  | 'PARAGRAPH';

export const formTypeEnum = pgEnum('form_type', [
  'OSCE',
  'EVALUATION',
  'DIRECT_OBSERVATION',
]);
export const ZFormTypeEnum = z.enum([
  'OSCE',
  'EVALUATION',
  'DIRECT_OBSERVATION',
]);
export type TFormType = z.infer<typeof ZFormTypeEnum>;

export const behaviors = pgTable('behaviors', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  description: text('description').notNull(),
  subcompetencyId: uuid('subcompetency_id')
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

export const competencies = pgTable('competencies', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().unique(),
});
export type Competency = typeof competencies.$inferSelect;
export const competencyRelations = relations(competencies, ({ many }) => ({
  subcompetencies: many(subcompetencies),
}));

export const subcompetencies = pgTable('subcompetencies', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  level: smallint('level').notNull(),
  competencyId: uuid('competency_id')
    .notNull()
    .references((): AnyPgColumn => competencies.id),
  specialtyId: uuid('specialty_id')
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

export const milestones = pgTable('milestones', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(), // eg PC 1.2.3
  description: text('description').notNull(), // eg "demonstrates knowledge of patient care"
  level: smallint('level').notNull(), // eg 2
  sublevel: smallint('sublevel').notNull(), // eg 3
  subcompetencyId: uuid('subcompetency_id')
    .notNull()
    .references((): AnyPgColumn => subcompetencies.id),
  metadata: json('metadata'),
});
export type Milestone = typeof milestones.$inferSelect;
export const milestoneRelations = relations(milestones, ({ one, many }) => ({
  subcompetencies: one(subcompetencies, {
    fields: [milestones.subcompetencyId],
    references: [subcompetencies.id],
  }),
  questions: many(milestonesOnFormItems),
}));

export const specialties = pgTable('specialties', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().unique(),
});
export type Specialty = typeof specialties.$inferSelect;
export const specialtyRelations = relations(specialties, ({ many }) => ({
  subcompetencies: many(subcompetencies),
}));

export const programs = pgTable('programs', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().unique(),
  description: text('description'),
  specialtyId: uuid('specialty_id').references(
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
  roles: many(programRoles),
  groups: many(groups),
}));

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: roleEnum('role').notNull().default('NONE'),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export const userRelations = relations(users, ({ many }) => ({
  programs: many(usersOnPrograms),
  forms: many(forms),
  roles: many(rolesOnUsers),
  groups: many(groups),
  assessments: many(assessments),
  formFolders: many(formFolders),
}));

export const usersOnPrograms = pgTable('users_on_programs', {
  userId: uuid('user_id')
    .notNull()
    .references((): AnyPgColumn => users.id),
  programId: uuid('program_id')
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

export const groups = pgTable('groups', {
  id: uuid('id')
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  programId: uuid('program_id')
    .notNull()
    .references(() => programs.id, { onDelete: 'cascade' }),
});
export const Group = typeof groups.$inferSelect;
export const NewGroup = typeof groups.$inferInsert;
export const groupRelations = relations(groups, ({ many, one }) => ({
  users: many(usersOnGroups),
  programs: one(programs, {
    fields: [groups.programId],
    references: [programs.id],
  }),
}));

export const usersOnGroups = pgTable(
  'users_on_groups',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    id: primaryKey({ columns: [table.userId, table.groupId] }),
  }),
);
export type UserOnGroup = typeof usersOnGroups.$inferSelect;
export type NewUserOnGroup = typeof usersOnGroups.$inferInsert;
export const usersOnGroupRelations = relations(usersOnGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersOnGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [usersOnGroups.groupId],
    references: [groups.id],
  }),
}));

// todo more expansive role permissions
export const programRoles = pgTable('program_roles', {
  id: uuid('id')
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  programId: uuid('program_id')
    .notNull()
    .references(() => programs.id, { onDelete: 'cascade' }),
  roleName: text('role_name'),
  isAdmin: boolean('is_admin'),
  isStudent: boolean('is_student'),
  isOwner: boolean('is_owner'),
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
  'roles_on_users',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    roleId: uuid('role_id')
      .notNull()
      .references(() => programRoles.id),
  },
  (table) => ({
    id: primaryKey({
      columns: [table.userId, table.roleId],
    }),
  }),
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

export const forms = pgTable('forms', {
  id: uuid('id')
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull().default('Untitled Evaluation'),
  lastOpenedAt: timestamp('last_opened_at').notNull().defaultNow(),
  type: formTypeEnum('type').notNull(),
  settings:
    jsonb('settings').$type<z.infer<typeof ZFormBuilderSettingsSchema>>(),
  programId: uuid('program_id')
    .references(() => programs.id)
    .notNull(),
  creatorId: uuid('creator_id').references(() => users.id),
  folderId: uuid('folder_id').references(() => formFolders.id, {
    onDelete: 'set null',
  }), // Allow forms without folders
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
  formFolder: one(formFolders, {
    fields: [forms.folderId],
    references: [formFolders.id],
  }),
}));

// todo nightmare refactor to normalize this
export const formItems = pgTable('form_items', {
  id: uuid('id')
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formId: uuid('form_id')
    .notNull()
    .references(() => forms.id, { onDelete: 'cascade' }),
  text: text('text'),
  description: text('description'),
  type: formItemTypeEnum('type').notNull(),
  position: integer('position').notNull(),
  isRequired: boolean('is_required').notNull().default(true),
  isScored: boolean('is_scored').notNull().default(true),
  minValue: integer('min_value'),
  maxValue: integer('max_value'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
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

export const options = pgTable('options', {
  id: uuid('id')
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text('text'),
  position: integer('position').notNull(),
  pointValue: decimal('point_value', { precision: 10, scale: 2 }),
  isNa: boolean('is_na').notNull().default(false),
  formItemId: uuid('form_item_id')
    .notNull()
    .references((): AnyPgColumn => formItems.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
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
  'milestones_on_form_items',
  {
    formItemId: uuid('form_item_id')
      .notNull()
      .references((): AnyPgColumn => formItems.id, { onDelete: 'cascade' }),
    milestoneId: uuid('milestone_id')
      .notNull()
      .references((): AnyPgColumn => milestones.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    id: primaryKey({
      columns: [table.formItemId, table.milestoneId],
    }),
    question: foreignKey({
      columns: [table.formItemId],
      foreignColumns: [formItems.id],
    }),
  }),
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

export const responses = pgTable('responses', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  assessmentId: uuid('assessment_id')
    .notNull()
    .references(() => assessments.id, { onDelete: 'cascade' }),
  respondeeId: uuid('respondee_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  status: responseStatusEnum('status').default('NOT_STARTED').notNull(), // on open, 'started'. on submit, 'completed'
  evaluateeId: uuid('evaluatee_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  duration: integer('duration'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
export const responseRelations = relations(responses, ({ one, many }) => ({
  respondee: one(users, {
    fields: [responses.respondeeId],
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

export const answers = pgTable('answers', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  responseId: uuid('response_id')
    .notNull()
    .references(() => responses.id, { onDelete: 'cascade' }),
  textValue: text('text_value'),
  formItemId: uuid('form_item_id')
    .notNull()
    .references(() => formItems.id, { onDelete: 'cascade' }),
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
  answerOptions: many(answerOptions),
}));

export const answerOptions = pgTable(
  'answer_options',
  {
    id: uuid('id')
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    optionId: uuid('option_id')
      .notNull()
      .references(() => options.id, { onDelete: 'cascade' }),
    answerId: uuid('answer_id')
      .notNull()
      .references(() => answers.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    unq: unique().on(table.optionId, table.answerId),
  }),
);
export type AnswerOption = typeof answerOptions.$inferSelect;
export type NewAnswerOption = typeof answerOptions.$inferInsert;
export const answerOptionRelations = relations(answerOptions, ({ one }) => ({
  answer: one(answers, {
    fields: [answerOptions.answerId],
    references: [answers.id],
  }),
  option: one(options, {
    fields: [answerOptions.optionId],
    references: [options.id],
  }),
}));

export const assessments = pgTable('assessments', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formId: uuid('form_id')
    .notNull()
    .references(() => forms.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  startsAt: timestamp('starts_at').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  creatorId: uuid('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'set null' }), // to protect assessment data
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
export type Assessment = typeof assessments.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;
export const assessmentRelations = relations(assessments, ({ one, many }) => ({
  form: one(forms, {
    fields: [assessments.formId],
    references: [forms.id],
  }),
  responses: many(responses),
  creator: one(users, {
    fields: [assessments.creatorId],
    references: [users.id],
  }),
}));

export const formFolders = pgTable('form_folders', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  creatorId: uuid('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('My Folder'),
});
export type FormFolder = typeof formFolders.$inferSelect;
export type NewFormFolder = typeof formFolders.$inferInsert;
export const formFolderRelations = relations(formFolders, ({ one, many }) => ({
  forms: many(forms),
  creator: one(users, {
    fields: [formFolders.creatorId],
    references: [users.id],
  }),
}));

export const recommendedMilestones = pgTable('recommended_milestones', {
  id: uuid(`id`)
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  formItemId: uuid('form_item_id')
    .notNull()
    .references(() => formItems.id, { onDelete: 'cascade' }),
  milestoneId: uuid('milestone_id')
    .notNull()
    .references(() => milestones.id),
  justification: text('justification').notNull(),
  score: integer('score').notNull(),
  isPositiveClassification: boolean('is_positive_classification'),
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
