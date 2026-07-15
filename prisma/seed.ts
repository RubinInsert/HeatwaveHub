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
      indexType: "NONE",
      type: "RADIO",
      options: [
        { label: "Male", icon: "👨", score: 0, slug: "male" },
        { label: "Female", icon: "👩", score: 0, slug: "female" },
        { label: "Other", icon: "🧑", score: 0, slug: "other" },
      ],
    },
    {
      text: "Where do you get heat warnings and emergency information? (Tick all that apply)",
      slug: "heat-information-sources",
      order: 1,
      category: "Risk Profile",
      indexType: "NONE",
      type: "CHECKBOX",
      options: [
        { label: "Bureau of Meteorology (BOM) or weather app", icon: "❤️", score: 0, slug: "bureau-of-meteorology-bom-or-weather-app" },
        { label: "State Emergency Service (SES)", icon: "👣", score: 0, slug: "state-emergency-service-ses" },
        { label: "Fire and Rescue / Fire authorities", icon: "🏠", score: 0, slug: "fire-and-rescue-fire-authorities" },
        { label: "Local council website", icon: "✅", score: 0, slug: "local-council-website" },
        { label: "Social media", icon: "✅", score: 0, slug: "social-media" },
        { label: "Radio", icon: "✅", score: 0, slug: "radio" },
        { label: "Television news", icon: "✅", score: 0, slug: "television-news" },
        { label: "Family or friends", icon: "✅", score: 0, slug: "family-or-friends" },
        { label: "Workplace or employer", icon: "✅", score: 0, slug: "workplace-or-employer" },
        { label: "Community groups or organisations", icon: "✅", score: 0, slug: "community-groups-or-organisations" },
        { label: "Doctor, nurse, or health service", icon: "✅", score: 0, slug: "doctor-nurse-or-health-service" },
        { label: "I do not recieve this information", icon: "✅", score: 0, slug: "i-do-not-recieve-this-information" },
      ],
    },
    {
      text: "On very hot days, how many hours do you spend outdoors for work, study, or other things you must do?",
      slug: "risk-factors",
      order: 2,
      category: "Heat Exposure",
      indexType: "EXPOSURE",
      type: "RADIO",
      options: [
        { label: "None", icon: "❤️", score: 0, slug: "none" },
        { label: "1 to 2 hours", icon: "👣", score: 0.33, slug: "1-to-2-hours" },
        { label: "3 to 4 hours", icon: "🏠", score: 0.67, slug: "3-to-4-hours" },
        { label: "5 or more hours", icon: "✅", score: 1, slug: "5-or-more-hours" },
      ],
    },
    {
      text: "Have you ever sought medical care to the effects of heat?",
      slug: "medical-care",
      order: 3,
      category: "Heat Exposure",
      indexType: "EXPOSURE",
      type: "RADIO",
      options: [
        { label: "No", icon: "❤️", score: 0, slug: "no" },
        { label: "Yes", icon: "👣", score: 1, slug: "yes" },
      ],
    },
    {
      text: "Do you do any of the following types of work? (Tick all that apply)",
      slug: "work-types",
      order: 4,
      category: "Heat Exposure",
      indexType: "EXPOSURE",
      type: "CHECKBOX",
      options: [
        { label: "Outdoor work (e.g., construction, landscaping, delivery)", icon: "👣", score: 1, slug: "outdoor-work-eg-construction-landscaping-delivery" },
        { label: "Indoor physical work (e.g. warehouse, factory, kitchen)", icon: "👣", score: 1, slug: "indoor-physical-work-eg-warehouse-factory-kitchen" },
        { label: "None of the above", icon: "❤️", score: 0, slug: "none-of-the-above" },
      ],
    },
    {
      text: "Do you identify as Indigenous or Torrens Straight Islander?",
      slug: "itsi-identification",
      order: 5,
      category: "Heat Exposure",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "No", icon: "❤️", score: 0, slug: "no" },
        { label: "Yes", icon: "👣", score: 1, slug: "yes" },
      ],
    },
    {
      text: "What is your postcode?",
      slug: "postcode",
      order: 6,
      category: "Location",
      indexType: "SENSITIVITY",
      type: "NUMBER",
      options: [],
    },
    {
      text: "What age group are you in?",
      slug: "age-group",
      order: 7,
      category: "Demographics",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "18 to 64 years", icon: "🧒", score: 0, slug: "18-to-64-years" },
        { label: "55 to 74 years", icon: "👤", score: 0.67, slug: "55-to-74-years" },
        { label: "75 to 84 years", icon: "👤", score: 0.83, slug: "75-to-84-years" },
        { label: "85 years or older", icon: "👴", score: 1, slug: "85-years-or-older" },
      ],
    },
    {
      text: "Does your household include dependents",
      slug: "dependents",
      order: 8,
      category: "Demographics",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "Children under 5 years", icon: "🧒", score: 1, slug: "children-under-5-years" },
        { label: "Children aged 5-17", icon: "👤", score: 0.5, slug: "children-aged-5-17" },
        { label: "Both of the above", icon: "👤", score: 1, slug: "both-of-the-above" },
        { label: "No Dependents", icon: "👴", score: 0, slug: "no-dependents" },
      ],
    },
    {
      text: "How well do you understand heat warnings and emergency information in English?",
      slug: "english-comprehension",
      order: 9,
      category: "Demographics",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "Very Well", icon: "🧒", score: 0, slug: "very-well" },
        { label: "Well", icon: "👤", score: 0.33, slug: "well" },
        { label: "Not Well", icon: "👤", score: 0.67, slug: "not-well" },
        { label: "Not at All", icon: "👴", score: 1, slug: "not-at-all" },
      ],
    },
    {
      text: "In general, how would you rate your health?",
      slug: "general-health",
      order: 10,
      category: "Health Profile",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "Excelent", icon: "💧", score: 0, slug: "excelent" },
        { label: "Good", icon: "🌀", score: 0.33, slug: "good" },
        { label: "Fair", icon: "⚠️", score: 0.67, slug: "fair" },
        { label: "Poor", icon: "❓", score: 1, slug: "poor" },
      ],
    },
    {
      text: "Do you have any of the following long-term health conditions? (Tick all that apply)",
      slug: "long-term-conditions",
      order: 11,
      category: "Health Profile",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "Heart condition", icon: "💧", score: 0.2, slug: "heart-condition" },
        { label: "Lung condition", icon: "🌀", score: 0.2, slug: "lung-condition" },
        { label: "Kidney disease", icon: "⚠️", score: 0.2, slug: "kidney-disease" },
        { label: "Diabetes", icon: "❓", score: 0.2, slug: "diabetes" },
        { label: "Mental health condition", icon: "❓", score: 0.2, slug: "mental-health-condition" },
        { label: "Other chronic health conditions", icon: "❓", score: 0.2, slug: "other-chronic-health-conditions" },
        { label: "None of the above", icon: "❓", score: 0, slug: "none-of-the-above" },
      ],
    },
    {
      text: "Do you take any medicines that make it harder for your body to handle heat?",
      slug: "heat-sensitive-medicines",
      indexType: "SENSITIVITY",
      order: 12,
      category: "Health Profile",
      type: "RADIO",
      options: [
        { label: "No", icon: "💧", score: 0, slug: "no" },
        { label: "Yes (For Example: Fluid pills, heart or blood pressure medicine, medicine for mental health)", icon: "🌀", score: 1, slug: "yes-for-example-fluid-pills-heart-or-blood-pressure-medicine-medicine-for-mental-health" },
      ],
    },
    {
      text: "Are you pregnant or currently breastfeeding?",
      slug: "pregnant-breastfeeding",
      order: 13,
      category: "Health Profile",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "No", icon: "💧", score: 0, slug: "no" },
        { label: "Yes (For Example: Fluid pills, heart or blood pressure medicine, medicine for mental health)", icon: "🌀", score: 1, slug: "yes-for-example-fluid-pills-heart-or-blood-pressure-medicine-medicine-for-mental-health" },
      ],
    },
    {
      text: "Do you need help from another person to manage daily activities?",
      slug: "daily-assistance",
      order: 14,
      category: "Health Profile",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "No, I manage independently", icon: "💧", score: 0, slug: "no-i-manage-independently" },
        { label: "Somewhat - It is harder but I usually manage", icon: "💧", score: 0.5, slug: "somewhat-it-is-harder-but-i-usually-manage" },
        { label: "Significantly - I often cannot go out or access services when needed", icon: "🌀", score: 1, slug: "significantly-i-often-cannot-go-out-or-access-services-when-needed" },
      ],
    },
    {
      text: "Which best describes your household situation?",
      slug: "household-situation",
      order: 15,
      category: "Social Connectedness",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "I live with others in a household with adequate space", icon: "💧", score: 0, slug: "i-live-with-others-in-a-household-with-adequate-space" },
        { label: "I live alone", icon: "💧", score: 1, slug: "i-live-alone" },
        { label: "I live in a crowded household where space is limited", icon: "🌀", score: 1, slug: "i-live-in-a-crowded-household-where-space-is-limited" },
      ],
    },
    {
      text: "Is there someone who would check on you during a heatwave?",
      slug: "social-support",
      order: 16,
      category: "Social Connectedness",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "No", icon: "💧", score: 0, slug: "no" },
        { label: "Yes", icon: "💧", score: 1, slug: "yes" },
        { label: "I'm not sure", icon: "🌀", score: 0.5, slug: "im-not-sure" },
      ],
    },
    {
      text: "Who would be most likely to check up on you during a heatwave?",
      slug: "social-support-person",
      order: 17,
      category: "Social Connectedness",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "Neighbour", icon: "💧", score: 1, slug: "neighbour" },
        { label: "Family Member", icon: "💧", score: 1, slug: "family-member" },
        { label: "Friend", icon: "🌀", score: 1, slug: "friend" },
        { label: "Housemate/roommate", icon: "🌀", score: 1, slug: "housemate-roommate" },
        { label: "Carer or support worker", icon: "🌀", score: 1, slug: "carer-or-support-worker" },
        { label: "Healthcare worker", icon: "🌀", score: 1, slug: "healthcare-worker" },
        { label: "Religious or community group member", icon: "🌀", score: 1, slug: "religious-or-community-group-member" },
        { label: "Other (please specify)", icon: "🌀", score: 1, slug: "other-please-specify" },
      ],
    },
    {
      text: "What is the main way you cool your home?",
      slug: "cooling-method",
      order: 18,
      category: "Home Cooling",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Air conditioning (at least one cooled room to retreat to)", icon: "🛑", score: 1, followup: ["cooling-effectiveness", "cooling-affordability"], slug: "air-conditioning-at-least-one-cooled-room-to-retreat-to" },
        { label: "Evaporative cooling", icon: "👕", score: 0.67, followup: ["cooling-effectiveness", "cooling-affordability"], slug: "evaporative-cooling" },
        { label: "Portable air conditioner or fan only", icon: "🥤", score: 0.33, followup: ["cooling-effectiveness", "cooling-affordability"], slug: "portable-air-conditioner-or-fan-only" },
        { label: "No cooling", icon: "🌳", score: 0, slug: "no-cooling" },
      ],
    },
    {
      text: "Does your cooling keep your home comfortable on very hot days?",
      slug: "cooling-effectiveness",
      isFollowup: true,
      order: 19,
      category: "Home Cooling",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes, it works well", icon: "🛑", score: 1, slug: "yes-it-works-well" },
        { label: "It works somewhat", icon: "👕", score: 0.67, slug: "it-works-somewhat" },
        { label: "No, it doesnt work well", icon: "🥤", score: 0.33, slug: "no-it-doesnt-work-well" },
        { label: "I don't have cooling (NA)", icon: "🌳", score: 0, slug: "i-dont-have-cooling-na" },
      ],
    },
    {
      text: "Can you afford to run your cooling whenever you need it during a heatwave?",
      slug: "cooling-affordability",
      isFollowup: true,
      order: 20,
      category: "Home Cooling",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes, always", icon: "🛑", score: 1, slug: "yes-always" },
        { label: "Yes, most of the time", icon: "👕", score: 0.67, slug: "yes-most-of-the-time" },
        { label: "Only sometimes", icon: "🥤", score: 0.33, slug: "only-sometimes" },
        { label: "No, never", icon: "🥤", score: 0, slug: "no-never" },
        { label: "I don't have cooling (NA)", icon: "🌳", score: 0, slug: "i-dont-have-cooling-na" },
      ],
    },
    {
      text: "About when was your home built?",
      slug: "home-built-year",
      order: 21,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "2003 or later", icon: "🏠", score: 1, slug: "2003-or-later" },
        { label: "Don't know", icon: "❓", score: 0.5, slug: "dont-know" },
        { label: "Before 2003", icon: "🧱", score: 0, slug: "before-2003" },
      ],
    },
    {
      text: "What type of home do you live in?",
      slug: "home-type",
      order: 22,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Detached house", icon: "🏠", score: 1, slug: "detached-house" },
        { label: "Semi-detached house, townhouse, or duplex (joined to one other home)", icon: "🏡", score: 0.67, slug: "semi-detached-house-townhouse-or-duplex-joined-to-one-other-home" },
        { label: "Apartment or unit", icon: "🏢", score: 0.33, slug: "apartment-or-unit" },
        { label: "Other (for example: mobile home, granny flat, caravan)", icon: "🚐", score: 0, slug: "other-for-example-mobile-home-granny-flat-caravan" },
      ],
    },
    {
      text: "What are the outside walls of your home mainly made of?",
      slug: "wall-material",
      order: 23,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Brick", icon: "🧱", score: 0.67, slug: "brick" },
        { label: "Weatherboard", icon: "🪵", score: 0.67, slug: "weatherboard" },
        { label: "Cement sheets", icon: "📐", score: 0.33, slug: "cement-sheets" },
        { label: "Mixed", icon: "🔄", score: 0.5, slug: "mixed" },
        { label: "Other", icon: "✨", score: 0.5, slug: "other" },
        { label: "Don't know", icon: "❓", score: 0.5, slug: "dont-know" },
      ],
    },
    {
      text: "What type of roof do you have?",
      slug: "roof-type",
      order: 24,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Metal Roof (e.g. Colourbond, Corrugated Steel)", icon: "⚪", score: 1, slug: "metal-roof" },
        { label: "Roof tiles (e.g. concrete or terracotta)", icon: "🧱", score: 0.5, slug: "tiled" },
        { label: "Slate Roof", icon: "🟩", score: 0.5, slug: "slate-roof" },
        { label: "Other (Please Specify)", icon: "⚫", score: 0, slug: "other-please-specify" },
      ],
    },
    {
      text: "What colour is your roof?",
      slug: "roof-colour",
      order: 25,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Light coloured", icon: "⚪", score: 0.33, slug: "light-coloured" },
        { label: "Medium coloured", icon: "⚪", score: 0.33, slug: "medium-coloured" },
        { label: "Dark coloured", icon: "⚫", score: 0.33, slug: "dark-coloured" },
      ],
    },
    {
      text: "Does your roof have insulation?",
      slug: "roof-insulation",
      order: 26,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes", icon: "🪟", score: 0.33, slug: "window-protection-eg-double-glazing-or-tinting" },
        { label: "No", icon: "🧱", score: 0.33, slug: "wall-insulation" },
        { label: "Unsure", icon: "?", score: 0.5, slug: "unsure" },
      ],
    },
    {
      text: "Does your home have external shading?",
      slug: "external-shading",
      order: 27,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "External blinds, awnings, or shutters", icon: "🏁", score: 1, slug: "external-blinds-awnings-or-shutters" },
        { label: "No built-in shading, but trees provide shade", icon: "🌳", score: 0.5, slug: "no-built-in-shading-but-trees-provide-shade" },
        { label: "No external external shading at all", icon: "☀️", score: 0, slug: "no-external-external-shading-at-all" },
      ],
    },
    {
      text: "Can you modify your home to keep it cooler?",
      slug: "home-modification",
      order: 28,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes, any changes", icon: "🛠️", score: 1, slug: "yes-any-changes" },
        { label: "Some small changes", icon: "🔨", score: 0.5, slug: "some-small-changes" },
        { label: "No", icon: "❌", score: 0, slug: "no" },
      ],
    },
    {
      text: "Can you change your daily routine to avoid being outside hottest part of the day?",
      slug: "routine-flexibility",
      order: 29,
      category: "Personal Adaptation",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes, usually", icon: "✅", score: 1, slug: "yes-usually" },
        { label: "Sometimes", icon: "⏳", score: 0.5, slug: "sometimes" },
        { label: "No, I can’t change my routine", icon: "❌", score: 0, slug: "no-i-cant-change-my-routine" },
      ],
    },
    {
      text: "If you work or study, can you change your hours or take extra breaks on very hot days?",
      slug: "work-study-flexibility",
      order: 30,
      category: "Personal Adaptation",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes", icon: "✅", score: 1, slug: "yes" },
        { label: "No", icon: "❌", score: 0, slug: "no" },
        { label: "NA", icon: "⚪", score: 1, slug: "na" },
      ],
    },
    {
      text: "Do you know of a place you could realistically go to cool down outside of home during a heatwave if you needed to?",
      slug: "cool-retreat-knowledge",
      order: 31,
      category: "Cooling Infrastructure, Transport & Connectivity",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes, and I could access at least one of them", icon: "🏃", score: 1, slug: "yes-and-i-could-access-at-least-one-of-them" },
        { label: "Yes, but I would have difficulty accessing them (e.g. transport, cost, hours, other barriers)", icon: "⚠️", score: 0.5, slug: "yes-but-i-would-have-difficulty-accessing-them-eg-transport-cost-hours-other-barriers" },
        { label: "I don’t have any cool places", icon: "❌", score: 0, slug: "i-dont-have-any-cool-places" },
      ],
    },
    {
      text: "In your local area, do you have access to any of the following? (Tick all that apply)",
      slug: "local-amenities",
      order: 32,
      category: "Cooling Infrastructure, Transport & Connectivity",
      indexType: "ADAPTIVE",
      type: "CHECKBOX",
      options: [
        { label: "A park, garden, or green space with shade trees", icon: "🌳", score: 0.33, slug: "a-park-garden-or-green-space-with-shade-trees" },
        { label: "A beach, river, lake, or other water body", icon: "🏖️", score: 0.33, slug: "a-beach-river-lake-or-other-water-body" },
        { label: "A public pool or splash park", icon: "🏊", score: 0.33, slug: "a-public-pool-or-splash-park" },
        { label: "None of these", icon: "❌", score: 0, slug: "none-of-these" },
      ],
    },
    {
      text: "If you needed to get to a cool place or access essential services during a heatwave, how would you get there?",
      slug: "heatwave-transport",
      order: 33,
      category: "Cooling Infrastructure, Transport & Connectivity",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "I have my own car", icon: "🚗", score: 1, slug: "i-have-my-own-car" },
        { label: "I could arrange private transport", icon: "🤝", score: 0.67, slug: "i-could-arrange-private-transport" },
        { label: "I could use public transport", icon: "🚌", score: 0.33, slug: "i-could-use-public-transport" },
        { label: "I walk / ride a bike", icon: "🚲", score: 0.67, slug: "i-walk-ride-a-bike" },
        { label: "I would have difficulty getting there", icon: "⚠️", score: 0, slug: "i-would-have-difficulty-getting-there" },
      ],
    },
    {
      text: "Do you have reliable access to the internet or phone data when you need information or services?",
      slug: "data-connectivity",
      order: 34,
      category: "Cooling Infrastructure, Transport & Connectivity",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes, always", icon: "📶", score: 1, slug: "yes-always" },
        { label: "Sometimes", icon: "⏳", score: 0.5, slug: "sometimes" },
        { label: "Rarely", icon: "📉", score: 0, slug: "rarely" },
        { label: "No access", icon: "❌", score: 0, slug: "no-access" },
      ],
    },
];
  // 3. Insert into Database
  for (const q of questionsData) {
    // Map over the options to guarantee every single one has a 'followup' array
    const sanitizedOptions = q.options.map((opt) => ({
      label: opt.label,
      icon: opt.icon,
      score: opt.score,
      slug: opt.slug,
      // If 'followup' exists in the seed object, use it; otherwise, provide an empty array
      followup: "followup" in opt && Array.isArray(opt.followup) ? opt.followup : [],
    }));
    await prisma.question.create({
      data: {
        text: q.text,
        slug: q.slug,
        isFollowup: 'isFollowup' in q ? (q.isFollowup as boolean) : false,
        category: q.category,
        indexType: q.indexType,
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
