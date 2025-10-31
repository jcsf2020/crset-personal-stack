import Image from "next/image";

export default function MascoteBoris() {
  return (
    <Image
      src="/mascotes/oficiais/boris_variacao_1/boris_variacao_1-w200.webp"
      alt="Mascote Boris"
      width={300}
      height={300}
      priority
    />
  );
}
