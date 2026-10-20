import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import MapClient from "./MapClient";
import ExpandableCard from "./ExpandableCard";
import PageNavigation from "../components/PageNavigation";
// This disables Server-Side Rendering for the map component
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <PageNavigation href="/" label="Heatwave Risk Map" />
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 border-b border-brand-midnight/10 pb-8">
        <div className="max-w-3xl">
          <h1 className="text-heading tracking-tight text-brand-midnight">
            Future heatwave risks in{" "}
            <span className="text-brand-coral">New South Wales</span>
          </h1>
          <p className="mt-4 text-body text-brand-midnight/80 leading-relaxed">
            Integrating climate analysis with NARCLiM2 and CMIP6 models to
            provide an evidence-based foundation for Local Government Areas.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-brand-midnight/10 shadow-sm flex flex-col items-start gap-1 max-w-[280px] hover:border-brand-coral/50 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-brand-cream rounded-md">
              <Image
                src="/icons/journal-link-icon.svg"
                alt="Australia Heatwave Map"
                width={32}
                height={32}
                className="object-cover object-center"
                priority
                unoptimized
              />
            </div>
            <span className="text-label font-bold text-brand-midnight/60 tracking-widest">
              Source methodology
            </span>
          </div>

          <Link
            href="about:blank"
            target="_blank"
            className="text-sm font-bold text-brand-midnight leading-tight group-hover:text-brand-coral transition-colors"
          >
            Assessment of Heatwave Preparedness in NSW (2024)
          </Link>

          <span className="text-[11px] text-brand-midnight/70 mt-1 italic">
            Published by University Research team
          </span>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-8 mb-10">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-brand-midnight/10 bg-white p-2 md:w-1/2 h-[500px]">
          {" "}
          {/* Map Container */}
          <MapClient />
        </div>
        <div className="md:pl-8 md:w-1/2 flex flex-col justify-center">
          <h2 className="text-heading mb-2">Explore the map</h2>
          <p>
            This interactive mapping tool is a core component of the Heatwave
            Hub which provides an analysis of heatwave preparedness of NSW. By
            integrating detailed climate analysis with community-specific data,
            this tool provides an evidence-based foundation for Local Government
            Areas, Emergency Services, Government, and Health Authorities.
          </p>
          <p className="mt-4 font-bold text-brand-coral text-body">
            <a href="heatwave-map/fullscreen">
              View the map in full screen
            </a>
            <ArrowRightIcon className="inline w-4 h-4 ml-1" />
          </p>
        </div>
      </div>
      <hr className="border-brand-midnight/10" />
      <div className="max-w-7xl mx-auto mt-10">
        <h1 className="text-heading mt-4 mb-2">
          What is the Combined Heatwave Risk Index (CHRI)?{" "}
        </h1>
        <p className="text-body">
          The Combined Heatwave Risk Index (CHRI) is a multi-dimensional metric
          used to quantify regional heat risk. It moves beyond simple
          temperature monitoring by calculating the intersection of Hazard
          severity, Population vulnerability, and Physical exposure. This allows
          decision-makers to identify not just where it is hot, but where the
          heat will have the most significant human and social impact.
        </p>
        <br />
        <p className="text-body">
          The CHRI offers a balanced score by averaging three critical
          components:
        </p>
        <div className="flex flex-col items-center md:items-start md:flex-row justify-around gap-4 mt-4">
          <ExpandableCard
            label="Hazard"
            bgColor="bg-brand-indigo"
            iconSrc="/icons/emergency-heat-icon.svg"
            altText="Hazard Icon"
          >
            <p className="text-body text-brand-cream/90 mb-2">
              Represents the potential of a heatwave to cause harm based on
              frequency and intensity. Data derived from historical records
              (1951–2022) and future projections using NARCLiM2 and CMIP6
              models.
            </p>
          </ExpandableCard>
          <ExpandableCard
            label="Vulnerability"
            bgColor="bg-brand-indigo"
            iconSrc="/icons/old-person-icon.svg"
            altText="Hazard Icon"
          >
            <p className="text-body text-brand-cream/90 mb-2">
              Measures susceptibility of a population to heat-related harm,
              including demographics (age ≥ 65 years), chronic health conditions
              (heart, kidney, or lung disease), and disability requiring
              assistance.
            </p>
          </ExpandableCard>
          <ExpandableCard
            label="Exposure"
            bgColor="bg-brand-indigo"
            iconSrc="/icons/group-icon.svg"
            altText="Hazard Icon"
          >
            <p className="text-body text-brand-cream/90 mb-2">
              Accounts for the number of people physically located in areas
              affected by heat hazards.
            </p>
          </ExpandableCard>
        </div>
      </div>
    </main>
  );
}
