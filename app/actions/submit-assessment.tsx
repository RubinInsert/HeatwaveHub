"use server";

import { prisma } from "app/lib/prisma";
import { ratelimit } from "../lib/ratelimit";
import { headers } from "next/headers";
export async function saveAssessment(data: any) {
  if (!process.env.DATABASE_URL) {
    console.log("No Database URL found. Skipping save (Demo Mode).");
    return { success: true, id: "demo-mode" };
  }
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "unknown";

  if (ip === "unknown") {
    console.warn("Could not determine IP address for rate limiting.");
  }
  const { success, limit, reset, remaining } = await ratelimit.limit(
    `survey_submit_${ip}`,
  );
  console.log(`IP: ${ip} | Remaining: ${remaining} | Success: ${success}`);
  if (!success) {
    return {
      success: false,
      error: "Rate limit exceeded. Please try again later.",
    };
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
    return {
      success: false,
      error: "An error occurred while saving the assessment.",
    };
  }
}
