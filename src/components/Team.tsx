"use client";

import Image from "next/image"

export default function Team(){
  const members=[
    {name:"Boris",role:"Segurança & Automação",img:"/mascotes/oficiais/boris_variacao_1/boris_variacao_1-w200.webp",pitch:"Robusto, confiavel, sem drama."},
    {name:"Laya",role:"Comunicação & UX",img:"/mascotes/oficiais/laya_variacao_1/laya_variacao_1-w200.webp",pitch:"Clareza de experiencia e copy."},
    {name:"Irina",role:"Analytics & Insights",img:"/mascotes/oficiais/irina_variacao_1/irina_variacao_1-w200.webp",pitch:"Dados que guiam decisoes."}
  ];
  return (
    <section id="equipa" className="py-14 md:py-20" aria-label="Equipa CRSET">
      <div className="container-pro">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">A equipa por tras dos resultados</h2>
          <p className="muted mt-2 max-w-prose mx-auto">Mascotes especialistas focadas em segurança, comunicação e dados.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {members.map((m)=>(
            <article key={m.name} className="card p-6 flex flex-col items-center text-center">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-2xl font-semibold">
                <span>{m.name.charAt(0)}</span>
                <Image 
                  src={m.img} 
                  alt={`Fotografia de ${m.name}, ${m.role}`} 
                  width={96}
                  height={96}
                  className="absolute inset-0 h-full w-full object-cover" 
                  onError={(e)=>{e.currentTarget.style.display="none";}}
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
              <div className="text-sm muted">{m.role}</div>
              <p className="text-sm mt-3">{m.pitch}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}