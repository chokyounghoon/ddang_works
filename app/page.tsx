'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Sparkles, CreditCard, Landmark, Cpu, User,
  Store, DollarSign, CheckCircle2, ArrowUpRight, MapPin,
  Clock, CloudRain, Zap, ChevronRight, TrendingUp,
  Banknote, Trophy, Flame, BarChart3, Lock, Unlock,
  AlertCircle,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const RevenueDashboard = dynamic(() => import('./components/RevenueDashboard'), { ssr: false });
const AIAgentScreen    = dynamic(() => import('./components/AIAgentScreen'),    { ssr: false });
const DGCSScreen       = dynamic(() => import('./components/DGCSScreen'),       { ssr: false });

// ─── 공통 서브 컴포넌트 ──────────────────────────────────────────────────────

const TrustBadge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border ${color}`}>
    <ShieldCheck className="w-3 h-3" /> {label}
  </span>
);

const GaugeBar = ({ label, value, max, color, suffix = '' }: {
  label: string; value: number; max: number; color: string; suffix?: string;
}) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="text-xs font-black text-slate-800">{value}{suffix}</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  </div>
);

// ─── TAB 1: AI 매칭 ─────────────────────────────────────────────────────────

function AgentTab() {
  const [surge, setSurge] = useState(false);
  const [tier, setTier] = useState<0 | 1 | 2>(1);
  const tiers = [
    { name: 'Silver',   rate: 70,  limit: 30,  color: 'text-slate-600', bg: 'bg-slate-100',   border: 'border-slate-300' },
    { name: 'Gold',     rate: 85,  limit: 70,  color: 'text-amber-600', bg: 'bg-amber-50',    border: 'border-amber-300' },
    { name: 'Platinum', rate: 95,  limit: 150, color: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-300' },
  ];
  const current = tiers[tier];

  return (
    <div className="space-y-4 pb-6">
      {/* AI 목표 넛지 카드 */}
      <div className="bg-[#0F172A] text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#0052FF] opacity-15 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[11px] font-black text-blue-400 tracking-widest uppercase">AI Goal Advisor</span>
          </div>
          <button
            onClick={() => setSurge(s => !s)}
            className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full transition-all ${
              surge ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            <Flame className="w-3 h-3" />{surge ? 'SURGE ON' : 'SURGE'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={surge ? 'on' : 'off'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-base font-black leading-snug mb-3">
              {surge
                ? <>"이지성님, 지금 강남역 시급 <span className="text-orange-400">₩18,750</span>!<br />이 타임 뛰시면 <span className="text-cyan-400">적금 목표 100%</span> 🎯"</>
                : <>"이지성님, <span className="text-cyan-400">아이패드 프로</span> 목표까지 <span className="underline decoration-blue-500">₩120,000</span> 남았습니다."</>
              }
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* 목표 달성 게이지 */}
        <div>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-slate-400 font-semibold">아이패드 프로 구매 목표</span>
            <span className="text-cyan-400 font-black">{surge ? '100%' : '76%'}</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: surge ? '100%' : '76%' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>₩380,000 보유</span>
            <span>목표 ₩500,000</span>
          </div>
        </div>
      </div>

      {/* 추천 잡 카드 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex gap-1.5 flex-wrap mb-2">
              <TrustBadge label="AI Match #1" color="text-[#0052FF] bg-blue-50 border-blue-200" />
              <TrustBadge label="Escrow Secured" color="text-emerald-700 bg-emerald-50 border-emerald-200" />
            </div>
            <h4 className="font-black text-lg text-slate-900">스타벅스 강남2호점</h4>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-[#0052FF]">₩{surge ? '18,750' : '12,500'}</p>
            <p className="text-[10px] text-slate-400">/hr · 수수료 0원</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-2xl p-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" /><span>14:00–18:00 (4h)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <CloudRain className="w-4 h-4" /><span>우천 할증 +50%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" /><span>도보 11분 (800m)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Zap className="w-4 h-4 text-amber-500" /><span>즉시 확정 가능</span>
          </div>
        </div>

        <button className="w-full bg-[#0052FF] text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 group active:scale-[0.98] transition-all shadow-[0_4px_24px_rgba(0,82,255,0.3)]">
          <span>이 스케줄로 확정하기</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Dynamic Credit Badge */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase mb-1">킬러 기능 · Dynamic Credit</p>
            <h4 className="font-black text-base text-slate-900">출근율 → 금융 한도 직결</h4>
            <p className="text-xs text-slate-400 mt-0.5">배지 달성 즉시 신한카드 한도 증액</p>
          </div>
          <Trophy className={`w-9 h-9 ${current.color}`} />
        </div>

        <div className="flex gap-2">
          {tiers.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setTier(i as 0|1|2)}
              className={`flex-1 py-2.5 rounded-xl text-[11px] font-black border transition-all ${
                tier === i ? `${t.bg} ${t.color} ${t.border}` : 'bg-slate-50 text-slate-400 border-slate-100'
              }`}
            >{t.name}</button>
          ))}
        </div>

        <GaugeBar
          label="출근율"
          value={current.rate}
          max={100}
          color={tier === 0 ? 'bg-slate-400' : tier === 1 ? 'bg-amber-400' : 'bg-indigo-500'}
          suffix="%"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-between ${current.bg} ${current.border} border rounded-2xl p-4`}
          >
            <div className="flex items-center gap-3">
              <Banknote className={`w-5 h-5 ${current.color}`} />
              <div>
                <p className={`text-xs font-black ${current.color}`}>{current.name} 달성 보상</p>
                <p className="text-[10px] text-slate-500">신한카드 마이너스 통장 즉시 개설</p>
              </div>
            </div>
            <span className={`text-lg font-black ${current.color}`}>+₩{current.limit}만</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── TAB 2: 점주 대시보드 ────────────────────────────────────────────────────

function EmployerTab() {
  const [matched, setMatched] = useState(false);

  return (
    <div className="space-y-4 pb-6">
      {/* 점주 헤더 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">S</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Employer Dashboard</p>
          <h3 className="font-black text-base text-slate-900">스타벅스 강남2호점</h3>
          <p className="text-xs text-slate-400">AI 예측 정확도 99.2%</p>
        </div>
      </div>

      {/* 노쇼 예측 카드 */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-sm p-5 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl tracking-wider">
          Punctual Score 98%
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center font-black text-xl text-slate-700 border-2 border-slate-200">이</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-black text-base text-slate-900">이지성</h4>
              <TrustBadge label="Gold 등급" color="text-amber-700 bg-amber-50 border-amber-200" />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />매장까지 800m · 에스크로 잠금 확인
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <GaugeBar label="노쇼 리스크" value={2}   max={100}  color="bg-emerald-500" suffix="%" />
          <GaugeBar label="ACS 신용점수" value={637} max={1000} color="bg-blue-500" />
          <GaugeBar label="출근 정시율"  value={98}  max={100}  color="bg-indigo-500" suffix="%" />
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 leading-relaxed">
          ✨ <strong>AI 인텔리전스:</strong> 최근 3개월 노쇼 0.02%. 에스크로 보증금 잠금 + 리스크 ≤2% → 매칭 확정 권장.
        </div>
      </div>

      {/* 에스크로 노쇼 차단 패널 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div>
          <p className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase mb-1">킬러 기능 · 에스크로 차단</p>
          <h4 className="font-black text-base text-slate-900">계정 정지가 아닌 '돈'으로 묶는다</h4>
          <p className="text-xs text-slate-400 mt-0.5">금융사 독점 노쇼 원천 차단 시스템</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { Icon: Store,             label: '점주 예치',   sub: '₩50,000', c: 'text-slate-700',   bg: 'bg-slate-50',   b: 'border-slate-200', ok: true },
            { Icon: matched ? Unlock : Lock, label: matched ? '해제' : '에스크로 잠금', sub: matched ? '✓' : '즉시', c: matched ? 'text-emerald-600' : 'text-blue-600', bg: matched ? 'bg-emerald-50' : 'bg-blue-50', b: matched ? 'border-emerald-200' : 'border-blue-200', ok: matched },
            { Icon: User,              label: '알바생 수령', sub: matched ? '₩50,000' : '대기', c: matched ? 'text-emerald-600' : 'text-slate-400', bg: 'bg-slate-50', b: 'border-slate-200', ok: matched },
          ].map(({ Icon, label, sub, c, bg, b, ok }) => (
            <div key={label} className={`${bg} rounded-2xl p-3 border ${b}`}>
              <Icon className={`w-6 h-6 mx-auto mb-1.5 ${c}`} />
              <p className={`font-black text-[10px] ${c}`}>{label}</p>
              <p className="text-slate-400 text-[9px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {!matched ? (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              매칭 확정 즉시 <strong>₩50,000</strong>이 신한은행 에스크로 자동 예치.
              노쇼 시 보증금 자동 차감 — <strong>사전 예방형 금융 제재</strong>.
            </p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <p className="text-sm text-emerald-700 font-bold">퇴근 완료 → 에스크로 즉시 해제 · ₩50,000 입금</p>
          </motion.div>
        )}

        <button
          onClick={() => setMatched(m => !m)}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-[0.98] ${
            matched ? 'bg-slate-100 text-slate-500' : 'bg-[#0052FF] text-white shadow-[0_4px_24px_rgba(0,82,255,0.25)]'
          }`}
        >
          {matched ? '초기화 (다시 보기)' : '매칭 확정 → 에스크로 잠금 실행'}
        </button>
      </div>
    </div>
  );
}

// ─── TAB 3: 1초 정산 ─────────────────────────────────────────────────────────

function CheckoutTab() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const doCheckout = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `CHK-${crypto.randomUUID()}`,
        },
        body: JSON.stringify({
          userId: 'GIG_WORKER_LEEJISUNG',
          storeId: 'STARBUCKS_GANGNAM_02',
          hoursWorked: 4,
          hourlyWage: 12500,
        }),
      });
      const j = await res.json() as any;
      if (j.success) setResult(j);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const subIcons = [
    <Landmark key="bank"   className="w-5 h-5 text-blue-600" />,
    <CreditCard key="card"  className="w-5 h-5 text-red-500" />,
    <ShieldCheck key="life"  className="w-5 h-5 text-emerald-600" />,
    <TrendingUp key="inv"   className="w-5 h-5 text-amber-600" />,
    <Cpu key="ds"    className="w-5 h-5 text-violet-600" />,
  ];

  return (
    <div className="space-y-4 pb-6">
      {!result ? (
        <>
          {/* 정산 미리보기 카드 */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#0052FF]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase">킬러 기능 · 1초 무중력 정산</p>
                <h3 className="font-black text-lg text-slate-900">오늘의 긱 워크 완료</h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-black text-emerald-700">수수료 0원 · 인스타페이 대비 100% 절감</span>
            </div>

            {/* 정산 내역 */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Escrow Secured · 오늘 4h 근무</p>
              {[
                { label: '총 급여 (4h × ₩12,500)', value: '₩50,000', style: 'text-slate-800 font-semibold' },
                { label: '인스타페이 수수료 (경쟁사 ₩1,500 절감)', value: '₩0', style: 'text-emerald-600 font-bold' },
                { label: '신한라이프 보험료', value: '-₩300', style: 'text-orange-500' },
                { label: '끝전 ETF 자동투자 (신한투자증권)', value: '-₩850', style: 'text-blue-500' },
                { label: '실수령 (즉시 입금 예정)', value: '₩48,850', style: 'text-emerald-600 font-black text-base' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 text-xs">{row.label}</span>
                  <span className={row.style}>{row.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={doCheckout}
              disabled={loading}
              className="w-full bg-[#0052FF] disabled:opacity-60 text-white font-black py-5 rounded-2xl text-base transition-all active:scale-[0.98] shadow-[0_6px_30px_rgba(0,82,255,0.3)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  신한DS 게이트웨이 검증 중...
                </span>
              ) : '퇴근 기록 및 1초 정산 받기 →'}
            </button>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* 성공 배너 */}
          <div className="bg-gradient-to-br from-[#0052FF] to-[#003ACC] text-white p-6 rounded-3xl text-center space-y-2 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent pointer-events-none" />
            <CheckCircle2 className="w-9 h-9 mx-auto text-cyan-300 relative" />
            <h3 className="font-black text-xl relative">Real-time Settlement Complete</h3>
            <p className="text-xs text-blue-200 uppercase tracking-widest font-bold relative">수수료 0원 · Cloudflare Edge · D1 원장</p>
            <p className="text-4xl font-black text-cyan-300 relative pt-2">
              ₩{result.financialImpact?.netDeposit?.toLocaleString() ?? '48,850'}
            </p>
            <p className="text-blue-200 text-sm relative">즉시 신한은행 통장 입금 완료</p>
          </div>

          <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase px-1">One Shinhan 교차수익 리포트</p>

          {Object.values(result.financialImpact.breakdown).map((item: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                  {subIcons[idx]}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h5 className="font-black text-sm text-slate-900">{item.title}</h5>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-[180px] leading-tight">
                    {item.description ?? item.value}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-slate-800 block">{item.value}</span>
                {item.revenuePerTx != null && (
                  <span className="text-[10px] text-emerald-600 font-bold">+₩{Number(item.revenuePerTx).toLocaleString()}</span>
                )}
              </div>
            </motion.div>
          ))}

          <button
            onClick={() => setResult(null)}
            className="w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
          >
            다시 시작하기
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

type Tab = 'agent' | 'employer' | 'checkout' | 'revenue' | 'aiscreen' | 'dgcs';

const tabs: Array<{ id: Tab; Icon: any; label: string }> = [
  { id: 'agent',    Icon: User,       label: 'AI 매칭' },
  { id: 'employer', Icon: Store,      label: '점주' },
  { id: 'checkout', Icon: DollarSign, label: '정산' },
  { id: 'revenue',  Icon: BarChart3,  label: '수익' },
  { id: 'aiscreen', Icon: Cpu,        label: 'AI 엔진' },
  { id: 'dgcs',     Icon: ShieldCheck, label: 'D-GCS' },
];

export default function ShinhanDDangApp() {
  const [activeTab, setActiveTab] = useState<Tab>('agent');

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans antialiased flex flex-col max-w-lg mx-auto relative">

      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase">One Shinhan Ecosystem</p>
            <h1 className="font-black text-xl text-[#0F172A] leading-tight">알바 땡겨요</h1>
          </div>
          <div className="flex items-center gap-2">
            <TrustBadge label="Escrow" color="text-emerald-700 bg-emerald-50 border-emerald-200" />
            <div className="flex items-center gap-1 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1.5 rounded-full">
              <Cpu className="w-3 h-3 text-cyan-400" /><span>AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'agent' && (
            <motion.div key="agent" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <AgentTab />
            </motion.div>
          )}
          {activeTab === 'employer' && (
            <motion.div key="employer" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <EmployerTab />
            </motion.div>
          )}
          {activeTab === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <CheckoutTab />
            </motion.div>
          )}
          {activeTab === 'revenue' && (
            <motion.div key="revenue" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="pb-6">
              <RevenueDashboard />
            </motion.div>
          )}
          {activeTab === 'aiscreen' && (
            <motion.div key="aiscreen" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="pb-6">
              <AIAgentScreen />
            </motion.div>
          )}
          {activeTab === 'dgcs' && (
            <motion.div key="dgcs" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="-mx-4 pb-6">
              <DGCSScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 하단 고정 내비 */}
      <nav className="sticky bottom-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {tabs.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all active:scale-90 ${
                activeTab === id ? 'text-[#0052FF]' : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${activeTab === id ? 'bg-blue-50' : ''}`}>
                <Icon className={`w-5 h-5 ${activeTab === id ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] font-black tracking-tight ${activeTab === id ? 'text-[#0052FF]' : 'text-slate-400'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
