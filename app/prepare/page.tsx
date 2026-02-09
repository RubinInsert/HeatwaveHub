import Link from "next/link";
import SlideTips from "./SlideTips"; // Adjust path if needed
import {
  ArrowLeftIcon,
  MapIcon,
  BuildingOffice2Icon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";

export default function PreparePage() {
  // LGA Data stays here as it's static for now
  const lgaStrategies = [
    {
      title: "Mitigation Strat 1",
      description:
        "Implement X, Y, and Z",
      icon: MapIcon,
    },
    {
      title: "Mitigation Strat 2",
      description:
        "Implement X, Y, and Z",
      icon: BuildingOffice2Icon,
    },
    {
      title: "Mitigation Strat 3",
      description:
        "Implement X, Y, and Z",
      icon: MegaphoneIcon,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Preparation Hub</h1>
        </div>
      </div>

      {/* COMPONENT: Individual Tips Carousel */}
      <SlideTips />

      {/* Call to Action for Individuals (Kept outside component for layout flexibility, or you can move it in) */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-medium text-orange-900">
            Unsure if your home is heat-ready? Take our readiness quiz.
          </p>
          <Link
            href="/test"
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors whitespace-nowrap"
          >
            Take Assessment
          </Link>
        </div>
      </div>

      {/* SECTION 2: FOR LGAs */}
      <section className="bg-slate-900 text-white py-20 px-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-700 pb-8">
            <div>
              <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">
                For Council & Government
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-2">
                Regional Risk Reduction
              </h2>
            </div>
            <p className="text-slate-400 max-w-md text-right md:text-left">
              Strategic planning resources for Local Government Areas to mitigate
              heat risk and improve community resilience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {lgaStrategies.map((strat) => (
              <div
                key={strat.title}
                className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors group"
              >
                <strat.icon className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">
                  {strat.title}
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {strat.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/heatwave-map"
              className="inline-flex items-center gap-2 text-blue-300 font-bold hover:text-blue-200 hover:underline"
            >
              View Regional Risk Data Map{" "}
              <ArrowLeftIcon className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}