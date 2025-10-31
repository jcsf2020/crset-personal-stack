"use client";
import { useState } from "react";

export default function ChatLoginPage() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setOk(null);
    try {
      const res = await fetch("/api/flags/chat/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      setOk(Boolean(data?.ok));
      setMsg(res.ok ? "login_ok" : (data?.reason || "login_failed"));
    } catch {
      setOk(false);
      setMsg("network_error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">Chat Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="text-sm">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={busy} className="w-full rounded-md border px-3 py-2">
            {busy ? "A validar..." : "Entrar"}
          </button>
        </form>
        {msg && (
          <p className={`text-sm ${ok ? "text-green-600" : "text-red-600"}`}>
            [{ok ? "OK" : "ERR"}] {msg}
          </p>
        )}
        <div className="text-center text-sm">
          <a href="/" className="underline">Voltar ao site</a>
        </div>
      </div>
    </main>
  );
}

