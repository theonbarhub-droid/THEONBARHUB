import type { Metadata } from "next";
import AccountClient from "@/components/auth/AccountClient";

export const metadata: Metadata = {
  title: "Your account",
  description: "Sign in to save your practice attempts and track your progress on The OnBar Hub.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold">Your account</h1>
      <div className="mt-6">
        <AccountClient />
      </div>
    </div>
  );
}
