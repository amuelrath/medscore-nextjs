import { calculateScorePercentile } from "../calculateScorePercentile";
import { FormVersionResult } from "@/db/types";
import { describe, expect, it } from "@jest/globals";

describe("calculateScorePercentile", () => {
  // if I tell ts that this is a 'FormVersionResult' it gets mad and doesn't think 'subcompetencies' exists
  const version = {
    id: "v1",
    createdAt: "2023-01-01",
    formId: "f1",
    title: "Form Version 1",
    programId: "p1",
    questions: [
      {
        id: "qv1",
        formVersionId: "v1",
        text: "Question 1",
        feedback: false,
        position: 1,
        options: [
          {
            id: "ov1",
            questionVersionId: "qv1",
            text: "Option 1",
            position: 1,
            pointValue: "1",
          },
          {
            id: "ov2",
            questionVersionId: "qv1",
            text: "Option 2",
            position: 2,
            pointValue: "2",
          },
        ],
        milestones: [
          {
            questionVersionId: "qv1",
            milestoneId: "m1",
            milestone: {
              id: "m1",
              name: "Milestone 1",
              description: "Description 1",
              level: 1,
              sublevel: 1,
              subcompetencyId: "sc1",
              subcompetencies: {
                id: "s1",
                name: "subcompetency 1",
                competencyId: "comp1",
                competencies: {
                  id: "comp1",
                  name: "ICS",
                },
              },
            },
          },
        ],
      },
      {
        id: "qv2",
        formVersionId: "v1",
        text: "Question 2",
        feedback: false,
        position: 2,
        options: [
          {
            id: "ov3",
            questionVersionId: "qv2",
            text: "Option 3",
            position: 1,
            pointValue: "3",
          },
          {
            id: "ov4",
            questionVersionId: "qv2",
            text: "Option 4",
            position: 2,
            pointValue: "4",
          },
        ],
        milestones: [
          {
            questionVersionId: "qv2",
            milestoneId: "m2",
            milestone: {
              id: "m2",
              name: "Milestone 2",
              description: "Description 2",
              level: 2,
              sublevel: 1,
              subcompetencyId: "sc2",
              subcompetencies: {
                id: "s1",
                name: "subcompetency 1",
                competencyId: "comp1",
                competencies: {
                  id: "comp1",
                  name: "ICS",
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
        formVersionId: "v1",
        creatorId: "u1",
        evaluateeId: "e1",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
        deletedAt: null,
        creator: {
          id: "u1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "password1",
          role: "FACULTY",
        },
        evaluatee: {
          id: "e1",
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@example.com",
          password: "password2",
          role: "STUDENT",
        },
        answers: [
          {
            id: "a1",
            questionVersionId: "qv1",
            optionVersionId: "ov1",
            responseId: "r1",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            deletedAt: null,
            feedback: null,
          },
          {
            id: "a2",
            questionVersionId: "qv2",
            optionVersionId: "ov3",
            responseId: "r1",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            deletedAt: null,
            feedback: null,
          },
        ],
      },
      {
        id: "r2",
        formVersionId: "v1",
        creatorId: "u2",
        evaluateeId: "e2",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
        deletedAt: null,
        creator: {
          id: "u2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          password: "password3",
          role: "FACULTY",
        },
        evaluatee: {
          id: "e2",
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob@example.com",
          password: "password4",
          role: "STUDENT",
        },
        answers: [
          {
            id: "a3",
            questionVersionId: "qv1",
            optionVersionId: "ov2",
            responseId: "r2",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            deletedAt: null,
            feedback: null,
          },
          {
            id: "a4",
            questionVersionId: "qv2",
            optionVersionId: "ov4",
            responseId: "r2",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            deletedAt: null,
            feedback: null,
          },
        ],
      },
      {
        id: "r3",
        formVersionId: "v1",
        creatorId: "u3",
        evaluateeId: "e3",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
        deletedAt: null,
        creator: {
          id: "u3",
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike@example.com",
          password: "password5",
          role: "FACULTY",
        },
        evaluatee: {
          id: "e3",
          firstName: "Sara",
          lastName: "Davis",
          email: "sara@example.com",
          password: "password6",
          role: "STUDENT",
        },
        answers: [
          {
            id: "a5",
            questionVersionId: "qv1",
            optionVersionId: "ov1",
            responseId: "r3",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            deletedAt: null,
            feedback: null,
          },
          {
            id: "a6",
            questionVersionId: "qv2",
            optionVersionId: "ov4",
            responseId: "r3",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            deletedAt: null,
            feedback: null,
          },
        ],
      },
    ],
    code: {
      id: "code",
      formVersionId: "f1",
      code: "",
      deletedAt: null,
      createdAt: "2023-01-01",
      expiresAt: "2023-01-03",
    },
  };

  it("should calculate the overall score percentile correctly", () => {
    const evaluateeId = "e2";
    const percentile = calculateScorePercentile(
      version as unknown as FormVersionResult,
      evaluateeId,
    );
    expect(percentile).toBe(100);
  });

  it("should calculate the competency-specific score percentile correctly", () => {
    const evaluateeId = "e1";
    const competencyName = "Competency 1";
    const percentile = calculateScorePercentile(
      version as unknown as FormVersionResult,
      evaluateeId,
      competencyName,
    );
    expect(percentile).toBe(0);
  });

  it("should return null if the evaluatee response is not found", () => {
    const evaluateeId = "e4";
    const percentile = calculateScorePercentile(
      version as unknown as FormVersionResult,
      evaluateeId,
    );
    expect(percentile).toBeNull();
  });
});
