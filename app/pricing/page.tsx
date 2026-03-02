"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080B18] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold tracking-tight">Support Replies Pro</h1>
        <p className="mt-2 text-white/50">
          Unlimited support reply generations + tone presets + saved templates.
        </p>
        <ul className="mt-6 space-y-2 text-white/70 text-sm">
          <li>• De-escalation replies</li>
          <li>• Refund / return / WISMO responses</li>
          <li>• Consistent brand voice</li>
        </ul>
        <button
          onClick={startCheckout}
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-white text-black font-semibold py-3 hover:bg-white/90 disabled:opacity-60"
        >
          {loading ? "Redirecting…" : "Subscribe"}
        </button>
        <p className="mt-4 text-xs text-white/40">
          You’ll be redirected to Stripe Checkout.
        </p>
      </div>
    </main>
  );
}
