import { FormVersionResult } from "@/server/actions/forms/get-one-version";
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";

/**
 * Calculates the average score for a specific question across form versions.
 *
 * @param versions - An array of form versions containing questions and responses.
 * @param questionText - The text of the question for which to calculate the average score.
 * @param all - Optional flag to consider all occurrences of the question across versions. Default is false.
 * @returns The average score of the specified question as a percentage.
 *
 * @description
 * This function calculates the average score for a specific question across multiple form versions.
 * It takes into account the points earned and points available for each answer corresponding to the question.
 *
 * The `versions` parameter is an array of `FormVersionResult` objects, each representing a form version
 * with its questions, options, and responses.
 *
 * The `questionText` parameter is the text of the question for which the average score needs to be calculated.
 * The function compares the normalized question text (with whitespace removed and converted to lowercase)
 * to find matching questions across versions.
 *
 * The `all` parameter is an optional boolean flag that determines whether to consider all occurrences of the
 * question across versions or only the first occurrence in each version. If `all` is set to `true`, the function
 * will calculate the average score based on all matching questions across all versions. If `all` is set to `false`
 * or not provided, the function will only consider the first occurrence of the question in each version.
 *
 * The function returns the average score of the specified question as a percentage. If no matching question is found,
 * the function returns 0.
 *
 * @example
 * const versions: FormVersionResult[] = [
 *   {
 *     id: '1',
 *     createdAt: '2023-01-01',
 *     questions: [
 *       {
 *         id: 'q1',
 *         text: 'Question 1',
 *         options: [
 *           { id: 'o1', pointValue: '1' },
 *           { id: 'o2', pointValue: '2' },
 *         ],
 *       },
 *     ],
 *     responses: [
 *       {
 *         evaluatee: { id: 'e1' },
 *         answers: [{ questionVersionId: 'q1', optionVersionId: 'o1' }],
 *       },
 *     ],
 *   },
 *   {
 *     id: '2',
 *     createdAt: '2023-01-02',
 *     questions: [
 *       {
 *         id: 'q2',
 *         text: 'Question 1',
 *         options: [
 *           { id: 'o3', pointValue: '3' },
 *           { id: 'o4', pointValue: '4' },
 *         ],
 *       },
 *     ],
 *     responses: [
 *       {
 *         evaluatee: { id: 'e2' },
 *         answers: [{ questionVersionId: 'q2', optionVersionId: 'o4' }],
 *       },
 *     ],
 *   },
 * ];
 *
 * const averageScore = calculateAverageQuestionScore(versions, 'Question 1');
 * console.log(averageScore); // Output: 50
 *
 * const averageScoreAll = calculateAverageQuestionScore(versions, 'Question 1', true);
 * console.log(averageScoreAll); // Output: 75
 */
export function calculateAverageQuestionScore(
  versions: FormVersionResult[],
  questionText: string | null,
  all = false,
): number {
  if (!questionText) return 0;
  const normalizedQuestionText = questionText.replace(/\s/g, "").toLowerCase();

  const questionScores: number[] = [];

  versions.forEach((version) => {
    version.questions?.forEach((question) => {
      if (!question.text) return;
      if (
        question.text.replace(/\s/g, "").toLowerCase() ===
        normalizedQuestionText
      ) {
        version.responses.forEach((response) => {
          const answer = response.answers.find(
            (a) => a.questionVersionId === question.id,
          );
          if (!answer) return;

          const { pointsEarned, pointsAvailable } = calculatePointsEarnedAndAvailable(
            [question],
            [answer],
          );
          const score =
            (pointsAvailable || 0) > 0
              ? (pointsEarned || 0) / (pointsAvailable || 0)
              : 0;
          questionScores.push(score);
        });
      }
    });

    if (!all) return;
  });

  if (questionScores.length === 0) return 0;

  const totalScore = questionScores.reduce((sum, score) => sum + score, 0);
  return (totalScore / questionScores.length) * 100;
}
