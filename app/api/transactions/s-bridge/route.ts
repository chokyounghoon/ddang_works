import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { env } = getRequestContext();
    const body = await request.json() as { gig_id: string; total_amount: number; worker_id?: string };
    
    const { gig_id, total_amount } = body;
    const worker_id = body.worker_id || 'worker-demo-id';
    
    if (!gig_id || !total_amount) {
      return NextResponse.json({ error: 'gig_id and total_amount are required' }, { status: 400 });
    }

    // 트랜잭션 ID 생성 (간단히 timestamp + 랜덤)
    const tx_id = `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // S-BRIDGE 정산 레코드 생성
    await env.DB.prepare(
      `INSERT INTO transactions (tx_id, gig_id, worker_id, total_amount, bank_status, invest_status, card_status, life_status)
       VALUES (?, ?, ?, ?, 'PENDING', 'PENDING', 'PENDING', 'PENDING')`
    ).bind(tx_id, gig_id, worker_id, total_amount).run();

    // 알바 상태 업데이트 (OPEN -> MATCHED)
    await env.DB.prepare(
      `UPDATE gigs SET status = 'MATCHED' WHERE id = ?`
    ).bind(gig_id).run();

    return NextResponse.json({ success: true, tx_id, message: 'Transaction created and gig updated' });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
