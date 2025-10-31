export const metadata: Metadata = { openGraph: { url: "https://crset-solutions-frontend.vercel.app/imobiliaria" } };
import type { Metadata } from "next";
export const dynamic = 'force-static';

export default function Imobiliaria() {
  return (
    <main style={{maxWidth:900,margin:'40px auto',padding:'16px',fontFamily:'Inter, system-ui, sans-serif'}}>
      <h1 style={{fontSize:32,marginBottom:8}}>Assistente para Imobiliárias</h1>
      <p style={{opacity:.8}}>
        Qualificação de leads, sugestões de imóveis e agendamento de visitas - 24/7.
      </p>

      <ul style={{marginTop:16,lineHeight:'1.8'}}>
        <li>⚡ Resposta imediata a leads (Web/WhatsApp).</li>
        <li>🗓️ Agendamento de visitas (Calendly/Google Calendar).</li>
        <li>📊 Registo em Sheet + métricas de conversão.</li>
        <li>🛡️ GDPR: consentimento + opt-out simples.</li>
      </ul>

      <div style={{marginTop:24,display:'flex',gap:12,flexWrap:'wrap'}}>
        <a href="https://wa.me/351914423688" target="_blank" rel="noopener noreferrer"
           style={{background:'#2563eb',color:'#fff',padding:'10px 16px',borderRadius:8,textDecoration:'none'}}>
          Falar no WhatsApp
        </a>
        <a href="/agi-test" style={{border:'1px solid #ddd',padding:'10px 16px',borderRadius:8,textDecoration:'none'}}>
          Ver Demo Técnica
        </a>
      </div>

      <p style={{marginTop:24,opacity:.7,fontSize:12}}>
        * Página demo estática. Não altera APIs existentes.
      </p>
    </main>
  );
}
