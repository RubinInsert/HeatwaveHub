import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
export default function PageNavigation({href, label}: {href: string, label: string}) {
    return (
        <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-20">
            <div className="max-w-6xl flex items-center gap-4">
            <Link
                href={href}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </Link>
            <h1 className="text-2xl font-black text-gray-900">{label}</h1>
            </div>
      </div>
    );
}