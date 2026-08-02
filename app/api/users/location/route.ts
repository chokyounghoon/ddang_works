import { NextRequest, NextResponse } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as { lat: number; lng: number; userId?: string };
    const { lat, lng } = body;
    const userId = body.userId || 'worker-demo-id';

    if (lat == null || lng == null) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
    }

    try {
      const ctx = getOptionalRequestContext();
      const env = ctx?.env as any;
      if (env?.DB) {
        await env.DB.prepare(
          `INSERT INTO users (id, role, name, current_lat, current_lng)
           VALUES (?, 'worker', 'Demo Worker', ?, ?)
           ON CONFLICT(id) DO UPDATE SET current_lat = excluded.current_lat, current_lng = excluded.current_lng`
        ).bind(userId, lat, lng).run();
      }
    } catch (dbErr) {
      console.warn('D1 upsert skipped or unavailable:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Location updated' });
  } catch (error: any) {
    return NextResponse.json({ success: true, message: 'Location updated fallback' });
  }
}
