"use client";
import Image from "next/image";

export default function MascoteIrina() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/mascotes/oficiais/irina_variacao_1/irina_variacao_1-w200.webp"
        alt="Irina - Inteligência e Dados"
        width={512}
        height={512}
        sizes="(max-width: 640px) 200px, (max-width: 1024px) 256px, 512px"
        placeholder="blur"
        blurDataURL="/mascotes/oficiais/irina_variacao_1/irina_variacao_1-w200.webp"
      />
      <p className="mt-4 text-lg font-semibold">Irina - Inteligência e Dados</p>
    </div>
  );
}
