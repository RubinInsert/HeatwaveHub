import PageNavigation from "../../components/PageNavigation";
import { prisma } from "app/lib/prisma";
import {
  createQuestion,
  deleteQuestion,
  toggleQuestionActive,
  updateQuestion,
} from "./actions";

export const dynamic = "force-dynamic";

function optionsToText(
  options: {
    label: string;
    icon: string;
    score: number;
  }[],
) {
  return options
    .map((option) => `${option.label}|${option.icon}|${option.score}`)
    .join("\n");
}

export default async function AdminQuestionsPage() {
  const questions = await prisma.question.findMany({
    include: {
      options: true,
      _count: {
        select: {
          answers: true,
        },
      },
    },
    orderBy: [{ weight: "asc" }, { category: "asc" }, { text: "asc" }],
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <PageNavigation href="/" label="Admin: Questionnaire Builder" />

      <section className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">
            Create Question
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Options format: one per line as label|icon|score. Use options for
            RADIO and CHECKBOX only.
          </p>

          <form
            action={createQuestion}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Question text
              </span>
              <input
                name="text"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="What is your postcode?"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Slug</span>
              <input
                name="slug"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="postcode"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Category
              </span>
              <input
                name="category"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Demographics"
                defaultValue="General"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Weight</span>
              <input
                name="weight"
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                defaultValue={1}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Type</span>
              <select
                name="type"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                defaultValue="RADIO"
              >
                <option value="RADIO">RADIO</option>
                <option value="CHECKBOX">CHECKBOX</option>
                <option value="TEXT">TEXT</option>
                <option value="NUMBER">NUMBER</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Options
              </span>
              <textarea
                name="options"
                rows={5}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                placeholder={"Yes|✅|0\nNo|❌|10"}
              />
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-orange-600 text-white px-4 py-2 font-semibold hover:bg-orange-700"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">
            Edit Existing Questions
          </h2>

          {questions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-600">
              No questions found.
            </div>
          ) : (
            questions.map((question) => (
              <article
                key={question.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      question.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {question.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
                    {question.type}
                  </span>
                  <span className="text-xs text-slate-500">
                    Responses: {question._count.answers}
                  </span>
                </div>

                <form
                  action={updateQuestion}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <input type="hidden" name="id" value={question.id} />

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Question text
                    </span>
                    <input
                      name="text"
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      defaultValue={question.text}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Slug
                    </span>
                    <input
                      name="slug"
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      defaultValue={question.slug}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Category
                    </span>
                    <input
                      name="category"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      defaultValue={question.category}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Weight
                    </span>
                    <input
                      name="weight"
                      type="number"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      defaultValue={question.weight}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Type
                    </span>
                    <select
                      name="type"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      defaultValue={question.type}
                    >
                      <option value="RADIO">RADIO</option>
                      <option value="CHECKBOX">CHECKBOX</option>
                      <option value="TEXT">TEXT</option>
                      <option value="NUMBER">NUMBER</option>
                    </select>
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">
                      Options
                    </span>
                    <textarea
                      name="options"
                      rows={4}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                      defaultValue={optionsToText(question.options)}
                    />
                  </label>

                  <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>

                <div className="relative float-right flex flex-wrap gap-3">
                  <form action={toggleQuestionActive}>
                    <input type="hidden" name="id" value={question.id} />
                    <input
                      type="hidden"
                      name="isActive"
                      value={String(question.isActive)}
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-slate-700 text-white px-4 py-2 font-semibold hover:bg-slate-800"
                    >
                      {question.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </form>

                  <form action={deleteQuestion}>
                    <input type="hidden" name="id" value={question.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-red-600 text-white px-4 py-2 font-semibold hover:bg-red-700"
                    >
                      Delete Question
                    </button>
                  </form>
                </div>

                {question._count.answers > 0 ? (
                  <p className="mt-3 text-xs text-slate-500">
                    This question already has responses. Delete will deactivate
                    it instead of hard deleting.
                  </p>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
