'use client';

// app/components/DGCSScreen.tsx
// 땡겨요 WORKS D-GCS (Dynamic Gig Credit Score) & 안전·보험 투명성 대시보드
// 땡겨요 공식 시그니처 레드(#FB521C) + 신한 딥 네이비(#0F172A) + 클린 라이트(#F8FAFC) 테마

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Banknote, ShieldCheck, Zap, AlertTriangle,
  Lock, TrendingDown, TrendingUp, Crown,
  Trophy, ChevronRight, XCircle, Clock, Flame, Info, CheckCircle
} from 'lucide-react';

// ─── 원형 게이지 (땡겨요 라이프스타일 스타일) ───────────────────────────────────

function ScoreGauge({ score, maxScore = 1000 }: { score: number; maxScore?: number }) {
  const pct = score / maxScore;
  const r = 72;
  const circumference = 2 * Math.PI * r;
  const dashArray = circumference * 0.75;
  const dashOffset = dashArray * (1 - pct);

  const color =
    score >= 900 ? '#FB521C' :
    score >= 800 ? '#0046FF' :
    score >= 600 ? '#F59E0B' : '#EF4444';

  const tier =
    score >= 900 ? { name: 'Ddangyo VIP',  badge: '👑', color: 'text-[#FB521C]', bg: 'bg-orange-50 text-[#FB521C] border-orange-200' } :
    score >= 800 ? { name: 'Platinum Sol', badge: '💎', color: 'text-blue-600',  bg: 'bg-blue-50 text-blue-700 border-blue-200' } :
    score >= 600 ? { name: 'Gold Prime',   badge: '🥇', color: 'text-amber-600', bg: 'bg-amber-50 text-amber-700 border-amber-200' } :
                   { name: '주의 경고군',   badge: '⚠️', color: 'text-rose-600',  bg: 'bg-rose-50 text-rose-700 border-rose-200' };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        {/* 배경 트랙 */}
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 160 160">
          <circle
            cx="80" cy="80" r={r}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dashArray} ${circumference}`}
          />
          <motion.circle
            cx="80" cy="80" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dashArray} ${circumference}`}
            initial={{ strokeDashoffset: dashArray }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{tier.badge}</span>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-3xl font-black text-slate-900 mt-0.5 tracking-tight"
          >
            {score}
          </motion.p>
          <p className="text-[11px] text-slate-400 font-semibold">/ {maxScore}점</p>
          <span className={`text-[10px] font-black mt-1 px-2 py-0.5 rounded-full border ${tier.bg}`}>
            {tier.name}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── W-Model 가중치 카드 ────────────────────────────────────────────────────

const weights = [
  {
    id: 'W1', label: '과거 누적 이행률', pct: 40, score: 352, max: 400,
    icon: Clock, color: '#FB521C', desc: '최근 3개월 매칭 대비 정상 출근 비율',
    detail: '결근 1회당 치명적 감점 적용. 현재 88% 이행 (3개월 35회 중 31회 정상)',
  },
  {
    id: 'W2', label: 'GPS 근접도·반응성', pct: 30, score: 267, max: 300,
    icon: MapPin, color: '#0046FF', desc: '출근 2시간 전 AI 푸시 응답속도 + 30분 전 3km 진입',
    detail: '평균 AI 응답 12초. 출근 28분 전 매장 반경 진입 완료 (평균)',
  },
  {
    id: 'W3', label: '업주 상호 신뢰 평가', pct: 20, score: 172, max: 200,
    icon: Star, color: '#F59E0B', desc: '태도·시간 준수 등 사장님 정량화 피드백',
    detail: '업무 태도 4.8/5.0 · 시간 준수 4.9/5.0 · 소통 4.7/5.0',
  },
  {
    id: 'W4', label: '금융 연계 성실도', pct: 10, score: 81, max: 100,
    icon: Banknote, color: '#10B981', desc: '잔돈 스윕 유지율 + CASA 예치 기간',
    detail: '끝전 스윕 유지율 92% · 신한은행 CASA 예치 평균 8.3일',
  },
];

function WeightCard({ w, active, onClick }: { w: typeof weights[0]; active: boolean; onClick: () => void }) {
  const Icon = w.icon;
  const scorePct = w.score / w.max;
  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all shadow-xs ${
        active 
          ? 'bg-white border-[#FB521C] ring-2 ring-orange-500/20 shadow-sm' 
          : 'bg-white border-slate-200/90 hover:border-slate-300'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl" style={{ backgroundColor: `${w.color}15` }}>
            <Icon className="w-4 h-4" style={{ color: w.color }} />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: w.color }}>{w.id} · {w.pct}% 가중치</span>
            <p className="text-xs font-bold text-slate-900">{w.label}</p>
          </div>
        </div>
        <p className="text-base font-black text-slate-900">
          {w.score}<span className="text-xs text-slate-400 font-medium">/{w.max}점</span>
        </p>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${scorePct * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: w.color }}
        />
      </div>
      <AnimatePresence>
        {active && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-medium"
          >
            💡 {w.detail}
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
    color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
    badge: 'LEVEL 1',
    items: [
      '향후 2주간 Surge 긱 노출 완전 차단 (기본 단가만 노출)',
      '사장님 대시보드에 "노쇼 주의군" 뱃지 자동 부착',
      '매칭 우선순위 하락 → 매칭 확률 급감',
    ],
    example: '"남들이 비 오는 날 시급 1.5배를 받을 때, 기본 단가 일자리만 노출됩니다."',
  },
  {
    level: 2, trigger: '600점 미만', threshold: 'D-GCS < 600',
    title: '에스크로 보증금 Lock-in', icon: Lock,
    color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200',
    badge: 'LEVEL 2',
    items: [
      '새 매칭 신청 시 출근 보증금 ₩10,000 선입금 필수',
      '정상 출근 확인 시 즉시 전액 환급',
      '무단 노쇼 시 보증금 → 사장님 위로금 전액 송금',
    ],
    example: '"내 보증금 10,000원이 묶여 성실 출근율 99.9%를 유지합니다."',
  },
  {
    level: 3, trigger: '무단 노쇼', threshold: '연락 두절 고의 결근',
    title: '금융 대안신용 블록', icon: XCircle,
    color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200',
    badge: 'LEVEL 3',
    items: [
      '땡겨요 웍스 영구 퇴출 (즉시 적용)',
      '근태 불량 데이터 → 신한카드 ACS 모델에 네거티브 전송',
      '신한카드 단기 대출 한도 삭감 / 마이너스 통장 연장 거절 가능',
    ],
    example: '"무단 노쇼 시 금융 신용 한도에 반영되는 신한만의 신뢰 보호망입니다."',
  },
];

function PenaltyCard({ p, active, onClick }: { p: typeof penalties[0]; active: boolean; onClick: () => void }) {
  const Icon = p.icon;
  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all shadow-xs ${
        active ? `${p.bg} ${p.border} ring-2 ring-amber-500/20` : 'bg-white border-slate-200/90 hover:border-slate-300'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-xl ${active ? 'bg-white shadow-xs' : 'bg-slate-100'}`}>
          <Icon className={`w-5 h-5 ${p.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[9.5px] font-black tracking-wider ${p.color}`}>
              {p.badge}
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full border ${p.bg} ${p.border} ${p.color} font-bold`}>
              {p.trigger}
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900">{p.title}</p>
        </div>
        <ChevronRight className={`w-4 h-4 transition-transform text-slate-400 ${active ? `rotate-90 ${p.color}` : ''}`} />
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 mt-2 bg-white/80 p-3 rounded-xl border border-slate-200/60">
              {p.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className={`w-3.5 h-3.5 ${p.color} shrink-0 mt-0.5`} />
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>
            <div className={`mt-2 p-2.5 rounded-xl ${p.bg} border ${p.border}`}>
              <p className={`text-[11px] ${p.color} font-bold leading-relaxed`}>{p.example}</p>
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
    desc: '오늘 밤 10만 원을 당겨 쓰고, 내일 알바로 갚는다. 긱 워커를 위한 신한 특화 금융 혜택.',
    color: 'text-[#FB521C]',
    bg: 'bg-orange-50 border-orange-200',
  },
  {
    icon: Crown,
    title: '하이엔드 매칭 프리패스',
    sub: '최상위 공고 선행 열람',
    value: '즉시 매칭 확정',
    desc: '점심 피크 꿀알바 — 사장님 별도 심사 없이 프리패스로 매칭 자동 확정.',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
  },
  {
    icon: TrendingUp,
    title: 'AI Surge 우선 배정',
    sub: '우천·심야 할증 긱 우선 노출',
    value: '시급 최대 +50%',
    desc: '탑 성실 워커에게만 할증 긱 우선 배정. 같은 시간 일하고 50% 더 버는 특권.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
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
    await new Promise(r => setTimeout(r, 800));
    setSimulating(false);
  };

  const resetScore = () => setScore(872);

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-8 text-slate-900 font-sans">
      {/* 1. 상단 인트로 헤더 */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="bg-[#FB521C] text-white text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-xs">
            신한 D-GCS
          </span>
          <span className="text-[11px] font-bold text-slate-500">
            Dynamic Gig Credit Score
          </span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">근태 데이터가 금융 권력이 된다</h2>
        <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
          성실성을 신용으로 계량화하는 신한DS 독점 대안신용 평가 시스템
        </p>
      </div>

      {/* 2. 점수 원형 게이지 & 시뮬레이션 카드 */}
      <div className="px-5 mb-5">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm flex flex-col items-center space-y-4">
          <ScoreGauge score={score} />

          {/* 점수 조작 시뮬레이터 */}
          <div className="w-full space-y-2 pt-1 border-t border-slate-100">
            <p className="text-[10.5px] text-slate-500 text-center font-bold">⚠️ 페널티 실시간 시뮬레이션</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Lv.1 발동', color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100', lv: 1 },
                { label: 'Lv.2 발동', color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100', lv: 2 },
                { label: 'Lv.3 발동', color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100', lv: 3 },
              ].map(b => (
                <button
                  key={b.lv}
                  onClick={() => simulatePenalty(b.lv)}
                  disabled={simulating}
                  className={`py-2 rounded-xl border text-[11px] font-bold ${b.color} disabled:opacity-40 active:scale-95 transition-all shadow-xs`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <button
              onClick={resetScore}
              className="w-full py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-bold hover:bg-slate-100 active:scale-95 transition-all"
            >
              점수 초기화 (872점)
            </button>
          </div>
        </div>
      </div>

      {/* 3. 🛡️ 신한 5% 수수료 안전망 & 무상 상해보험 투명성 명세 */}
      <div className="px-5 mb-5">
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFF2EE] text-[#FB521C] flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[9.5px] font-black text-[#FB521C] uppercase tracking-widest block">One Shinhan Safety</span>
                <h4 className="font-bold text-sm text-slate-900">점주 5% 수수료 안전·보험 분배 명세</h4>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FB521C] border border-orange-200 shrink-0">
              100% 무상보장
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            점주님이 지불한 5% 시너지 수수료(₩50,000 구인 기준 <strong>₩2,500</strong>)는 알바몬처럼 단순 광고비로 사라지지 않습니다. <strong>알바생의 0원 무상 상해보험과 미래 자산 형성</strong>을 위해 100% 투명하게 자동 분배됩니다.
          </p>

          {/* 수수료 4대 분배 명세 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* 1. 신한EZ 손해보험 (50% / ₩1,250) */}
            <div className="bg-orange-50/50 p-3.5 rounded-2xl border border-orange-200/70 space-y-1 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FB521C] text-xs flex items-center gap-1">
                  🛡️ ① 신한EZ 마이크로 상해보험
                </span>
                <span className="text-[10px] font-bold text-[#FB521C] bg-white px-1.5 py-0.5 rounded-md border border-orange-200">50% (₩1,250)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                출근 스와이프 즉시 <strong>0원 무상 자동 가입</strong>되는 비급여 단체 상해보험 (치료비 최대 1,000만 원 보장, 사장님 산재 면책)
              </p>
            </div>

            {/* 2. 신한투자증권 ETF (17% / ₩425) */}
            <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-200/70 space-y-1 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-700 text-xs flex items-center gap-1">
                  📈 ② 신한투자증권 ETF 매칭
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded-md border border-blue-200">17% (₩425)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                근무 완료 즉시 알바생 CMA 계좌로 소수점 KODEX/TIGER ETF 자동 매수적립
              </p>
            </div>

            {/* 3. 신한라이프 마이크로 연금 (17% / ₩425) */}
            <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/70 space-y-1 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-700 text-xs flex items-center gap-1">
                  🌿 ③ 신한라이프 마이크로 연금
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded-md border border-emerald-200">17% (₩425)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                초단기 1시간 긱워커도 근무할 때마다 차곡차곡 쌓이는 신한라이프 1% 퇴직 연금 자산
              </p>
            </div>

            {/* 4. 신한DS 7-Core Infra (16% / ₩400) */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                  ⚙️ ④ 신한DS 7-Core 인프라
                </span>
                <span className="text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">16% (₩400)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                노쇼 방지 0.1초 에스크로 계약, SBT 근태 증명, 3.0% PG 수수료 0원 고정 인프라
              </p>
            </div>
          </div>

          {/* 의무 고지 사항 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[10.5px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">⚖️ 전자상거래법 및 금융소비자보호법 고지:</p>
            <p>• 신한EZ손해보험 증권은 출근 스와이프 타임스탬프와 동시 발효되며 별도 청구비 0원입니다.</p>
            <p>• 미출근/노쇼 발생 시 예치된 급여 원금과 수수료는 0.1초 만에 점주 계좌로 100% 자동 환급됩니다.</p>
          </div>
        </div>
      </div>

      {/* 4. W-Model 가중치 */}
      <div className="px-5 mb-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">
          W-Model 4요소 신용 가중치
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
        <div className="mt-3 bg-rose-50 border border-rose-200 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-rose-700">AI 실시간 노쇼 감지 로직</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            GPS 트래킹 기준 출근 <strong className="text-slate-900 font-bold">1시간 전 이동 미파악</strong> 시 노쇼 징후로 판단 → 점수 임시 차감 및 점주에게 <strong className="text-slate-900 font-bold">"Plan B 스탠바이"</strong> 즉시 알림 발송.
          </p>
        </div>
      </div>

      {/* 5. 3단계 금융 페널티 */}
      <div className="px-5 mb-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
          3단계 금융 중력 페널티
        </h3>
        <p className="text-xs text-slate-400 mb-2.5">탭하여 상세 조치 확인 및 위 시뮬레이션 버튼으로 점수 변화 체험</p>
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

      {/* 6. 최상위 성실 워커 리워드 */}
      <div className="px-5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Trophy className="w-4 h-4 text-[#FB521C]" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Ddangyo VIP 최상위 리워드
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">출근율 98% 이상 · D-GCS 900점 이상 달성 시 자동 부여</p>

        <div className="space-y-2.5">
          {rewards.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-4 border bg-white shadow-xs ${r.bg}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white shadow-xs">
                      <Icon className={`w-4.5 h-4.5 ${r.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold">{r.sub}</p>
                      <h4 className="font-bold text-slate-900 text-sm">{r.title}</h4>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full bg-white border shadow-xs ${r.color}`}>
                    {r.value}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 요약 배너 */}
        <div className="mt-5 bg-gradient-to-br from-[#FB521C] to-[#FF7A50] rounded-3xl p-5 text-center text-white shadow-sm space-y-1.5">
          <Flame className="w-7 h-7 text-amber-200 mx-auto" />
          <h4 className="font-bold text-base leading-snug">
            "경쟁사는 광고를 팔고,<br />땡겨요는 안심 금융 인프라를 제공합니다."
          </h4>
          <p className="text-xs text-white/90">
            D-GCS는 성실한 긱워커와 사장님 모두를 지키는 신한만의 약속입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
