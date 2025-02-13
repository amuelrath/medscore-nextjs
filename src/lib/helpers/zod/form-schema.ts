import { findDuplicates } from "@/lib/helpers/find-duplicates";
import { z } from "zod";

const ZRoleScoreWeightSchema = z
  .array(
    z.object({
      roleId: z.string().uuid(),
      weight: z.number(),
    }),
  )
  .refine(
    (data) => {
      // total weight cannot sum to a value greater than 1
      const totalWeight = Object.values(data).reduce((total, current) => total + current.weight, 0);

      return totalWeight <= 1;
    },
    { message: "Total weights cannot be greater than 1." },
  )
  .refine((data) => {
    // only one rule allowed per role
    const roleIds = data.map((d) => d.roleId);
    const duplicates = findDuplicates(roleIds);

    return duplicates.length <= 0;

  }, { message: "Only one weight per role allowed."});


const ZPassingCriteriaSchema = z.array(z.object({
  aspect: z.enum(["OVERALL", "ICS", "SBP", "PC", "MK", "PBLI", "PROF"]),
  minPercentScore: z.number().min(0).max(100)
})).refine((data) => {
  // cannot have more than one rule for the same aspect
  const aspects = data.map(d => d.aspect)
  const duplicates = findDuplicates(aspects)

  return duplicates.length <= 0;

}, { message: "Only one rule per aspect allowed." })

export const ZFormSettingsSchema = z.object({
  administerAccess: z.enum([
    "JUST_ME",
    "FACULTY_IN_PROGRAM",
    "FACULTY_I_CHOOSE",
  ]),
  editAccess: z.enum(["JUST_ME", "FACULTY_IN_PROGRAM", "FACULTY_I_CHOOSE"]),
  allowResponseRevisions: z.boolean(),
  allowResponseSaveAndQuit: z.boolean(),
  allowMultipleSubmissions: z.boolean(),
  scoresAffectGrades: z.boolean(),
  roleWeights: ZRoleScoreWeightSchema,
  passingCriteria: ZPassingCriteriaSchema
});

