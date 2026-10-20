"use client"; // <--- Critical: This allows ssr: false to work

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-brand-cream animate-pulse" />,
});

export default function MapClient() {
  return <MapView />;
}
