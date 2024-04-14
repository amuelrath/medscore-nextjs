"use client";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";

type EvaluationForm = {
  id: string;
  title: string;
  creatorId: string;
  program: {
    id: string;
    name: string;
    specialty: {
      id: string;
      name: string;
      subcompetencies: Array<{
        id: string;
        level: string;
        name: string;
      }>;
    };
  };
  questions: Array<{
    id: string;
    text: string;
    position: string;
    milestones: Array<{
      id: string;
      name: string;
      description: string;
      level: string;
      sublevel: string;
      subcompetencyId: string;
    }>;
    options: Array<{
      id: string;
      text: string;
      position: string;
      pointValue: string;
    }>;
  }>;
};

export default function EvaluationForm() {
  const {
    register,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      evaluation: {
        id: "",
        title: "",
        creatorId: "",
        program: {
          id: "",
          name: "",
          specialty: {
            id: "",
            name: "",
            subcompetencies: [
              {
                id: "",
                level: "",
                name: "",
              },
            ],
          },
        },
        questions: [
          {
            id: "",
            text: "",
            position: "",
            milestones: [
              {
                id: "",
                name: "",
                description: "",
                level: "",
                sublevel: "",
                subcompetencyId: "",
              },
            ],
            options: [
              {
                id: "",
                text: "",
                pointValue: "",
              },
            ],
          },
        ],
      },
    },
  });

  //const { fields } = useFieldArray();

  return <div></div>;
}
