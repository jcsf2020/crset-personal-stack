export function register() {
  if (typeof window === 'undefined') return;
  const start = () =>
    import('@sentry/nextjs')
      .then(S => {
        S.init({
          dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
          tracesSampleRate: 0.1,
          replaysOnErrorSampleRate: 0.1,
          replaysSessionSampleRate: 0.0,
        });
      })
      .catch(() => {});
  // dispara fora do caminho crítico
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(start);
  else setTimeout(start, 1500);
}
