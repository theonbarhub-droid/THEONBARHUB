"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function Waitlist({ source = "site" }: { source?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!site.waitlistEndpoint) {
      setState("error");
      return;
    }
    setState("sending");
    const data = new FormData(e.currentTarget);
    data.append("source", source);
    try {
      const res = await fetch(site.waitlistEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-lg bg-wash border border-line p-4 text-sm">
        You are on the list. We will email you when results land and when OnBar opens.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
      <label htmlFor={`email-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`email-${source}`}
        name="email"
        type="email"
        required
        placeholder="you@email.com"
        className="flex-1 rounded-md border border-line px-3 py-2.5 text-base"
      />
      <select name="exam" aria-label="Which exam" className="rounded-md border border-line px-3 py-2.5 text-base bg-paper">
        <option value="solicitor">Solicitor</option>
        <option value="barrister">Barrister</option>
        <option value="both">Both</option>
      </select>
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-md bg-brand text-white font-semibold px-5 py-2.5 disabled:opacity-60"
      >
        {state === "sending" ? "Joining..." : "Get updates"}
      </button>
      {state === "error" && (
        <p className="text-sm text-red-700 sm:basis-full">
          Sign-up is not open yet. Please check back soon.
        </p>
      )}
    </form>
  );
}
