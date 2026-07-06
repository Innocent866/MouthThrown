import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { addDays } from "@/lib/deadline";
import type { CaseDraft } from "@/lib/caseStore";

const REMINDER_DAYS_BEFORE = [7, 3, 1] as const;

/**
 * Persists a case at signup and schedules the 7/3/1-day reminder emails.
 * No-op (but still 200) when Supabase isn't configured, so the funnel keeps
 * working in demo mode.
 */
export async function POST(req: NextRequest) {
  const draft = (await req.json().catch(() => null)) as CaseDraft | null;
  if (!draft?.email || !draft.deadline) {
    return NextResponse.json({ error: "Missing email or deadline." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ persisted: false });
  }

  const { data: caseRow, error } = await supabase
    .from("cases")
    .insert({
      email: draft.email,
      defendant_name: draft.defendantName,
      court_id: draft.courtId,
      case_number: draft.caseNumber,
      plaintiff_name: draft.plaintiffName,
      amount_claimed: draft.amountClaimed,
      date_served: draft.dateServed,
      deadline_date: draft.deadline,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !caseRow) {
    return NextResponse.json({ error: "Could not save case." }, { status: 500 });
  }

  const reminders = REMINDER_DAYS_BEFORE.map((days) => ({
    case_id: caseRow.id,
    email: draft.email,
    send_on: addDays(draft.deadline!, -days),
    days_before: days,
  })).filter((r) => r.send_on > new Date().toISOString().slice(0, 10));

  if (reminders.length > 0) {
    await supabase.from("reminders").insert(reminders);
  }

  return NextResponse.json({ persisted: true, caseId: caseRow.id });
}
