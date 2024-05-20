import { calculatePercentChange } from "./index";
import { FormVersionsResult } from "@/server/actions/forms/get-all-versions";
import { COMPETENCIES } from "@/db/constants";
import { describe, expect, it } from "@jest/globals";

describe("calculatePercentChange", () => {
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

  it("should calculate the percent change correctly", () => {
    const evaluateeId = "u2";
    const currentVersionId = "2";

    const result = calculatePercentChange(
      evaluateeId,
      mockFormVersions,
      currentVersionId,
    );

    expect(result).toEqual({
      percentChangeFromPrevious: 16.666666666666664,
      percentChangeFromFirst: 16.666666666666664,
    });
  });

  it("should filter questions and answers based on competencyName", () => {
    const evaluateeId = "u2";
    const currentVersionId = "2";
    const competencyName = "SBP" as keyof typeof COMPETENCIES;

    const result = calculatePercentChange(
      evaluateeId,
      mockFormVersions,
      currentVersionId,
      competencyName,
    );

    expect(result).toEqual({
      percentChangeFromPrevious: 20.00000000000001,
      percentChangeFromFirst: 20.00000000000001,
    });
  });

  it("should return null if evaluateeId is not provided", () => {
    const evaluateeId = "";
    const currentVersionId = "2";

    const result = calculatePercentChange(
      evaluateeId,
      mockFormVersions,
      currentVersionId,
    );

    expect(result).toBeNull();
  });

  it("should return null if formVersions is not provided", () => {
    const evaluateeId = "u2";
    const currentVersionId = "2";

    const result = calculatePercentChange(evaluateeId, [], currentVersionId);

    expect(result).toBeNull();
  });

  it("should return null if currentVersionId is not provided", () => {
    const evaluateeId = "u2";
    const currentVersionId = "";

    const result = calculatePercentChange(
      evaluateeId,
      mockFormVersions,
      currentVersionId,
    );

    expect(result).toBeNull();
  });

  it("should throw an error if versions cannot be located from the responses", () => {
    const evaluateeId = "u3"; // Non-existent evaluateeId
    const currentVersionId = "2";

    expect(() =>
      calculatePercentChange(evaluateeId, mockFormVersions, currentVersionId),
    ).toThrowError("Couldn't locate versions from their responses.");
  });
});
