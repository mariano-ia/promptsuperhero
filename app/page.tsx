"use client";

import { useState } from "react";
import PlatformSelector from "@/components/PlatformSelector";
import PromptInput from "@/components/PromptInput";
import ActionButton from "@/components/ActionButton";
import PromptOutput from "@/components/PromptOutput";
import { Platform } from "@/lib/systemPrompts";

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("chatgpt");
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const handleEnhance = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setError("");
    setShowOutput(false);

    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput, platform }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Paywall handling
        if (res.status === 402 || data.code === "PAYWALL") {
          window.location.href = data.pricingUrl ?? "/pricing";
          return;
        }

        setError(data.error ?? "Algo salió mal. Intentá de nuevo.");
        return;
      }

      setResult(data.result);
      // Small delay so the previous output collapses before the new one appears
      setTimeout(() => setShowOutput(true), 80);
    } catch {
      setError("No se pudo conectar con el servidor. Verificá tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080B18] text-white relative overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-700/15 blur-[120px]" />
        <div className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-800/8 blur-[100px]" />
      </div>

      {/* Noise texture overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative z-10 flex flex-col items-center justify-start px-4 py-16 sm:py-24 min-h-screen">
        {/* Header */}
        <header className="text-center mb-12 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-medium mb-2 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by GPT-4o mini
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              Prompt
            </span>
            <span className="text-white">Fácil</span>
          </h1>

          <p className="text-white/40 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Escribí tu deseo en lenguaje simple. Nosotros lo convertimos en un prompt estructurado profesional.
          </p>
        </header>

        {/* Card */}
        <div className="w-full max-w-2xl space-y-6 animate-fade-in-up-delay">
          {/* Platform Selector */}
          <section className="space-y-3">
            <label className="block text-xs font-semibold text-white/30 uppercase tracking-widest text-center">
              Elegí tu plataforma
            </label>
            <PlatformSelector selected={platform} onChange={setPlatform} />
          </section>

          {/* Input */}
          <section>
            <PromptInput
              value={userInput}
              onChange={setUserInput}
              disabled={loading}
            />
          </section>

          {/* CTA */}
          <div className="flex justify-center">
            <ActionButton
              onClick={handleEnhance}
              loading={loading}
              disabled={!userInput.trim()}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm animate-fade-in-up">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Output */}
          {result && (
            <PromptOutput result={result} visible={showOutput} platform={platform} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-white/15 text-xs space-y-1">
          <p>Construido con Next.js · Impulsado por OpenAI</p>
        </footer>
      </div>
    </main>
  );
}
