import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import NavCard from "./NavCard";
export default function Page() {
  const heatFacts = [
    {
      title: "Silent Killer",
      description:
        "Heatwaves claim more lives in Australia than any other natural hazard.",
      color: "border-orange-500",
    },
    {
      title: "Stay Hydrated",
      description:
        "Drink plenty of water even if you don't feel thirsty during extreme heat.",
      color: "border-blue-500",
    },
    {
      title: "Check-In",
      description:
        "Look out for elderly neighbors and those living alone during hot spells.",
      color: "border-green-500",
    },
  ];
  return (
    <main className="flex min-h-screen flex-col">
      <section className="p-6">
        <div className="relative block md:h-64 h-auto w-full overflow-hidden rounded-xl border-4 border-white shadow-xl">
          <Image
            src="/heatwave-map.png"
            alt="Australia Heatwave Map"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="flex h-full items-center p-12 bg-black/40 text-white relative z-10 backdrop-blur-sm hover:backdrop-blur duration-300">
            <div className="max-w-2xl">
              <h1 className="text-xl md:text-5xl font-black mb-4 drop-shadow-lg">
                Centralized Heatwave Info
              </h1>
              <p className="text-l md:text-xl opacity-90">
                Your go-to resource for building community resilience against
                heatwaves. Explore tools, resources, and information to help you
                prepare for and respond to extreme heat events.
              </p>
            </div>
          </div>
        </div>

        <div className="flex text-center flex-col md:flex-row gap-4 justify-around text-white font-bold text-2xl mt-12">
          <NavCard
            href="/prepare"
            bgColor="bg-orange-400"
            iconSrc="/icons/emergency-heat-icon.svg"
            altText="Heatwave Icon"
            label="Prepare"
          />
          <NavCard
            href="/"
            bgColor="bg-green-400"
            iconSrc="/icons/fan-icon.svg"
            altText="Fan Icon"
            label="Find A Cooling Centre Near You"
          />
          <NavCard
            href="/test"
            bgColor="bg-blue-400"
            iconSrc="/icons/assessment-icon.svg"
            altText="Assessment Icon"
            label="Test Your Heatwave Readiness Score"
          />
          <NavCard
            href="/heatwave-map"
            bgColor="bg-yellow-400"
            iconSrc="/icons/map-icon.svg"
            altText="Map Icon"
            label="View Heatwave Risk Map"
          />
          <NavCard
            href="/"
            bgColor="bg-purple-400"
            iconSrc="/icons/question-icon.svg"
            altText="Question Icon"
            label="What is Heatwave Hub?"
          />
        </div>
      </section>

      <section className="mt-12 md:ml-32 md:mr-32 border-t-8 border-gray-200 hover:border-orange-400 transition-colors duration-200 shadow-lg bg-white rounded-2xl overflow-hidden">
        <div className="p-8 md:p-12 ">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-gray-100 pb-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-2">
                Safety Guide
              </h2>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Stay Aware.
              </h1>
            </div>
            <p className="text-gray-500 max-w-xs text-sm">
              Quick insights to help you navigate extreme heat conditions
              safely.
            </p>
          </div>

          {/* Facts Grid */}
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {heatFacts.map((fact) => (
              <div key={fact.title} className="group">
                <div
                  className={`h-1 w-12 mb-4 transition-all group-hover:w-full border-t-4 ${fact.color}`}
                />
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {fact.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {fact.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Link / Resource Prompt */}
          <div className="mt-16 pt-8 border-t border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Other Helpful Resources
            </h3>
            <button className="text-blue-600 font-medium hover:underline flex items-center gap-2">
              View All <span>→</span>
            </button>
          </div>
        </div>
      </section>
      <section className="mt-12 flex md:flex-row flex-col items-center justify-evenly p-8 border border-gray-200">
        <h1 className="text-lg font-semibold w-1/2">
          {" "}
          Funding provided by{" "}
          <span className="font-black">Disaster Ready Fund (DRF) </span>
        </h1>
        <Image
          src="/NEMA-logo.svg"
          alt="Heatwave Icon"
          width={100}
          height={100}
          className="w-[250px] h-auto object-contain invert"
        ></Image>
      </section>
    </main>
  );
}
