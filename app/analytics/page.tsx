import PageNavigation from "../components/PageNavigation";
import { prisma } from "app/lib/prisma";

export const dynamic = "force-dynamic";

type ValueDistribution = {
  value: string;
  count: number;
  percentage: number;
};

type QuestionSummary = {
  id: string;
  slug: string;
  text: string;
  category: string;
  type: string;
  totalResponses: number;
  uniqueResponses: number;
  valueDistribution: ValueDistribution[];
};

type TopBucket = {
  label: string;
  count: number;
};

const toPercent = (value: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 1000) / 10;
};

const splitCheckboxValues = (value: string) => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "(blank)";
};

const barColorClass = (index: number) => {
  const classes = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-fuchsia-500",
    "bg-amber-500",
    "bg-cyan-500",
  ];

  return classes[index % classes.length];
};

export default async function AnalyticsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <main className="min-h-screen bg-slate-50">
        <PageNavigation href="/" label="Assessment Analytics" />
        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              Database Not Configured
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Set <span className="font-bold">DATABASE_URL</span> to enable
              analytics for saved assessments. The page is ready, but there is
              no connected data source in this environment.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const assessments = await prisma.assessment.findMany({
    orderBy: { createdAt: "desc" },
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
          questionId: true,
          value: true,
          question: {
            select: {
              slug: true,
              text: true,
              category: true,
              type: true,
            },
          },
        },
      },
    },
  });

  const totalAssessments = assessments.length;
  const totalScore = assessments.reduce(
    (acc, item) => acc + item.totalScore,
    0,
  );
  const averageScore =
    totalAssessments === 0
      ? 0
      : Math.round((totalScore / totalAssessments) * 10) / 10;

  const riskMap = new Map<string, number>();
  const postcodeMap = new Map<string, number>();
  const ageGroupMap = new Map<string, number>();
  const dateMap = new Map<string, number>();

  const questionMap = new Map<
    string,
    {
      id: string;
      slug: string;
      text: string;
      category: string;
      type: string;
      totalResponses: number;
      valueMap: Map<string, number>;
    }
  >();

  for (const assessment of assessments) {
    riskMap.set(
      assessment.riskLevel,
      (riskMap.get(assessment.riskLevel) ?? 0) + 1,
    );
    postcodeMap.set(
      assessment.postcode,
      (postcodeMap.get(assessment.postcode) ?? 0) + 1,
    );
    ageGroupMap.set(
      assessment.ageGroup,
      (ageGroupMap.get(assessment.ageGroup) ?? 0) + 1,
    );

    const day = assessment.createdAt.toISOString().slice(0, 10);
    dateMap.set(day, (dateMap.get(day) ?? 0) + 1);

    for (const answer of assessment.answers) {
      const q = answer.question;
      const existingQuestion = questionMap.get(answer.questionId) ?? {
        id: answer.questionId,
        slug: q.slug,
        text: q.text,
        category: q.category,
        type: q.type,
        totalResponses: 0,
        valueMap: new Map<string, number>(),
      };

      const normalizedValues =
        q.type === "CHECKBOX"
          ? splitCheckboxValues(answer.value).map(normalizeValue)
          : [normalizeValue(answer.value)];

      if (normalizedValues.length === 0) {
        normalizedValues.push("(blank)");
      }

      for (const value of normalizedValues) {
        existingQuestion.valueMap.set(
          value,
          (existingQuestion.valueMap.get(value) ?? 0) + 1,
        );
        existingQuestion.totalResponses += 1;
      }

      questionMap.set(answer.questionId, existingQuestion);
    }
  }

  const riskDistribution = Array.from(riskMap.entries())
    .map(([label, count]) => ({
      label,
      count,
      percentage: toPercent(count, totalAssessments),
    }))
    .sort((a, b) => b.count - a.count);

  const topPostcodes: TopBucket[] = Array.from(postcodeMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const ageDistribution = Array.from(ageGroupMap.entries())
    .map(([label, count]) => ({
      label,
      count,
      percentage: toPercent(count, totalAssessments),
    }))
    .sort((a, b) => b.count - a.count);

  const submissionsByDay = Array.from(dateMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const questionSummaries: QuestionSummary[] = Array.from(questionMap.values())
    .map((question) => {
      const valueDistribution = Array.from(question.valueMap.entries())
        .map(([value, count]) => ({
          value,
          count,
          percentage: toPercent(count, question.totalResponses),
        }))
        .sort((a, b) => b.count - a.count);

      return {
        id: question.id,
        slug: question.slug,
        text: question.text,
        category: question.category,
        type: question.type,
        totalResponses: question.totalResponses,
        uniqueResponses: question.valueMap.size,
        valueDistribution,
      };
    })
    .sort((a, b) => b.totalResponses - a.totalResponses);

  const latestSubmissions = assessments.slice(0, 10);

  return (
    <main className="min-h-screen bg-slate-50">
      <PageNavigation href="/" label="Assessment Analytics" />

      <section className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex justify-end">
          <a
            href="/analytics/export"
            className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700"
          >
            Export Assessments CSV
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Assessments
            </p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              {totalAssessments}
            </h2>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Average Score
            </p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              {averageScore}
            </h2>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Tracked Questions
            </p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              {questionSummaries.length}
            </h2>
          </article>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Risk Level Distribution
            </h3>
            {riskDistribution.length === 0 ? (
              <p className="text-slate-500">
                No assessment data available yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {riskDistribution.map((item, index) => (
                  <li key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">
                        {item.label}
                      </span>
                      <span className="text-slate-500">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${barColorClass(index)}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Age Group Distribution
            </h3>
            {ageDistribution.length === 0 ? (
              <p className="text-slate-500">No age data available yet.</p>
            ) : (
              <ul className="space-y-3">
                {ageDistribution.map((item, index) => (
                  <li key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">
                        {item.label}
                      </span>
                      <span className="text-slate-500">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${barColorClass(index + 2)}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Top Postcodes
            </h3>
            {topPostcodes.length === 0 ? (
              <p className="text-slate-500">No postcode data available yet.</p>
            ) : (
              <ul className="space-y-2">
                {topPostcodes.map((item) => (
                  <li
                    key={item.label}
                    className="flex justify-between border-b border-slate-100 pb-2"
                  >
                    <span className="font-medium text-slate-700">
                      {item.label}
                    </span>
                    <span className="text-slate-500">{item.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Submission Trend (By Day)
            </h3>
            {submissionsByDay.length === 0 ? (
              <p className="text-slate-500">
                No submission trend available yet.
              </p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-auto pr-2">
                {submissionsByDay.map((item) => (
                  <li
                    key={item.label}
                    className="flex justify-between border-b border-slate-100 pb-2 text-sm"
                  >
                    <span className="text-slate-700">{item.label}</span>
                    <span className="text-slate-500">{item.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>

        <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Question-Level Analysis
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            This section is generated from stored answers and adapts
            automatically when questionnaire questions change.
          </p>

          {questionSummaries.length === 0 ? (
            <p className="text-slate-500">No answers available yet.</p>
          ) : (
            <div className="space-y-8">
              {questionSummaries.map((question) => (
                <div
                  key={question.id}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                      {question.category}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {question.type}
                    </span>
                    <span className="text-xs text-slate-500">
                      slug: {question.slug}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {question.text}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1 mb-4">
                    {question.totalResponses} responses across{" "}
                    {question.uniqueResponses} unique answers
                  </p>

                  <div className="space-y-3">
                    {question.valueDistribution
                      .slice(0, 10)
                      .map((entry, index) => (
                        <div key={`${question.id}-${entry.value}-${index}`}>
                          <div className="flex justify-between text-sm mb-1 gap-4">
                            <span className="font-medium text-slate-700 truncate">
                              {entry.value}
                            </span>
                            <span className="text-slate-500 shrink-0">
                              {entry.count} ({entry.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full ${barColorClass(index)}`}
                              style={{ width: `${entry.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Latest Submissions
          </h3>
          {latestSubmissions.length === 0 ? (
            <p className="text-slate-500">No submissions yet.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-4">Created</th>
                    <th className="py-2 pr-4">Postcode</th>
                    <th className="py-2 pr-4">Age Group</th>
                    <th className="py-2 pr-4">Gender</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {latestSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-slate-100 text-slate-700"
                    >
                      <td className="py-2 pr-4">
                        {submission.createdAt.toLocaleString()}
                      </td>
                      <td className="py-2 pr-4">{submission.postcode}</td>
                      <td className="py-2 pr-4">{submission.ageGroup}</td>
                      <td className="py-2 pr-4">
                        {submission.gender ?? "Not provided"}
                      </td>
                      <td className="py-2 pr-4">{submission.totalScore}</td>
                      <td className="py-2">{submission.riskLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
