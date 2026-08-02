// app/api/employer/dashboard/route.ts
// 점주 대시보드 데이터 API — Cloudflare D1 연동 (로컬 fallback 포함)

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/* ------------------------------------------------------------------
   로컬·개발 환경용 Fallback 데이터
   — D1이 연결되지 않은 환경(next dev)에서 사용
   ------------------------------------------------------------------ */
const FALLBACK_TRANSACTIONS = [
  { tx_id: 'tx_001', type: 'out', label: '조이수 알바비 정산',           amount: 58000,  date: '08.02 22:01', method: '신한 에스크로 0.1초 즉시',  detail: '하남돼지집 부평역점 야간 서빙 4h',                            category: '인건비' },
  { tx_id: 'tx_002', type: 'out', label: '5% 시너지 수수료',             amount: 2900,   date: '08.02 22:01', method: '신한DS 자동 정산',           detail: '신한EZ보험₩1,450 + ETF기여분₩850(점주100%부담) + Infra₩600', category: '수수료' },
  { tx_id: 'tx_003', type: 'in',  label: '신한카드 매출 입금',           amount: 423000, date: '08.02 18:30', method: '신한카드 가맹점 정산',        detail: '스타벅스 강남2호점 D-1 정산',                                  category: '매출'   },
  { tx_id: 'tx_004', type: 'out', label: '박민준 알바비 정산',           amount: 54000,  date: '08.02 14:00', method: '신한 에스크로 0.1초 즉시',   detail: '스타벅스 강남2호점 홀서빙 4h',                                 category: '인건비' },
  { tx_id: 'tx_005', type: 'out', label: '5% 시너지 수수료',             amount: 2700,   date: '08.02 14:00', method: '신한DS 자동 정산',           detail: '증권ETF ₩850 — 점주 수수료 100% 지원',                        category: '수수료' },
  { tx_id: 'tx_006', type: 'in',  label: '대출 이자 감면 리베이트',       amount: 4250,   date: '08.01 23:59', method: '신한투자증권 자동 적립',      detail: '점주 ETF 적립금 B2B 대출 이자 감면 환원',                     category: '수익'   },
  { tx_id: 'tx_007', type: 'out', label: '김수아 알바비 정산',           amount: 30000,  date: '08.01 13:30', method: '신한 에스크로 0.1초 즉시',   detail: '컴포즈커피 역삼역점 오전 2h',                                  category: '인건비' },
  { tx_id: 'tx_008', type: 'in',  label: '카드매출 입금',                amount: 287000, date: '08.01 18:00', method: '신한카드 가맹점 정산',        detail: 'D-1 정산 (신한카드 가맹점 수수료 0%)',                         category: '매출'   },
  { tx_id: 'tx_009', type: 'out', label: '최현우 알바비 정산(취소환불)', amount: 16000,  date: '07.31 12:05', method: '에스크로 노쇼 즉시환불',      detail: 'CU 강남파이낸스점 노쇼 자동 환불 0.1초',                      category: '환불'   },
  { tx_id: 'tx_010', type: 'in',  label: '노쇼 에스크로 반환',           amount: 16000,  date: '07.31 12:05', method: '신한은행 스마트 계약',        detail: '알바생 노쇼 발생 → 선입금 원금 100% 자동 반환',              category: '환불'   },
];

const FALLBACK_ALBA = [
  { id: 'a1', name: '조이수', age: 24, gender: '남', role: '야간 서빙',   store: '하남돼지집 부평역점', date: '08.02 18:00–22:00', pay: 58000, dgcs: 980, noshow: false },
  { id: 'a2', name: '박민준', age: 22, gender: '남', role: '홀 서빙',     store: '스타벅스 강남2호점',  date: '08.02 14:00–18:00', pay: 54000, dgcs: 920, noshow: false },
  { id: 'a3', name: '김수아', age: 21, gender: '여', role: '음료 조리',   store: '컴포즈커피 역삼역점', date: '08.01 11:30–13:30', pay: 30000, dgcs: 860, noshow: false },
  { id: 'a4', name: '최현우', age: 25, gender: '남', role: '편의점 세팅', store: 'CU 강남파이낸스점',   date: '07.31 12:00–13:00', pay: 16000, dgcs: 640, noshow: true  },
  { id: 'a5', name: '정예은', age: 20, gender: '여', role: '매장 진열',   store: '이마트 역삼점',       date: '07.30 10:00–15:00', pay: 65000, dgcs: 910, noshow: false },
];

// ─── 투자 분배 정책: 증권 ETF는 점주 납부 수수료에서 100% 지원 ─────────────
const INVEST_ALLOC = [
  {
    name: '신한투자증권 KODEX 미국S&P500 ETF',
    pct: 34, amount: 850,
    color: 'from-blue-500 to-indigo-600',
    badge: '점주 100% 지원',
    accum: 42500,
    // ★ 핵심 변경: "점주 수수료에서 100% 지원" 명시
    note: '알바생 ETF 적립금 전액을 점주 납부 5% 수수료에서 지원 — 알바생 추가 부담 0원',
  },
  {
    name: '신한EZ손해보험 마이크로 상해보험',
    pct: 46, amount: 1150,
    color: 'from-emerald-500 to-teal-600',
    badge: '보장중',
    accum: 0,
    note: '알바생 출근 스와이프 시 자동 개시, 점주 배상책임 방어',
  },
  {
    name: '신한라이프 마이크로 퇴직연금',
    pct: 12, amount: 300,
    color: 'from-violet-500 to-purple-600',
    badge: '적립중',
    accum: 18900,
    note: '알바생 1% 마이크로 연금, 점주 노무 리스크 제로화',
  },
  {
    name: '신한DS 7-Core 인프라 운영',
    pct: 8, amount: 200,
    color: 'from-amber-500 to-orange-500',
    badge: '운영비',
    accum: 0,
    note: '4대보험 BATCH·전자계약·AI 에이전트 무중단 서버 유지비',
  },
];

export async function GET(request: NextRequest) {
  const employer_id = request.nextUrl.searchParams.get('employer_id') ?? 'employer-demo';

  try {
    // ── Cloudflare D1 접근 ──
    // dynamic import로 edge 환경 외에서의 import 에러를 방지
    const { getRequestContext } = await import('@cloudflare/next-on-pages');
    const { env } = getRequestContext() as any;

    // 1. 입출금 내역 (transactions 테이블)
    const txResult = await (env.DB as any).prepare(
      `SELECT
         t.tx_id,
         t.total_amount,
         t.bank_status,
         t.created_at,
         g.title      AS gig_title,
         g.status     AS gig_status,
         u.name       AS worker_name,
         u.trust_score AS dgcs
       FROM transactions t
       LEFT JOIN gigs  g ON t.gig_id    = g.id
       LEFT JOIN users u ON t.worker_id = u.id
       ORDER BY t.created_at DESC
       LIMIT 30`
    ).all();

    // 2. 알바 공고 + 워커 내역 (gigs 테이블)
    const gigResult = await (env.DB as any).prepare(
      `SELECT
         g.id, g.title, g.hourly_wage, g.status,
         u.name        AS worker_name,
         u.trust_score AS dgcs,
         t.total_amount
       FROM gigs g
       LEFT JOIN transactions t ON t.gig_id   = g.id
       LEFT JOIN users u        ON t.worker_id = u.id
       WHERE g.employer_id = ? OR g.employer_id IS NULL
       ORDER BY g.id DESC
       LIMIT 20`
    ).bind(employer_id).all();

    // 3. 투자 적립 현황 (gig_revenue_ledger 테이블)
    const ledger = await (env.DB as any).prepare(
      `SELECT
         COALESCE(SUM(invest_sweep_amount),    0) AS total_etf,
         COALESCE(SUM(life_premium_collected), 0) AS total_pension,
         COUNT(*)                                  AS tx_count
       FROM gig_revenue_ledger`
    ).first();

    // ─── D1 결과를 UI 포맷으로 변환 ───
    const transactions = (txResult.results ?? []).length > 0
      ? (txResult.results as any[]).map((row, i) => ({
          tx_id: row.tx_id ?? `d1_tx_${i}`,
          type: 'out',
          label: row.worker_name ? `${row.worker_name} 알바비 정산` : '정산 처리',
          amount: row.total_amount ?? 0,
          date: new Date(row.created_at ?? Date.now()).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          method: row.bank_status === 'PENDING' ? '처리중' : '신한 에스크로 0.1초 즉시',
          detail: `${row.gig_title ?? '알바 긱'} · D-GCS ${row.dgcs ?? '-'}점`,
          category: '인건비',
        }))
      : FALLBACK_TRANSACTIONS;

    const albaList = (gigResult.results ?? []).length > 0
      ? (gigResult.results as any[]).map((row, i) => ({
          id: `d1_${i}`,
          name: row.worker_name ?? '미배정',
          age: 22,
          gender: '-',
          role: row.title ?? '근무',
          store: '스타벅스 강남2호점',
          date: '-',
          pay: row.total_amount ?? row.hourly_wage ?? 0,
          dgcs: row.dgcs ?? 0,
          noshow: row.status === 'CANCELLED',
        }))
      : FALLBACK_ALBA;

    return NextResponse.json({
      source: 'd1',
      dataTimestamp: new Date().toISOString(),
      transactions,
      albaList,
      investAlloc: INVEST_ALLOC,
      kpi: {
        revenue: 710000,
        laborCost: 238000,
        feePaid: 11900,
        netProfit: 460100,
        feeRefund: 4250,
        effectiveFee: 7650,
        etfAccum: Number(ledger?.total_etf ?? 0) || 42500,
        pensionAccum: Number(ledger?.total_pension ?? 0) || 18900,
        feeRebate: 18200,
        netSaved: 43800,
        txCount: Number(ledger?.tx_count ?? 0),
      },
    });

  } catch (_err) {
    // ── D1 미연결(로컬 next dev) → Fallback ──
    console.warn('[employer/dashboard] D1 unavailable, using fallback:', _err);
    return NextResponse.json({
      source: 'fallback',
      dataTimestamp: new Date().toISOString(),
      transactions: FALLBACK_TRANSACTIONS,
      albaList: FALLBACK_ALBA,
      investAlloc: INVEST_ALLOC,
      kpi: {
        revenue: 710000, laborCost: 238000, feePaid: 11900,
        netProfit: 460100, feeRefund: 4250, effectiveFee: 7650,
        etfAccum: 42500, pensionAccum: 18900, feeRebate: 18200, netSaved: 43800, txCount: 0,
      },
    });
  }
}
