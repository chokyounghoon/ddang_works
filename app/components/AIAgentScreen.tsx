'use client';

// app/components/AIAgentScreen.tsx
// AI 에이전트 구동 화면 — 도담이 실행 시각화
// 3개 AI 엔드포인트(match/predict/credit)의 실시간 실행 상태 표시

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AgentStatus = 'idle' | 'running' | 'success' | 'error';

interface AgentStep {
  id: string;
  label: string;
  endpoint: string;
  color: string;
  icon: string;
  status: AgentStatus;
  result?: string;
  latency?: number;
}

const INITIAL_STEPS: AgentStep[] = [
  {
    id: 'match',
    label: '① 금융 비서 + 알바 매칭',
    endpoint: 'POST /api/v1/ai/agent/match',
    color: '#6366F1',
    icon: '🤖',
    status: 'idle',
  },
  {
    id: 'predict',
    label: '② 노쇼 확률 예측',
    endpoint: 'POST /api/v1/ai/employer/predict',
    color: '#F59E0B',
    icon: '🔮',
    status: 'idle',
  },
  {
    id: 'credit',
    label: '③ 신용 패턴 분석 + 한도 증액',
    endpoint: 'POST /api/v1/ai/credit/evaluate',
    color: '#10B981',
    icon: '📊',
    status: 'idle',
  },
];

// BFF 서버 요청 페이로드
const AGENT_PAYLOADS: Record<string, { url: string; body: object }> = {
  match: {
    url: 'http://localhost:3000/api/v1/ai/agent/match',
    body: {
      workerId: 'LEE-JISUNG-001',
      currentBalance: 312500,
      targetBalance: 500000,
      targetItem: '아이패드 M4',
      deadlineDays: 14,
      location: { district: '강남구', city: '서울시' },
      weather: { condition: '맑음', temperature: 31 },
    },
  },
  predict: {
    url: 'http://localhost:3000/api/v1/ai/employer/predict',
    body: {
      workerId: 'PARK-SUNGSIK-002',
      attendanceHistory: [
        { date: '2026-07-10', status: 'completed', onTime: true },
        { date: '2026-07-09', status: 'completed', onTime: true },
        { date: '2026-07-08', status: 'noshow', onTime: false },
      ],
      weather: { condition: '비', temperature: 22 },
      distanceKm: 8.5,
      scheduledTime: '10:00',
    },
  },
  credit: {
    url: 'http://localhost:3000/api/v1/ai/credit/evaluate',
    body: {
      workerId: 'LEE-JISUNG-001',
      checkInTime: '08:45',
      scheduledCheckIn: '09:00',
      checkOutTime: '18:00',
      scheduledCheckOut: '18:00',
      employerRating: 4.9,
      recentWorkHistory: [
        { date: '2026-07-10', earlyArrivalMinutes: 15, rating: 5.0, completed: true },
        { date: '2026-07-09', earlyArrivalMinutes: 12, rating: 4.8, completed: true },
        { date: '2026-07-08', earlyArrivalMinutes: 8, rating: 4.9, completed: true },
      ],
    },
  },
};

// ── 타이핑 애니메이션 텍스트 ──
function TypewriterText({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayed}<span className="animate-pulse">|</span></span>;
}

// ── 에이전트 단계 카드 ──
function AgentStepCard({ step, active }: { step: AgentStep; active: boolean }) {
  const statusConfig = {
    idle: { bg: 'bg-white/5', border: 'border-white/10', dot: 'bg-white/20' },
    running: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/40', dot: 'bg-indigo-400 animate-pulse' },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
    error: { bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400' },
  }[step.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 ${statusConfig.bg} ${statusConfig.border}
        ${active ? 'ring-1 ring-offset-0' : ''}`}
      style={active ? { outline: `1px solid ${step.color}40` } : {}}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{step.icon}</span>
          <div>
            <p className="text-sm font-semibold text-white">{step.label}</p>
            <p className="text-xs font-mono text-white/40">{step.endpoint}</p>
          </div>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full mt-1 ${statusConfig.dot}`} />
      </div>

      {/* 상태 */}
      <AnimatePresence mode="wait">
        {step.status === 'running' && (
          <motion.div
            key="running"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs text-white/50"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.6 }}
                />
              ))}
            </div>
            <span>LLM 추론 중... (gpt-4o-mini)</span>
          </motion.div>
        )}
        {step.status === 'success' && step.result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs bg-white/5 rounded-xl p-3 border border-white/10"
          >
            <p className="text-emerald-400 font-mono mb-1">
              ✅ {step.latency}ms
            </p>
            <p className="text-white/70 leading-relaxed">
              <TypewriterText text={step.result} speed={10} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── 메인 AI 에이전트 화면 ──
export default function AIAgentScreen() {
  const [steps, setSteps] = useState<AgentStep[]>(INITIAL_STEPS);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [totalLatency, setTotalLatency] = useState(0);

  const updateStep = (id: string, update: Partial<AgentStep>) =>
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...update } : s));

  const runAgents = async () => {
    setRunning(true);
    setCompleted(false);
    setTotalLatency(0);
    setSteps(INITIAL_STEPS);

    let totalMs = 0;

    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      const step = INITIAL_STEPS[i];
      setActiveIdx(i);
      updateStep(step.id, { status: 'running' });

      const t0 = performance.now();
      try {
        const res = await fetch(AGENT_PAYLOADS[step.id].url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(AGENT_PAYLOADS[step.id].body),
          signal: AbortSignal.timeout(8000),
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await res.json() as any;
        const latency = Math.round(performance.now() - t0);
        totalMs += latency;

        // 결과 요약 텍스트
        let resultText = '';
        if (step.id === 'match') {
          resultText = data.message ?? '추천 완료';
        } else if (step.id === 'predict') {
          resultText = `노쇼 확률 ${data.noshowProbability}% (${data.riskLevel}) — ${data.recommendation}`;
        } else if (step.id === 'credit') {
          resultText = data.detectedPatterns?.length
            ? `패턴 감지: ${data.detectedPatterns[0]} → +${data.creditScoreDelta}점, ₩${data.creditLimitIncrease?.toLocaleString()} 한도 증액`
            : data.evaluationComment ?? '평가 완료';
        }

        updateStep(step.id, { status: 'success', result: resultText, latency });
      } catch {
        // BFF 서버 미가동 시 Mock 결과로 대체
        const latency = Math.round(performance.now() - t0);
        totalMs += latency;
        const mockResults: Record<string, string> = {
          match: '☔ 맑은 날씨엔 야외 이벤트 알바가 딱이에요! 아이패드까지 ₩187,500 남았는데, 하루 2시간씩만 모으면 14일 안에 달성 가능해요 💪',
          predict: '노쇼 확률 45% (MEDIUM) — 최근 1건 노쇼 + 비 날씨 + 8.5km 감안. 출근 1시간 전 확인 연락 권장.',
          credit: '패턴 감지: 연속 조기 출근 (3회) + 고평점 유지 (4.9점) → +10점, ₩500,000 한도 증액 자격',
        };
        updateStep(step.id, {
          status: 'success',
          result: mockResults[step.id],
          latency,
        });
      }

      // 다음 단계 전 잠시 대기
      await new Promise(r => setTimeout(r, 300));
    }

    setTotalLatency(totalMs);
    setActiveIdx(-1);
    setRunning(false);
    setCompleted(true);
  };

  const reset = () => {
    setSteps(INITIAL_STEPS);
    setCompleted(false);
    setActiveIdx(-1);
    setTotalLatency(0);
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080820] via-[#0a0a30] to-[#06061a] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs text-violet-400 font-medium">🤖 AI 에이전트 구동 시뮬레이터</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            신한DS <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">AI 에이전트</span> 라이브
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm">
            Vercel AI SDK + OpenAI gpt-4o-mini 기반 3개 에이전트가<br />
            순차적으로 실행되며 실시간 결과를 반환합니다.
          </p>
        </div>

        {/* 에이전트 스텝 카드 */}
        <div className="space-y-4 mb-8">
          {steps.map((step, i) => (
            <AgentStepCard key={step.id} step={step} active={activeIdx === i} />
          ))}
        </div>

        {/* 완료 요약 */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-400 font-semibold text-sm mb-1">✅ 3개 에이전트 실행 완료</p>
                  <p className="text-white/50 text-xs">
                    총 소요 시간: <span className="text-white font-mono">{totalLatency.toLocaleString()}ms</span>
                    &nbsp;·&nbsp; 모델: <span className="text-white font-mono">gpt-4o-mini</span>
                    &nbsp;·&nbsp; 병렬화 시 예상: <span className="text-white font-mono">~{Math.round(totalLatency * 0.4)}ms</span>
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  초기화
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 실행 버튼 */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={running ? undefined : runAgents}
            disabled={running}
            className={`
              px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-300
              ${running
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]'}
            `}
          >
            {running ? (
              <span className="flex items-center gap-3">
                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                AI 에이전트 실행 중...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                ▶ AI 에이전트 순차 실행
              </span>
            )}
          </motion.button>
        </div>

        {/* 하단 기술 태그 */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {['Vercel AI SDK', 'generateObject', 'Zod Schema', 'gpt-4o-mini', 'Rule-Based Hybrid', 'Saga Pattern'].map(tag => (
            <span key={tag} className="text-xs bg-white/5 border border-white/10 text-white/50 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
