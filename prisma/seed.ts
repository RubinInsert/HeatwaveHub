// prisma/seed.ts
import { PrismaClient } from "./generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const adapter = new PrismaPg(pool);
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data in order of dependency
  // Delete Answers first because they point to Questions and Assessments
  await prisma.answer.deleteMany();
  
  // Delete Options because they point to Questions
  await prisma.option.deleteMany();
  
  // Delete Assessments because nothing points to them (now that answers are gone)
  await prisma.assessment.deleteMany();
  
  // Finally, delete the Questions
  await prisma.question.deleteMany();

  // 2. Questions Array
  const questionsData = [
    {
      text: "What is the post code where you spent the most time in last week?",
      slug: "postcode",
      category: "Location",
      type: "NUMBER",
      options: [], // Text inputs don't need predefined options
    },
    {
      text: "A bit about you – what is your gender?",
      slug: "gender",
      category: "Demographics",
      type: "RADIO",
      options: [
        { label: "Male", icon: "👨", score: 0 },
        { label: "Female", icon: "👩", score: 0 },
        { label: "Non-binary", icon: "🧑", score: 0 },
        { label: "Prefer not to say", icon: "😶", score: 0 },
      ],
    },
    {
      text: "A bit about you – What is your age?",
      slug: "age-group",
      category: "Demographics",
      type: "RADIO",
      options: [
        { label: "Under 18", icon: "🧒", score: 0 },
        { label: "18-64", icon: "👤", score: 0 },
        { label: "65+", icon: "👴", score: 20 }, // Higher risk
      ],
    },
    {
      text: "Do you identify with any of these?",
      slug: "risk-factors",
      category: "Risk Profile",
      type: "CHECKBOX",
      options: [
        { label: "History of kidney or cardiac disease", icon: "❤️", score: 25 },
        { label: "Aboriginal or Torres Strait Islander", icon: "👣", score: 5 },
        { label: "Currently experiencing homelessness", icon: "🏠", score: 15 },
        { label: "None of the above", icon: "✅", score: 0 },
      ],
    },
    {
      text: "Have you experienced any symptoms of heat-related illness?",
      slug: "heat-symptoms",
      category: "Symptoms",
      type: "CHECKBOX",
      options: [
        { label: "Extreme thirst", icon: "💧", score: 5 },
        { label: "Dizziness or light-headedness", icon: "🌀", score: 10 },
        { label: "Fainting or collapsing", icon: "⚠️", score: 30 },
        { label: "Feeling confused", icon: "❓", score: 25 },
        { label: "Muscle twitching or cramping", icon: "💪", score: 5 },
        { label: "Lack of coordination/difficulty moving", icon: "🚶", score: 20 },
        { label: "Racing heart beat", icon: "💓", score: 15 },
      ],
    },
    {
      text: "How did you manage your symptoms?",
      slug: "management-actions",
      category: "Management",
      type: "CHECKBOX",
      options: [
        { label: "Stopped or reduced activity", icon: "🛑", score: 0 },
        { label: "Removed clothing", icon: "👕", score: 0 },
        { label: "Drank more fluids", icon: "🥤", score: 0 },
        { label: "Stayed inside / sought shade", icon: "🌳", score: 0 },
        { label: "Had a shower or bath", icon: "🚿", score: 0 },
        { label: "Went for a swim", icon: "🏊", score: 0 },
        { label: "Sprayed/splashed with water", icon: "💦", score: 0 },
        { label: "Turned on fan", icon: "🌬️", score: 0 },
        { label: "Turned on air conditioning", icon: "❄️", score: 0 },
        { label: "Found a cooler location", icon: "🏢", score: 0 },
        { label: "Other", icon: "✨", score: 0 },
      ],
    },
    {
      text: "Where did you seek help to manage symptoms?",
      slug: "management-source",
      category: "Management",
      type: "RADIO",
      options: [
        { label: "Pharmacy", icon: "💊", score: 0 },
        { label: "Medical Centre", icon: "🏥", score: 0 },
        { label: "Hospital", icon: "🚑", score: 0 },
        { label: "Other", icon: "❓", score: 0 },
        { label: "Did not seek medical help", icon: "🏠", score: 0 },
      ],
    },
    {
      text: "Were you absent from work due to these symptoms? (Enter number of days)",
      slug: "work-absence",
      category: "Work",
      type: "NUMBER",
      options: [], 
    },
  ];

  // 3. Insert into Database
  for (const q of questionsData) {
    await prisma.question.create({
      data: {
        text: q.text,
        slug: q.slug,
        category: q.category,
        type: q.type,
        options: {
          create: q.options,
        },
      },
    });
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
