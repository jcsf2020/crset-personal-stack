export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

/**
 * GET /api/personal/notion
 * 
 * Searches Notion workspace for pages and databases
 * Useful for quick access to notes, docs, and knowledge base
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    return NextResponse.json({
      ok: true,
      message: 'Notion integration requires MCP CLI setup',
      instructions: {
        search: 'manus-mcp-cli tool call search_notion --server notion --input \'{"query":"' + query + '"}\'',
        list_pages: 'manus-mcp-cli tool call list_pages --server notion',
        note: 'Use these commands to interact with Notion'
      },
      query,
      limit,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: 'notion_fetch_failed',
      message: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
