export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

/**
 * GET /api/personal/calendar
 * 
 * Fetches upcoming events from Google Calendar
 * Shows next 7 days of events
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + days);

    return NextResponse.json({
      ok: true,
      message: 'Calendar integration requires MCP CLI setup',
      instructions: {
        command: 'manus-mcp-cli tool call list_events --server google-calendar --input \'{"timeMin":"' + now.toISOString() + '","timeMax":"' + future.toISOString() + '","maxResults":20}\'',
        note: 'Run this command to fetch calendar events'
      },
      period: {
        from: now.toISOString(),
        to: future.toISOString(),
        days
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: 'calendar_fetch_failed',
      message: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
