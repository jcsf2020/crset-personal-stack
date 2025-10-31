import Image from "next/image";
import { MASCOTES } from "../../content/mascotes";

export default function MascotesGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {MASCOTES.map((m) => {
        // Usar as imagens PNG diretamente disponíveis
        const imageSrc = m.ativo;
        
        return (
          <figure
            key={m.id}
            className="rounded-2xl ring-1 ring-[var(--ring)] bg-[var(--card)]/90 p-4 transition hover:bg-[var(--card)]"
          >
            <div className="overflow-hidden rounded-xl">
              <Image
                src={imageSrc}
                alt={m.imagens[0]?.alt ?? `${m.nome} — ${m.funcao}`}
                width={512}
                height={512}
                className="aspect-square object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
            <figcaption className="mt-3">
              <p className="text-lg font-semibold leading-snug break-words text-[var(--text-strong)]">
                {m.imagens.find(i => i.file === m.ativo)?.title ?? `${m.nome} — ${m.funcao}`}
              </p>
              <p className="text-sm leading-snug text-[var(--muted)]">{m.nome} — mascote</p>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
