import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function PUT(request: NextRequest) {
  try {
    const { env } = getRequestContext();
    const body = await request.json() as { lat: number; lng: number; userId?: string };
    
    const { lat, lng } = body;
    // 실제로는 세션에서 userId를 가져와야 하지만 데모를 위해 임의의 ID 처리
    const userId = body.userId || 'worker-demo-id';

    if (lat == null || lng == null) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
    }

    // 유저가 존재하지 않으면 생성 후 위치 업데이트 (데모용 Upsert 처리)
    await env.DB.prepare(
      `INSERT INTO users (id, role, name, current_lat, current_lng)
       VALUES (?, 'worker', 'Demo Worker', ?, ?)
       ON CONFLICT(id) DO UPDATE SET current_lat = excluded.current_lat, current_lng = excluded.current_lng`
    ).bind(userId, lat, lng).run();

    return NextResponse.json({ success: true, message: 'Location updated' });
  } catch (error: any) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
