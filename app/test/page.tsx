import AcmeLogo from "@/app/ui/acme-logo";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import HeatwaveAssessment from "./HeatwaveAssessment";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      {/* 1. Specialized Assessment Header */}
      <header className="w-full bg-white border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-orange-100 transition-colors">
              <ChevronLeftIcon className="w-5 h-5 text-slate-600 group-hover:text-orange-600" />
            </div>
            <span className="font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              Back to Hub
            </span>
          </Link>
          <div className="hidden md:block">
            <AcmeLogo />
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Personal Assessment
            </p>
          </div>
        </div>
      </header>

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
        <HeatwaveAssessment />

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
