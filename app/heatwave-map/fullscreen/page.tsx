import MapClient from "../MapClient";

export default function FullscreenPage() {
    return (
        <main className="flex-1 min-h-0">
            <div className="h-full w-full">
            <MapClient />
            </div>
        </main>
    );
}