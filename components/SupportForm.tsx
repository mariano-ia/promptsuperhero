"use client";

import { useMemo, useState } from "react";
import ActionButton from "@/components/ActionButton";
import PromptOutput from "@/components/PromptOutput";

type IssueType =
  | "angry_customer"
  | "shipping_delay"
  | "refund_request"
  | "return_request"
  | "wismo"
  | "damaged_item"
  | "wrong_item"
  | "subscription_cancel";

type Tone = "calm" | "apologetic" | "firm" | "friendly";

type Channel = "email" | "live_chat" | "whatsapp" | "public_review";

const ISSUE_LABEL: Record<IssueType, string> = {
  angry_customer: "Angry customer",
  shipping_delay: "Shipping delay",
  refund_request: "Refund request",
  return_request: "Return request",
  wismo: "Where is my order? (WISMO)",
  damaged_item: "Damaged item",
  wrong_item: "Wrong item received",
  subscription_cancel: "Subscription cancellation",
};

const TONE_LABEL: Record<Tone, string> = {
  calm: "Calm",
  apologetic: "Apologetic",
  firm: "Firm",
  friendly: "Friendly",
};

const CHANNEL_LABEL: Record<Channel, string> = {
  email: "Email",
  live_chat: "Live chat",
  whatsapp: "WhatsApp",
  public_review: "Public review",
};

function buildUserInput(params: {
  customerMessage: string;
  issue: IssueType;
  tone: Tone;
  channel: Channel;
  policy: string;
  orderStatus: string;
  compensation: string;
}) {
  return `You are a customer support specialist.

Write a professional reply for the following situation.

Channel: ${CHANNEL_LABEL[params.channel]}
Issue type: ${ISSUE_LABEL[params.issue]}
Tone: ${TONE_LABEL[params.tone]}
Order status: ${params.orderStatus || "(unknown)"}
Policy / constraints: ${params.policy || "(none provided)"}
Compensation / offer: ${params.compensation || "(none)"}

Customer message:
"""
${params.customerMessage.trim()}
"""

Requirements:
- Be concise and helpful.
- De-escalate if needed.
- Offer next steps.
- Do NOT promise anything outside the policy.
- Provide 3 variants: short, standard, and firm.
`;
}

export default function SupportForm() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [issue, setIssue] = useState<IssueType>("shipping_delay");
  const [tone, setTone] = useState<Tone>("calm");
  const [channel, setChannel] = useState<Channel>("email");
  const [orderStatus, setOrderStatus] = useState("");
  const [policy, setPolicy] = useState("");
  const [compensation, setCompensation] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const userInput = useMemo(
    () =>
      buildUserInput({
        customerMessage,
        issue,
        tone,
        channel,
        policy,
        orderStatus,
        compensation,
      }),
    [customerMessage, issue, tone, channel, policy, orderStatus, compensation]
  );

  const handleGenerate = async () => {
    if (!customerMessage.trim()) return;
    setLoading(true);
    setError("");
    setShowOutput(false);

    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput, platform: "chatgpt" }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 402 || data.code === "PAYWALL") {
          window.location.href = data.pricingUrl ?? "/pricing";
          return;
        }
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setResult(data.result);
      setTimeout(() => setShowOutput(true), 80);
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/50">Issue type</label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value as IssueType)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm"
            >
              {Object.keys(ISSUE_LABEL).map((k) => (
                <option key={k} value={k}>
                  {ISSUE_LABEL[k as IssueType]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/50">Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm"
            >
              {Object.keys(CHANNEL_LABEL).map((k) => (
                <option key={k} value={k}>
                  {CHANNEL_LABEL[k as Channel]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/50">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm"
            >
              {Object.keys(TONE_LABEL).map((k) => (
                <option key={k} value={k}>
                  {TONE_LABEL[k as Tone]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/50">Order status (optional)</label>
            <input
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              placeholder="e.g., Shipped (tracking says delayed)"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <label className="text-xs font-semibold text-white/50">Customer message</label>
          <textarea
            value={customerMessage}
            onChange={(e) => setCustomerMessage(e.target.value)}
            placeholder="Paste what the customer wrote…"
            rows={6}
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 text-sm leading-relaxed"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/50">Policy / constraints (optional)</label>
            <textarea
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              placeholder="e.g., Returns within 30 days. Refund only after item is returned."
              rows={4}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 text-sm leading-relaxed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/50">Compensation / offer (optional)</label>
            <textarea
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              placeholder="e.g., 10% discount code for next order"
              rows={4}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <ActionButton onClick={handleGenerate} loading={loading} disabled={!customerMessage.trim()} />
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <PromptOutput result={result} visible={showOutput} platform="chatgpt" />
          </div>
        )}
      </div>

      <div className="text-center text-xs text-white/25">
        3 free replies. After that, subscribe in Stripe.
      </div>
    </div>
  );
}
