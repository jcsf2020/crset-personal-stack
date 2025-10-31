import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, pdf } from '@react-pdf/renderer';

export const dynamic = 'force-dynamic';

type Payload = {
  title?: string;
  date?: string;
  summary?: string;
  metrics?: {
    lighthouse?: { mobile?: number; desktop?: number; a11y?: number; seo?: number };
    smoke?: { count?: number; avg_ttfb_ms?: number };
    integrations?: { sentry?: string; resend?: string; supabase_lead_id?: string };
  };
  links?: string[];
  notes?: string[];
};

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  h1: { fontSize: 18, marginBottom: 8 },
  h2: { fontSize: 14, marginTop: 12, marginBottom: 6 },
  mono: { fontFamily: 'Courier', fontSize: 10 },
  li: { marginBottom: 2 }
});

function ReportDoc(data: Payload) {
  const { title = 'CRSET - Proof of Delivery', date, summary, metrics, links = [], notes = [] } = data;
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(Text, { style: styles.h1 }, title),
      React.createElement(Text, null, date || new Date().toISOString()),
      summary
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(Text, { style: styles.h2 }, 'Resumo'),
            React.createElement(Text, null, summary)
          )
        : null,
      React.createElement(Text, { style: styles.h2 }, 'Metricas'),
      React.createElement(
        View,
        null,
        React.createElement(
          Text,
          null,
          `• Lighthouse - Mobile: ${metrics?.lighthouse?.mobile ?? '-'} | Desktop: ${metrics?.lighthouse?.desktop ?? '-'} | A11y: ${metrics?.lighthouse?.a11y ?? '-'} | SEO: ${metrics?.lighthouse?.seo ?? '-'}`
        ),
        React.createElement(
          Text,
          null,
          `• Smoke - Rotas: ${metrics?.smoke?.count ?? '-'} | TTFB medio: ${metrics?.smoke?.avg_ttfb_ms ?? '-'} ms`
        ),
        React.createElement(
          Text,
          null,
          `• Integracoes - Sentry: ${metrics?.integrations?.sentry ?? '-'} | Resend: ${metrics?.integrations?.resend ?? '-'} | Supabase Lead: ${metrics?.integrations?.supabase_lead_id ?? '-'}`
        )
      ),
      links.length
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(Text, { style: styles.h2 }, 'Links'),
            React.createElement(
              View,
              null,
              links.map((u, i) =>
                React.createElement(
                  View,
                  { key: i, style: styles.li },
                  React.createElement(Link, { src: u }, u)
                )
              )
            )
          )
        : null,
      notes.length
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(Text, { style: styles.h2 }, 'Observacoes'),
            notes.map((n, i) => React.createElement(Text, { key: i }, `• ${n}`))
          )
        : null
    )
  );
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Payload;
  const doc = ReportDoc(body);
  const buffer = await pdf(doc).toBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'inline; filename="crset-proof.pdf"'
    }
  });
}
