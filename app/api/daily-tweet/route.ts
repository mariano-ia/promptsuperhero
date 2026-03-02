import { NextResponse } from "next/server";

function formatDateUTC() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET() {
  // Deterministic daily tweet so Zapier can pull it.
  // CTA included 3x/week (Mon/Wed/Fri) to avoid fatigue.
  const day = formatDateUTC();
  const dow = new Date().getUTCDay(); // 0 Sun .. 6 Sat
  const withCta = dow === 1 || dow === 3 || dow === 5;

  let text =
    `Ship log (${day}): Shipped Stripe paywall + 3 free replies for PromptSuperhero. ` +
    `Next: better UX for customer support replies + programmatic SEO pages (refunds, WISMO, shipping delays).`;

  if (withCta) text += ` Try it: https://promptsuperhero.com`;

  return NextResponse.json({ text });
}
