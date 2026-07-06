import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatLongDate } from "@/lib/deadline";
import { DISCLAIMER } from "@/config/jurisdiction";

/**
 * Reminder email sender, run daily by Vercel Cron (see vercel.json).
 * Sends every due, unsent reminder via Resend and marks it sent.
 * Protect with CRON_SECRET (Vercel sets the Authorization header).
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const resendKey = process.env.RESEND_API_KEY;
  if (!supabase || !resendKey) {
    return NextResponse.json({ sent: 0, skipped: "not configured" });
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: due } = await supabase
    .from("reminders")
    .select("id, email, days_before, case_id, cases(deadline_date, plaintiff_name)")
    .is("sent_at", null)
    .lte("send_on", today)
    .limit(100);

  let sent = 0;
  for (const reminder of due ?? []) {
    const caseInfo = Array.isArray(reminder.cases) ? reminder.cases[0] : reminder.cases;
    const deadline = caseInfo?.deadline_date as string | undefined;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.REMINDER_FROM_EMAIL ?? "Answered <reminders@example.com>",
        to: reminder.email,
        subject: `⏰ ${reminder.days_before} day${reminder.days_before === 1 ? "" : "s"} left to respond to your lawsuit`,
        text:
          `Your deadline to file an Answer is ${deadline ? formatLongDate(deadline) : "coming up"}.\n\n` +
          `If you don't respond in time, the court will likely enter a default judgment against you.\n\n` +
          `Pick up where you left off: ${process.env.NEXT_PUBLIC_APP_URL ?? ""}/preview\n\n` +
          DISCLAIMER,
      }),
    });
    if (res.ok) {
      await supabase
        .from("reminders")
        .update({ sent_at: new Date().toISOString() })
        .eq("id", reminder.id);
      sent += 1;
    }
  }

  return NextResponse.json({ sent });
}
