'use client';

// app/components/DGCSScreen.tsx
// 땡겨요 WORKS [안전/보험] 대시보드
// 1. 🛡️ 신한EZ손해보험 초단기 마이크로 상해·배상책임 보험 실시간 디지털 인증서
// 2. 📊 D-GCS (Dynamic Gig Credit Score) & 대안신용 평가 시스템

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Banknote, ShieldCheck, Zap, AlertTriangle,
  Lock, TrendingDown, TrendingUp, Crown, Trophy, ChevronRight,
  XCircle, Clock, Flame, Info, CheckCircle, Shield, Activity,
  PhoneCall, Download, Check, AlertCircle, FileText, Landmark,
  Building2, User, Sparkles
} from 'lucide-react';
import { useAppPush } from './AppPushToast';
import confetti from 'canvas-confetti';

// ─── 원형 게이지 (D-GCS) ──────────────────────────────────────────────────────

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

// ─── W-Model 가중치 ─────────────────────────────────────────────────────────

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

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────

export default function DGCSScreen() {
  const { triggerPush } = useAppPush();
  const [mainView, setMainView] = useState<'ez_insurance' | 'dgcs_credit'>('ez_insurance');
  const [score, setScore] = useState(872);
  const [activeWeight, setActiveWeight] = useState<string | null>('W1');
  const [activePenalty, setActivePenalty] = useState<number | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // 실시간 긱 대상 보험 상태 (CU 강남파이낸스점 또는 진행 긱)
  const [insuranceActive, setInsuranceActive] = useState(true);

  const simulatePenalty = async (level: number) => {
    setSimulating(true);
    const penalty = level === 1 ? -80 : level === 2 ? -200 : -400;
    setScore(s => Math.max(0, s + penalty));
    await new Promise(r => setTimeout(r, 800));
    setSimulating(false);
  };

  const resetScore = () => setScore(872);

  const handleClaim = () => {
    setClaimSuccess(true);
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch {}
    
    triggerPush({
      title: '🚨 [신한EZ 1초 안심 사고 접수 완료]',
      body: 'CU 강남파이낸스점 긱 상해/배상 청구가 접수되었습니다. 신한EZ 전담 보상팀(1544-2580)이 즉시 배정되었습니다.',
      type: 'confirm',
    });

    setTimeout(() => {
      setShowClaimModal(false);
      setClaimSuccess(false);
    }, 2500);
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-12 text-slate-900 font-sans">
      {/* 1. 상단 인트로 헤더 & 탭 스위처 */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-xs">
              신한 One-Safety
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              신한EZ손보 & D-GCS
            </span>
          </div>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 실시간 보장 작동 중
          </span>
        </div>

        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          {mainView === 'ez_insurance' ? '신한EZ 초단기 마이크로 보험' : '근태 데이터가 금융 권력이 된다'}
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
          {mainView === 'ez_insurance' 
            ? '출근 스와이프 0.1초 즉시 발효 · 육아/서빙/물류 현장 비급여 치료비 & 대물 100% 무상 보장'
            : '성실성을 신용으로 계량화하는 신한DS 독점 대안신용 평가 시스템'}
        </p>

        {/* 상단 탭 전환 바 */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-200/80 rounded-2xl">
          <button
            onClick={() => setMainView('ez_insurance')}
            className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
              mainView === 'ez_insurance'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>신한EZ 실시간 보험</span>
            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded-full font-bold border border-blue-200">
              인증서
            </span>
          </button>

          <button
            onClick={() => setMainView('dgcs_credit')}
            className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
              mainView === 'dgcs_credit'
                ? 'bg-white text-[#FB521C] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4 text-[#FB521C]" />
            <span>D-GCS 신용평가</span>
            <span className="text-[9px] bg-orange-50 text-[#FB521C] px-1.5 py-0.2 rounded-full font-bold border border-orange-200">
              {score}점
            </span>
          </button>
        </div>
      </div>

      {mainView === 'ez_insurance' ? (
        /* ═══════════════════════════════════════════════════════════════════════════
           탭 1: 🛡️ 신한EZ손해보험 초단기 마이크로 보험 실시간 디지털 인증서 
           ═══════════════════════════════════════════════════════════════════════════ */
        <div className="px-5 space-y-4">
          {/* 1. 신한EZ손보 디지털 보험 증권 카드 (Hero Certificate) */}
          <div className="bg-gradient-to-br from-[#0A192F] via-[#0F284E] to-[#0A192F] rounded-3xl p-5 text-white shadow-xl border border-blue-500/40 relative overflow-hidden space-y-4">
            {/* 네온 배경 효과 */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            {/* 인증서 상단 헤더 */}
            <div className="flex items-start justify-between border-b border-blue-500/30 pb-3.5 relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      신한EZ손해보험
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      증권번호: EZ-2026-GIG-0822-CU98
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white tracking-tight">
                    초단기 마이크로 상해·배상 책임보험
                  </h3>
                </div>
              </div>
            </div>

            {/* 🟢 실시간 활성 상태 안내 배너 (요구사항 필수 문구 반영) */}
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-300">
                    🟢 LIVE ACTIVE · 실시간 보험 보장 가동 중
                  </span>
                  <span className="text-[9.5px] bg-emerald-500/20 text-emerald-200 px-1.5 py-0.2 rounded font-bold">
                    0.1초 자동 연동
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-200 leading-relaxed font-medium">
                  <strong>근무 시작 스와이프 시 0.1초 만에 활성화</strong>되며, 육아/서빙/물류 현장의 <strong>비급여 치료비 및 대물 배상까지 완벽 보장 중</strong>입니다.
                </p>
              </div>
            </div>

            {/* 현재 보장 대상 긱 정보 그리드 */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" /> 보장 대상 사업장 및 피보험자
                </span>
                <span className="text-emerald-400 font-mono">신한 원장 인증 완료</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11.5px]">
                <div className="space-y-1">
                  <div className="text-slate-400 text-[10.5px]">사업장(피보험 업체)</div>
                  <div className="font-black text-white text-xs">CU 강남파이낸스점</div>
                  <div className="text-[10px] text-slate-400">강남구 테헤란로 152</div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 text-[10.5px]">피보험 근로자 (워커)</div>
                  <div className="font-black text-white text-xs">조이수 (D-GCS 980점)</div>
                  <div className="text-[10px] text-blue-300">물류 하역 1시간 피크 시프트</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">보장 유효 시간:</span>
                <span className="font-bold text-amber-300">오늘 12:00 ~ 13:00 (1시간 실시간 락업)</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">워커 부담 보험료:</span>
                <span className="font-black text-emerald-400">₩0원 (점주 5% 시너지 수수료 100% 무상 지원)</span>
              </div>
            </div>

            {/* 3대 핵심 보장 항목 & 한도 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-blue-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                신한EZ 3대 마이크로 안심 보장 내역
              </h4>

              <div className="grid grid-cols-1 gap-2 text-xs">
                {/* 1. 비급여 상해 치료비 */}
                <div className="bg-slate-900/90 border border-blue-500/20 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-xs flex items-center gap-1.5">
                      🏥 ① 비급여 의료비 및 상해 치료비
                    </span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                      최대 1,000만 원
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    물류 박스 하역/이동 중 발목 염좌, 골절, 베임 사고 시 MRI·도수치료·비급여 주사제 100% 실손 보상 (자기부담금 0원)
                  </p>
                </div>

                {/* 2. 대물 배상 책임 */}
                <div className="bg-slate-900/90 border border-blue-500/20 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-xs flex items-center gap-1.5">
                      ☕ ② 현장 대물 배상책임 (기물 파손)
                    </span>
                    <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                      최대 5,000만 원
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    서빙 중 고가 와인/식기 파손, 매장 POS기 음료 침수, 매장 진열대 파손 등 업무 중 우발적 대물 사고 전액 면책 배상
                  </p>
                </div>

                {/* 3. 긴급 구급 이송 & 후유장해 */}
                <div className="bg-slate-900/90 border border-blue-500/20 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-xs flex items-center gap-1.5">
                      🚑 ③ 긴급 구급 이송 & 후유장해
                    </span>
                    <span className="text-xs font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                      최대 1억 원
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    응급 119 이송 지원금 및 중증 상해 시 신한금융그룹 원스톱 안심 케어 보상금 지급
                  </p>
                </div>
              </div>
            </div>

            {/* 하단 액션 버튼 (사고 접수 & 증권 다운로드) */}
            <div className="pt-2 border-t border-blue-500/30 grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowClaimModal(true)}
                className="py-3 px-3 rounded-2xl font-black text-xs bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-white animate-bounce" />
                <span>🚨 1초 간편 사고 접수</span>
              </button>

              <button
                onClick={() => {
                  triggerPush({
                    title: '📥 [디지털 보험 증권 발급 완료]',
                    body: '신한EZ손해보험 초단기 마이크로 보험 가입 증명서(PDF)가 카카오 알림톡으로 전송되었습니다.',
                    type: 'apply',
                  });
                }}
                className="py-3 px-3 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>보험 증권 PDF 받기</span>
              </button>
            </div>
          </div>

          {/* 2. 점주 & 알바생 무과실 안심 보장 설명 카드 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Landmark className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">왜 땡겨요 웍스는 100% 무상 보험인가요?</h4>
                <p className="text-[10.5px] text-slate-500">신한금융그룹 원신한 상생 인프라 모델</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-blue-700 flex items-center gap-1">
                  <span>👔</span> 사장님(점주) 안심 면책
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  1시간 알바생이 일하다 다쳐도 사장님이 사비로 물어줄 필요가 없습니다. 신한EZ손보가 치료비 전액을 100% 실손 처리하여 민형사상 노무 분쟁을 완벽히 방어합니다.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-emerald-700 flex items-center gap-1">
                  <span>🏃</span> 워커(알바생) 0원 보장
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  별도 보험 가입 서류 작성 없이, [출근 스와이프] 0.1초 만에 즉시 보장이 개시됩니다. 비급여 치료비까지 본인 부담금 0원으로 치료받고 안전하게 일할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════════════════
           탭 2: 📊 D-GCS 대안신용 평가 & 페널티 시뮬레이션
           ═══════════════════════════════════════════════════════════════════════════ */
        <div className="space-y-5">
          {/* 점수 원형 게이지 & 시뮬레이션 카드 */}
          <div className="px-5">
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

          {/* W-Model 가중치 */}
          <div className="px-5">
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
          </div>

          {/* 페널티 3단계 */}
          <div className="px-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">
              D-GCS 3단계 페널티 거버넌스
            </h3>
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
        </div>
      )}

      {/* 🚨 1초 간편 사고 접수 팝업 모달 */}
      <AnimatePresence>
        {showClaimModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-5 text-white shadow-2xl space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">신한EZ 1초 간편 사고 접수</h3>
                    <p className="text-[10px] text-slate-400">24시간 긴급 전담 보상 센터</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              {claimSuccess ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-sm text-emerald-300">사고 접수가 완료되었습니다!</h4>
                  <p className="text-xs text-slate-300">
                    신한EZ 전담 손해사정사가 3분 이내로 연락드립니다.<br />
                    <span className="text-[10.5px] text-slate-400">(대표번호 1544-2580)</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="text-slate-400 text-[10.5px]">사고 발생 긱</div>
                    <div className="font-bold text-white">CU 강남파이낸스점 (1시간 물류 하역)</div>
                    <div className="text-[10.5px] text-emerald-400">✓ 신한EZ 비급여 실손 보험 가동 중</div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300">사고 유형 선택</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-2.5 rounded-xl bg-slate-800 border border-blue-500 text-blue-300 font-bold text-[11px] text-center">
                        🩹 상해 / 다침
                      </button>
                      <button className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold text-[11px] text-center hover:border-slate-700">
                        📦 기물 파손
                      </button>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-400 leading-tight">
                    * 접수 즉시 병원 진료비 영수증 사진 한 장으로 청구가 완료되며, 자기부담금 없이 신한은행 계좌로 당일 입금됩니다.
                  </p>

                  <button
                    onClick={handleClaim}
                    className="w-full py-3 rounded-2xl font-black text-xs bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    <span>원클릭 1초 사고 접수 실행</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
