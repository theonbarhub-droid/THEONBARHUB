"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function NavAuth() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <Link
      href="/account"
      className="text-ink hover:text-brand no-underline whitespace-nowrap font-semibold"
    >
      {user ? "Account" : "Sign in"}
    </Link>
  );
}
