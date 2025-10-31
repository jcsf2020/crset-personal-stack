import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  user_id?: string;
  session_id?: string;
  timestamp?: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
}

interface PageView {
  page: string;
  title?: string;
  user_id?: string;
  session_id?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Simulação de armazenamento de eventos (em produção usar base de dados)
const events: AnalyticsEvent[] = [];
const pageViews: PageView[] = [];

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'event';

    if (type === 'pageview') {
      const data: PageView = await request.json();
      
      if (!data.page) {
        return NextResponse.json(
          { ok: false, error: 'Página é obrigatória' },
          { status: 400 }
        );
      }

      const pageView = {
        ...data,
        timestamp: new Date().toISOString(),
        user_agent: request.headers.get('user-agent') || 'unknown',
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      };

      pageViews.push(pageView);
      console.log('PageView registada:', pageView);

      return NextResponse.json({
        ok: true,
        message: 'PageView registada',
        event_id: `pv_${Date.now()}`
      });
    }

    if (type === 'event') {
      const data: AnalyticsEvent = await request.json();
      
      if (!data.event) {
        return NextResponse.json(
          { ok: false, error: 'Nome do evento é obrigatório' },
          { status: 400 }
        );
      }

      const event = {
        ...data,
        timestamp: data.timestamp || new Date().toISOString(),
        user_agent: request.headers.get('user-agent') || 'unknown',
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      };

      events.push(event);
      console.log('Evento registado:', event);

      return NextResponse.json({
        ok: true,
        message: 'Evento registado',
        event_id: `ev_${Date.now()}`
      });
    }

    return NextResponse.json(
      { ok: false, error: 'Tipo inválido. Use "event" ou "pageview"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erro ao processar analytics:', error);
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const debug = searchParams.get('debug');
  const report = searchParams.get('report');

  if (debug === '1') {
    return NextResponse.json({
      ok: true,
      service: 'analytics',
      status: 'operational',
      stats: {
        total_events: events.length,
        total_pageviews: pageViews.length,
        unique_pages: new Set(pageViews.map(pv => pv.page)).size,
        top_events: getTopEvents()
      },
      features: {
        event_tracking: true,
        pageview_tracking: true,
        user_tracking: true,
        session_tracking: true,
        utm_tracking: true,
        real_time_analytics: false // TODO: implementar
      }
    });
  }

  if (report === 'summary') {
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const recentPageViews = pageViews.filter(pv => 
      new Date(pv.timestamp || 0).getTime() > last24h
    );
    const recentEvents = events.filter(ev => 
      new Date(ev.timestamp || 0).getTime() > last24h
    );

    return NextResponse.json({
      ok: true,
      period: 'last_24h',
      pageviews: {
        total: recentPageViews.length,
        unique_pages: new Set(recentPageViews.map(pv => pv.page)).size,
        top_pages: getTopPages(recentPageViews)
      },
      events: {
        total: recentEvents.length,
        unique_events: new Set(recentEvents.map(ev => ev.event)).size,
        top_events: getTopEvents(recentEvents)
      },
      traffic_sources: getTrafficSources(recentPageViews)
    });
  }

  return NextResponse.json(
    { ok: false, error: 'Parâmetro inválido' },
    { status: 400 }
  );
}

function getTopEvents(eventList = events) {
  const eventCounts = eventList.reduce((acc, event) => {
    acc[event.event] = (acc[event.event] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(eventCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([event, count]) => ({ event, count }));
}

function getTopPages(pageViewList = pageViews) {
  const pageCounts = pageViewList.reduce((acc, pv) => {
    acc[pv.page] = (acc[pv.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(pageCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }));
}

function getTrafficSources(pageViewList = pageViews) {
  const sources = pageViewList.reduce((acc, pv) => {
    const source = pv.utm_source || 'direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(sources)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));
}
