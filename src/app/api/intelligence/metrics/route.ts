import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

interface MetricsData {
  revenue: {
    total: number;
    change: number;
    data: Array<{ date: string; value: number }>;
  };
  users: {
    total: number;
    change: number;
    data: Array<{ date: string; value: number }>;
  };
  conversion: {
    rate: number;
    change: number;
  };
  performance: {
    score: number;
    change: number;
    apiLatency: number;
    uptime: number;
    cacheHitRate: number;
    avgResponse: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30'; // 7, 30, 90 days
    
    // Get Supabase client (with fallback if env vars missing)
    let supabase = null;
    try {
      supabase = getSupabaseAdmin();
    } catch (e) {
      console.warn('Supabase client unavailable, using mock data:', e);
    }
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Fetch real data from database
    // For now, we'll use simulated data, but this structure is ready for real data
    
    // TODO: Replace with real queries
    // const { data: leads, error } = await supabase
    //   .from('leads')
    //   .select('*')
    //   .gte('created_at', startDate.toISOString())
    //   .lte('created_at', endDate.toISOString());
    
    // Generate metrics based on period
    const metrics: MetricsData = await generateMetrics(parseInt(period));
    
    return NextResponse.json({
      ok: true,
      period: parseInt(period),
      metrics,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error fetching intelligence metrics:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

async function generateMetrics(period: number): Promise<MetricsData> {
  // This function will be replaced with real data queries
  // For now, it generates realistic simulated data
  
  const days = period;
  const revenueData = [];
  const userData = [];
  
  // Generate daily data
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    revenueData.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(1000 + Math.random() * 2000),
    });
    
    userData.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(50 + Math.random() * 150),
    });
  }
  
  // Calculate totals and changes
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.value, 0);
  const totalUsers = userData.reduce((sum, d) => sum + d.value, 0);
  
  // Calculate previous period for comparison
  const currentPeriodRevenue = revenueData.slice(-Math.floor(days / 2)).reduce((sum, d) => sum + d.value, 0);
  const previousPeriodRevenue = revenueData.slice(0, Math.floor(days / 2)).reduce((sum, d) => sum + d.value, 0);
  const revenueChange = ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
  
  const currentPeriodUsers = userData.slice(-Math.floor(days / 2)).reduce((sum, d) => sum + d.value, 0);
  const previousPeriodUsers = userData.slice(0, Math.floor(days / 2)).reduce((sum, d) => sum + d.value, 0);
  const usersChange = ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100;
  
  return {
    revenue: {
      total: totalRevenue,
      change: parseFloat(revenueChange.toFixed(1)),
      data: revenueData,
    },
    users: {
      total: totalUsers,
      change: parseFloat(usersChange.toFixed(1)),
      data: userData,
    },
    conversion: {
      rate: 3.2,
      change: -2.1,
    },
    performance: {
      score: 98.5,
      change: 5.7,
      apiLatency: 45,
      uptime: 99.9,
      cacheHitRate: 94,
      avgResponse: 1.2,
    },
  };
}

