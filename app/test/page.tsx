export const dynamic = "force-dynamic";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import HeatwaveAssessment from "./HeatwaveAssessment";
import { prisma } from "app/lib/prisma";
import PageNavigation from "../components/PageNavigation";
export default async function Page() {
  const questions = await prisma.question.findMany({
    where: { isActive: true },
    include: { options: true },
  });
  console.log("Active Questions:", questions);
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      {/* 1. Specialized Assessment Header */}
      <PageNavigation href="/" label="Heatwave Readiness Assessment" />

      {/* 2. Hero Context Section */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Heatwave <span className="text-orange-600">Readiness Score</span>
          </h1>
          <p className="text-lg text-slate-600">
            This assessment helps you understand your personal risk levels based
            on health, environment, and preparedness. It takes approximately 2
            minutes.
          </p>
        </div>

        {/* 3. The Assessment Component */}
        <HeatwaveAssessment questions={questions} />

        {/* 4. Support/Privacy Footer */}
        <div className="max-w-2xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-8">
          <div>
            <h3 className="font-bold text-slate-800 mb-2">Why take this?</h3>
            <p className="text-sm text-slate-500">
              Understanding your vulnerability is the first step in disaster
              mitigation. This data aligns with the NSW Health Heatwave
              Framework.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2">
              Privacy & Security
            </h3>
            <p className="text-sm text-slate-500">
              Your responses are processed locally in your browser. We do not
              collect, store, or share your personal health information.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
