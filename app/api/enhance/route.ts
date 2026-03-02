import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt, Platform } from "@/lib/systemPrompts";
import { cookies } from "next/headers";
import { verifySubscriptionToken, subscriptionCookieName } from "@/lib/billing";
import { CREDITS_COOKIE, getFreeCreditsLimit, parseCreditsUsed } from "@/lib/credits";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInput, platform } = body as {
      userInput: string;
      platform: Platform;
    };

    if (!userInput || typeof userInput !== "string" || userInput.trim() === "") {
      return NextResponse.json({ error: "userInput is required." }, { status: 400 });
    }

    const validPlatforms: Platform[] = ["chatgpt", "claude", "gemini", "midjourney"];
    if (!platform || !validPlatforms.includes(platform)) {
      return NextResponse.json({ error: "Invalid or missing platform." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const subToken = cookieStore.get(subscriptionCookieName())?.value;
    const sub = verifySubscriptionToken(subToken);
    const creditsUsed = parseCreditsUsed(cookieStore.get(CREDITS_COOKIE)?.value);
    const freeLimit = getFreeCreditsLimit();

    const hasAccess = Boolean(sub) || creditsUsed < freeLimit;
    if (!hasAccess) {
      return NextResponse.json(
        {
          error: "Free credits exhausted.",
          code: "PAYWALL",
          creditsUsed,
          freeLimit,
          pricingUrl: "/pricing",
        },
        { status: 402 }
      );
    }

    const systemPrompt = buildSystemPrompt(platform);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput.trim() },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content ?? "";

    // Only count credits for non-subscribers.
    if (!sub) {
      cookieStore.set(CREDITS_COOKIE, String(creditsUsed + 1), {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return NextResponse.json({ result, creditsUsed: sub ? null : creditsUsed + 1, freeLimit });
  } catch (error) {
    console.error("[/api/enhance] Error:", error);
    return NextResponse.json(
      { error: "Error processing your request. Please try again." },
      { status: 500 }
    );
  }
}
