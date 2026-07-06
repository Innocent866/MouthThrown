import { NextRequest, NextResponse } from "next/server";
import { getStripe, isDemoMode, DEMO_SESSION_ID } from "@/lib/stripe";
import { PRICE_USD_CENTS, JURISDICTION } from "@/config/jurisdiction";
import type { CaseDraft } from "@/lib/caseStore";

export async function POST(req: NextRequest) {
  const draft = (await req.json().catch(() => ({}))) as CaseDraft;
  const stripe = getStripe();

  if (!stripe) {
    if (isDemoMode()) {
      return NextResponse.json({
        url: `/filing?session_id=${DEMO_SESSION_ID}`,
      });
    }
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 503 },
    );
  }

  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: PRICE_USD_CENTS,
          product_data: {
            name: `Answered — court-ready ${JURISDICTION.answerFormName}`,
            description:
              "Completed Answer PDF, certificate of service, and filing instructions.",
          },
        },
      },
    ],
    customer_email: draft.email || undefined,
    metadata: { case_id: draft.id ?? "", case_number: draft.caseNumber ?? "" },
    success_url: `${origin}/filing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/preview`,
  });

  return NextResponse.json({ url: session.url });
}
