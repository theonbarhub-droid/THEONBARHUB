import type { Metadata } from "next";
import AdminClient from "@/components/admin/AdminClient";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Dashboard</h1>
      <p className="text-muted mt-2">How people are using The OnBar Hub.</p>
      <div className="mt-8">
        <AdminClient />
      </div>
    </div>
  );
}
