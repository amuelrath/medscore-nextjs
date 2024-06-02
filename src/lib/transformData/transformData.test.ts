import { FormVersionResult } from "@/db/types";
import { transformVersion } from "./index";
import { it, describe, expect } from "@jest/globals";

describe("transformVersion", () => {
  const mockFormVersionResult: FormVersionResult = {
    id: "1",
    formId: "form1",
    createdAt: "2023-05-24T10:00:00.000Z",
    title: "Form Version 1",
    code: {
      code: "ABC123",
      createdAt: "2023-05-24T10:00:00.000Z",
      id: "code1",
    },

    questions: [
      {
        id: "question1",
        position: 1,
        text: "Question 1",
        feedback: true,
        options: [
          {
            id: "option1",
            text: "Option 1",
            position: 1,
            pointValue: "10",
          },
          {
            id: "option2",
            text: "Option 2",
            position: 2,
            pointValue: "20",
          },
        ],
        milestones: [
          {
            milestone: {
              id: "milestone1",
              name: "Milestone 1",
              subcompetencies: {
                id: "subcompetency1",
                name: "Subcompetency 1",
                competencies: {
                  id: "competency1",
                  name: "Competency 1",
                },
              },
              description: "Milestone 1 description",
              simpleDescription: "",
              metadata: undefined,
            },
          },
        ],
      },
      {
        id: "question2",
        position: 2,
        text: "Question 2",
        feedback: false,
        options: [
          {
            id: "option3",
            text: "Option 3",
            position: 1,
            pointValue: "5",
          },
        ],
        milestones: [
          {
            milestone: {
              id: "milestone1",
              name: "Milestone 1",
              description: "Milestone 1 description",
              subcompetencies: {
                id: "subcompetency1",
                name: "Subcompetency 1",
                competencies: {
                  id: "competency1",
                  name: "Competency 1",
                },
              },
              simpleDescription: "",
              metadata: undefined,
            },
          },
          {
            milestone: {
              id: "milestone2",
              name: "Milestone 2",
              description: "Milestone 2 description",
              subcompetencies: {
                id: "subcompetency2",
                name: "Subcompetency 2",
                competencies: {
                  id: "competency2",
                  name: "Competency 2",
                },
              },
              simpleDescription: "",
              metadata: undefined,
            },
          },
        ],
      },
    ],
    responses: [
      {
        id: "response1",
        formVersionId: "1",
        createdAt: "2023-05-24T11:00:00.000Z",
        creator: {
          id: "user1",
          role: "FACULTY",
          lastName: "Doe",
          firstName: "John",
        },
        answers: [
          {
            id: "answer1",
            questionVersionId: "question1",
            optionVersionId: "option1",
            feedback: "Feedback 1",
          },
          {
            id: "answer2",
            questionVersionId: "question2",
            optionVersionId: "option3",
            feedback: "Feedback 2",
          },
        ],
        evaluatee: {
          id: "user2",
          role: "STUDENT",
          lastName: "Smith",
          firstName: "Jane",
        },
      },
    ],
  };

  it("should transform form version data correctly", () => {
    const result = transformVersion(mockFormVersionResult);

    expect(result.questions).toHaveLength(2);
    expect(result.answers).toHaveLength(2);
    expect(result.milestones).toHaveLength(2);

    expect(result.questions[0]).toEqual({
      id: "question1",
      text: "Question 1",
      feedback: true,
      position: 1,
      options: [
        {
          id: "option1",
          text: "Option 1",
          position: 1,
          pointValue: 10,
        },
        {
          id: "option2",
          text: "Option 2",
          position: 2,
          pointValue: 20,
        },
      ],
      milestones: [
        {
          id: "milestone1",
          name: "Milestone 1",
          subcompetencies: {
            id: "subcompetency1",
            name: "Subcompetency 1",
            competencyId: "competency1",
          },
        },
      ],
    });

    expect(result.questions[1]).toEqual({
      id: "question2",
      text: "Question 2",
      feedback: false,
      position: 2,
      options: [
        {
          id: "option3",
          text: "Option 3",
          position: 1,
          pointValue: 5,
        },
      ],
      milestones: [
        {
          id: "milestone1",
          name: "Milestone 1",
          subcompetencies: {
            id: "subcompetency1",
            name: "Subcompetency 1",
            competencyId: "competency1",
          },
        },
        {
          id: "milestone2",
          name: "Milestone 2",
          subcompetencies: {
            id: "subcompetency2",
            name: "Subcompetency 2",
            competencyId: "competency2",
          },
        },
      ],
    });

    expect(result.answers[0]).toEqual({
      id: "answer1",
      questionId: "question1",
      optionId: "option1",
      feedback: "Feedback 1",
    });

    expect(result.answers[1]).toEqual({
      id: "answer2",
      questionId: "question2",
      optionId: "option3",
      feedback: "Feedback 2",
    });

    expect(result.milestones[0]).toEqual({
      id: "milestone1",
      name: "Milestone 1",
      subcompetencies: {
        id: "subcompetency1",
        name: "Subcompetency 1",
        competencyId: "competency1",
      },
    });

    expect(result.milestones[1]).toEqual({
      id: "milestone2",
      name: "Milestone 2",
      subcompetencies: {
        id: "subcompetency2",
        name: "Subcompetency 2",
        competencyId: "competency2",
      },
    });
  });

  it("should handle empty form version data", () => {
    const emptyFormVersionResult: FormVersionResult = {
      id: "1",
      formId: "form1",
      createdAt: "2023-05-24T10:00:00.000Z",
      title: "Form Version 1",
      // @ts-ignore
      code: {},
      questions: [],
      responses: [],
    };

    const result = transformVersion(emptyFormVersionResult);

    expect(result.questions).toHaveLength(0);
    expect(result.answers).toHaveLength(0);
    expect(result.milestones).toHaveLength(0);
  });
});
