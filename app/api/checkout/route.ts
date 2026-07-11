import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

interface Env {
  DB: D1Database;
}

export async function POST(request: NextRequest) {
  try {
    const idempotencyKey = request.headers.get('Idempotency-Key');
    if (!idempotencyKey) {
      return NextResponse.json({ error: 'Idempotency-Key 헤더가 누락되었습니다.' }, { status: 400 });
    }

    const body = (await request.json()) as {
      userId: string;
      storeId: string;
      hoursWorked: number;
      hourlyWage: number;
    };
    const { userId, storeId, hoursWorked, hourlyWage } = body;

    if (!userId || !storeId || !hoursWorked || !hourlyWage) {
      return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const context = getRequestContext();
    const db = (context?.env as unknown as Env)?.DB;

    // ── 멱등성 체크 ──
    if (db) {
      const existing = await db
        .prepare(`SELECT response_body FROM idempotency_keys WHERE idempotency_key = ?`)
        .bind(idempotencyKey)
        .first<{ response_body: string }>();
      if (existing) {
        return new NextResponse(existing.response_body, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      console.warn('⚠️ D1 DB 미연결 — Mock 모드 실행');
    }

    // ─────────────────────────────────────────────────────────────────
    // 수익 계산 엔진 (5개 계열사)
    // ─────────────────────────────────────────────────────────────────
    const grossPay      = hoursWorked * hourlyWage;

    // 1. 신한은행
    const bankPgFeeSaved = Math.round(grossPay * 0.03);  // 경쟁사 PG 수수료 3% 절감
    const bankCacSaved   = 15000;                         // CAC 제로 (타행 고객 유입 가치)
    const bankRpProfit   = parseFloat((grossPay * 0.035 / 365).toFixed(2)); // 에스크로 RP 일일

    // 2. 신한카드
    const cardAcsValue   = 2.7;                           // ACS 신용 데이터 수익화
    const cardCreditUp   = 5;
    const cardLoanLimit  = 500000;

    // 3. 신한라이프
    const lifePremium    = hoursWorked * 75;              // ₩75/시간 (₩300/4h)

    // 4. 신한투자증권
    const remainder      = grossPay % 1000;
    const investSweep    = remainder > 0 ? 1000 - remainder : 500;
    const investAum      = investSweep;

    // 5. 신한DS
    const dsBaasFee      = 200;                           // ₩50 × 4 API calls
    const dsApiCalls     = 4;

    // 실수령액
    const netDeposit     = grossPay - lifePremium;        // 보험료 차감

    // 증권 30% 확률 지연 (Graceful Degradation)
    const isInvestDelayed = Math.random() < 0.3;
    const investStatus    = isInvestDelayed ? 'PENDING' : 'COMPLETED';

    const txId = `TXN-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;

    // ─────────────────────────────────────────────────────────────────
    // 응답 페이로드
    // ─────────────────────────────────────────────────────────────────
    const responsePayload = {
      success: true,
      txId,
      timestamp: new Date().toISOString(),
      financialImpact: {
        grossPay,
        netDeposit,
        breakdown: {
          bank: {
            title: '신한은행',
            color: '#003087',
            value: `₩${netDeposit.toLocaleString()} 즉시 이체`,
            revenuePerTx: bankPgFeeSaved,
            metrics: {
              pgFeeSaved: bankPgFeeSaved,
              cacSaved: bankCacSaved,
              rpProfit: bankRpProfit,
            },
            description: `PG 수수료 ₩${bankPgFeeSaved.toLocaleString()} 절감 (3% → 0%)`,
          },
          card: {
            title: '신한카드',
            color: '#FF0000',
            value: `ACS +${cardCreditUp}점 업데이트`,
            revenuePerTx: cardAcsValue,
            metrics: {
              acsDataValue: cardAcsValue,
              creditUp: cardCreditUp,
              loanLimit: cardLoanLimit,
            },
            description: `Thin-Filer 대안신용 데이터 ₩${cardAcsValue}/건 수익화`,
          },
          life: {
            title: '신한라이프',
            color: '#00A650',
            value: `상해보험료 ₩${lifePremium.toLocaleString()} 직납`,
            revenuePerTx: lifePremium,
            metrics: {
              premium: lifePremium,
              ratePerHour: 75,
              commissionSaved: 0,
            },
            description: `설계사 수수료 0원, 전액 직납 수익`,
          },
          invest: {
            title: '신한투자증권',
            color: '#FF6B00',
            value: isInvestDelayed
              ? '시스템 지연 — 3초 후 자동 재시도'
              : `끝전 ₩${investSweep.toLocaleString()} ETF 자동 매수`,
            revenuePerTx: Math.round(investSweep * 0.003),
            metrics: {
              sweepAmount: investSweep,
              aumIncrease: investAum,
              managementFee: parseFloat((investSweep * 0.003 / 12).toFixed(2)),
            },
            status: investStatus,
            description: `AUM ₩${investAum.toLocaleString()} 증가, 운용보수 0.3%`,
          },
          ds: {
            title: '신한DS',
            color: '#6366F1',
            value: `BaaS API ${dsApiCalls}회 호출 → ₩${dsBaasFee} 과금`,
            revenuePerTx: dsBaasFee,
            metrics: {
              baasFee: dsBaasFee,
              apiCalls: dsApiCalls,
              feePerCall: 50,
            },
            description: `BFF API Gateway 수수료 수입 (₩50/call)`,
          },
        },
      },
      oneShinhaSynergy: {
        totalRevenuePerTx: bankPgFeeSaved + lifePremium + Math.round(cardAcsValue) + dsBaasFee,
        annualProjection100k: (bankPgFeeSaved + lifePremium + dsBaasFee) * 12 * 100000,
        mauEffect: '알바 매일 → 슈퍼SOL DAU 전환 (트래픽 엔진)',
      },
    };

    const responseBodyString = JSON.stringify(responsePayload);

    // ── D1 Batch 원자적 커밋 ──
    if (db) {
      const statements: D1PreparedStatement[] = [
        db.prepare(`
          INSERT INTO gig_revenue_ledger (
            tx_id, user_id, store_id, gross_pay, net_deposit,
            bank_casa_inflow, bank_cac_saved, bank_pg_fee_saved,
            card_credit_score_up, card_loan_limit_up, card_acs_data_value,
            invest_sweep_amount, invest_rp_profit, invest_aum_increase,
            life_premium_collected,
            ds_baas_fee, ds_api_call_count,
            invest_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          txId, userId, storeId, grossPay, netDeposit,
          netDeposit, bankCacSaved, bankPgFeeSaved,
          cardCreditUp, cardLoanLimit, cardAcsValue,
          investSweep, bankRpProfit, investAum,
          lifePremium,
          dsBaasFee, dsApiCalls,
          investStatus
        ),
        db.prepare(`
          INSERT INTO idempotency_keys (idempotency_key, response_body) VALUES (?, ?)
        `).bind(idempotencyKey, responseBodyString),
      ];

      if (isInvestDelayed) {
        statements.push(
          db.prepare(`
            INSERT INTO outbox_events (event_id, aggregate_type, aggregate_id, payload, status)
            VALUES (?, ?, ?, ?, ?)
          `).bind(
            `EVT-${crypto.randomUUID()}`,
            'INVESTMENT',
            txId,
            JSON.stringify({ investSweep, userId }),
            'PENDING'
          )
        );
      }

      await db.batch(statements);
      console.log(`[D1] ✅ 원장 기록 완료: ${txId}`);
    } else {
      console.log(`[Mock] 트랜잭션 시뮬레이션: ${txId}`);
    }

    return new NextResponse(responseBodyString, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
