"use server";

import { prisma } from "app/lib/prisma";

export async function saveAssessment(data: any) {
  if (!process.env.DATABASE_URL) {
    console.log("No Database URL found. Skipping save (Demo Mode).");
    return { success: true, id: "demo-mode" };
  }
  try {
    const submission = await prisma.assessment.create({
      data: {
        postcode: data.postcode,
        ageGroup: data.ageGroup,
        gender: data.gender, // Matches schema
        totalScore: data.totalScore,
        riskLevel: data.riskLevel,

        // This is how you handle the "Variable" part (the Symptoms/Answers)
        answers: {
          create: data.selections.map((sel: any) => ({
            questionId: sel.questionId,
            value: sel.optionLabel, // This replaces the old 'symptoms' array
          })),
        },
      },
    });
    return { success: true, id: submission.id };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false };
  }
}
