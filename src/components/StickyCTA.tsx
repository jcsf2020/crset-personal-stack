"use client";

import { useEffect, useRef, useState } from "react";

export default function StickyCTA() {
  const [visible, setVisible] = useState(true);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    footerRef.current = document.querySelector("footer");
    const targets = [footerRef.current, ...Array.from(document.querySelectorAll("[data-hide-sticky-cta]"))]
      .filter(Boolean) as Element[];

    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        setVisible(!anyVisible);
      },
      { rootMargin: "0px 0px -20% 0px", threshold: [0, 0.1] }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  if (!visible) return null;

  const gotoStart = () => {
    if (window.location.pathname !== "/start") {
      window.location.href = "/start";
      return;
    }
    const el = document.querySelector("#start-form") as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div role="region" aria-label="Sticky CTA" className="fixed inset-x-0 bottom-3 z-[60] mx-auto max-w-3xl">
      <div className="mx-3 rounded-2xl shadow-xl border border-black/5 bg-white/90 backdrop-blur p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full animate-pulse bg-emerald-500" aria-hidden="true" />
          <p className="text-sm md:text-base font-medium">Pronto para captar leads?</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={gotoStart}
            className="btn-primary"
            data-cta="start-now"
          >
            Comecar agora
          </button>
          <a
            href="https://wa.me/351914423688?text=Quero%20demo%20CRSET"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            data-cta="whatsapp"
            aria-label="Falar no WhatsApp"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
