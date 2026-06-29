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
      text: "A bit about you – what is your gender?",
      slug: "gender",
      category: "Demographics",
      type: "RADIO",
      options: [
        { label: "Male", icon: "👨", score: 0 },
        { label: "Female", icon: "👩", score: 0 },
        { label: "Other", icon: "🧑", score: 0 },
      ],
    },
    {
      text: "Where do you get heat warnings and emergency information? (Tick all that apply)",
      slug: "heat-information-sources",
      category: "Risk Profile",
      type: "CHECKBOX",
      options: [
        { label: "Bureau of Meteorology (BOM) or weather app", icon: "❤️", score: 0 },
        { label: "State Emergency Service (SES)", icon: "👣", score: 0 },
        { label: "Fire and Rescue / Fire authorities", icon: "🏠", score: 0 },
        { label: "Local council website", icon: "✅", score: 0 },
        { label: "Social media", icon: "✅", score: 0 },
        { label: "Radio", icon: "✅", score: 0 },
        { label: "Television news", icon: "✅", score: 0 },
        { label: "Family or friends", icon: "✅", score: 0 },
        { label: "Workplace or employer", icon: "✅", score: 0 },
        { label: "Community groups or organisations", icon: "✅", score: 0 },
        { label: "Doctor, nurse, or health service", icon: "✅", score: 0 },
        { label: "I do not recieve this information", icon: "✅", score: 0 },
      ],
    },
    {
      text: "On very hot days, how many hours do you spend outdoors for work, study, or other things you must do?",
      slug: "risk-factors",
      category: "Heat Exposure",
      type: "RADIO",
      options: [
        { label: "None", icon: "❤️", score: 0 },
        { label: "1 to 2 hours", icon: "👣", score: 5 },
        { label: "3 to 4 hours", icon: "🏠", score: 15 },
        { label: "5 or more hours", icon: "✅", score: 0 },
      ],
    },
    {
      text: "Have you ever sought medical care to the effects of heat?",
      slug: "medical-care",
      category: "Heat Exposure",
      type: "RADIO",
      options: [
        { label: "No", icon: "❤️", score: 0 },
        { label: "Yes", icon: "👣", score: 5 }
      ],
    },
    {
      text: "Do you do any of the following types of work? (Tick all that apply)",
      slug: "work-types",
      category: "Heat Exposure",
      type: "CHECKBOX",
      options: [
        { label: "Outdoor work (e.g., construction, landscaping, delivery)", icon: "👣", score: 5 },
        { label: "Indoor physical work (e.g. warehouse, factory, kitchen)", icon: "👣", score: 5 },
        { label: "None of the above", icon: "❤️", score: 0 },
      ],
    },
    {
      text: "Do you identify as Indigenous or Torrens Straight Islander?",
      slug: "medical-care",
      category: "Heat Exposure",
      type: "RADIO",
      options: [
        { label: "No", icon: "❤️", score: 0 },
        { label: "Yes", icon: "👣", score: 5 }
      ],
    },
    {
      text: "What is your postcode?",
      slug: "postcode",
      category: "Location",
      type: "NUMBER",
      options: [], // Text inputs don't need predefined options
    },
    {
      text: "What age group are you in?",
      slug: "age-group",
      category: "Demographics",
      type: "RADIO",
      options: [
        { label: "18 to 64 years", icon: "🧒", score: 0 },
        { label: "55 to 74 years", icon: "👤", score: 0 },
        { label: "75 to 84 years", icon: "👤", score: 0 },
        { label: "85 years or older", icon: "👴", score: 20 }, // Higher risk
      ],
    },
    {
      text: "Does your household include dependents",
      slug: "age-group",
      category: "Demographics",
      type: "RADIO",
      options: [
        { label: "Children under 5 years", icon: "🧒", score: 0 },
        { label: "Children aged 5-17", icon: "👤", score: 0 },
        { label: "Both of the above", icon: "👤", score: 0 },
        { label: "No Dependents", icon: "👴", score: 20 }, // Higher risk
      ],
    },
    {
      text: "How well do you understand heat warnings and emergency information in English?",
      slug: "age-group",
      category: "Demographics",
      type: "RADIO",
      options: [
        { label: "Very Well", icon: "🧒", score: 0 },
        { label: "Well", icon: "👤", score: 0 },
        { label: "Not Well", icon: "👤", score: 0 },
        { label: "Not at All", icon: "👴", score: 20 }, // Higher risk
      ],
    },
    {
      text: "In general, how would you rate your health?",
      slug: "general-health",
      category: "Health Profile",
      type: "RADIO",
      options: [
        { label: "Excelent", icon: "💧", score: 5 },
        { label: "Good", icon: "🌀", score: 10 },
        { label: "Fair", icon: "⚠️", score: 30 },
        { label: "Poor", icon: "❓", score: 25 }
      ],
    },
    {
      text: "Do you have any of the following long-term health conditions? (Tick all that apply)",
      slug: "long-term-conditions",
      category: "Health Profile",
      type: "RADIO",
      options: [
        { label: "Heart condition", icon: "💧", score: 5 },
        { label: "Lung condition", icon: "🌀", score: 10 },
        { label: "Kidney disease", icon: "⚠️", score: 30 },
        { label: "Diabetes", icon: "❓", score: 25 },
        { label: "Mental health condition", icon: "❓", score: 25 },
        { label: "Other chronic health conditions", icon: "❓", score: 25 },
        { label: "None of the above", icon: "❓", score: 25 },
      ],
    },
    {
      text: "Do you take any medicines that make it harder for your body to handle heat?",
      slug: "heat-sensitive-medicines",
      category: "Health Profile",
      type: "RADIO",
      options: [
        { label: "No", icon: "💧", score: 5 },
        { label: "Yes (For Example: Fluid pills, heart or blood pressure medicine, medicine for mental health)", icon: "🌀", score: 10 }
      ],
    },
    {
      text: "Are you pregnant or currently breastfeeding?",
      slug: "pregnant-breastfeeding",
      category: "Health Profile",
      type: "RADIO",
      options: [
        { label: "No", icon: "💧", score: 5 },
        { label: "Yes (For Example: Fluid pills, heart or blood pressure medicine, medicine for mental health)", icon: "🌀", score: 10 }
      ],
    },
    {
      text: "Do you need help from another person to manage daily activities?",
      slug: "daily-assistance",
      category: "Health Profile",
      type: "RADIO",
      options: [
        { label: "No, I manage independently", icon: "💧", score: 5 },
        { label: "Somewhat - It is harder but I usually manage", icon: "💧", score: 5 },
        { label: "Significantly - I often cannot go out or access services when needed", icon: "🌀", score: 10 }
      ],
    },
    {
      text: "Which best describes your household situation?",
      slug: "household-situation",
      category: "Social Connectedness",
      type: "RADIO",
      options: [
        { label: "I live with others in a household with adequate space", icon: "💧", score: 5 },
        { label: "I live alone", icon: "💧", score: 5 },
        { label: "I live in a crowded household where space is limited", icon: "🌀", score: 10 }
      ],
    },
    {
      text: "Is there someone who would check on you during a heatwave?",
      slug: "social-support",
      category: "Social Connectedness",
      type: "RADIO",
      options: [
        { label: "No", icon: "💧", score: 5 },
        { label: "Yes", icon: "💧", score: 5 },
        { label: "I'm not sure", icon: "🌀", score: 10 }
      ],
    },
    {
      text: "Who would be most likely to check up on you during a heatwave?",
      slug: "social-support-person",
      category: "Social Connectedness",
      type: "RADIO",
      options: [
        { label: "Neighbour", icon: "💧", score: 5 },
        { label: "Family Member", icon: "💧", score: 5 },
        { label: "Friend", icon: "🌀", score: 10 },
        { label: "Housemate/roommate", icon: "🌀", score: 10 },
        { label: "Carer or support worker", icon: "🌀", score: 10 },
        { label: "Healthcare worker", icon: "🌀", score: 10 },
        { label: "Religious or community group member", icon: "🌀", score: 10 },
        { label: "Other (please specify)", icon: "🌀", score: 10 },
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
