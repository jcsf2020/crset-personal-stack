"use client";
import Image from "next/image";

export default function MascoteLaya() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/mascotes/oficiais/laya_variacao_1/laya_variacao_1-w200.webp"
        alt="Laya - Comunicação"
        width={512}
        height={512}
        sizes="(max-width: 640px) 200px, (max-width: 1024px) 256px, 512px"
        placeholder="blur"
        blurDataURL="/mascotes/oficiais/laya_variacao_1/laya_variacao_1-w200.webp"
      />
      <p className="mt-4 text-lg font-semibold">Laya - Comunicação</p>
    </div>
  );
}
