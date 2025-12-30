import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex flex-col h-auto shrink-0 items-start rounded-lg bg-red-800 p-4 text-white">
        <h1 className="font-black text-2xl">What is Heatwave Hub?</h1>
        <p className="mt-2">
          Heatwave Hub is a community resilience initiative focused on improving
          heatwave resilience across vulnerable Local Government Areas by:
        </p>
        <ul className="list-disc list-inside">
          <li>delivering tailored preparedness plans,</li>
          <li>community engagement activities, and</li>
          <li>
            providing an accessible online platform to support councils, service
            providers, and communities.
          </li>
        </ul>
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
