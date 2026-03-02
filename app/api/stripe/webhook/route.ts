import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Note: In this MVP we don't persist anything on webhook.
// We keep it to validate Stripe is wired and for future: update DB / revoke access.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const body = await req.text();
  try {
    stripe.webhooks.constructEvent(body, sig, secret);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook signature verification failed.", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
