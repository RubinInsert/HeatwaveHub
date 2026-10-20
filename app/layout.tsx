import "@/app/ui/global.css";
import { arial } from "@/app/ui/fonts";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Heatwave Hub — Centralised heatwave information for community resilience",
  description:
    "Explore heatwave risk data, preparedness guidance and a personal heatwave readiness assessment for communities across New South Wales.",
  openGraph: {
    siteName: "Heatwave Hub",
    type: "website",
    title: "Heatwave Hub",
    description:
      "Centralised heatwave information for community resilience across New South Wales.",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${arial.className} antialiased p-0 m-0 h-dvh flex flex-col`}
      >
        <header className="shrink-0 w-full bg-brand-cream border-b-4 border-brand-coral shadow-sm">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-4">
            {/* Primary logo: brandmark with the "Heatwave Hub" wordmark */}
            <Link
              href="/"
              className="flex items-center"
              aria-label="Heatwave Hub — home"
            >
              <Image
                src="/heatwave-hub-primary-logo.svg"
                alt="Heatwave Hub"
                width={302}
                height={263}
                priority
                unoptimized
                className="h-16 w-auto md:h-20"
              />
            </Link>
            <nav aria-label="Primary" className="ml-auto">
              <ul className="flex flex-wrap items-center justify-center gap-6 text-lg font-bold text-brand-midnight">
                <li>
                  <Link
                    className="hover:text-brand-coral transition-colors"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-brand-indigo/40">
                  |
                </li>
                <li>
                  <Link
                    className="hover:text-brand-coral transition-colors"
                    href="/heatwave-map"
                  >
                    Find your LGA&apos;s heatwave risk
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
