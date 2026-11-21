import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { site } from "@/lib/site";
import AuthProvider from "@/components/auth/AuthProvider";
import NavAuth from "@/components/auth/NavAuth";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Ontario Bar Exam Prep`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_CA",
  },
  alternates: { canonical: "/" },
};

const nav = [
  { href: "/blog", label: "Guides" },
  { href: "/tools/practice-exam", label: "Practice" },
  { href: "/tools/results-tracker", label: "Results & dates" },
  { href: "/about", label: "About" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
        <header className="border-b border-line">
          <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-ink no-underline whitespace-nowrap">
              The <span className="text-brand">OnBar</span> Hub
            </Link>
            <nav className="flex gap-3 sm:gap-5 text-xs sm:text-sm items-center">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="text-ink hover:text-brand no-underline whitespace-nowrap">
                  {n.label}
                </Link>
              ))}
              <NavAuth />
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line bg-wash mt-16">
          <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-muted space-y-2">
            <p>
              <strong className="text-ink">{site.name}</strong>: {site.tagline}
            </p>
            <p>{site.disclaimer}</p>
            <p>© 2026 {site.name}. A sister site of The NCA Hub.</p>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
