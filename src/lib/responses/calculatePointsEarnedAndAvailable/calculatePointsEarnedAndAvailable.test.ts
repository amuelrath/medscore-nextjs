import { calculatePointsEarnedAndAvailable } from "./index";
import { QuestionVersionResult, AnswerResult } from "@/db/types";
import { describe, expect, it } from "@jest/globals";

describe("calculatePointsEarnedAndAvailable", () => {
  const questions = [
    {
      id: "1",
      formVersionId: "1",
      text: "Question 1",
      position: 1,
      feedback: true,
      options: [
        {
          id: "1",
          questionVersionId: "1",
          text: "Option 1",
          pointValue: 1,
          position: 1,
        },
        {
          id: "2",
          questionVersionId: "1",
          text: "Option 2",
          pointValue: 2,
          position: 2,
        },
        {
          id: "3",
          questionVersionId: "1",
          text: "Option 3",
          pointValue: 3,
          position: 3,
        },
      ],
      milestones: [
        {
          milestone: {
            id: "1",
            name: "Milestone 1",
            position: 1,
            subcompetencies: [
              {
                subcompetency: {
                  id: "1",
                  name: "Subcompetency 1",
                  position: 1,
                  competencies: [
                    {
                      id: "1",
                      name: "Competency 1",
                      description: "Description 1",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    {
      id: "2",
      formVersionId: "1",
      text: "Question 2",
      position: 2,
      feedback: false,
      options: [
        {
          id: "4",
          questionVersionId: "2",
          text: "Option 4",
          pointValue: 4,
          position: 1,
        },
        {
          id: "5",
          questionVersionId: "2",
          text: "Option 5",
          pointValue: 5,
          position: 2,
        },
      ],
      milestones: [
        {
          milestone: {
            id: "2",
            name: "Milestone 2",
            position: 2,
            subcompetencies: [
              {
                subcompetency: {
                  id: "2",
                  name: "Subcompetency 2",
                  position: 1,
                  competencies: [
                    {
                      id: "2",
                      name: "Competency 2",
                      description: "Description 2",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  ];

  const answers: AnswerResult[] = [
    {
      id: "1",
      responseId: "1",
      questionVersionId: "1",
      optionVersionId: "2",
      updatedAt: "",
      deletedAt: null,
      feedback: null,
      createdAt: "2023-01-01",
    },
    {
      id: "2",
      responseId: "1",
      questionVersionId: "2",
      optionVersionId: "4",
      updatedAt: "",
      deletedAt: null,
      feedback: null,
      createdAt: "2023-01-01",
    },
  ];

  it("should calculate points earned and available correctly", () => {
    const result = calculatePointsEarnedAndAvailable(
      questions as unknown as QuestionVersionResult[],
      answers,
    );
    expect(result).toEqual({ pointsEarned: 6, pointsAvailable: 8 });
  });

  it("should handle missing answers", () => {
    const result = calculatePointsEarnedAndAvailable(
      questions as unknown as QuestionVersionResult[],
      undefined,
    );
    expect(result).toEqual({ pointsEarned: 0, pointsAvailable: 8 });
  });

  it("should handle missing questions", () => {
    const result = calculatePointsEarnedAndAvailable(undefined, answers);
    expect(result).toEqual({ pointsEarned: 0, pointsAvailable: 0 });
  });

  it("should handle empty questions and answers", () => {
    const result = calculatePointsEarnedAndAvailable([], []);
    expect(result).toEqual({ pointsEarned: 0, pointsAvailable: 0 });
  });

  it("should handle missing options in questions", () => {
    const questionsWithMissingOptions: QuestionVersionResult[] = [
      // @ts-ignore
      { ...questions[0], options: undefined },
      // @ts-ignore
      { ...questions[1], options: undefined },
    ];
    const result = calculatePointsEarnedAndAvailable(
      questionsWithMissingOptions,
      answers,
    );
    expect(result).toEqual({ pointsEarned: 0, pointsAvailable: 0 });
  });
});
