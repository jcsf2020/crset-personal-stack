'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function StartInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const plan = (params as any)?.get?.('plan') ?? null;
    if (plan) {
      router.replace(`/checkout?plan=${encodeURIComponent(plan)}`);
    }
  }, [params, router]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="opacity-70">A preparar o checkout...</p>
    </main>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="opacity-70">A preparar o checkout...</p>
      </main>
    }>
      <StartInner />
    </Suspense>
  );
}
