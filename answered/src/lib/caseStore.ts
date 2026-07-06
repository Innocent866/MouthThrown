"use client";

import type { InterviewAnswers } from "@/lib/interview";

/**
 * Client-side draft store (localStorage). The draft is the source of truth
 * through the funnel; it is persisted to Supabase at signup (POST /api/cases)
 * and marked paid by the Stripe webhook. Works fully offline/demo when
 * Supabase env vars are absent.
 */

export interface CaseDraft {
  id?: string;
  email?: string;
  defendantName?: string;
  courtId?: string;
  caseNumber?: string;
  plaintiffName?: string;
  amountClaimed?: number;
  dateServed?: string;
  deadline?: string;
  answers?: InterviewAnswers;
  status?: "draft" | "paid" | "filed";
  stripeSessionId?: string;
}

const KEY = "answered.caseDraft.v1";

export function loadDraft(): CaseDraft {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as CaseDraft;
  } catch {
    return {};
  }
}

export function saveDraft(patch: Partial<CaseDraft>): CaseDraft {
  const next = { ...loadDraft(), ...patch };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearDraft() {
  window.localStorage.removeItem(KEY);
}
