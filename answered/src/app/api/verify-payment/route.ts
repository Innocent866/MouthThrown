import { NextRequest, NextResponse } from "next/server";
import { getStripe, isDemoMode, DEMO_SESSION_ID } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  if (sessionId === DEMO_SESSION_ID) {
    return NextResponse.json({ paid: isDemoMode() });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ paid: false }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ paid: session.payment_status === "paid" });
  } catch {
    return NextResponse.json({ paid: false }, { status: 404 });
  }
}
