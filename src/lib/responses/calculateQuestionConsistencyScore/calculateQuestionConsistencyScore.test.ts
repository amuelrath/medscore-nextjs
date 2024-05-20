import { getQuestionConsistencyScore } from "./index";
import { FormVersionResult } from "@/server/actions/forms/get-one-version";
import { describe, expect, it } from "@jest/globals";

describe("getQuestionConsistencyScore", () => {
  const mockFormVersions = [
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
      ],
      responses: [
        {
          evaluatee: { id: "e1" },
          answers: [{ questionVersionId: "q1", optionVersionId: "o1" }],
        },
        {
          evaluatee: { id: "e2" },
          answers: [{ questionVersionId: "q1", optionVersionId: "o2" }],
        },
      ],
    },
    {
      id: "2",
      createdAt: "2023-01-02",
      questions: [
        {
          id: "q1",
          text: "Question 1",
          options: [
            { id: "o1", pointValue: "1" },
            { id: "o2", pointValue: "2" },
          ],
        },
      ],
      responses: [
        {
          evaluatee: { id: "e1" },
          answers: [{ questionVersionId: "q1", optionVersionId: "o2" }],
        },
        {
          evaluatee: { id: "e2" },
          answers: [{ questionVersionId: "q1", optionVersionId: "o1" }],
        },
      ],
    },
  ] as unknown as FormVersionResult[];

  const evaluateeIds = ["e1", "e2"];
  const questionId = "q1";
  const goodThreshold = 0.8;
  const badThreshold = 0.2;

  it("should calculate the consistency score for a specific question", () => {
    const result = getQuestionConsistencyScore(
      mockFormVersions,
      evaluateeIds,
      questionId,
      goodThreshold,
      badThreshold,
    );
    expect(result).toEqual({
      consistentlyGoodPercentage: 50,
      consistentlyBadPercentage: 0,
    });
  });

  it("should handle missing responses or answers", () => {
    const mockFormVersionsWithMissingData: FormVersionResult[] = [
      {
        id: "3",
        createdAt: "2023-01-03",
        questions: [
          {
            id: "q1",
            text: "Question 1",
            options: [
              // @ts-expect-error
              { id: "o1", pointValue: "1" },
              // @ts-expect-error
              { id: "o2", pointValue: "2" },
            ],
          },
        ],
        responses: [
          {
            // @ts-expect-error
            evaluatee: { id: "e1" },
            answers: [],
          },
          {
            // @ts-expect-error
            evaluatee: { id: "e2" },
            // @ts-expect-error
            answers: [{ questionVersionId: "q1", optionVersionId: "o1" }],
          },
        ],
      },
    ];

    const result = getQuestionConsistencyScore(
      mockFormVersionsWithMissingData,
      evaluateeIds,
      questionId,
      goodThreshold,
      badThreshold,
    );
    expect(result).toEqual({
      consistentlyGoodPercentage: 0,
      consistentlyBadPercentage: 50,
    });
  });

  it("should throw an error if questionScores is not defined", () => {
    const mockFormVersionsWithoutQuestion: FormVersionResult[] = [
      {
        id: "4",
        createdAt: "2023-01-04",
        questions: [],
        responses: [
          {
            // @ts-expect-error
            evaluatee: { id: "e1" },
            answers: [],
          },
          {
            // @ts-expect-error
            evaluatee: { id: "e2" },
            answers: [],
          },
        ],
      },
    ];

    expect(() =>
      getQuestionConsistencyScore(
        mockFormVersionsWithoutQuestion,
        evaluateeIds,
        questionId,
        goodThreshold,
        badThreshold,
      ),
    ).toThrowError("questionScores is not defined.");
  });
});
