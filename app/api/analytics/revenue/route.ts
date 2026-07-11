import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// ─────────────────────────────────────────────────────────────────
// GET /api/analytics/revenue
// 실시간 수익 집계 API — 신한 4개 계열사 + DS 재무 지표 반환
//
// 반환 구조:
//   - 전체 누적 트랜잭션 수 / 총 급여액
//   - 계열사별 수익 항목 (재무적 이득 수치 포함)
//   - 연간 추정 수익 (현재 속도 기반 extrapolation)
//   - 최근 5건 트랜잭션 내역
// ─────────────────────────────────────────────────────────────────

// 연간 수익 추정 상수 (현재 일일 거래량 기준 외삽)
const ANNUAL_MULTIPLIER = 365;
const WORKER_SCALE = 100000; // 10만 긱 워커 가정

// Mock 데이터 (D1 미연결 시 데모용)
function buildMockRevenue() {
  const baseTx = Math.floor(Math.random() * 50) + 150; // 150~200 누적 트랜잭션

  return {
    summary: {
      totalTransactions: baseTx,
      totalGrossPay: baseTx * 48500,
      totalNetDeposit: baseTx * 47850,
      lastUpdated: new Date().toISOString(),
    },
    subsidiaries: {
      bank: {
        name: '신한은행',
        color: '#003087',
        metrics: {
          casaInflow: baseTx * 47850,
          cacSaved: baseTx * 15000,
          pgFeeSaved: Math.round(baseTx * 48500 * 0.03),
          description: 'PG 수수료 0원 + CAC 절감',
        },
        revenuePerTx: Math.round(48500 * 0.03),  // ₩1,455
        annualProjection: Math.round(48500 * 0.03 * 12 * WORKER_SCALE),
      },
      card: {
        name: '신한카드',
        color: '#FF0000',
        metrics: {
          acsDataValue: baseTx * 2.7,
          loanLimitIssued: baseTx * 500000,
          thinFilersCaptured: baseTx,
          description: 'ACS 데이터 수익 + Thin-Filer 여신',
        },
        revenuePerTx: 2.7,
        annualProjection: Math.round(2.7 * 12 * WORKER_SCALE),
      },
      life: {
        name: '신한라이프',
        color: '#00A650',
        metrics: {
          premiumCollected: baseTx * 302,
          policyCount: baseTx,
          avgPremiumPerSession: 302,
          description: '온디맨드 상해보험 직납 (설계사비 0)',
        },
        revenuePerTx: 302,
        annualProjection: Math.round(302 * 12 * WORKER_SCALE),
      },
      invest: {
        name: '신한투자증권',
        color: '#FF6B00',
        metrics: {
          sweepTotal: baseTx * 850,
          rpProfit: parseFloat((baseTx * (48500 * 0.035 / 365)).toFixed(0)),
          aumIncrease: baseTx * 850,
          description: '끝전 자동투자 + 에스크로 RP 운용',
        },
        revenuePerTx: parseFloat((48500 * 0.035 / 365 + 0.3).toFixed(2)),
        annualProjection: Math.round((302 + 850 * 0.003) * 12 * WORKER_SCALE),
      },
      ds: {
        name: '신한DS',
        color: '#6366F1',
        metrics: {
          baasFeeTotal: baseTx * 200,
          apiCallsTotal: baseTx * 4,
          feePerCall: 50,
          description: 'BaaS API 게이트웨이 수수료 (₩50/call)',
        },
        revenuePerTx: 200,
        annualProjection: Math.round(200 * 12 * WORKER_SCALE),
      },
    },
    competitive: {
      pgCostCompetitor: '3% (₩1,455/건)',
      pgCostShinhan: '0% (₩0/건)',
      annualSavings: Math.round(48500 * 0.03 * 12 * WORKER_SCALE),
      marketShareCapture: `${baseTx > 180 ? '32' : '28'}%`,
    },
    recentTransactions: Array.from({ length: 5 }, (_, i) => ({
      txId: `TXN-${(Math.random() * 0xFFFFFF | 0).toString(16).toUpperCase().padStart(6, '0')}`,
      userId: `WORKER-${1000 + i}`,
      grossPay: 48000 + (i * 500),
      lifePremium: 302,
      investSweep: 850,
      netDeposit: 47850 + (i * 500),
      dsBaasFee: 200,
      createdAt: new Date(Date.now() - i * 1000 * 60 * 3).toISOString(),
    })),
    mode: 'MOCK',
  };
}

export async function GET(_req: NextRequest) {
  try {
    const context = getRequestContext();
    const db = context?.env?.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json(buildMockRevenue(), {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    // ── D1 실제 쿼리 ──
    const [summary, subsidiaryData, recent] = await Promise.all([
      // 전체 요약
      db.prepare(`
        SELECT
          COUNT(*)                        AS total_transactions,
          COALESCE(SUM(gross_pay), 0)     AS total_gross_pay,
          COALESCE(SUM(net_deposit), 0)   AS total_net_deposit,
          COALESCE(SUM(bank_pg_fee_saved), 0) AS total_pg_saved,
          COALESCE(SUM(bank_cac_saved), 0) AS total_cac_saved,
          COALESCE(SUM(life_premium_collected), 0) AS total_life_premium,
          COALESCE(SUM(card_acs_data_value), 0) AS total_acs_value,
          COALESCE(SUM(invest_sweep_amount), 0) AS total_sweep,
          COALESCE(SUM(invest_rp_profit), 0) AS total_rp_profit,
          COALESCE(SUM(ds_baas_fee), 0)   AS total_ds_fee,
          COALESCE(SUM(ds_api_call_count), 0) AS total_api_calls
        FROM gig_revenue_ledger
      `).first(),

      // 계열사별 집계
      db.prepare(`
        SELECT
          COUNT(*) AS tx_count,
          AVG(gross_pay) AS avg_gross,
          SUM(life_premium_collected) AS life_total,
          SUM(ds_baas_fee) AS ds_total,
          SUM(invest_sweep_amount) AS invest_total,
          SUM(bank_pg_fee_saved) AS bank_pg_total
        FROM gig_revenue_ledger
      `).first(),

      // 최근 5건
      db.prepare(`
        SELECT tx_id, user_id, gross_pay, life_premium_collected,
               invest_sweep_amount, net_deposit, ds_baas_fee, created_at
        FROM gig_revenue_ledger
        ORDER BY created_at DESC
        LIMIT 5
      `).all(),
    ]);

    const s = summary as any;
    const sub = subsidiaryData as any;
    const txCount = Number(s?.total_transactions ?? 0);
    const avgGross = Number(sub?.avg_gross ?? 48500);

    return NextResponse.json({
      summary: {
        totalTransactions: txCount,
        totalGrossPay: Number(s?.total_gross_pay ?? 0),
        totalNetDeposit: Number(s?.total_net_deposit ?? 0),
        lastUpdated: new Date().toISOString(),
      },
      subsidiaries: {
        bank: {
          name: '신한은행', color: '#003087',
          metrics: {
            casaInflow: Number(s?.total_net_deposit ?? 0),
            cacSaved: Number(s?.total_cac_saved ?? 0),
            pgFeeSaved: Number(s?.total_pg_saved ?? 0),
            description: 'PG 수수료 0원 + CAC 절감',
          },
          revenuePerTx: Math.round(avgGross * 0.03),
          annualProjection: Math.round(avgGross * 0.03 * 12 * WORKER_SCALE),
        },
        card: {
          name: '신한카드', color: '#FF0000',
          metrics: {
            acsDataValue: Number(s?.total_acs_value ?? 0),
            loanLimitIssued: txCount * 500000,
            thinFilersCaptured: txCount,
            description: 'ACS 데이터 수익 + Thin-Filer 여신',
          },
          revenuePerTx: 2.7,
          annualProjection: Math.round(2.7 * 12 * WORKER_SCALE),
        },
        life: {
          name: '신한라이프', color: '#00A650',
          metrics: {
            premiumCollected: Number(s?.total_life_premium ?? 0),
            policyCount: txCount,
            avgPremiumPerSession: 302,
            description: '온디맨드 상해보험 직납',
          },
          revenuePerTx: 302,
          annualProjection: Math.round(302 * 12 * WORKER_SCALE),
        },
        invest: {
          name: '신한투자증권', color: '#FF6B00',
          metrics: {
            sweepTotal: Number(s?.total_sweep ?? 0),
            rpProfit: Number((s?.total_rp_profit ?? 0).toFixed(0)),
            aumIncrease: Number(s?.total_sweep ?? 0),
            description: '끝전 자동투자 + RP 운용',
          },
          revenuePerTx: parseFloat((avgGross * 0.035 / 365 + 0.3).toFixed(2)),
          annualProjection: Math.round(302 * 12 * WORKER_SCALE),
        },
        ds: {
          name: '신한DS', color: '#6366F1',
          metrics: {
            baasFeeTotal: Number(s?.total_ds_fee ?? 0),
            apiCallsTotal: Number(s?.total_api_calls ?? 0),
            feePerCall: 50,
            description: 'BaaS API 게이트웨이 수수료',
          },
          revenuePerTx: 200,
          annualProjection: Math.round(200 * 12 * WORKER_SCALE),
        },
      },
      competitive: {
        pgCostCompetitor: '3% (₩1,455/건)',
        pgCostShinhan: '0% (₩0/건)',
        annualSavings: Math.round(avgGross * 0.03 * 12 * WORKER_SCALE),
        marketShareCapture: `${txCount > 100 ? '32' : '28'}%`,
      },
      recentTransactions: (recent.results as any[]).map(r => ({
        txId: r.tx_id,
        userId: r.user_id,
        grossPay: r.gross_pay,
        lifePremium: r.life_premium_collected,
        investSweep: r.invest_sweep_amount,
        netDeposit: r.net_deposit,
        dsBaasFee: r.ds_baas_fee,
        createdAt: r.created_at,
      })),
      mode: 'D1',
    }, { headers: { 'Cache-Control': 'no-store' } });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
