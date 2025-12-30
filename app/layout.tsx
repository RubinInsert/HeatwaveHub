import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import Image from "next/image";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className={`${inter.className} antialiased p-0 m-0`}>
        <header className="w-full h-auto bg-gray-300 border-b-4 border-red-400 flex items-center justify-center md:justify-between gap-4 px-6 flex-wrap py-3">
          <Image
            src="/heatwave-hub-logo.png"
            alt="Logo"
            width={730 / 10}
            height={827 / 10}
            unoptimized={false}
          />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black text-blue-900">HEATWAVE HUB</h1>
            <h2 className="text-xl font-normal text-blue-900">
              Community Resilience Initiative
            </h2>
          </div>
          <nav className="md:justify-self-end md:ml-auto">
            <ul className="flex gap-4 items-center justify-center text-center">
              <li>
                <a href="/">Home</a>
              </li>
              <span className="inline text-gray-400">|</span>
              <li>
                <a className="block h-full w-full" href="/dashboard">
                  Search Your Local Government Area
                </a>
              </li>
            </ul>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
