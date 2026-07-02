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
      order: 0,
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
      order: 1,
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
      order: 2,
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
      order: 3,
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
      order: 4,
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
      slug: "itsi-identification",
      order: 5,
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
      order: 6,
      category: "Location",
      type: "NUMBER",
      options: [], // Text inputs don't need predefined options
    },
    {
      text: "What age group are you in?",
      slug: "age-group",
      order: 7,
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
      slug: "dependents",
      order: 8,
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
      slug: "english-comprehension",
      order: 9,
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
      order: 10,
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
      order: 11,
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
      order: 12,
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
      order: 13,
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
      order: 14,
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
      order: 15,
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
      order: 16,
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
      order: 17,
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
      text: "What is the main way you cool your home?",
      slug: "cooling-method",
      order: 18,
      category: "Home Cooling",
      type: "RADIO",
      options: [
        { label: "Air conditioning (at least one cooled room to retreat to)", icon: "🛑", score: 0 },
        { label: "Evaporative cooling", icon: "👕", score: 0 },
        { label: "Portable air conditioner or fan only", icon: "🥤", score: 0 },
        { label: "No cooling", icon: "🌳", score: 0, followup: ["cooling-effectiveness", "cooling-affordability"]}
      ],
    },
    {
      text: "Does your cooling keep your home comfortable on very hot days?",
      slug: "cooling-effectiveness",
      isFollowup: true,
      order: 19,
      category: "Home Cooling",
      type: "RADIO",
      options: [
        { label: "Yes, it works well", icon: "🛑", score: 0 },
        { label: "It works somewhat", icon: "👕", score: 0 },
        { label: "No, it doesnt work well", icon: "🥤", score: 0 },
        { label: "I don't have cooling (NA)", icon: "🌳", score: 0 }
      ],
    },
    {
      text: "Can you afford to run your cooling whenever you need it during a heatwave?",
      slug: "cooling-affordability",
      isFollowup: true,
      order: 20,
      category: "Home Cooling",
      type: "RADIO",
      options: [
        { label: "Yes, always", icon: "🛑", score: 0 },
        { label: "Yes, most of the time", icon: "👕", score: 0 },
        { label: "Only sometimes", icon: "🥤", score: 0 },
        { label: "No, never", icon: "🥤", score: 0 },
        { label: "I don't have cooling (NA)", icon: "🌳", score: 0 }
      ],
    },
    {
      text: "About when was your home built?",
      slug: "home-built-year",
      order: 21,
      category: "Housing Thermal Performance",
      type: "RADIO",
      options: [
        { label: "2003 or later", icon: "🏠", score: 0 },
        { label: "Don't know", icon: "❓", score: 0 },
        { label: "Before 2003", icon: "🧱", score: 0 }
      ],
    },
    {
      text: "What type of home do you live in?",
      slug: "home-type",
      order: 22,
      category: "Housing Thermal Performance",
      type: "RADIO",
      options: [
        { label: "Detached house", icon: "🏠", score: 0 },
        { label: "Semi-detached house, townhouse, or duplex (joined to one other home)", icon: "🏡", score: 0 },
        { label: "Apartment or unit", icon: "🏢", score: 0 },
        { label: "Other (for example: mobile home, granny flat, caravan)", icon: "🚐", score: 0 }
      ],
    },
    {
      text: "What are the outside walls of your home mainly made of?",
      slug: "wall-material",
      order: 23,
      category: "Housing Thermal Performance",
      type: "RADIO",
      options: [
        { label: "Brick", icon: "🧱", score: 0 },
        { label: "Weatherboard", icon: "🪵", score: 0 },
        { label: "Cement sheets", icon: "📐", score: 0 },
        { label: "Mixed", icon: "🔄", score: 0 },
        { label: "Other", icon: "✨", score: 0 },
        { label: "Don't know", icon: "❓", score: 0 }
      ],
    },
    {
      text: "What type of roof do you have?",
      slug: "roof-type",
      order: 24,
      category: "Housing Thermal Performance",
      type: "RADIO",
      options: [
        { label: "Light coloured", icon: "⚪", score: 0 },
        { label: "Tiled", icon: "🧱", score: 0 },
        { label: "Colourbond", icon: "🟩", score: 0 },
        { label: "Dark coloured", icon: "⚫", score: 0 }
      ],
    },
    {
      text: "What insulation does your home have? (Tick all that apply)",
      slug: "home-insulation",
      order: 25,
      category: "Housing Thermal Performance",
      type: "CHECKBOX",
      options: [
        { label: "Window protection (e.g. double glazing or tinting)", icon: "🪟", score: 0 },
        { label: "Wall insulation", icon: "🧱", score: 0 },
        { label: "Roof insulation", icon: "🪵", score: 0 },
        { label: "None", icon: "❌", score: 0 },
        { label: "Unsure", icon: "❓", score: 0 }
      ],
    },
    {
      text: "Does your home have external shading?",
      slug: "external-shading",
      order: 26,
      category: "Housing Thermal Performance",
      type: "RADIO",
      options: [
        { label: "External blinds, awnings, or shutters", icon: "🏁", score: 0 },
        { label: "No built-in shading, but trees provide shade", icon: "🌳", score: 0 },
        { label: "No external shading at all", icon: "☀️", score: 0 }
      ],
    },
    {
      text: "Can you modify your home to keep it cooler?",
      slug: "home-modification",
      order: 27,
      category: "Housing Thermal Performance",
      type: "RADIO",
      options: [
        { label: "Yes, any changes", icon: "🛠️", score: 0 },
        { label: "Some small changes", icon: "🔨", score: 0 },
        { label: "No", icon: "❌", score: 0 }
      ],
    },
    {
      text: "Can you change your daily routine to avoid being outside hottest part of the day?",
      slug: "routine-flexibility",
      order: 28,
      category: "Personal Adaptation",
      type: "RADIO",
      options: [
        { label: "Yes, usually", icon: "✅", score: 0 },
        { label: "Sometimes", icon: "⏳", score: 0 },
        { label: "No, I can’t change my routine", icon: "❌", score: 0 }
      ],
    },
    {
      text: "If you work or study, can you change your hours or take extra breaks on very hot days?",
      slug: "work-study-flexibility",
      order: 29,
      category: "Personal Adaptation",
      type: "RADIO",
      options: [
        { label: "Yes", icon: "✅", score: 0 },
        { label: "No", icon: "❌", score: 0 },
        { label: "NA", icon: "⚪", score: 0 }
      ],
    },
    {
      text: "Do you know of a place you could realistically go to cool down outside of home during a heatwave if you needed to?",
      slug: "cool-retreat-knowledge",
      order: 30,
      category: "Cooling Infrastructure, Transport & Connectivity",
      type: "RADIO",
      options: [
        { label: "Yes, and I could access at least one of them", icon: "🏃", score: 0 },
        { label: "Yes, but I would have difficulty accessing them (e.g. transport, cost, hours, other barriers)", icon: "⚠️", score: 0 },
        { label: "I don’t have any cool places", icon: "❌", score: 0 }
      ],
    },
    {
      text: "In your local area, do you have access to any of the following? (Tick all that apply)",
      slug: "local-amenities",
      order: 31,
      category: "Cooling Infrastructure, Transport & Connectivity",
      type: "CHECKBOX",
      options: [
        { label: "A park, garden, or green space with shade trees", icon: "🌳", score: 0 },
        { label: "A beach, river, lake, or other water body", icon: "🏖️", score: 0 },
        { label: "A public pool or splash park", icon: "🏊", score: 0 },
        { label: "None of these", icon: "❌", score: 0 }
      ],
    },
    {
      text: "If you needed to get to a cool place or access essential services during a heatwave, how would you get there?",
      slug: "heatwave-transport",
      order: 32,
      category: "Cooling Infrastructure, Transport & Connectivity",
      type: "RADIO",
      options: [
        { label: "I have my own car", icon: "🚗", score: 0 },
        { label: "I could arrange private transport", icon: "🤝", score: 0 },
        { label: "I could use public transport", icon: "🚌", score: 0 },
        { label: "I walk / ride a bike", icon: "🚲", score: 0 },
        { label: "I would have difficulty getting there", icon: "⚠️", score: 0 }
      ],
    },
    {
      text: "Do you have reliable access to the internet or phone data when you need information or services?",
      slug: "data-connectivity",
      order: 33,
      category: "Cooling Infrastructure, Transport & Connectivity",
      type: "RADIO",
      options: [
        { label: "Yes, always", icon: "📶", score: 0 },
        { label: "Sometimes", icon: "⏳", score: 0 },
        { label: "Rarely", icon: "📉", score: 0 },
        { label: "No access", icon: "❌", score: 0 }
      ],
    }
  ];
  // 3. Insert into Database
  for (const q of questionsData) {
    // Map over the options to guarantee every single one has a 'followup' array
    const sanitizedOptions = q.options.map((opt) => ({
      label: opt.label,
      icon: opt.icon,
      score: opt.score,
      // If 'followup' exists in the seed object, use it; otherwise, provide an empty array
      followup: "followup" in opt && Array.isArray(opt.followup) ? opt.followup : [],
    }));
    await prisma.question.create({
      data: {
        text: q.text,
        slug: q.slug,
        isFollowup: 'isFollowup' in q ? (q.isFollowup as boolean) : false,
        category: q.category,
        type: q.type,
        order: q.order,
        options: {
          create: sanitizedOptions,
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
