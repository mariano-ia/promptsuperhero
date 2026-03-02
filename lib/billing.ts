import crypto from "crypto";

const COOKIE_NAME = "psh_sub";

function getSigningSecret() {
  // Use a stable server-side secret. Stripe secret key exists in all envs here.
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Missing STRIPE_SECRET_KEY");
  return secret;
}

export function subscriptionCookieName() {
  return COOKIE_NAME;
}

export type SubscriptionTokenPayload = {
  exp: number; // unix seconds
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
};

export function signSubscriptionToken(payload: SubscriptionTokenPayload) {
  const json = JSON.stringify(payload);
  const data = Buffer.from(json).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

export function verifySubscriptionToken(token: string | undefined | null): SubscriptionTokenPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = crypto
    .createHmac("sha256", getSigningSecret())
    .update(data)
    .digest("base64url");
  // constant-time compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  try {
    const json = Buffer.from(data, "base64url").toString("utf8");
    const payload = JSON.parse(json) as SubscriptionTokenPayload;
    if (typeof payload.exp !== "number") return null;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return null;
    return payload;
  } catch {
    return null;
  }
}
