import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import MapClient from "./MapClient";

// This disables Server-Side Rendering for the map component
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <MapClient />
    </main>
  );
}
