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
      text: "What gender do you identify as?",
      order: 0,
      slug: "gender",
      category: "Demographics",
      indexType: "NONE",
      type: "RADIO",
      options: [
        { label: "Male", icon: "🔷", score: 0, slug: "male" },
        { label: "Female", icon: "🔸", score: 0, slug: "female" },
        { label: "Other", icon: "▫️", score: 0, slug: "other" },
      ],
    },
    {
      text: "Where do you access information about heat warnings and emergency situations?(Select all that apply)",
      slug: "heat-information-sources",
      order: 1,
      category: "Risk Profile",
      indexType: "NONE",
      type: "CHECKBOX",
      options: [
        { label: "Bureau of Meteorology (BOM) or weather app", icon: "☀️", score: 0, slug: "bureau-of-meteorology-bom-or-weather-app" },
        { label: "State Emergency Service (SES)", icon: "🛡️", score: 0, slug: "state-emergency-service-ses" },
        { label: "Fire and Rescue / Fire authorities", icon: "🚒", score: 0, slug: "fire-and-rescue-fire-authorities" },
        { label: "Local council website", icon: "🏛️", score: 0, slug: "local-council-website" },
        { label: "Social media", icon: "📱", score: 0, slug: "social-media" },
        { label: "Radio", icon: "📻", score: 0, slug: "radio" },
        { label: "Television news", icon: "📺", score: 0, slug: "television-news" },
        { label: "Family or friends", icon: "👥", score: 0, slug: "family-or-friends" },
        { label: "Workplace or employer", icon: "💼", score: 0, slug: "workplace-or-employer" },
        { label: "Community groups or organisations", icon: "🤝", score: 0, slug: "community-groups-or-organisations" },
        { label: "Doctor, nurse, or health service", icon: "🏥", score: 0, slug: "doctor-nurse-or-health-service" },
        { label: "I do not receive this information", icon: "❌", score: 0, slug: "i-do-not-receive-this-information" },
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
        { label: "None", icon: "⏱️", score: 0, slug: "none" },
        { label: "1 to 2 hours", icon: "🕐", score: 0.33, slug: "1-to-2-hours" },
        { label: "3 to 4 hours", icon: "🕒", score: 0.67, slug: "3-to-4-hours" },
        { label: "5 or more hours", icon: "🕔", score: 1, slug: "5-or-more-hours" },
      ],
    },
    {
      text: "Have you ever sought medical care for the effects of heat?",
      slug: "medical-care",
      order: 3,
      category: "Heat Exposure",
      indexType: "EXPOSURE",
      type: "RADIO",
      options: [
        { label: "No", icon: "❌", score: 0, slug: "no" },
        { label: "Yes", icon: "✅", score: 1, slug: "yes" },
      ],
    },
    {
      text: "Do you do any of the following types of professional work activities? (Select all that apply)",
      slug: "work-types",
      order: 4,
      category: "Heat Exposure",
      indexType: "EXPOSURE",
      type: "CHECKBOX",
      options: [
        { label: "Outdoor work (e.g., construction, landscaping, delivery),", icon: "🏗️", score: 1, slug: "outdoor-work-eg-construction-landscaping-delivery" },
        { label: "Indoor physical work (e.g. warehouse, factory, manufacturing, food preparation),", icon: "🏭", score: 1, slug: "indoor-physical-work-eg-warehouse-factory-manufacturing-food-preparation" },
        { label: "No", icon: "❌", score: 0, slug: "no", isNone: true },
      ],
    },
    {
      text: "Do you identify as identify as Indigenous or Torrens Straight Islander?",
      slug: "itsi-identification",
      order: 5,
      category: "Demographic Sensitivity",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "No", icon: "❌", score: 0, slug: "no" },
        { label: "Yes", icon: "✅", score: 1, slug: "yes" },
        { label: "Prefer not to say", icon: "🔒", score: 0.5, slug: "prefer-not-to-say" },
      ],
    },
    {
      text: "What is your post code?",
      slug: "postcode",
      order: 6,
      category: "Demographic Sensitivity",
      indexType: "SENSITIVITY",
      type: "NUMBER",
      options: [],
    },
    {
      text: "Which age group are you in?",
      slug: "age-group",
      order: 7,
      category: "Demographic Sensitivity",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "18 to 64 years", icon: "🔹", score: 0, slug: "18-to-64-years" },
        { label: "65 to 74 years", icon: "🔸", score: 0.67, slug: "65-to-74-years" },
        { label: "75 to 84 years", icon: "🔺", score: 0.83, slug: "75-to-84-years" },
        { label: "85 years or older", icon: "▪️", score: 1, slug: "85-years-or-older" },
      ],
    },
    {
      text: "Does your household include any people who depend on you for care or support? (Select all that apply)",
      slug: "dependents",
      order: 8,
      category: "Demographic Sensitivity",
      indexType: "SENSITIVITY",
      type: "CHECKBOX",
      options: [
        { label: "Child(ren) under 5 years", icon: "🍼", score: 1, slug: "children-under-5-years" },
        { label: "Child(ren) aged 5–17 years", icon: "🎒", score: 1, slug: "children-aged-5-17-years" },
        { label: "Adult(s) with disability or ongoing support needs", icon: "🤝", score: 1, slug: "adults-with-disability-or-ongoing-support-needs" },
        { label: "Older person(s) requiring care or assistance", icon: "💜", score: 1, slug: "older-persons-requiring care-or-assistance" },
        { label: "Other dependent(s)", icon: "👤", score: 1, slug: "other-dependents" },
        { label: "No dependents", icon: "❌", score: 0, slug: "no-dependents", isNone: true },
      ],
    },
    {
      text: "How well do you understand heatwave warnings and emergency information provided in English?",
      slug: "english-comprehension",
      order: 9,
      category: "Demographic Sensitivity",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "Completely understand", icon: "🟢", score: 0, slug: "completely-understand" },
        { label: "Mostly understand", icon: "🟡", score: 0.2, slug: "mostly-understand" },
        { label: "Sometimes understand", icon: "🟠", score: 0.4, slug: "sometimes-understand" },
        { label: "Rarely understand", icon: "🔴", score: 0.8, slug: "rarely-understand" },
        { label: "Do not understand", icon: "❌", score: 1, slug: "do not-understand" },
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
        { label: "Excellent", icon: "🟢", score: 0, slug: "excellent" },
        { label: "Good", icon: "🟡", score: 0.33, slug: "good" },
        { label: "Fair", icon: "🟠", score: 0.67, slug: "fair" },
        { label: "Poor", icon: "🔴", score: 1, slug: "poor" },
      ],
    },
    {
      text: "Do you have any of the following long-term health conditions? (Select all that apply)",
      slug: "long-term-conditions",
      order: 11,
      category: "Health Profile",
      indexType: "SENSITIVITY",
      type: "CHECKBOX",
      options: [
        { label: "Heart condition", icon: "❤️", score: 0.2, slug: "heart-condition" },
        { label: "Lung condition", icon: "🫁", score: 0.2, slug: "lung-condition" },
        { label: "Kidney disease", icon: "🩺", score: 0.2, slug: "kidney-disease" },
        { label: "Diabetes", icon: "🩸", score: 0.2, slug: "diabetes" },
        { label: "Mental health condition", icon: "🧠", score: 0.2, slug: "mental-health-condition" },
        { label: "Other chronic health conditions", icon: "📋", score: 0.2, slug: "other-chronic-health-conditions" },
        { label: "None of the above", icon: "❌", score: 0, slug: "none-of-the-above", isNone: true },
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
        { label: "No", icon: "❌", score: 0, slug: "no" },
        { label: "Yes (for example: fluid pills, heart or blood pressure medicine, medicine for mental health)", icon: "💊", score: 1, slug: "yes-for-example-fluid-pills-heart-or-blood-pressure-medicine-medicine-for-mental-health" },
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
        { label: "No", icon: "❌", score: 0, slug: "no" },
        { label: "Yes", icon: "✨", score: 1, slug: "yes" },
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
        { label: "No, I manage independently", icon: "🟢", score: 0, slug: "no-i-manage-independently" },
        { label: "Yes, occasionally", icon: "🟡", score: 0.5, slug: "yes-occasionally" },
        { label: "Yes, I rely on daily support", icon: "🔴", score: 1, slug: "yes-i-rely-on-daily-support" },
      ],
    },
    {
      text: "Do any health conditions or personal circumstances make it difficult for you to leave you home or access essential services and locations?",
      slug: "household-situation",
      order: 15,
      category: "Health Profile",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "Not at all", icon: "🟢", score: 0, slug: "not-at-all" },
        { label: "Somewhat — it is harder but I usually manage", icon: "🟡", score: 0.5, slug: "somewhat-it-is-harder-but-i-usually-manage" },
        { label: "Significantly — I often cannot go out or access services when needed", icon: "🔴", score: 1, slug: "significantly-i-often-cannot-go-out-or-access-services-when-needed" },
      ],
    },
    {
      text: "Which of the following best describes your household?",
      slug: "social-support",
      order: 16,
      category: "Social Connectedness",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "I live alone", icon: "👤", score: 1, slug: "i-live-alone" },
        { label: "I live with others in a household and have adequate living space", icon: "🏠", score: 0, slug: "i-live-with-others-in-a-household-and-have-adequate-living-space" },
        { label: "I live with others and feel that living space is limited", icon: "⚠️", score: 1, slug: "i-live-with-others-and-feel-that-living-space-is-limited" },
      ],
    },
    {
      text: "If you needed assistance during a heatwave, would support be available to you?",
      slug: "social-support-person",
      order: 17,
      category: "Social Connectedness",
      indexType: "SENSITIVITY",
      type: "RADIO",
      options: [
        { label: "No", icon: "❌", score: 0, slug: "no" },
        { label: "Yes", icon: "✅", score: 1, slug: "yes" },
        { label: "I’m not sure", icon: "❓", score: 0.5, slug: "im-not-sure" },
      ],
    },
    {
      text: "If yes, who would it be? (Select all that apply)",
      slug: "social-support-followup",
      order: 18,
      category: "Social Connectedness",
      indexType: "NONE",
      type: "CHECKBOX",
      options: [
        { label: "Neighbour", icon: "🏡", score: -1, slug: "neighbour" },
        { label: "Family", icon: "👨‍👩‍👧‍👦", score: -1, slug: "family" },
        { label: "Friend", icon: "😊", score: -1, slug: "friend" },
        { label: "Housemate/roommate", icon: "🔑", score: -1, slug: "housemate-roommate" },
        { label: "Community organisation", icon: "🏛️", score: -1, slug: "community-organisation" },
        { label: "Carer or support worker", icon: "🤝", score: -1, slug: "carer-or-support-worker" },
        { label: "Health or aged-care service", icon: "🏥", score: -1, slug: "health-or-aged-care-service" },
        { label: "Emergency service", icon: "🛡️", score: -1, slug: "emergency-service" },
        { label: "Local council", icon: "🏢", score: -1, slug: "local-council" },
        { label: "Religious organisation", icon: "⛪", score: -1, slug: "religious-organisation" },
        { label: "Other (please specify)", icon: "💬", score: -1, slug: "other-please-specify" },
      ],
    },
    {
      text: "What is the main way you keep your home cool during hot weather?",
      slug: "cooling-method",
      order: 19,
      category: "Home Cooling",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Refrigerated air conditioning (e.g. split system, ducted air conditioning)", icon: "❄️", score: 1, slug: "refrigerated-air-conditioning-eg-split-system-ducted-air-conditioning" },
        { label: "Evaporative cooling", icon: "🌬️", score: 0.75, slug: "evaporative-cooling" },
        { label: "Portable air conditioner", icon: "🌀", score: 0.5, slug: "portable-air-conditioner" },
        { label: "Fans only", icon: "🪭", score: 0.25, slug: "fans-only" },
        { label: "I do not have any cooling devices", icon: "❌", score: 0, slug: "i-do-not-have-any-cooling-devices" },
      ],
    },
    {
      text: "How well does your cooling keep your home comfortable during very hot weather?",
      slug: "cooling-effectiveness",
      order: 20,
      category: "Home Cooling",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "It keeps my home comfortable most of the time", icon: "🟢", score: 1, slug: "it-keeps-my-home-comfortable-most-of-the-time" },
        { label: "It keeps my home somewhat comfortable", icon: "🟡", score: 0.67, slug: "it-keeps-my-home-somewhat-comfortable" },
        { label: "It does not keep my home comfortable", icon: "🔴", score: 0.33, slug: "it-does-not-keep-my-home-comfortable" },
      ],
    },
    {
      text: "Can you afford to use your cooling whenever you need it during a heatwave?",
      slug: "cooling-affordability",
      order: 21,
      category: "Home Cooling",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes, always", icon: "🟢", score: 1, slug: "yes-always" },
        { label: "Yes, most of the time", icon: "🟡", score: 0.8, slug: "yes-most-of-the-time" },
        { label: "Only sometimes", icon: "🟠", score: 0.6, slug: "only-sometimes" },
        { label: "Rarely", icon: "🔴", score: 0.4, slug: "rarely" },
        { label: "No, never", icon: "❌", score: 0.2, slug: "no-never" },
      ],
    },
    {
      text: "About when was your home built?",
      slug: "home-built-year",
      order: 22,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Before 1996", icon: "📅", score: 0, slug: "before-1996" },
        { label: "1996–2002", icon: "📅", score: 0.25, slug: "1996-2002" },
        { label: "2003–2009", icon: "📅", score: 0.5, slug: "2003-2009" },
        { label: "2010–2021", icon: "📅", score: 0.75, slug: "2010-2021" },
        { label: "2022 or later", icon: "📅", score: 1, slug: "2022-or-later" },
        { label: "Don't know", icon: "❓", score: 0.5, slug: "dont-know" },
      ],
    },
    {
      text: "Which of the following best describes your home?",
      slug: "home-type",
      order: 23,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Detached house", icon: "🏠", score: 1, slug: "detached-house" },
        { label: "Semi-detached house, townhouse or duplex", icon: "🏡", score: 0.75, slug: "semi-detached-house-townhouse-or-duplex" },
        { label: "Apartment or unit (low-rise 1-3 storeys)", icon: "🏢", score: 0.5, slug: "apartment-or-unit-low-rise-1-3-storeys" },
        { label: "Apartment or unit (high-rise 4 or more storeys)", icon: "🏙️", score: 0.25, slug: "apartment-or-unit-high-rise-4-or-more-storeys" },
        { label: "Other (for example: mobile home, granny flat, caravan)", icon: "🚐", score: 0, slug: "other-for-example-mobile-home-granny-flat-caravan" },
      ],
    },
    {
      text: "What is the main material used for the external walls of your home?",
      slug: "wall-material",
      order: 24,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Brick", icon: "🧱", score: 1, slug: "brick" },
        { label: "Timber or weatherboard", icon: "🪵", score: 0.75, slug: "timber-or-weatherboard" },
        { label: "Fibre cement sheeting", icon: "📐", score: 0.5, slug: "fibre-cement-sheeting" },
        { label: "Lightweight cladding (e.g. metal or vinyl)", icon: "⛓️", score: 0.25, slug: "lightweight-cladding-eg-metal-or-vinyl" },
        { label: "Mixed materials", icon: "🔄", score: 0.5, slug: "mixed-materials" },
        { label: "Other (please specify)", icon: "💬", score: 0.5, slug: "other-please-specify" },
      ],
    },
    {
      text: "What type of roof does your home have?",
      slug: "roof-type",
      order: 25,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Metal roof (e.g. Colorbond, corrugated steel)", icon: "💿", score: -1, slug: "metal-roof-eg-colorbond-corrugated-steel" },
        { label: "Roof tiles (e.g. concrete or terracotta)", icon: "🧱", score: -1, slug: "roof-tiles-eg-concrete-or-terracotta" },
        { label: "Slate roof", icon: "🪨", score: -1, slug: "slate-roof" },
        { label: "Other (please specify)", icon: "💬", score: -1, slug: "other-please-specify" },
      ],
    },
    {
      text: "What colour is your roof?",
      slug: "roof-colour",
      order: 26,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Light coloured (e.g. white, cream, light grey, pale)", icon: "⚪", score: -1, slug: "light-coloured-eg-white-cream-light-grey-pale" },
        { label: "Medium coloured (e.g. red, green, terracotta)", icon: "🟤", score: -1, slug: "medium-coloured-eg-red-green-terracotta" },
        { label: "Dark coloured (e.g. black, dark grey, brown, navy)", icon: "⚫", score: -1, slug: "dark-coloured-eg-black-dark-grey-brown-navy" },
      ],
    },
    {
      text: "Does your roof or ceiling have insulation?",
      slug: "roof-insulation",
      order: 27,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes", icon: "✅", score: -1, slug: "yes" },
        { label: "No", icon: "❌", score: -1, slug: "no" },
        { label: "Don’t know", icon: "❓", score: -1, slug: "dont-know" },
      ],
    },
    {
      text: "Which of the following features does your home have? (Select all that apply)",
      slug: "home-features",
      order: 28,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "CHECKBOX",
      options: [
        { label: "Wall insulation", icon: "🧱", score: -1, slug: "wall-insulation" },
        { label: "Double-glazed windows", icon: "🪟", score: -1, slug: "double-glazed-windows" },
        { label: "Window tinting or reflective film", icon: "🕶️", score: -1, slug: "window-tinting-or-reflective-film" },
        { label: "External window shading (e.g. awnings, shutters, external blinds)", icon: "⛱️", score: -1, slug: "external-window-shading-eg-awnings-shutters-external-blinds" },
        { label: "None of the above", icon: "❌", score: 0, slug: "none-of-the-above", isNone: true },
      ],
    },
    {
      text: "What types of external shading does your home have??",
      slug: "external-shading",
      order: 29,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "External blinds, awnings, or shutters", icon: "⛱️", score: 1, slug: "external-blinds-awnings-or-shutters" },
        { label: "Verandah, porch, or pergola", icon: "🏡", score: 0.75, slug: "verandah-porch-or-pergola" },
        { label: "Trees or other vegetation provide shade", icon: "🌳", score: 0.75, slug: "trees-or-other-vegetation-provide-shade" },
        { label: "Shade from nearby buildings", icon: "🏢", score: 0.25, slug: "shade-from-nearby-buildings" },
        { label: "No external shading", icon: "☀️", score: 0, slug: "no-external-shading" },
      ],
    },
    {
      text: "How much ability do you have to make changes to your home to improve comfort during hot weather?",
      slug: "home-modification",
      order: 30,
      category: "Housing Thermal Performance",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "I can make major changes if needed", icon: "🛠️", score: 1, slug: "i-can-make-major-changes-if-needed" },
        { label: "I can make some minor changes", icon: "🔨", score: 0.5, slug: "i-can-make-some-minor-changes" },
        { label: "I have little or no ability to make changes", icon: "❌", score: 0, slug: "i-have-little-or-no-ability-to-make-changes" },
      ],
    },
    {
      text: "Can you change your daily routine to avoid being outside during the hottest part of the day?",
      slug: "routine-flexibility",
      order: 31,
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
      order: 32,
      category: "Personal Adaptation",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes", icon: "✅", score: 1, slug: "yes" },
        { label: "No", icon: "❌", score: 0, slug: "no" },
        { label: "Does not apply (NA)", icon: "▫️", score: 0.5, slug: "does not-apply-na" },
      ],
    },
    {
      text: "If you needed to cool down during a heatwave, do you know of a place outside your home that you could realistically access?",
      slug: "cool-retreat-knowledge",
      order: 33,
      category: "Cooling Infrastructure, Transport & Connectivity",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes, and I could access at least one place", icon: "✅", score: 1, slug: "yes-and-i-could-access-at-least-one-place" },
        { label: "Yes, but accessing it would be difficult (e.g. transport, cost, opening hours, mobility, or other barriers)", icon: "⚠️", score: 0.5, slug: "yes-but-accessing-it-would-be-difficult-eg-transport-cost-opening-hours-mobility-or-other-barriers" },
        { label: "No, I do not know of any suitable places", icon: "❌", score: 0, slug: "no-i-do-not-know-of-any-suitable-places" },
      ],
    },
    {
      text: "Do you have access to any of the following near your home? (Select all that apply)",
      slug: "local-amenities",
      order: 34,
      category: "Cooling Infrastructure, Transport & Connectivity",
      indexType: "ADAPTIVE",
      type: "CHECKBOX",
      options: [
        { label: "A park, garden, or green space with shade trees", icon: "🌳", score: -1, slug: "a-park-garden-or-green-space-with-shade-trees" },
        { label: "A beach, river, lake, or other water body", icon: "🏖️", score: -1, slug: "a-beach-river-lake-or-other-water-body" },
        { label: "A public pool or splash park", icon: "🏊", score: -1, slug: "a-public-pool-or-splash-park" },
        { label: "None of these", icon: "❌", score: 0, slug: "none-of-these", isNone: true },
      ],
    },
    {
      text: "If you needed to reach a cool place or access essential services during a heatwave, which transport options would be available to you? (Select all that apply)",
      slug: "heatwave-transport",
      order: 35,
      category: "Cooling Infrastructure, Transport & Connectivity",
      indexType: "ADAPTIVE",
      type: "CHECKBOX",
      options: [
        { label: "My own vehicle", icon: "🚗", score: 1, slug: "my-own-vehicle" },
        { label: "Family, friends, or carers could provide transport", icon: "🤝", score: 0.67, slug: "family-friends-or-carers-could-provide-transport" },
        { label: "Public transport", icon: "🚌", score: 0.33, slug: "public-transport" },
        { label: "Taxi or rideshare", icon: " taxi", score: 0.33, slug: "taxi-or-rideshare" },
        { label: "Walking", icon: "🚶", score: 0.33, slug: "walking" },
        { label: "Cycling", icon: "🚲", score: 0.33, slug: "cycling" },
        { label: "I would have difficulty getting there", icon: "⚠️", score: 0, slug: "i-would-have-difficulty-getting-there", isNone: true },
      ],
    },
    {
      text: "During a heatwave, do you have reliable access to the internet or mobile data to receive information and access services?",
      slug: "data-connectivity",
      order: 36,
      category: "Cooling Infrastructure, Transport & Connectivity",
      indexType: "ADAPTIVE",
      type: "RADIO",
      options: [
        { label: "Yes, always", icon: "📶", score: 1, slug: "yes-always" },
        { label: "Yes most of the time", icon: "📶", score: 0.75, slug: "yes-most-of-the-time" },
        { label: "Sometimes", icon: "📉", score: 0.5, slug: "sometimes" },
        { label: "Rarely", icon: "📉", score: 0.25, slug: "rarely" },
        { label: "No access", icon: "❌", score: 0, slug: "no-access" },
      ],
    },
];
  // 3. Insert into Database
  for (const q of questionsData) {
    const sanitizedOptions = q.options.map((opt) => ({
      label: opt.label,
      icon: opt.icon,
      score: opt.score,
      slug: opt.slug,
      // Safely check if isNone exists in the seed object, otherwise fall back to false
      isNone: 'isNone' in opt ? (opt.isNone as boolean) : false,
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
