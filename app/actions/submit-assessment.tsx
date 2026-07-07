"use server";

import { prisma } from "app/lib/prisma";
import { ratelimit } from "../lib/ratelimit";
import { headers } from "next/headers";
import { createHash } from "crypto";
import INDEX_TYPE_MAP from "./indexTypeMapping";
type SaveAssessmentData = {
  postcode: string;
  ageGroup: string;
  gender: string;
  totalScore: number;
  riskLevel?: string;          // optional — currently commented out in your call
  selections: {
    questionId: string; // Now uses the question slug (e.g. "risk-factors")
    optionLabel: string;
    points: number;
  }[];
  fingerprint: string;
};
export async function saveAssessment(data: SaveAssessmentData) {
  
  if (!process.env.DATABASE_URL) {
    console.log("No Database URL found. Skipping save (Demo Mode).");
    return { success: true, id: "demo-mode" };
  }
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "unknown";

  if (ip === "unknown") {
    console.warn("Could not determine IP address for rate limiting.");
  }
  const { success, limit, reset, remaining } = await ratelimit.limit( // Rate limit based exclusively on IP address to prevent bot submission abuse.
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
    const userIdentification = `${data.fingerprint}_${data.postcode}_${data.ageGroup}`; // For database submission, combine fingerprint, postcode, and age group to create a unique identifier for the user. This helps in preventing duplicate submissions from the same user.
    const hashedFingerprint = createHash("sha256").update(userIdentification).digest("hex"); // Hash the combined identifier for privacy and security.
    const riskScore = calculateRiskLevel(data); // Calculate the risk level based on the total score or other criteria.
    const submission = await prisma.assessment.create({
      data: {
        fingerprint: hashedFingerprint,
        postcode: data.postcode,
        ageGroup: data.ageGroup,
        gender: data.gender, // Matches schema
        totalScore: data.totalScore,
        riskLevel: riskScore,

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

function calculateRiskLevel(data: SaveAssessmentData): string {
  // Example
  
  return "X score"
}
