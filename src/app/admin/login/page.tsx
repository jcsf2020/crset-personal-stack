"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: any) {
    e.preventDefault();
    setMsg("A autenticar...");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: {"content-type":"application/json"},
      body: JSON.stringify({ password })
    });
    if (r.ok) {
      setMsg("OK. Redirecionando...");
      location.href = "/admin";
    } else {
      const j = await r.json().catch(()=>({}));
      setMsg("Falhou: " + (j?.error || r.status));
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="text-2xl font-bold mb-4">Login Admin</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
               placeholder="ADMIN_PASSWORD" className="border px-3 py-2 w-full rounded"/>
        <button className="px-4 py-2 rounded bg-black text-white w-full">Entrar</button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}
