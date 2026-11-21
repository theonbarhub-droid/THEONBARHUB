import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { site } from "@/lib/site";
import AuthProvider from "@/components/auth/AuthProvider";
import NavAuth from "@/components/auth/NavAuth";
import Analytics from "@/components/Analytics";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
        <Analytics />
        <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-30">
          <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl font-semibold text-ink no-underline whitespace-nowrap tracking-tight">
              The <span className="text-brand">OnBar</span> Hub
            </Link>
            <nav className="flex gap-4 sm:gap-6 text-sm items-center">
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
        <footer className="bg-brand-ink text-paper/70 mt-20">
          <div className="mx-auto max-w-5xl px-5 py-12 space-y-3">
            <p className="font-serif text-xl text-paper">The OnBar Hub</p>
            <p className="max-w-xl text-paper/70">{site.tagline}</p>
            <p className="text-sm text-paper/55 max-w-2xl pt-2">{site.disclaimer}</p>
            <p className="text-sm text-paper/45 pt-2">© 2026 {site.name}. A sister site of The NCA Hub.</p>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
