export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

/**
 * GET /api/personal/gmail
 * 
 * Fetches important emails from Gmail using MCP integration
 * Useful for tracking: invoices, receipts, important notifications
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'is:important OR is:starred';
    const limit = parseInt(searchParams.get('limit') || '10');

    // This endpoint requires manual MCP CLI invocation
    // In production, you would use a proper Gmail API client
    
    return NextResponse.json({
      ok: true,
      message: 'Gmail integration requires MCP CLI setup',
      instructions: {
        command: 'manus-mcp-cli tool call gmail_search_messages --server gmail --input \'{"query":"' + query + '","maxResults":' + limit + '}\'',
        note: 'Run this command in the sandbox to fetch emails'
      },
      query,
      limit,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: 'gmail_fetch_failed',
      message: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
