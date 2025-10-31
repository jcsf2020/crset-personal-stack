'use client';
import Image from 'next/image';
import type { Mascote } from '@/data/mascotes';

export default function MascoteCard({ m }: { m: Mascote }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white/5 p-4 shadow-sm hover:transform hover:scale-105 transition">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-3 mx-auto">
        <Image src={m.src} alt={m.name} width={96} height={96} className="w-full h-full object-cover" />
      </div>
      <div className="text-center">
        <div className="font-semibold">{m.name}</div>
        <div className="text-xs text-blue-300 mb-1">{m.title}</div>
        <p className="text-sm text-[rgb(var(--muted))]">{m.blurb}</p>
      </div>
    </div>
  );
}
