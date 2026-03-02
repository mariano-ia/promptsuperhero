import { NextResponse } from "next/server";

function formatDateUTC() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET() {
  // Simple deterministic daily tweet so Zapier can pull it.
  // Later we can switch to reading from a changelog or generating via LLM.
  const day = formatDateUTC();

  const text =
    `Ship log (${day}): Wired a 3-free-credits paywall + Stripe Checkout flow for PromptSuperhero. ` +
    `Next: redesigning UX around one job—customer support replies—then launching 20 programmatic SEO pages for high-intent support scenarios.`;

  return NextResponse.json({ text });
}
