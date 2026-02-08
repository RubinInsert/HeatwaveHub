import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import MapClient from "./MapClient";
import ExpandableCard from "./ExpandableCard";
// This disables Server-Side Rendering for the map component
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 border-b pb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Future Heatwave Risks in{" "}
            <span className="text-orange-600">New South Wales</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Integrating climate analysis with NARCLiM2 and CMIP6 models to
            provide an evidence-based foundation for Local Government Areas.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-start gap-1 max-w-[280px] hover:border-orange-300 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-orange-100 rounded-md">
              <Image
                src="/icons/journal-link-icon.svg"
                alt="Australia Heatwave Map"
                width={32}
                height={32}
                className="object-cover object-center"
                priority
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Source Methodology
            </span>
          </div>

          <Link
            href="about:blank"
            target="_blank"
            className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors"
          >
            Assessment of Heatwave Preparedness in NSW (2024)
          </Link>

          <span className="text-[11px] text-slate-500 mt-1 italic">
            Published by University Research Team
          </span>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-8 mb-10">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-2 md:w-1/2">
          {" "}
          {/* Map Container */}
          <MapClient />
        </div>
        <div className="md:pl-8 md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold mb-2">Explore the Map</h2>
          <p>
            This interactive mapping tool is a core component of the Heatwave
            Hub which provides an analysis of heatwave preparedness of NSW. By
            integrating detailed climate analysis with community-specific data,
            this tool provides an evidence-based foundation for Local Government
            Areas, Emergency Services, Government, and Health Authorities.
          </p>
        </div>
      </div>
      <hr />
      <div className="max-w-7xl mx-auto mt-10">
        <h1 className="text-3xl font-extrabold mt-4 mb-2">
          What is the Combined Heatwave Risk Index (CHRI)?{" "}
        </h1>
        <p className="text-lg">
          The Combined Heatwave Risk Index (CHRI) is a multi-dimensional metric
          used to quantify regional heat risk. It moves beyond simple
          temperature monitoring by calculating the intersection of Hazard
          severity, Population vulnerability, and Physical exposure. This allows
          decision-makers to identify not just where it is hot, but where the
          heat will have the most significant human and social impact.
        </p>
        <br />
        <p className="text-lg">
          The CHRI offers a balanced score by averaging three critical
          components:
        </p>
        <div className="flex flex-col items-center md:items-start md:flex-row justify-around gap-4 mt-4">
          <ExpandableCard
            label="Hazard"
            bgColor="bg-orange-500"
            iconSrc="/icons/emergency-heat-icon.svg"
            altText="Hazard Icon"
          >
            <p className="text-lg text-white mb-2">
              Represents the potential of a heatwave to cause harm based on
              frequency and intensity. Data derived from historical records
              (1951–2022) and future projections using NARCLiM2 and CMIP6
              models.
            </p>
          </ExpandableCard>
          <ExpandableCard
            label="Vulnerability"
            bgColor="bg-orange-500"
            iconSrc="/icons/old-person-icon.svg"
            altText="Hazard Icon"
          >
            <p className="text-lg mb-2 text-white">
              Measures susceptibility of a population to heat-related harm,
              including demographics (age ≥ 65 years), chronic health conditions
              (heart, kidney, or lung disease), and disability requiring
              assistance.
            </p>
          </ExpandableCard>
          <ExpandableCard
            label="Exposure"
            bgColor="bg-orange-500"
            iconSrc="/icons/group-icon.svg"
            altText="Hazard Icon"
          >
            <p className="text-lg mb-2 text-white">
              Accounts for the number of people physically located in areas
              affected by heat hazards.
            </p>
          </ExpandableCard>
        </div>
      </div>
    </main>
  );
}
