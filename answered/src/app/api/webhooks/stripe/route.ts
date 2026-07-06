import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Stripe webhook: marks the case paid and records the payment. Configure the
 * endpoint in Stripe for the `checkout.session.completed` event and set
 * STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const caseId = session.metadata?.case_id;
    const supabase = getSupabaseAdmin();
    if (supabase && caseId) {
      await supabase.from("payments").insert({
        case_id: caseId,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: "paid",
      });
      await supabase.from("cases").update({ status: "paid" }).eq("id", caseId);
    }
  }

  return NextResponse.json({ received: true });
}
