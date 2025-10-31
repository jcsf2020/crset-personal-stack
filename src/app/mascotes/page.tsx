import Image from "next/image";

export const metadata = {
  title: "Mascotes — CRSET Solutions",
  description: "Conhece a nossa equipa de mascotes: Boris, Laya e Irina",
  alternates: { canonical: "/mascotes" },
};

const mascotes = [
  {
    nome: "Boris",
    funcao: "Operações & Segurança",
    imagem: "/mascotes/boris/boris_seguranca.png",
    descricao: "Boris garante que todos os sistemas estão seguros e operacionais."
  },
  {
    nome: "Laya", 
    funcao: "Comunicação & Suporte",
    imagem: "/mascotes/laya/laya_apoio_cliente.png",
    descricao: "Laya cuida da comunicação e do suporte aos nossos clientes."
  },
  {
    nome: "Irina",
    funcao: "Análise & Inteligência", 
    imagem: "/mascotes/irina/irina_inteligencia.png",
    descricao: "Irina analisa dados e fornece insights inteligentes."
  }
];

export default function Page() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Mascotes</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Companheiros que representam como trabalhamos.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {mascotes.map((mascote) => (
          <div key={mascote.nome} className="text-center space-y-4">
            <div className="relative w-64 h-64 mx-auto">
              <Image
                src={mascote.imagem}
                alt={`${mascote.nome} - ${mascote.funcao}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{mascote.nome}</h2>
              <p className="text-sm text-muted-foreground">{mascote.funcao}</p>
              <p className="mt-2 text-sm">{mascote.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-lg font-semibold">Trabalham em Equipa</h3>
        <p className="text-muted-foreground">
          Boris, Laya e Irina representam as diferentes áreas da nossa empresa: 
          operações e segurança, comunicação e suporte, e análise e inteligência. 
          Juntos, garantem que cada projeto é executado com excelência.
        </p>
      </div>
    </main>
  );
}
