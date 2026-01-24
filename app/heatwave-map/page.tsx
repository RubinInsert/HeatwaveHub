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
      <div className="mb-6 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          Future Heatwave Risks in New South Wales
        </h1>
        <p>
          This interactive mapping tool is a core component of the Heatwave Hub
          which provides an analysis of heatwave preparedness of NSW. By
          integrating detailed climate analysis with community-specific data,
          this tool provides an evidence-based foundation for Local Government
          Areas, Emergency Services, Government, and Health Authorities.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Explore the Map</h2>
        <p>
          The mapping displays the Combined Heatwave Risk Index (CHRI), which
          offers a balanced score by averaging three critical components:
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
      <MapClient />
    </main>
  );
}
