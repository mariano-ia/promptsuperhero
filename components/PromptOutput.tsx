"use client";

import { useState } from "react";

interface PromptOutputProps {
    result: string;
    visible: boolean;
    platform: string;
}

export default function PromptOutput({ result, visible, platform }: PromptOutputProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for iOS Safari
            const ta = document.createElement("textarea");
            ta.value = result;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const platformLabel: Record<string, string> = {
        chatgpt: "ChatGPT",
        claude: "Claude",
        gemini: "Gemini",
        midjourney: "Midjourney",
    };

    return (
        <div
            className={`
        transition-all duration-700 ease-out
        ${visible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                }
      `}
        >
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 bg-white/3">
                    <div className="flex items-center gap-2.5">
                        {/* Traffic lights */}
                        <span className="w-3 h-3 rounded-full bg-rose-400/70" />
                        <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
                        <span className="ml-3 text-xs text-white/30 font-mono">
                            Prompt optimizado para {platformLabel[platform] ?? platform}
                        </span>
                    </div>

                    {/* Copy button */}
                    <button
                        onClick={handleCopy}
                        className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              transition-all duration-300
              ${copied
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/8 text-white/50 border border-white/10 hover:bg-white/15 hover:text-white hover:border-white/25"
                            }
            `}
                    >
                        {copied ? (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                ¡Copiado!
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copiar al portapapeles
                            </>
                        )}
                    </button>
                </div>

                {/* Result text */}
                <div className="p-5">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-white/80 leading-relaxed">
                        {result}
                    </pre>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0D0F1A]/60 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
