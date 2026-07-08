"use server";

import { prisma } from "app/lib/prisma";
import { ratelimit } from "../lib/ratelimit";
import { headers } from "next/headers";
import { createHash } from "crypto";
import ASSESSMENT_SCORE_MAP from "./indexTypeMapping";
type SaveAssessmentData = {
  postcode: string;
  ageGroup: string;
  gender: string;
  totalScore: number;
  riskLevel?: string;
  fingerprint: string;
  answers: Record<string, string | string[]>;
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
    return { success: true, id: 0 };
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
  // Helper function to calculate the average answer score for a single index type
  const getAverageForIndexType = (indexType: "EXPOSURE" | "SENSITIVITY" | "ADAPTIVE"): number => {
    // Filter the ASSESSMENT_SCORE_MAP to get only the questions relevant to the specified index type
    const relevantQuestions = ASSESSMENT_SCORE_MAP.filter(
      ([_, questionConfig]) => questionConfig.index_type === indexType
    );

    let totalScoreSum = 0;
    let answeredQuestionCount = 0;
    // Iterate through the relevant questions and calculate the average score based on user answers
    for (const [questionSlug, config] of relevantQuestions) {
      const userAnswer = data.answers[questionSlug];
      
      // Skip missing or empty answers
      if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
        continue;
      }

      // Check array first and cleanly process their option slugs.
      if (Array.isArray(userAnswer)) {
        let checkboxSum = 0;
        let validOptionsCount = 0;

        userAnswer.forEach((optionSlug) => {
          const score = config.options[optionSlug];
          if (score !== undefined) {
            checkboxSum += score;
            validOptionsCount++;
          }
        });

        if (validOptionsCount > 0) {
          totalScoreSum += checkboxSum / validOptionsCount; // Average score for particular checkbox question
          answeredQuestionCount++;
        }
      } 
      // Handle fallback string variants (just in case)
      else {
        const score = config.options[userAnswer];
        if (score !== undefined) {
          totalScoreSum += score;
          answeredQuestionCount++;
        }
      }
    }

    return answeredQuestionCount > 0 ? totalScoreSum / answeredQuestionCount : 0;
  };

  // 2. Compute the averages for all three index pillars
  const exposureAvg = getAverageForIndexType("EXPOSURE");
  const sensitivityAvg = getAverageForIndexType("SENSITIVITY");
  const adaptiveAvg = getAverageForIndexType("ADAPTIVE");

  // 3. Apply your formula: (EXPOSURE_AVG * SENSITIVITY_AVG) / ADAPTIVE_AVG
  const finalScore = adaptiveAvg > 0 
    ? (exposureAvg * sensitivityAvg) / adaptiveAvg 
    : 0;

  console.log({
    exposureAvg,
    sensitivityAvg,
    adaptiveAvg,
    finalScore
  });

  return `${finalScore.toFixed(2)} score`;
}