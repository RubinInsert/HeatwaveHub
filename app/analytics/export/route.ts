import { prisma } from "app/lib/prisma";

export const dynamic = "force-dynamic";

const escapeCsvCell = (value: string) => {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
};

const asText = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return new Response("DATABASE_URL is not configured.", { status: 503 });
  }

  const assessments = await prisma.assessment.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      createdAt: true,
      postcode: true,
      ageGroup: true,
      gender: true,
      totalScore: true,
      riskLevel: true,
      answers: {
        select: {
          value: true,
          question: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  const questionSlugs = Array.from(
    new Set(
      assessments.flatMap((assessment) =>
        assessment.answers.map((answer) => answer.question.slug),
      ),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const baseHeaders = [
    "id",
    "createdAt",
    "postcode",
    "ageGroup",
    "gender",
    "totalScore",
    "riskLevel",
  ];

  const headers = [...baseHeaders, ...questionSlugs];

  const rows = assessments.map((assessment) => {
    const answerMap = new Map<string, string[]>();

    for (const answer of assessment.answers) {
      const slug = answer.question.slug;
      const existingValues = answerMap.get(slug) ?? [];
      existingValues.push(answer.value);
      answerMap.set(slug, existingValues);
    }

    const rowCells = [
      assessment.id,
      assessment.createdAt.toISOString(),
      assessment.postcode,
      assessment.ageGroup,
      assessment.gender ?? "",
      String(assessment.totalScore),
      assessment.riskLevel,
      ...questionSlugs.map((slug) => (answerMap.get(slug) ?? []).join(" | ")),
    ];

    return rowCells.map((cell) => escapeCsvCell(asText(cell))).join(",");
  });

  const csv = [headers.map(escapeCsvCell).join(","), ...rows].join("\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=assessments-${stamp}.csv`,
      "Cache-Control": "no-store",
    },
  });
}
