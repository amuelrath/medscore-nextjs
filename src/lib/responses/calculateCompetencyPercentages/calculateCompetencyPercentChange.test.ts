import { calculateCompetencyPercentages } from "./index";
import { QuestionVersionResult, AnswerResult } from "@/db/types";
import { describe, expect, it } from "@jest/globals";

describe("calculateCompetencyPercentages", () => {
  const mockQuestions = [
    {
      id: "q1",
      formVersionId: "1",
      text: "Question 1",
      position: 1,
      feedback: true,
      options: [
        {
          id: "o1",
          questionVersionId: "q1",
          text: "Option 1",
          pointValue: "1",
          position: 1,
        },
        {
          id: "o2",
          questionVersionId: "q1",
          text: "Option 2",
          pointValue: "2",
          position: 2,
        },
      ],
      milestones: [
        {
          milestone: {
            id: "m1",
            name: "Milestone 1",
            position: 1,
            subcompetencies: {
              id: "sc1",
              name: "Subcompetency 1",
              competencies: {
                id: "05ae7c1e-2640-48de-b3d3-c1b3157d4ad9",
                name: "SBP",
              },
            },
          },
        },
      ],
    },
    {
      id: "q2",
      formVersionId: "1",
      text: "Question 2",
      position: 2,
      feedback: false,
      options: [
        {
          id: "o3",
          questionVersionId: "q2",
          text: "Option 3",
          pointValue: "3",
          position: 1,
        },
        {
          id: "o4",
          questionVersionId: "q2",
          text: "Option 4",
          pointValue: "4",
          position: 2,
        },
      ],
      milestones: [
        {
          milestone: {
            id: "m2",
            name: "Milestone 2",
            subcompetencies: {
              id: "sc2",
              name: "Subcompetency 2",
              competencies: {
                id: "5a8776bb-a705-4af2-9504-dc20e4daaf05",
                name: "ICS",
              },
            },
          },
        },
      ],
    },
  ] as unknown as QuestionVersionResult[];

  const mockAnswers: AnswerResult[] = [
    {
      id: "a1",
      questionVersionId: "q1",
      optionVersionId: "o2",
      updatedAt: "2023-05-21T00:00:00.000Z",
      deletedAt: null,
      feedback: null,
      createdAt: "2023-05-21T00:00:00.000Z",
      responseId: "r1",
    },
    {
      id: "a2",
      questionVersionId: "q2",
      optionVersionId: "o3",
      updatedAt: "2023-05-21T00:00:00.000Z",
      deletedAt: null,
      feedback: null,
      createdAt: "2023-05-21T00:00:00.000Z",
      responseId: "r1",
    },
  ];

  it("should return null if questions or answers is not provided", () => {
    const result1 = calculateCompetencyPercentages(mockQuestions, undefined);
    expect(result1).toBeNull();

    const result2 = calculateCompetencyPercentages(undefined, mockAnswers);
    expect(result2).toBeNull();
  });

  it("should calculate competency percentages correctly", () => {
    const result = calculateCompetencyPercentages(mockQuestions, mockAnswers);
    expect(result).toEqual({
      ICS: 42.85714285714286,
      MK: 0,
      PBLI: 0,
      PC: 0,
      PROF: 0,
      SBP: 66.66666666666666,
    });
  });

  it("should handle competencies with no available points", () => {
    const result = calculateCompetencyPercentages([], mockAnswers);
    expect(result).toEqual({
      ICS: 0,
      MK: 0,
      PBLI: 0,
      PC: 0,
      PROF: 0,
      SBP: 0,
    });
  });
});
