import { NextRequest, NextResponse } from "next/server";
import { buildAnswerPdf } from "@/lib/pdf/answerDocument";
import { draftToAnswerPdfData } from "@/lib/pdf/fromDraft";
import { getStripe, isDemoMode, DEMO_SESSION_ID } from "@/lib/stripe";
import type { CaseDraft } from "@/lib/caseStore";

/**
 * Generates the final (unwatermarked) Answer PDF. Requires a paid Stripe
 * Checkout session — the watermark-free document is the paid deliverable.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    draft?: CaseDraft;
    sessionId?: string;
  } | null;

  if (!body?.draft || !body.sessionId) {
    return NextResponse.json({ error: "Missing case data." }, { status: 400 });
  }

  let paid = false;
  if (body.sessionId === DEMO_SESSION_ID) {
    paid = isDemoMode();
  } else {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Payments not configured." }, { status: 503 });
    }
    try {
      const session = await stripe.checkout.sessions.retrieve(body.sessionId);
      paid = session.payment_status === "paid";
    } catch {
      paid = false;
    }
  }

  if (!paid) {
    return NextResponse.json(
      { error: "No completed payment found for this case." },
      { status: 402 },
    );
  }

  const bytes = await buildAnswerPdf(draftToAnswerPdfData(body.draft), {
    watermark: false,
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Answer.pdf"',
    },
  });
}
