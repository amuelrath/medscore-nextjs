import { calculateAverageQuestionScore } from "./index";
import { FormVersionResult } from "@/server/actions/forms/get-one-version";
import { describe, expect, it } from "@jest/globals";

describe("calculateAverageQuestionScore", () => {
  const mockVersions = [
    {
      id: "1",
      createdAt: "2023-01-01",
      questions: [
        {
          id: "q1",
          text: "Question 1",
          options: [
            { id: "o1", pointValue: "1" },
            { id: "o2", pointValue: "2" },
          ],
        },
        {
          id: "q2",
          text: "Question 2",
          options: [
            { id: "o3", pointValue: "3" },
            { id: "o4", pointValue: "4" },
          ],
        },
      ],
      responses: [
        {
          evaluatee: { id: "e1" },
          answers: [
            { questionVersionId: "q1", optionVersionId: "o1" },
            { questionVersionId: "q2", optionVersionId: "o3" },
          ],
        },
        {
          evaluatee: { id: "e2" },
          answers: [
            { questionVersionId: "q1", optionVersionId: "o2" },
            { questionVersionId: "q2", optionVersionId: "o4" },
          ],
        },
      ],
    },
    {
      id: "2",
      createdAt: "2023-01-02",
      questions: [
        {
          id: "q3",
          text: "Question 1",
          options: [
            { id: "o5", pointValue: "3" },
            { id: "o6", pointValue: "4" },
          ],
        },
        {
          id: "q4",
          text: "Question 2",
          options: [
            { id: "o7", pointValue: "1" },
            { id: "o8", pointValue: "2" },
          ],
        },
      ],
      responses: [
        {
          evaluatee: { id: "e3" },
          answers: [
            { questionVersionId: "q3", optionVersionId: "o6" },
            { questionVersionId: "q4", optionVersionId: "o7" },
          ],
        },
        {
          evaluatee: { id: "e4" },
          answers: [
            { questionVersionId: "q3", optionVersionId: "o5" },
            { questionVersionId: "q4", optionVersionId: "o7" },
          ],
        },
      ],
    },
  ] as unknown as FormVersionResult[];

  it("should return 0 if questionText is null or empty", () => {
    expect(calculateAverageQuestionScore(mockVersions, null)).toBe(0);
    expect(calculateAverageQuestionScore(mockVersions, "")).toBe(0);
  });

  it("should calculate the average score for a specific question considering all occurrences", () => {
    const averageScoreAll = calculateAverageQuestionScore(
      mockVersions,
      "Question 1",
    );
    expect(averageScoreAll).toBe(81.25);

    const averageScoreForQuestion2 = calculateAverageQuestionScore(
      mockVersions,
      "Question 2",
    );
    expect(averageScoreForQuestion2).toBe(68.75);
  });

  it("should return 0 if no matching question is found", () => {
    const averageScore = calculateAverageQuestionScore(
      mockVersions,
      "Question 3",
    );
    expect(averageScore).toBe(0);
  });

  it("should handle questions with no options or responses", () => {
    const versionsWithEmptyData: FormVersionResult[] = [
      {
        id: "3",
        createdAt: "2023-01-03",
        questions: [
          // @ts-expect-error
          {
            id: "q5",
            text: "Question 3",
            options: [],
            feedback: false,
          },
        ],
        responses: [],
      },
    ];

    const averageScore = calculateAverageQuestionScore(
      versionsWithEmptyData,
      "Question 3",
    );
    expect(averageScore).toBe(0);
  });
});
