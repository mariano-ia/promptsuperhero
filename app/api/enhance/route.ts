import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt, Platform } from "@/lib/systemPrompts";

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
            return NextResponse.json(
                { error: "userInput is required." },
                { status: 400 }
            );
        }

        const validPlatforms: Platform[] = ["chatgpt", "claude", "gemini", "midjourney"];
        if (!platform || !validPlatforms.includes(platform)) {
            return NextResponse.json(
                { error: "Invalid or missing platform." },
                { status: 400 }
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

        return NextResponse.json({ result });
    } catch (error) {
        console.error("[/api/enhance] Error:", error);
        return NextResponse.json(
            { error: "Error processing your request. Please try again." },
            { status: 500 }
        );
    }
}
