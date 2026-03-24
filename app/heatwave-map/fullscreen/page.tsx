import MapClient from "../MapClient";
import PageNavigation from "../../components/PageNavigation";
export default function FullscreenPage() {
    return (
        <main className="flex-1 min-h-0 p-6">
            <PageNavigation href="/heatwave-map" label="Heatwave Risk Map (Full Screen)" />
            <div className="h-full w-full">
            <MapClient />
            </div>
        </main>
    );
}