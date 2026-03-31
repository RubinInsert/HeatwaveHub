"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "app/lib/prisma";

const QUESTION_TYPES = new Set(["RADIO", "CHECKBOX", "TEXT", "NUMBER"]);

type ParsedOption = {
  label: string;
  icon: string;
  score: number;
};

function parseType(rawType: FormDataEntryValue | null) {
  const candidate = String(rawType ?? "").toUpperCase();
  return QUESTION_TYPES.has(candidate) ? candidate : "RADIO";
}

function parseWeight(rawWeight: FormDataEntryValue | null) {
  const parsed = Number(rawWeight ?? 1);
  if (Number.isNaN(parsed)) return 1;
  return parsed;
}

function parseOptions(rawOptions: FormDataEntryValue | null): ParsedOption[] {
  const lines = String(rawOptions ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    const [labelPart, iconPart, scorePart] = line.split("|").map((value) => value?.trim());

    if (!labelPart) {
      throw new Error(`Option line ${index + 1} is missing a label.`);
    }

    const score = Number(scorePart ?? "0");
    if (Number.isNaN(score)) {
      throw new Error(`Option line ${index + 1} has an invalid score.`);
    }

    return {
      label: labelPart,
      icon: iconPart || "•",
      score,
    };
  });
}

function revalidateQuestionRoutes() {
  revalidatePath("/admin/questions");
  revalidatePath("/test");
}

export async function createQuestion(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "General").trim() || "General";
  const type = parseType(formData.get("type"));
  const weight = parseWeight(formData.get("weight"));
  const options = parseOptions(formData.get("options"));

  if (!text || !slug) {
    throw new Error("Question text and slug are required.");
  }

  if ((type === "RADIO" || type === "CHECKBOX") && options.length === 0) {
    throw new Error("RADIO and CHECKBOX questions require at least one option.");
  }

  await prisma.question.create({
    data: {
      text,
      slug,
      category,
      type,
      weight,
      isActive: true,
      options: {
        create: type === "RADIO" || type === "CHECKBOX" ? options : [],
      },
    },
  });

  revalidateQuestionRoutes();
}

export async function updateQuestion(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "General").trim() || "General";
  const type = parseType(formData.get("type"));
  const weight = parseWeight(formData.get("weight"));
  const options = parseOptions(formData.get("options"));

  if (!id || !text || !slug) {
    throw new Error("Question id, text and slug are required.");
  }

  if ((type === "RADIO" || type === "CHECKBOX") && options.length === 0) {
    throw new Error("RADIO and CHECKBOX questions require at least one option.");
  }

  await prisma.question.update({
    where: { id },
    data: {
      text,
      slug,
      category,
      type,
      weight,
      options: {
        deleteMany: {},
        create: type === "RADIO" || type === "CHECKBOX" ? options : [],
      },
    },
  });

  revalidateQuestionRoutes();
}

export async function toggleQuestionActive(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const activeRaw = String(formData.get("isActive") ?? "true");

  if (!id) {
    throw new Error("Question id is required.");
  }

  await prisma.question.update({
    where: { id },
    data: { isActive: activeRaw !== "true" },
  });

  revalidateQuestionRoutes();
}

export async function deleteQuestion(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Question id is required.");
  }

  const answersCount = await prisma.answer.count({ where: { questionId: id } });

  if (answersCount > 0) {
    await prisma.question.update({
      where: { id },
      data: { isActive: false },
    });
    revalidateQuestionRoutes();
    return;
  }

  await prisma.$transaction([
    prisma.option.deleteMany({ where: { questionId: id } }),
    prisma.question.delete({ where: { id } }),
  ]);

  revalidateQuestionRoutes();
}