// app/api/v1/ai/employer/predict/route.ts
// 점주 전용 AI 노쇼 확률 예측 — D1 ai_agent_sessions 테이블에 결과 영구 기록

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// ─── 시그널 가중치 상수 ──────────────────────────────────────────────────────
const SIGNAL_WEIGHTS = {
  DGCS_WEIGHT:      0.40,  // D-GCS 신용점수
  DISTANCE_WEIGHT:  0.20,  // 거리 (가까울수록 높은 점수)
  WEATHER_PENALTY:  0.15,  // 우천 시 노쇼 위험 가중
  HISTORY_WEIGHT:   0.25,  // 최근 노쇼/지각 이력
} as const;

interface Applicant {
  id: string;
  dgcs?: number;         // D-GCS 점수 (0–1000)
  distanceM?: number;    // 거리(m)
  recentNoshow?: number; // 최근 3개월 노쇼 횟수
}

function predictNoshow(worker: Applicant, weather: string): {
  probability: number;
  status: string;
  type: 'excellent' | 'good' | 'warning' | 'risk';
  analysisText: string;
} {
  const dgcs      = worker.dgcs      ?? 700;
  const distanceM = worker.distanceM ?? 1000;
  const noshow    = worker.recentNoshow ?? 0;
  const isRainy   = weather === 'Rainy' || weather === '비';

  // 1. D-GCS → 기여 점수 (1000점 = 1.0, 500점 = 0.5)
  const dgcsScore = (dgcs / 1000) * SIGNAL_WEIGHTS.DGCS_WEIGHT;

  // 2. 거리 → 가까울수록 높은 점수 (500m 이하 = full, 5km 이상 = 0)
  const distScore = Math.max(0, 1 - distanceM / 5000) * SIGNAL_WEIGHTS.DISTANCE_WEIGHT;

  // 3. 우천 패널티
  const weatherPenalty = isRainy ? SIGNAL_WEIGHTS.WEATHER_PENALTY * 0.5 : 0;

  // 4. 노쇼 이력 패널티
  const historyScore = Math.max(0, 1 - noshow * 0.3) * SIGNAL_WEIGHTS.HISTORY_WEIGHT;

  // 출근 확률 (0~1)
  const attendProb = Math.min(1, Math.max(0,
    dgcsScore + distScore - weatherPenalty + historyScore
  ));

  // 노쇼 확률 %
  const noshowPct = Math.round((1 - attendProb) * 100);
  const attendPct = 100 - noshowPct;

  let type: 'excellent' | 'good' | 'warning' | 'risk';
  let status: string;
  if (noshowPct <= 5)       { type = 'excellent'; status = `출근 확률 ${attendPct}% (최우수)`; }
  else if (noshowPct <= 20) { type = 'good';      status = `출근 확률 ${attendPct}% (양호)`;   }
  else if (noshowPct <= 45) { type = 'warning';   status = `노쇼 주의 ${noshowPct}%`;          }
  else                      { type = 'risk';      status = `노쇼 위험 ${noshowPct}% (요주의)`;  }

  const weatherNote = isRainy ? ` 우천 날씨 감안 노쇼 확률 +${Math.round(SIGNAL_WEIGHTS.WEATHER_PENALTY * 50)}%p 상승.` : '';
  const noshowNote  = noshow > 0 ? ` 최근 노쇼 ${noshow}건 이력 감지.` : ' 최근 노쇼 이력 없음.';
  const distNote    = distanceM < 800 ? ` 매장까지 ${distanceM}m — 도보 접근 가능.` : ` 매장까지 ${distanceM}m — 이동 경로 확인 권장.`;

  const analysisText = `D-GCS ${dgcs}점 신용 평가.${noshowNote}${distNote}${weatherNote} 종합 노쇼 확률 ${noshowPct}%.`;

  return { probability: attendPct, status, type, analysisText };
}

export async function POST(request: NextRequest) {
  const startMs = Date.now();

  try {
    const body = (await request.json()) as {
      applicants: Applicant[];
      weather?: string;
      employer_id?: string;
    };
    const { applicants = [], weather = 'Clear', employer_id = 'employer-demo' } = body;

    if (!Array.isArray(applicants) || applicants.length === 0) {
      return NextResponse.json({ success: false, error: 'applicants array is required' }, { status: 400 });
    }

    // ─── 1. AI 확률 계산 ──────────────────────────────────────────────────
    const predictions = applicants.map(worker => ({
      id: worker.id,
      ...predictNoshow(worker, weather),
    }));

    const latencyMs = Date.now() - startMs;

    // ─── 2. Cloudflare D1에 AI 세션 영구 기록 ────────────────────────────
    try {
      const { getRequestContext } = await import('@cloudflare/next-on-pages');
      const { env } = getRequestContext() as any;

      const sessionId = `predict_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const inputPayload  = JSON.stringify({ applicants, weather, employer_id });
      const outputPayload = JSON.stringify(predictions);

      await (env.DB as any).prepare(
        `INSERT INTO ai_agent_sessions
           (session_id, worker_id, agent_type, input_payload, output_payload, latency_ms, model_used)
         VALUES (?, ?, 'noshow_predict', ?, ?, ?, 'rule-engine-v2')`
      ).bind(
        sessionId,
        employer_id,
        inputPayload,
        outputPayload,
        latencyMs,
      ).run();

      console.info(`[predict] session saved → ${sessionId} (${latencyMs}ms)`);
    } catch (d1Err) {
      // D1 미연결(로컬 개발)은 조용히 무시
      console.warn('[predict] D1 session save skipped:', d1Err);
    }

    // ─── 3. 응답 ─────────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      latencyMs,
      engine: 'Cloudflare-D1-RuleEngine-v2',
      data: { predictions },
    });

  } catch (error: any) {
    console.error('[predict] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
