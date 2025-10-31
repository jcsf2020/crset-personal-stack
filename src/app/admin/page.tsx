import Link from "next/link";

async function getJSON() {
  // RSC: fetch em server leva cookie admin_jwt automaticamente
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/metrics`, { cache: "no-store", headers: { "authorization": "" } })
    .catch(()=>null as any);
  if (!r || !r.ok) return null;
  return r.json();
}

export default async function AdminHome() {
  const m = await getJSON();
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Admin</h1>
      {!m && (
        <div className="p-4 border rounded">
          <p>Sem sessao. <Link href="/admin/login" className="underline">Faz login</Link>.</p>
        </div>
      )}
      {m && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded"><div className="text-sm text-gray-500">Total</div><div className="text-2xl font-semibold">{m.total}</div></div>
          <div className="p-4 border rounded"><div className="text-sm text-gray-500">24h</div><div className="text-2xl font-semibold">{m.last24h}</div></div>
          <div className="p-4 border rounded"><div className="text-sm text-gray-500">7d</div><div className="text-2xl font-semibold">{m.last7d}</div></div>
        </div>
      )}
      <div className="flex gap-3">
        <a className="underline" href="/api/metrics.csv">Export CSV</a>
        <a className="underline" href="/api/metrics">Ver JSON</a>
      </div>
    </div>
  );
}
