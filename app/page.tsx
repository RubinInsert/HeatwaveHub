import Image from "next/image";
import NavCard from "./NavCard";

export default function Page() {
  const heatFacts = [
    {
      title: "Silent killer",
      description:
        "Heatwaves claim more lives in Australia than any other natural hazard.",
      color: "border-brand-coral",
    },
    {
      title: "Stay hydrated",
      description:
        "Drink plenty of water even if you don't feel thirsty during extreme heat.",
      color: "border-brand-denim",
    },
    {
      title: "Check in",
      description:
        "Look out for elderly neighbours and those living alone during hot spells.",
      color: "border-brand-turquoise",
    },
  ];
  return (
    <main className="flex min-h-screen flex-col">
      <section className="px-6 py-10 md:py-14">
        <div className="relative block h-auto min-h-[26rem] w-full overflow-hidden rounded-xl border-4 border-white shadow-xl md:min-h-[36rem]">
          <Image
            src="/heatwave-map.png"
            alt="Heat map of Australia"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="flex h-full items-center p-8 md:p-16 bg-brand-midnight/70 text-brand-cream relative z-10 backdrop-blur-sm hover:backdrop-blur duration-300">
            <div className="max-w-4xl">
              <p className="text-label font-bold text-brand-golden mb-4">
                Community resilience initiative
              </p>
              <h1 className="text-display mb-6 drop-shadow-lg">
                Centralised heatwave information
              </h1>
              <p className="text-body-lg max-w-measure opacity-90">
                Your go-to resource for building community resilience against
                heatwaves. Explore tools, resources, and information to help you
                prepare for and respond to extreme heat events.
              </p>
            </div>
          </div>
        </div>

        {/* Call-to-action buttons, ordered left to right as approved.
            External referral links (e.g. NSW Government resources) are being
            moved to a dedicated links page, so they are not listed here. */}
        <div className="mt-12 flex flex-col gap-5 font-bold md:flex-row md:justify-between">
          <NavCard
            href="/about"
            bgColor="bg-brand-indigo"
            iconSrc="/icons/question-icon.svg"
            altText=""
            label="What is the heatwave hub"
            textColor="text-brand-cream"
          />
          <NavCard
            href="/heatwave-map"
            bgColor="bg-brand-denim"
            iconSrc="/icons/map-icon.svg"
            altText=""
            label="View heatwave risk map"
            textColor="text-brand-cream"
          />
          <NavCard
            href="/test"
            bgColor="bg-brand-golden"
            iconSrc="/icons/assessment-icon.svg"
            altText=""
            label="Test your heatwave readiness score"
            textColor="text-brand-midnight"
            iconClassName="invert"
          />
          <NavCard
            href="/prepare"
            bgColor="bg-brand-coral"
            iconSrc="/icons/emergency-heat-icon.svg"
            altText=""
            label="Prepare"
            textColor="text-brand-midnight"
            iconClassName="invert"
          />
        </div>
      </section>

      <section className="mt-12 md:ml-32 md:mr-32 border-t-8 border-brand-indigo hover:border-brand-coral transition-colors duration-200 shadow-lg bg-white rounded-2xl">
        <div className="p-8 md:p-12 ">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-brand-midnight/10 pb-10">
            <div>
              <p className="text-label font-bold text-brand-coral mb-3">
                Safety guide
              </p>
              <h2 className="text-heading">Stay aware</h2>
            </div>
            <p className="text-body text-brand-midnight/70 max-w-measure-tight">
              Quick insights to help you navigate extreme heat conditions
              safely.
            </p>
          </div>

          {/* Facts Grid */}
          <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-14">
            {heatFacts.map((fact) => (
              <div key={fact.title} className="group md:max-w-measure-tight">
                <div
                  className={`h-1 w-12 mb-4 transition-all group-hover:w-full border-t-4 ${fact.color}`}
                />
                <h3 className="text-subheading mb-4">{fact.title}</h3>
                <p className="text-body text-brand-midnight/80">
                  {fact.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Link / Resource Prompt */}
          <div className="mt-20 pt-10 border-t border-brand-midnight/10 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-subheading">Other helpful resources</h3>
            <button className="text-brand-denim font-bold hover:underline flex items-center gap-2">
              View all <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
      <section className="mt-auto flex md:flex-row flex-col items-center justify-center gap-8 p-10 md:p-12 bg-brand-midnight text-brand-cream">
        <p className="text-body w-full md:w-1/2 text-center">
          Funding provided by{" "}
          <span className="font-bold">Disaster Ready Fund (DRF)</span>
        </p>
      </section>
    </main>
  );
}
