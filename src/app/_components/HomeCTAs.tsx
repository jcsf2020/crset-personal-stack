import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeCTAs() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button asChild size="lg">
        <Link href="/servicos">Ver Serviços</Link>
      </Button>
      <Button asChild variant="secondary" size="lg">
        <Link href="/precos">Planos & Preços</Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link href="/agi-live">Demo AGI (JWT)</Link>
      </Button>
    </div>
  );
}
