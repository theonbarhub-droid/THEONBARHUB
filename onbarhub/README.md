# The OnBar Hub (onbarhub.com)

Ontario LSO bar exam prep. Next.js (App Router) site with a markdown blog and free tools.

## Run locally
    npm install
    npm run dev        # http://localhost:3000

## Add or edit an article
Create `content/blog/<slug>.md` with front matter:

    ---
    title: "..."
    description: "..."
    date: 2026-11-20
    updated: 2026-12-01   # optional
    category: Results
    exam: Solicitor        # Barrister | Solicitor | Both
    draft: false           # true hides it
    faq:                   # optional, also emitted as FAQ schema
      - q: "..."
        a: "..."
    ---

## Key files
- `src/data/exam-dates.ts`: every LSO sitting and deadline, plus results-window estimates. Update each sitting.
- `src/lib/site.ts`: site name, author, disclaimer.
- `src/app/tools/results-tracker`: results date tracker.

## Environment variables
- `NEXT_PUBLIC_WAITLIST_ENDPOINT`: form endpoint (for example Formspree) for email sign-ups.

## Deploy
Vercel: import the GitHub repo, framework Next.js, add the env var, then point onbarhub.com DNS at Vercel.

## Content rules
- No names, usernames or quotes from Reddit. Anonymous statistics only.
- Never reproduce LSO material text. Point to pages.
- Every date links to its LSO source and shows when it was checked.
