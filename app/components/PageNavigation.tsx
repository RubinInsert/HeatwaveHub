import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
export default function PageNavigation({href, label}: {href: string, label: string}) {
    return (
        <div className="bg-brand-cream border-b border-brand-midnight/10 p-6 sticky top-0 z-20">
            <div className="max-w-6xl flex items-center gap-4">
            <Link
                href={href}
                className="p-2 rounded-full hover:bg-brand-indigo/10 transition-colors"
                aria-label={`Back to ${label}`}
            >
                <ArrowLeftIcon className="w-6 h-6 text-brand-midnight" />
            </Link>
            <h1 className="text-subheading">{label}</h1>
            </div>
      </div>
    );
}