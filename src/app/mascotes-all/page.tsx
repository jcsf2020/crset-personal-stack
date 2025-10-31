export const metadata: Metadata = { openGraph: { url: "https://crset-solutions-frontend.vercel.app/mascotes-all" } };
import MascoteBoris from "@/components/MascoteBoris";
import MascoteLaya from "@/components/MascoteLaya";
import MascoteIrina from "@/components/MascoteIrina";
import type { Metadata } from "next";

export default function Page() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mascotes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <figure className="rounded-xl border border-border bg-card shadow">
          <div className="aspect-square overflow-hidden flex items-center justify-center p-4">
            <div className="w-full h-full flex items-center justify-center [&>img]:w-full [&>img]:h-full [&>img]:object-contain [&>svg]:w-full [&>svg]:h-full [&>canvas]:w-full [&>canvas]:h-full" role="img" aria-label="Boris - mascote">
              <MascoteBoris />
            </div>
          </div>
          <figcaption className="text-xs text-muted-foreground text-center py-2">Boris - mascote</figcaption>
        </figure>

        <figure className="rounded-xl border border-border bg-card shadow">
          <div className="aspect-square overflow-hidden flex items-center justify-center p-4">
            <div className="w-full h-full flex items-center justify-center [&>img]:w-full [&>img]:h-full [&>img]:object-contain [&>svg]:w-full [&>svg]:h-full [&>canvas]:w-full [&>canvas]:h-full" role="img" aria-label="Laya - mascote">
              <MascoteLaya />
            </div>
          </div>
          <figcaption className="text-xs text-muted-foreground text-center py-2">Laya - mascote</figcaption>
        </figure>

        <figure className="rounded-xl border border-border bg-card shadow">
          <div className="aspect-square overflow-hidden flex items-center justify-center p-4">
            <div className="w-full h-full flex items-center justify-center [&>img]:w-full [&>img]:h-full [&>img]:object-contain [&>svg]:w-full [&>svg]:h-full [&>canvas]:w-full [&>canvas]:h-full" role="img" aria-label="Irina - mascote">
              <MascoteIrina />
            </div>
          </div>
          <figcaption className="text-xs text-muted-foreground text-center py-2">Irina - mascote</figcaption>
        </figure>
      </div>
    </main>
  );
}
