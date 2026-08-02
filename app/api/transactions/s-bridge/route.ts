import { NextRequest, NextResponse } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { gig_id: string; total_amount: number; worker_id?: string };
    const { gig_id, total_amount } = body;
    const worker_id = body.worker_id || 'worker-demo-id';
    
    if (!gig_id || !total_amount) {
      return NextResponse.json({ error: 'gig_id and total_amount are required' }, { status: 400 });
    }

    const tx_id = `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
      const ctx = getOptionalRequestContext();
      const env = ctx?.env as any;
      if (env?.DB) {
        await env.DB.prepare(
          `INSERT INTO transactions (tx_id, gig_id, worker_id, total_amount, bank_status, invest_status, card_status, life_status)
           VALUES (?, ?, ?, ?, 'SUCCESS', 'PENDING', 'PENDING', 'PENDING')`
        ).bind(tx_id, gig_id, worker_id, total_amount).run();
      }
    } catch (dbErr) {
      console.warn('D1 insert skipped or unavailable:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'S-BRIDGE transaction initiated',
      tx_id,
      mock_results: {
        bank: '0.1초 신한 에스크로 정산 완료',
        invest: '신한투자증권 50% 수수료 매칭 펀딩 완료',
        card: '신한카드 가맹점 입금 완료',
        life: '신한라이프 18시간 상해보험 효력 개시',
      },
    });
  } catch {
    return NextResponse.json({ success: true, tx_id: `tx_${Date.now()}` });
  }
}
