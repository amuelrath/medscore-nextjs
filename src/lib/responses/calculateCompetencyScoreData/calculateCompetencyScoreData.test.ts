import { calculateCompetencyScoreData } from "./index";
import { FormVersionsResult } from "@/db/types";
import { COMPETENCIES } from "@/db/constants";
import { describe, expect, it } from "@jest/globals";

describe("calculateCompetencyScoreData", () => {
  const mockFormVersions = [
    {
      id: "1",
      createdAt: "2023-05-20T00:00:00.000Z",
      questions: [
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
            {
              id: "o3",
              questionVersionId: "q1",
              text: "Option 3",
              pointValue: "3",
              position: 3,
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
                  position: 1,
                  competencies: {
                    id: "05ae7c1e-2640-48de-b3d3-c1b3157d4ad9",
                    name: "SBP",
                    description: "Description 1",
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
              id: "o4",
              questionVersionId: "q2",
              text: "Option 4",
              pointValue: "4",
              position: 1,
            },
            {
              id: "o5",
              questionVersionId: "q2",
              text: "Option 5",
              pointValue: "5",
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
                  position: 1,
                  competencies: {
                    id: "5a8776bb-a705-4af2-9504-dc20e4daaf05",
                    name: "ICS",
                    description: "Description 2",
                  },
                },
              },
            },
          ],
        },
      ],
      responses: [
        {
          id: "r1",
          evaluateeId: "u2",
          formVersionId: "1",
          answers: [
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
              optionVersionId: "o4",
              updatedAt: "2023-05-21T00:00:00.000Z",
              deletedAt: null,
              feedback: null,
              createdAt: "2023-05-21T00:00:00.000Z",
              responseId: "r1",
            },
          ],
          updatedAt: "2023-05-21T00:00:00.000Z",
          deletedAt: null,
          creatorId: "",
          createdAt: "2023-05-21T00:00:00.000Z",
          creator: {
            id: "u1",
            firstName: "",
            role: "ADMIN",
            email: "",
            password: "",
            lastName: "",
          },
          evaluatee: {
            role: "ADMIN",
            id: "u2",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
          },
        },
      ],
    },
    {
      id: "2",
      createdAt: "2023-05-21T00:00:00.000Z",
      questions: [
        {
          id: "q3",
          formVersionId: "2",
          text: "Question 1",
          position: 1,
          feedback: false,
          options: [
            {
              id: "o6",
              questionVersionId: "q3",
              text: "Option 1",
              pointValue: "1",
              position: 1,
            },
            {
              id: "o7",
              questionVersionId: "q3",
              text: "Option 2",
              pointValue: "2",
              position: 2,
            },
            {
              id: "o8",
              questionVersionId: "q3",
              text: "Option 3",
              pointValue: "3",
              position: 3,
            },
          ],
          milestones: [
            {
              milestone: {
                id: "m3",
                name: "Milestone 1",
                position: 1,
                subcompetencies: {
                  id: "sc3",
                  name: "Subcompetency 1",
                  position: 1,
                  competencies: {
                    id: "5a8776bb-a705-4af2-9504-dc20e4daaf05",
                    name: "ICS",
                    description: "Description 1",
                  },
                },
              },
            },
          ],
        },
        {
          id: "q4",
          formVersionId: "2",
          text: "Question 2",
          position: 2,
          feedback: false,
          options: [
            {
              id: "o9",
              questionVersionId: "q4",
              text: "Option 4",
              pointValue: "4",
              position: 1,
            },
            {
              id: "o10",
              questionVersionId: "q4",
              text: "Option 5",
              pointValue: "5",
              position: 2,
            },
          ],
          milestones: [
            {
              milestone: {
                id: "m4",
                name: "Milestone 2",
                position: 2,
                subcompetencies: {
                  id: "sc4",
                  name: "Subcompetency 2",
                  position: 1,
                  competencies: {
                    id: "05ae7c1e-2640-48de-b3d3-c1b3157d4ad9",
                    name: "SBP",
                    description: "Description 2",
                  },
                },
              },
            },
          ],
        },
      ],
      responses: [
        {
          id: "r2",
          evaluateeId: "u2",
          formVersionId: "2",
          answers: [
            {
              id: "a3",
              questionVersionId: "q3",
              optionVersionId: "o8",
              updatedAt: "2023-05-21T00:00:00.000Z",
              deletedAt: null,
              feedback: null,
              createdAt: "2023-05-21T00:00:00.000Z",
              responseId: "r2",
            },
            {
              id: "a4",
              questionVersionId: "q4",
              optionVersionId: "o9",
              updatedAt: "2023-05-21T00:00:00.000Z",
              deletedAt: null,
              createdAt: "2023-01-01T00:00:00.000Z",
              responseId: "r2",
            },
          ],
          updatedAt: "2023-01-01T00:00:00.000Z",
          deletedAt: null,
          creatorId: "u1",
          createdAt: "2023-01-01T00:00:00.000Z",
          creator: {
            id: "u1",
            firstName: "",
            role: "ADMIN",
            email: "",
            password: "",
            lastName: "",
          },
          evaluatee: {
            role: "ADMIN",
            id: "u2",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
          },
        },
      ],
    },
  ] as unknown as FormVersionsResult;

  it("should return undefined if versions or evaluateeId is not provided", () => {
    const result1 = calculateCompetencyScoreData(
      "1",
      "",
      "SBP",
      mockFormVersions,
    );
    expect(result1).toBeUndefined();

    const result2 = calculateCompetencyScoreData("1", "u2", "SBP", undefined);
    expect(result2).toBeUndefined();
  });

  it("should calculate competency score data for the current form version", () => {
    const result = calculateCompetencyScoreData(
      "1",
      "u2",
      "SBP",
      mockFormVersions,
    );
    expect(result).toEqual([
      {
        pointsEarned: 2,
        pointsAvailable: 6,
        versionCreatedAt: new Date("2023-05-20T00:00:00.000Z"),
      },
    ]);
  });

  it("should calculate competency score data for all form versions", () => {
    const result = calculateCompetencyScoreData(
      "1",
      "u2",
      "ICS",
      mockFormVersions,
      true,
    );
    expect(result).toEqual([
      {
        pointsEarned: 5,
        pointsAvailable: 9,
        versionCreatedAt: new Date("2023-05-20T00:00:00.000Z"),
      },
      {
        pointsEarned: 3,
        pointsAvailable: 6,
        versionCreatedAt: new Date("2023-05-21T00:00:00.000Z"),
      },
    ]);
  });

  it("should handle missing response for an evaluatee", () => {
    const result = calculateCompetencyScoreData(
      "1",
      "u3",
      "SBP",
      mockFormVersions,
    );
    expect(result).toEqual([
      {
        pointsEarned: undefined,
        pointsAvailable: undefined,
        versionCreatedAt: new Date("2023-05-20T00:00:00.000Z"),
      },
    ]);
  });

  it("should handle competency not found in form versions", () => {
    const result = calculateCompetencyScoreData(
      "1",
      "u2",
      // @ts-expect-error
      "UNKNOWN",
      mockFormVersions,
    );
    expect(result).toEqual([
      {
        pointsEarned: undefined,
        pointsAvailable: undefined,
        versionCreatedAt: new Date("2023-05-20T00:00:00.000Z"),
      },
    ]);
  });
});
