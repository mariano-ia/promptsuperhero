export const CREDITS_COOKIE = "psh_credits";
const FREE_CREDITS = 3;

export function getFreeCreditsLimit() {
  return FREE_CREDITS;
}

export function parseCreditsUsed(raw: string | undefined | null): number {
  if (!raw) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
