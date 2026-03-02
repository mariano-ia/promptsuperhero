import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const { priceId } = (await req.json().catch(() => ({}))) as { priceId?: string };
    const PRICE_ID = priceId || process.env.STRIPE_PRICE_ID;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    if (!PRICE_ID) {
      return NextResponse.json({ error: "Missing STRIPE_PRICE_ID" }, { status: 500 });
    }
    if (!APP_URL) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_APP_URL" }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[/api/stripe/checkout]", e);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
