'use client';

// app/components/DGCSScreen.tsx
// D-GCS (Dynamic Gig Credit Score) 시각화
// W-Model 4요소 가중치 + 3단계 금융 페널티 + 안티그래비티 리워드

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Banknote, ShieldCheck, Zap, AlertTriangle,
  CheckCircle2, Lock, TrendingDown, TrendingUp, Crown,
  Trophy, ChevronRight, XCircle, Clock, Flame,
} from 'lucide-react';

// ─── 원형 게이지 ───────────────────────────────────────────────────────────

function ScoreGauge({ score, maxScore = 1000 }: { score: number; maxScore?: number }) {
  const pct = score / maxScore;
  const r = 72;
  const circumference = 2 * Math.PI * r;
  // 270도 호 (상단 45° 에서 시작, 시계방향)
  const dashArray = circumference * 0.75;
  const dashOffset = dashArray * (1 - pct);

  const color =
    score >= 900 ? '#6366f1' :
    score >= 800 ? '#22c55e' :
    score >= 600 ? '#f59e0b' : '#ef4444';

  const tier =
    score >= 900 ? { name: 'Anti-Gravity', badge: '🚀', bg: 'from-indigo-600 to-violet-600' } :
    score >= 800 ? { name: 'Platinum',     badge: '💎', bg: 'from-emerald-500 to-teal-600' } :
    score >= 600 ? { name: 'Gold',         badge: '🥇', bg: 'from-amber-500 to-orange-500' } :
                   { name: 'Warning',      badge: '⚠️', bg: 'from-red-500 to-rose-600' };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* 배경 트랙 */}
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 160 160">
          <circle
            cx="80" cy="80" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dashArray} ${circumference}`}
          />
          <motion.circle
            cx="80" cy="80" r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dashArray} ${circumference}`}
            initial={{ strokeDashoffset: dashArray }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{tier.badge}</span>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-4xl font-black text-white mt-1"
            style={{ color }}
          >
            {score}
          </motion.p>
          <p className="text-xs text-white/40 font-semibold">/ {maxScore}</p>
          <p className="text-xs font-black mt-1" style={{ color }}>{tier.name}</p>
        </div>
      </div>
    </div>
  );
}

// ─── W-Model 가중치 카드 ────────────────────────────────────────────────────

const weights = [
  {
    id: 'W1', label: '과거 누적 이행률', pct: 40, score: 352, max: 400,
    icon: Clock, color: '#6366f1', desc: '최근 3개월 매칭 대비 정상 출근 비율',
    detail: '결근 1회당 치명적 감점 적용. 현재 88% 이행 (3개월 35회 중 31회 정상)',
  },
  {
    id: 'W2', label: 'GPS 근접도·반응성', pct: 30, score: 267, max: 300,
    icon: MapPin, color: '#22c55e', desc: '출근 2시간 전 AI 푸시 응답속도 + 30분 전 3km 진입',
    detail: '평균 AI 응답 12초. 출근 28분 전 매장 반경 진입 완료 (평균)',
  },
  {
    id: 'W3', label: '업주 상호 평가', pct: 20, score: 172, max: 200,
    icon: Star, color: '#f59e0b', desc: '태도·시간 준수 등 사장님 정량화 피드백',
    detail: '업무 태도 4.8/5.0 · 시간 준수 4.9/5.0 · 소통 4.7/5.0',
  },
  {
    id: 'W4', label: '금융 연계 성실도', pct: 10, score: 81, max: 100,
    icon: Banknote, color: '#0052FF', desc: '잔돈 스윕 유지율 + CASA 예치 기간',
    detail: '끝전 스윕 유지율 92% · 신한은행 CASA 예치 평균 8.3일',
  },
];

function WeightCard({ w, active, onClick }: { w: typeof weights[0]; active: boolean; onClick: () => void }) {
  const Icon = w.icon;
  const scorePct = w.score / w.max;
  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active ? 'bg-white/15 border-white/30' : 'bg-white/5 border-white/10'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ background: w.color + '25' }}>
            <Icon className="w-4 h-4" style={{ color: w.color }} />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest" style={{ color: w.color }}>{w.id} · {w.pct}%</span>
            <p className="text-xs font-black text-white">{w.label}</p>
          </div>
        </div>
        <p className="text-lg font-black text-white">
          {w.score}<span className="text-xs text-white/30">/{w.max}</span>
        </p>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${scorePct * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: w.color }}
        />
      </div>
      <AnimatePresence>
        {active && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] text-white/50 mt-2 leading-relaxed"
          >
            {w.detail}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── 페널티 레벨 ────────────────────────────────────────────────────────────

const penalties = [
  {
    level: 1, trigger: '800점 미만', threshold: 'D-GCS < 800',
    title: '수익률 하향 조정', icon: TrendingDown,
    color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30',
    badge: 'LEVEL 1',
    items: [
      '향후 2주간 Surge 긱 노출 완전 차단 (기본 단가만 노출)',
      '사장님 대시보드에 "노쇼 주의군" 뱃지 자동 부착',
      '매칭 우선순위 하락 → 매칭 확률 급감',
    ],
    example: '"남들이 비 오는 날 시급 1.5배를 받을 때, 당신은 기본 단가 일자리만 볼 수 있습니다."',
  },
  {
    level: 2, trigger: '600점 미만', threshold: 'D-GCS < 600',
    title: '에스크로 보증금 Lock-in', icon: Lock,
    color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30',
    badge: 'LEVEL 2',
    items: [
      '새 매칭 신청 시 출근 보증금 ₩10,000 선입금 필수',
      '정상 출근 확인 시 즉시 전액 환급',
      '무단 노쇼 시 보증금 → 사장님 위로금 전액 송금',
    ],
    example: '"내 돈 10,000원이 묶여 있는 이상, 출근율은 99.9%로 치솟습니다."',
  },
  {
    level: 3, trigger: '무단 노쇼', threshold: '연락 두절 고의 결근',
    title: '금융 대안신용 블록', icon: XCircle,
    color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30',
    badge: 'LEVEL 3',
    items: [
      '땡겨요 웍스 영구 퇴출 (즉시 적용)',
      '근태 불량 데이터 → 신한카드 ACS 모델에 네거티브 전송',
      '신한카드 단기 대출 한도 삭감 / 마이너스 통장 연장 거절 가능',
    ],
    example: '"알바 하나 펑크냈을 뿐인데, 신한카드 한도가 깎입니다. 이것이 금융사만의 절대 억제력입니다."',
  },
];

function PenaltyCard({ p, active, onClick }: { p: typeof penalties[0]; active: boolean; onClick: () => void }) {
  const Icon = p.icon;
  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active ? `${p.bg} ${p.border}` : 'bg-white/5 border-white/10'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-xl ${active ? p.bg : 'bg-white/10'}`}>
          <Icon className={`w-5 h-5 ${active ? p.color : 'text-white/40'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black tracking-widest ${active ? p.color : 'text-white/30'}`}>
              {p.badge}
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
              active ? `${p.color} ${p.border} ${p.bg}` : 'text-white/30 border-white/10'
            } font-black`}>
              {p.trigger}
            </span>
          </div>
          <p className={`text-sm font-black ${active ? 'text-white' : 'text-white/50'}`}>{p.title}</p>
        </div>
        <ChevronRight className={`w-4 h-4 transition-transform ${active ? `rotate-90 ${p.color}` : 'text-white/20'}`} />
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 mt-2">
              {p.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className={`w-3.5 h-3.5 ${p.color} flex-shrink-0 mt-0.5`} />
                  <p className="text-xs text-white/70 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className={`mt-3 p-3 rounded-xl ${p.bg} border ${p.border}`}>
              <p className={`text-[10px] ${p.color} italic leading-relaxed font-semibold`}>{p.example}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── 안티그래비티 리워드 ───────────────────────────────────────────────────

const rewards = [
  {
    icon: Zap,
    title: 'Gig-Loan 즉시 개설',
    sub: '땡겨요 웍스 전용 비상금',
    value: '₩50만 한도',
    desc: '오늘 밤 10만 원을 당겨 쓰고, 내일 알바로 갚는다. 긱 워커에게 신과 같은 혜택.',
    color: 'from-indigo-500 to-violet-600',
    glow: 'rgba(99,102,241,0.4)',
  },
  {
    icon: Crown,
    title: '하이엔드 매칭 프리패스',
    sub: '최상위 공고 24시간 선행 열람',
    value: '승인 없이 즉시 확정',
    desc: '강남역 스타벅스 주말 꿀알바 — 사장님 승인 없이 프리패스로 매칭 자동 확정.',
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.4)',
  },
  {
    icon: TrendingUp,
    title: 'AI Surge 우선 배정',
    sub: '우천·심야 할증 긱 최우선 노출',
    value: '시급 최대 +50%',
    desc: '탑 프로만 볼 수 있는 할증 긱. 같은 시간 일하고 50% 더 버는 특권.',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.4)',
  },
];

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────

export default function DGCSScreen() {
  const [score, setScore] = useState(872);
  const [activeWeight, setActiveWeight] = useState<string | null>('W1');
  const [activePenalty, setActivePenalty] = useState<number | null>(null);
  const [simulating, setSimulating] = useState(false);

  const simulatePenalty = async (level: number) => {
    setSimulating(true);
    const penalty = level === 1 ? -80 : level === 2 ? -200 : -400;
    setScore(s => Math.max(0, s + penalty));
    await new Promise(r => setTimeout(r, 1000));
    setSimulating(false);
  };

  const resetScore = () => setScore(872);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050514] via-[#0a0a2e] to-[#0d1140] pb-8">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">
            D-GCS · Dynamic Gig Credit Score
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">근태 데이터가 금융 권력이 된다</h2>
        <p className="text-sm text-white/40 mt-1">성실성을 신용으로 계량화하는 신한DS 독점 알고리즘</p>
      </div>

      {/* 점수 게이지 */}
      <div className="px-5 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center space-y-4">
          <ScoreGauge score={score} />

          {/* 점수 조작 버튼 */}
          <div className="w-full space-y-2">
            <p className="text-[10px] text-white/30 text-center uppercase tracking-widest font-bold">페널티 시뮬레이션</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Lv.1 발동', color: 'bg-amber-500/20 border-amber-500/40 text-amber-400', lv: 1 },
                { label: 'Lv.2 발동', color: 'bg-orange-500/20 border-orange-500/40 text-orange-400', lv: 2 },
                { label: 'Lv.3 발동', color: 'bg-red-500/20 border-red-500/40 text-red-400', lv: 3 },
              ].map(b => (
                <button
                  key={b.lv}
                  onClick={() => simulatePenalty(b.lv)}
                  disabled={simulating}
                  className={`py-2 rounded-xl border text-[11px] font-black ${b.color} disabled:opacity-40 active:scale-95 transition-all`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <button
              onClick={resetScore}
              className="w-full py-2 rounded-xl border border-white/10 text-[11px] text-white/40 font-bold hover:bg-white/5 transition-all"
            >
              점수 초기화 (872점)
            </button>
          </div>
        </div>
      </div>

      {/* W-Model 가중치 */}
      <div className="px-5 mb-6">
        <h3 className="text-sm font-black text-white/70 uppercase tracking-widest mb-3">
          W-Model 4요소 가중치
        </h3>
        <div className="space-y-2">
          {weights.map(w => (
            <WeightCard
              key={w.id}
              w={w}
              active={activeWeight === w.id}
              onClick={() => setActiveWeight(activeWeight === w.id ? null : w.id)}
            />
          ))}
        </div>

        {/* AI 노쇼 감지 경고 */}
        <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <MapPin className="w-4 h-4 text-red-400" />
            <span className="text-xs font-black text-red-400">AI 노쇼 감지 로직</span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            GPS 트래킹 기준, 출근 <strong className="text-white/70">1시간 전까지 이동 동선 미파악</strong> 시 노쇼 징후로 판단 →
            점수 임시 차감 + 사장님에게 <strong className="text-white/70">"Plan B 스탠바이"</strong> 즉각 알림 발송.
          </p>
        </div>
      </div>

      {/* 3단계 금융 페널티 */}
      <div className="px-5 mb-6">
        <h3 className="text-sm font-black text-white/70 uppercase tracking-widest mb-1">
          3단계 금융 중력 페널티
        </h3>
        <p className="text-xs text-white/30 mb-3">탭하여 상세 조치 확인 · 위 시뮬레이션 버튼으로 점수 변화 체험</p>
        <div className="space-y-2">
          {penalties.map(p => (
            <PenaltyCard
              key={p.level}
              p={p}
              active={activePenalty === p.level}
              onClick={() => setActivePenalty(activePenalty === p.level ? null : p.level)}
            />
          ))}
        </div>
      </div>

      {/* 안티그래비티 리워드 */}
      <div className="px-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-black text-white/70 uppercase tracking-widest">
            Anti-Gravity 최상위 2% 리워드
          </h3>
        </div>
        <p className="text-xs text-white/30 mb-4">출근율 98% 이상 · D-GCS 900점 이상 달성 시 자동 부여</p>

        <div className="space-y-3">
          {rewards.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl overflow-hidden"
                style={{ boxShadow: `0 4px 30px ${r.glow}` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${r.color} opacity-10`} />
                <div className="relative border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${r.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 font-bold">{r.sub}</p>
                        <h4 className="font-black text-white text-sm">{r.title}</h4>
                      </div>
                    </div>
                    <span className={`text-sm font-black bg-gradient-to-r ${r.color} bg-clip-text text-transparent`}>
                      {r.value}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 요약 CTA */}
        <div className="mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-5 text-center space-y-2">
          <Flame className="w-8 h-8 text-white mx-auto" />
          <h4 className="font-black text-white text-lg leading-tight">
            "경쟁사는 배지를 팔고,<br />신한은 금융 인프라를 심는다."
          </h4>
          <p className="text-xs text-white/70">
            D-GCS는 플랫폼 종속이 아닌 금융 생태계 진입의 열쇠입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
