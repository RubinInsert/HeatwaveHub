"use server";

import { prisma } from "app/lib/prisma";

export async function saveAssessment(data: any) {
  try {
    const submission = await prisma.assessment.create({
      data: {
        postcode: data.postcode,
        ageGroup: data.ageGroup,
        isOver65: data.ageGroup === "65+",
        hasChronicIllness: data.hasChronicIllness,
        totalScore: data.score,
        riskLevel: data.riskLevel,
        symptoms: data.symptoms,
        // ... map the rest of your state here
      },
    });
    return { success: true, id: submission.id };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false };
  }
}
