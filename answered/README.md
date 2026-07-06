# Answered — debt lawsuit response MVP

A guided tool that takes someone who has been sued for a consumer debt in
**Texas** from "I just got served" to a completed, court-ready Answer with
filing instructions — in under 20 minutes, on a phone.

> **Answered is not a law firm and does not provide legal advice.** The app
> provides legal information and document preparation only. See
> [Before you launch](#before-you-launch) — attorney review is mandatory.

## Stack

Next.js 14 (App Router) · TypeScript · MUI + Tailwind · Supabase (auth/DB) ·
Stripe Checkout ($99 one-time) · pdf-lib · Vitest · Vercel (with cron for
reminder emails via Resend).

## Run it

```bash
npm install
cp .env.example .env.local   # fill in what you have; see demo mode below
npm test                     # deadline math + defense mapping (must pass)
npm run dev
```

End-to-end smoke test (drives the full funnel in headless Chromium against a
running server): `DEMO_MODE=true npm run build && DEMO_MODE=true npx next start`,
then `npm run smoke` in another terminal.

**Demo mode** — set `DEMO_MODE=true` in `.env.local` to run the entire funnel
(including the post-payment download) with no Supabase/Stripe/Resend
credentials. Drafts live in localStorage. Never enable in production.

## User flow

`/` landing → `/intake` summons details → `/deadline` countdown (or
`/deadline-passed` hard stop — no sale, legal aid links) → `/signup` →
`/interview` 7-question wizard → `/summary` defenses → `/preview` watermarked
PDF + $99 Stripe Checkout → `/filing` download + court-specific checklist.

## Where the legal logic lives

| Concern | File |
| --- | --- |
| State rules (deadline days, SOL, rollover) | `src/config/jurisdiction.ts` |
| Court holidays | `src/config/jurisdiction.ts` (`COURT_HOLIDAYS`) |
| Courts + clerk addresses | `src/config/courts.ts` (+ `courts` table) |
| Deadline math (tested) | `src/lib/deadline.ts` |
| Interview questions | `src/lib/interview.ts` |
| Answer→defense mapping (tested) | `src/lib/defenses.ts` |
| PDF generation | `src/lib/pdf/answerDocument.ts` |

Adding a second state is a data task: new `JurisdictionConfig`, holiday list,
and court rows — no application code changes.

### Swapping in the official court form

`buildAnswerPdf()` currently lays out a formatted pleading programmatically.
When you have the official state Answer form PDF, replace the layout with
pdf-lib form-filling of that template (load bytes → `doc.getForm()` → fill →
flatten), keeping the same `AnswerPdfData` contract and watermark option.
**Provide the official form PDF and it can be wired in.**

## Architecture notes

- **Business rules enforced in code + tests:** deadline weekend/holiday
  rollover (`deadline.test.ts`), no defense auto-selected without a supporting
  answer, denials only for what the user disputed, information-not-advice
  phrasing (`defenses.test.ts`), hard stop when the deadline passed.
- **Payments:** checkout session created server-side; the final unwatermarked
  PDF route (`/api/pdf`) independently verifies the Stripe session is paid.
  Webhook (`/api/webhooks/stripe`) records payment + flips case status in DB.
- **Reminders:** signup schedules 7/3/1-day reminders in the `reminders`
  table; `vercel.json` cron hits `/api/cron/send-reminders` daily, which
  sends via Resend and marks rows sent.
- **Performance:** court picker is virtualized (react-window) with debounced
  search; the preview screen is code-split (`next/dynamic`) so pdf-lib stays
  out of the main bundle; preview PDFs render in a **Web Worker** with
  throttled regeneration; wizard steps use `useTransition` and memoized option
  buttons.
- **Phase 2 stubs:** summons photo/OCR (button stubbed), e-filing, settlement
  letter generator (teased on paywall), multi-state.

## Database

Apply `supabase/migrations/0001_init.sql` (tables: `courts`, `cases`,
`interview_answers`, `defenses`, `payments`, `reminders`, with RLS). Seed
`courts` from `src/config/courts.ts`.

## Before you launch

1. **A licensed Texas attorney must review** the interview questions, defense
   mapping, deadline rule (Tex. R. Civ. P. 502.5/500.5), statute of
   limitations config, and every string shown on screen or printed in the PDF
   for unauthorized-practice-of-law risk. Non-negotiable.
2. Verify the official Answer form, filing fee, and fee-waiver forms for each
   county served; verify every clerk address in `src/config/courts.ts`.
3. Verify the court holiday calendar yearly and per county.
4. Form an LLC and get appropriate insurance before taking payments.
