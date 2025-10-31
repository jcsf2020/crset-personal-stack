import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build');

type Attachment = { filename: string; content: string; mime?: string };

export async function POST(req: NextRequest) {
  try {
    const { subject = 'CRSET — CI audit', to = 'crsetsolutions@gmail.com', summary, links, attachments } = await req.json();

    const html = `<h2>${subject}</h2>
      <pre>${summary ?? ''}</pre>
      <ul>${(links ?? []).map((x: string) => `<li><a href="${x}">${x}</a></li>`).join('')}</ul>`;

    const atts =
      Array.isArray(attachments)
        ? attachments.map((a: Attachment) => ({
            filename: a.filename,
            content: a.content, // base64
            contentType: a.mime || 'application/octet-stream'
          }))
        : undefined;

    const r = await resend.emails.send({
      from: 'CRSET <noreply@crsetsolutions.com>',
      to,
      subject,
      html,
      attachments: atts
    });

    return NextResponse.json({ ok: true, id: r.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
