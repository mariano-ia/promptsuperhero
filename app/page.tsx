import SupportForm from "@/components/SupportForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080B18] text-white relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-700/15 blur-[120px]" />
        <div className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-800/8 blur-[100px]" />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-start px-4 py-14 sm:py-20 min-h-screen">
        <header className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Built for ecommerce support
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              Customer Support
            </span>{" "}
            <span className="text-white">Reply Generator</span>
          </h1>

          <p className="text-white/45 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Paste a customer message. Get 3 reply variants (short, standard, firm) that respect your policy.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-white/35">
            <a className="underline hover:text-white/60" href="/pricing">
              $9/month after 3 free replies
            </a>
            <span>•</span>
            <span>No login required</span>
          </div>
        </header>

        <SupportForm />

        <footer className="mt-16 text-center text-white/15 text-xs space-y-1">
          <p>PromptSuperhero · Powered by OpenAI</p>
        </footer>
      </div>
    </main>
  );
}
