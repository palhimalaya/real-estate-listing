import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AdminModeToggle from "@/components/admin-mode-toggle";

export const metadata: Metadata = {
  title: "Real Estate App",
  description: "Find your perfect home",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased">
        <div className="min-h-screen">
          <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-900 text-sm font-semibold text-white shadow-sm">
                  RE
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-zinc-950">
                    House
                  </p>
                  <p className="text-xs text-zinc-500">
                    Real estate listings across the valley
                  </p>
                </div>
              </Link>
              <AdminModeToggle />
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
