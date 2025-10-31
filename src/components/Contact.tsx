"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const to = "crsetsolutions@gmail.com";
    const subject = encodeURIComponent("Contato CRSET - " + name);
    const body = encodeURIComponent(
      `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${msg}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contacto" className="py-14 md:py-20" aria-label="Contacto">
      <div className="container-pro grid gap-8 md:grid-cols-2 items-start">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Fala connosco</h2>
          <p className="muted max-w-prose">Resposta rapida em horario comercial. Se preferires, usa WhatsApp.</p>
          <Button asChild variant="secondary" size="lg">
            <a
              href="https://wa.me/351914423688?text=Quero%20demo%20CRSET"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir WhatsApp
            </a>
          </Button>
        </div>

        <form onSubmit={onSubmit} className="card p-6 md:p-7 space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="O teu nome"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="teu@email.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mensagem</label>
            <textarea
              required
              rows={5}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="Como podemos ajudar?"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" size="lg">Enviar por email</Button>
            <Button asChild variant="secondary" size="lg">
              <a href="https://wa.me/351914423688?text=Quero%20demo%20CRSET" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
