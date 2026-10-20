import Link from "next/link";
import SlideTips from "./SlideTips"; // Adjust path if needed
import {
  ArrowLeftIcon,
  MapIcon,
  BuildingOffice2Icon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import PageNavigation from "../components/PageNavigation";

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
    <main className="min-h-screen bg-brand-cream flex flex-col">
      
      {/* Navigation */}
      <PageNavigation href="/" label="Heatwave Preparedness" />

      {/* COMPONENT: Individual Tips Carousel */}
      <SlideTips />

      {/* Call to Action for Individuals (Kept outside component for layout flexibility, or you can move it in) */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-xl p-6 border border-brand-coral/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-bold text-brand-midnight">
            Unsure if your home is heat-ready? Take our readiness quiz.
          </p>
          <Link
            href="/test"
            className="bg-brand-coral text-brand-midnight px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all whitespace-nowrap"
          >
            Take assessment
          </Link>
        </div>
      </div>

      {/* SECTION 2: FOR LGAs */}
      <section className="bg-brand-midnight text-brand-cream py-20 px-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-brand-cream/20 pb-8">
            <div>
              <span className="text-label font-bold tracking-widest text-brand-turquoise">
                For council &amp; government
              </span>
              <h2 className="text-heading mt-2">
                Regional risk reduction
              </h2>
            </div>
            <p className="text-body text-brand-cream/70 max-w-measure-tight text-right md:text-left">
              Strategic planning resources for Local Government Areas to mitigate
              heat risk and improve community resilience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {lgaStrategies.map((strat) => (
              <div
                key={strat.title}
                className="bg-brand-indigo p-8 rounded-2xl border border-brand-cream/20 hover:border-brand-turquoise transition-colors group"
              >
                <strat.icon className="w-10 h-10 text-brand-turquoise mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-subheading text-brand-cream mb-3">
                  {strat.title}
                </h3>
                <p className="text-body text-brand-cream/80">
                  {strat.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/heatwave-map"
              className="inline-flex items-center gap-2 text-brand-turquoise font-bold hover:text-brand-cream hover:underline"
            >
              View regional risk data map{" "}
              <ArrowLeftIcon className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}