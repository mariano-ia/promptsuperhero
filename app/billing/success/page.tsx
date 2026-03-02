import Link from "next/link";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <main className="min-h-screen bg-[#080B18] text-white flex items-center justify-center px-6">
        <div className="max-w-lg">
          <h1 className="text-2xl font-bold">Payment received</h1>
          <p className="mt-2 text-white/50">Missing session id.</p>
          <Link className="mt-6 inline-block underline" href="/">
            Go back
          </Link>
        </div>
      </main>
    );
  }

  // We confirm server-side and set an httpOnly cookie.
  return (
    <main className="min-h-screen bg-[#080B18] text-white flex items-center justify-center px-6">
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold">Subscription active</h1>
        <p className="mt-2 text-white/50">
          Final step: confirm your subscription.
        </p>
        <a
          className="mt-6 inline-block rounded-xl bg-white text-black font-semibold px-4 py-2"
          href={`/api/stripe/confirm?session_id=${encodeURIComponent(session_id)}&redirect=/`}
        >
          Continue
        </a>
      </div>
    </main>
  );
}
