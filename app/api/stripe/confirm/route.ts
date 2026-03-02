import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { signSubscriptionToken, subscriptionCookieName } from "@/lib/billing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    const redirect = req.nextUrl.searchParams.get("redirect") ?? "/";
    if (!sessionId) return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    const subscription = session.subscription;
    const customer = session.customer;

    const isActive =
      typeof subscription === "object" &&
      subscription !== null &&
      (subscription as Stripe.Subscription).status === "active";

    if (!isActive) {
      return NextResponse.redirect(new URL(`/pricing?not_active=1`, req.url));
    }

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 32; // 32 days
    const token = signSubscriptionToken({
      exp,
      stripeCustomerId: typeof customer === "string" ? customer : customer?.id,
      stripeSubscriptionId: typeof subscription === "string" ? subscription : (subscription as Stripe.Subscription).id,
    });

    const res = NextResponse.redirect(new URL(redirect, req.url));
    res.cookies.set(subscriptionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 32,
    });

    return res;
  } catch (e) {
    console.error("[/api/stripe/confirm]", e);
    return NextResponse.redirect(new URL(`/pricing?error=1`, req.url));
  }
}
