"use server";

import { prisma } from "app/lib/prisma";
import { ratelimit } from "../lib/ratelimit";
import { headers } from "next/headers";
import { createHash } from "crypto";
import { cache } from "react";
import POSTCODE_MMM_MAP from "./MMM_SCORE_MAP";
type SaveAssessmentData = {
  postcode: string;
  ageGroup: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  fingerprint: string;
  answers: Record<string, string | string[]>;
};
type AssessmentScoreMap = Record<
  string,
  {
    indexType: "NONE" | "EXPOSURE" | "SENSITIVITY" | "ADAPTIVE";
    options: Record<string, number>;
  }
>;
export const getAssessmentScoreMap = cache(async (): Promise<AssessmentScoreMap> => {
  const questions = await prisma.question.findMany({
    where: { isActive: true },
    include: {
      options: {
        select: { slug: true, score: true },
      },
    },
  });

  const map: AssessmentScoreMap = {};

  for (const q of questions) {
    const options: Record<string, number> = {};
    for (const opt of q.options) {
      options[opt.slug] = opt.score;
    }

    // If you haven't added indexType yet, you'll need to add it to your schema
    // or derive it from another field (e.g., category). Here we assume it's there.
    map[q.slug] = {
      indexType: q.indexType as AssessmentScoreMap[string]["indexType"],
      options,
    };
  }

  return map;
});
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
    const riskScore = await calculateRiskLevel(data); // Calculate the risk level based on the total score or other criteria.
    return { success: true, id: 0, score: riskScore };
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
const SEPERATELY_PROCESSED_QUESTIONS = ["postcode", "long-term-conditions",]
async function calculateRiskLevel(data: SaveAssessmentData): Promise<string> {
  // Helper function to calculate the average answer score for a single index type
  const scoreMap = await getAssessmentScoreMap()
  const getIndicatorsForIndexType = (indexType: "EXPOSURE" | "SENSITIVITY" | "ADAPTIVE", scoreMap: AssessmentScoreMap): number[] => {
    // Filter the ASSESSMENT_SCORE_MAP to get only the questions relevant to the specified index type
    const relevantQuestions = Object.entries(scoreMap).filter(
      ([questionSlug, questionConfig]) => questionConfig.indexType === indexType
      && !SEPERATELY_PROCESSED_QUESTIONS.includes(questionSlug)
    );

    let indicators: number[] = [];
    // Iterate through the relevant questions and calculate the average score based on user answers
    for (const [questionSlug, config] of relevantQuestions) {
      const userAnswer = data.answers[questionSlug];
      
      // Skip missing or empty answers
      if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
        continue;
      }

      // Check array first and cleanly process their option slugs.
      if (Array.isArray(userAnswer)) {
        
        let validOptionsCount = 0;

        userAnswer.forEach((optionSlug) => {
          const score = config.options[optionSlug];
          if (score !== undefined) {
            indicators.push(score);
            validOptionsCount++;
          }
        });

        // Average scores outside of function to allow for custom logic on some questions
        // if (validOptionsCount > 0) {
        //   totalScoreSum += indicators.reduce((sum, score) => sum + score, 0) / validOptionsCount; // Average score for particular checkbox question
        //   answeredQuestionCount++;
        // }
      } 
      // Handle fallback string variants (just in case)
      else {
        const score = config.options[userAnswer];
        if (score !== undefined) {
          indicators.push(score);
        }
      }
    }

    return indicators;
  };

  // 2. Compute the averages for all three index pillars
  const exposureIndicators = getIndicatorsForIndexType("EXPOSURE", scoreMap);
  const sensitivityIndicators = getIndicatorsForIndexType("SENSITIVITY", scoreMap);
  // Add exceptions to average sensitivity calculation
  // Look up MMM score based on postcode and average it with the sensitivityAvg if it exists
  const mmmScore = POSTCODE_MMM_MAP[data.postcode as keyof typeof POSTCODE_MMM_MAP];
  if (mmmScore !== undefined) {
  sensitivityIndicators.push(mmmScore);
  }
  if(data.answers["long-term-conditions"] !== undefined) {
    const longTermConditionsAnswers = data.answers["long-term-conditions"];

    // Ensure answer is an array
    const answersArray = Array.isArray(longTermConditionsAnswers)
    ? longTermConditionsAnswers
    : [longTermConditionsAnswers];

    let conditionsSum = 0;
    const answerScores = scoreMap["long-term-conditions"];
    if (answerScores && answerScores.options) {
    answersArray.forEach((optionSlug) => {
      const score = answerScores.options[optionSlug];
      if (score !== undefined) {
        conditionsSum += score;
      }
    });
    sensitivityIndicators.push(conditionsSum);
  }
  }

  const adaptiveIndicators = getIndicatorsForIndexType("ADAPTIVE", scoreMap);

  const exposureAvg = exposureIndicators.reduce((sum, score) => sum + score, 0) / (exposureIndicators.length || 1);
  const sensitivityAvg = sensitivityIndicators.reduce((sum, score) => sum + score, 0) / (sensitivityIndicators.length || 1);
  const adaptiveAvg = adaptiveIndicators.reduce((sum, score) => sum + score, 0) / (adaptiveIndicators.length || 1);

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