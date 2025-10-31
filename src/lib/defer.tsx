// use client porque usa window/IO
'use client';

import React, { useEffect, useRef, useState, type ReactNode } from 'react';

type DeferProps = {
  children: ReactNode;
  /** Ex.: "200px" — quando o placeholder entra no viewport */
  rootMargin?: string;
  /** Tempo máximo para render mesmo sem visibilidade */
  idleTimeout?: number;
};

/**
 * Renderiza os children quando:
 *  - o placeholder entra no viewport (IntersectionObserver), OU
 *  - o browser fica idle / passa o timeout (requestIdleCallback|setTimeout)
 * Usa-se dentro de um container com altura reservada para evitar CLS.
 */
export default function Defer({
  children,
  rootMargin = '200px',
  idleTimeout = 1500,
}: DeferProps) {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const reveal = () => {
      if (!shownRef.current) {
        shownRef.current = true;
        setShow(true);
      }
    };

    // 1) Visibilidade
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined' && anchorRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) reveal();
        },
        { rootMargin }
      );
      observer.observe(anchorRef.current);
    }

    // 2) Idle/timeout (fallback seguro)
    let idleId: number | undefined;
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(reveal, { timeout: idleTimeout }) as unknown as number;
    } else {
      idleId = w.setTimeout(reveal, idleTimeout);
    }

    return () => {
      if (observer) observer.disconnect();
      if (idleId !== undefined) {
        if (typeof w.cancelIdleCallback === 'function') {
          w.cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId);
        }
      }
    };
  }, [rootMargin, idleTimeout]);

  if (show) return <>{children}</>;
  // Placeholder leve; a altura deve ser reservada pelo container pai para evitar CLS.
  return <span ref={anchorRef} aria-hidden="true" />;
}
