"use server";

import { db } from "@/db";

export async function getTrainingData() {
  // TODO separate by specialty

  return db.query.questionClassifications.findMany();
}
