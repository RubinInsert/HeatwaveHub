import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import NavCard from "./NavCard";
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex text-center flex-col md:flex-row gap-4 justify-around text-white font-bold text-2xl mt-6">
        <NavCard
          href="/"
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
          href="/"
          bgColor="bg-blue-400"
          iconSrc="/icons/assessment-icon.svg"
          altText="Assessment Icon"
          label="Test Your Heatwave Readiness Score"
        />
        <NavCard
          href="/"
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
      <div className="flex gap-4 bg-gray-100 h-auto mt-6 rounded-lg p-4">
        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="flex flex-col flex-1 bg-white rounded-lg p-4 shadow">
            <h2 className="font-semibold text-lg">Get Started</h2>
            <p className="mt-2 flex-1">
              Begin by exploring our resources and tools designed to help you
              enhance heatwave resilience in your community.
            </p>
            <Link
              href="/get-started"
              className="mt-4 inline-flex items-center text-red-800 font-semibold hover:underline"
            >
              Explore Resources
              <ArrowRightIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="flex flex-col flex-1 bg-white rounded-lg p-4 shadow">
            <h2 className="font-semibold text-lg">Contribute</h2>
            <p className="mt-2 flex-1">
              Give back to the community by sharing your own resources,
              experiences, and best practices on heatwave resilience.
            </p>
            <Link
              href="/get-started"
              className="mt-4 inline-flex items-center text-red-800 font-semibold hover:underline"
            >
              Get Involved
              <ArrowRightIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
