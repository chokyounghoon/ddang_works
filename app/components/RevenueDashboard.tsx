'use client';

// app/components/RevenueDashboard.tsx
// 실시간 수익 대시보드 — 신한 7개 계열사 통합 금융 시너지 시각화
// 고대비 프리미엄 다크 핀테크 테마 (텍스트 흐림 / 투명도 충돌 완전 제거)

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevenueStore, SubsidiaryMetric } from '../../store/revenueStore';
import { ShieldCheck, ChevronDown, Sparkles, Building2, CreditCard, Landmark, LineChart, Cpu, Coins, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

// ── 숫자 카운트업 애니메이션 훅 ──
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const diff = target - start;
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(start + diff * eased));
      if (t < 1) requestAnimationFrame(step);
      else prev.current = target;
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// ── 실시간 펄스 아이콘 ──
const LiveDot = () => (
  <span className="relative flex h-2.5 w-2.5 shrink-0">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
  </span>
);

const affiliateIcons: Record<string, any> = {
  bank: Landmark,
  ezInsurance: ShieldAlert,
  card: CreditCard,
  life: ShieldCheck,
  invest: LineChart,
  savingsCapital: Coins,
  ds: Cpu,
};

// ── 계열사 수익 & 시너지 카드 (솔리드 다크 고대비) ──
function SubsidiaryCard({
  id, item, isSelected, onClick, index
}: {
  id: string; item: SubsidiaryMetric; isSelected: boolean; onClick: () => void; index: number;
}) {
  const annualCount = useCountUp(item.annualProjection, 1500 + index * 150);
  const Icon = affiliateIcons[id] || Building2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 180 }}
      onClick={onClick}
      style={{ borderColor: isSelected ? item.color : '#334155' }}
      className={`
        relative rounded-2xl border p-3.5 cursor-pointer transition-all duration-200 overflow-hidden text-left flex flex-col justify-between
        ${isSelected ? 'bg-[#1E293B] shadow-lg ring-2 ring-indigo-400/50' : 'bg-[#0F172A] hover:bg-[#1E293B]'}
      `}
    >
      {/* 헤더 */}
      <div className="relative mb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-xl shrink-0 bg-slate-800 border border-slate-700">
              <Icon className="w-4 h-4" style={{ color: item.color }} />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-white block truncate">{item.name}</span>
              {item.subtitle && (
                <p className="text-[10px] text-slate-300 font-semibold truncate leading-tight mt-0.5">{item.subtitle}</p>
              )}
            </div>
          </div>
          <span
            className="text-[10.5px] font-black px-2 py-0.5 rounded-lg font-mono shrink-0 whitespace-nowrap bg-slate-800 border border-slate-700"
            style={{ color: item.color }}
          >
            ₩{item.revenuePerTx.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 연간 수익 & 프로그레스 */}
      <div className="relative my-1 bg-[#090D16] p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[10px] text-slate-400 font-bold">연간 창출 기대치</span>
          <p className="text-sm font-black text-white tracking-tight font-mono">
            ₩{(annualCount / 100000000).toFixed(1)}
            <span className="text-[11px] font-bold text-emerald-400 ml-1">억/년</span>
          </p>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${item.color}, #60A5FA)` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (item.annualProjection / 2500000000) * 100)}%` }}
            transition={{ duration: 1.5, delay: index * 0.08, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 하단 시너지 목표 & 아코디언 토글 */}
      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10.5px]">
        <span className="text-slate-300 font-semibold truncate max-w-[130px] sm:max-w-none">{item.synergyGoal || '그룹 시너지'}</span>
        <span className="text-indigo-400 font-bold shrink-0 flex items-center gap-0.5 hover:text-indigo-300">
          {isSelected ? '상세 접기 ▲' : '시너지 분석 ▼'}
        </span>
      </div>
    </motion.div>
  );
}

// ── 실시간 트랜잭션 피드 ──
function TransactionFeed({ transactions }: { transactions: Array<{ txId: string; grossPay: number; lifePremium: number; netDeposit: number; dsBaasFee: number; ezInsuranceFee?: number; createdAt: string }> }) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
      <AnimatePresence initial={false}>
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.txId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between bg-[#0B0F19] hover:bg-[#151D30] transition-colors rounded-xl px-3 py-2.5 border border-slate-800 gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-md shrink-0">
                7
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-slate-100 font-bold truncate">{tx.txId}</p>
                <p className="text-[10px] text-slate-400 font-medium">{new Date(tx.createdAt).toLocaleTimeString('ko-KR')}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-black text-emerald-400 font-mono">+₩{tx.netDeposit.toLocaleString()}</p>
              <p className="text-[10px] text-indigo-300 font-semibold">BaaS ₩{tx.dsBaasFee} 정산</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── 메인 대시보드 컴포넌트 ──
export default function RevenueDashboard() {
  const { data, fetchRevenue, simulatedTx, simulateTransaction } = useRevenueStore();
  const [simulating, setSimulating] = useState(false);
  const [selectedSub, setSelectedSub] = useState<string | null>('bank');

  const totalTx = useCountUp((data?.summary?.totalTransactions ?? 0) + simulatedTx, 800);
  const totalRevenue = useCountUp(
    ((data?.summary?.totalGrossPay ?? 0) + simulatedTx * 48500) * 0.03 +
    simulatedTx * 302 + simulatedTx * 200 + simulatedTx * 150 + simulatedTx * 400,
    1000
  );

  useEffect(() => { fetchRevenue(); }, []);

  useEffect(() => {
    const timer = setInterval(fetchRevenue, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    simulateTransaction();
    await fetchRevenue();
    setSimulating(false);
  };

  const subs = data?.subsidiaries;
  const subOrder: Array<{ id: string; item: SubsidiaryMetric }> = subs ? [
    { id: 'bank', item: subs.bank },
    { id: 'ezInsurance', item: subs.ezInsurance },
    { id: 'card', item: subs.card },
    { id: 'life', item: subs.life },
    { id: 'invest', item: subs.invest },
    { id: 'savingsCapital', item: subs.savingsCapital },
    { id: 'ds', item: subs.ds },
  ] : [];

  const activeSubData = selectedSub && subs ? (subs as any)[selectedSub] as SubsidiaryMetric : null;

  return (
    <section className="py-2 px-1 sm:px-3 text-white font-sans text-left">
      <div className="space-y-4">
        {/* 헤더 안내 (솔리드 다크 딥 네이비 카드) */}
        <div className="text-center bg-[#0F172A] rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl">
          <div className="inline-flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/40 rounded-full px-3 py-1 mb-2.5">
            <LiveDot />
            <span className="text-[10.5px] text-indigo-300 font-black tracking-wide">신한금융그룹 7대 계열사 독점 시너지엔진</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mb-1.5 leading-snug break-keep">
            신한 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">7-Core</span> 금융 시너지 & 수익 집계
          </h2>
          <p className="text-slate-300 text-[11px] sm:text-xs max-w-2xl mx-auto leading-relaxed break-keep font-medium">
            0.1초 퇴근 스와이프 1번으로 7개 계열사의 독점적 정산·대출·보험·투자·BaaS 결제망이 일제히 가동됩니다.
          </p>
        </div>

        {/* 3대 핵심 KPI 카드 (솔리드 다크 고대비 텍스트) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              label: '누적 7-Core 트랜잭션',
              value: `${totalTx.toLocaleString()}건`,
              sub: `+${simulatedTx} 시뮬레이션 실시간 합산`,
              bg: 'bg-[#0F172A]',
              border: 'border-blue-500/40',
              valColor: 'text-blue-400',
            },
            {
              label: '신한 7대 계열사 연간 창출 수익',
              value: totalRevenue > 0 ? `₩${(totalRevenue / 100000000).toFixed(1)}억/년` : '₩48.2억/년',
              sub: 'CASA + 마이크로보험 + 카드 + ETF + BaaS',
              bg: 'bg-[#0F172A]',
              border: 'border-emerald-500/40',
              valColor: 'text-emerald-400',
            },
            {
              label: 'PG 수수료 절감 (vs 알바몬)',
              value: data ? `₩${Math.round((data?.competitive?.annualSavings ?? 0) / 100000000)}억/년` : '₩15억/년',
              sub: '3.0% → 0.0% · 100만 워커 기준',
              bg: 'bg-[#0F172A]',
              border: 'border-purple-500/40',
              valColor: 'text-purple-300',
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${kpi.bg} border ${kpi.border} rounded-2xl p-4 shadow-xl text-left flex flex-col justify-between`}
            >
              <div>
                <p className="text-slate-300 text-[11px] mb-1 font-bold leading-tight">{kpi.label}</p>
                <p className={`text-xl font-black ${kpi.valColor} font-mono tracking-tight`}>{kpi.value}</p>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium leading-tight">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* 7개 계열사 시너지 파이프라인 (솔리드 다크 그리드) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FB521C] shrink-0" />
              <span>신한 7대 계열사 비즈니스 시너지 파이프라인</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap shrink-0">
              7개사 전원 가동
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {subOrder.map(({ id, item }, idx) => (
              <SubsidiaryCard
                key={id}
                id={id}
                item={item}
                isSelected={selectedSub === id}
                onClick={() => setSelectedSub(selectedSub === id ? null : id)}
                index={idx}
              />
            ))}
          </div>
        </div>

        {/* 선택된 계열사 상세 [현장 고통] ➡️ [수익 시너지] 패널 */}
        <AnimatePresence mode="wait">
          {activeSubData && (
            <motion.div
              key={selectedSub}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#0F172A] border rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3"
              style={{ borderColor: activeSubData.color + '80' }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: activeSubData.color }} />
                  <h4 className="text-sm sm:text-base font-black text-white">{activeSubData.name}</h4>
                  {activeSubData.subtitle && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold truncate border border-slate-700">
                      {activeSubData.subtitle}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full text-white shrink-0 bg-slate-800 border" style={{ borderColor: activeSubData.color }}>
                  {activeSubData.synergyGoal}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 현장 고통 */}
                <div className="bg-[#1C131D] border border-rose-500/40 rounded-xl p-3.5 space-y-1.5">
                  <span className="inline-block text-[10px] font-black text-rose-300 px-2 py-0.5 bg-rose-950 rounded-md border border-rose-500/40">
                    🚨 [현장 고통 & 병목]
                  </span>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                    {activeSubData.painPoint}
                  </p>
                </div>

                {/* 수익 시너지 */}
                <div className="bg-[#0D201A] border border-emerald-500/40 rounded-xl p-3.5 space-y-1.5">
                  <span className="inline-block text-[10px] font-black text-emerald-300 px-2 py-0.5 bg-emerald-950 rounded-md border border-emerald-500/40">
                    💰 [One Shinhan 독점 수익 창출]
                  </span>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                    {activeSubData.synergy}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 하단 패널: 실시간 정산 피드 + 7-Core Saga 시뮬레이션 */}
        <div className="flex flex-col gap-4">
          {/* 7-Core 시뮬레이션 패널 */}
          <div className="bg-[#0F172A] border border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>⚡ 0.1초 퇴근 정산 7-Core Saga 시뮬레이션</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono border border-indigo-500/40 shrink-0 font-bold">
                  Saga v2 Engine
                </span>
              </div>
              <p className="text-[10.5px] text-slate-300 mb-3 leading-tight font-medium">알바생 4시간 근무 완료 → 출퇴근 스와이프 1번으로 7개 계열사 일제 연동</p>
              
              <div className="space-y-1.5 text-xs">
                {[
                  { icon: '🏦', label: '신한은행', action: 'CASA 모계좌 ₩50,000 이체 + SBT 근태 박제', color: 'text-blue-400' },
                  { icon: '🛡️', label: '신한EZ손해보험', action: '마이크로 상해/배상책임 ₩150 자동 정산', color: 'text-cyan-400' },
                  { icon: '💳', label: '신한카드', action: '점주 일일한도 부여 + ACS 대안신용 +5점', color: 'text-pink-400' },
                  { icon: '🌿', label: '신한라이프', action: '1% 마이크로 연금 ₩302 적립 + GPS 생체DB', color: 'text-emerald-400' },
                  { icon: '📈', label: '신한투자증권', action: '끝전 ₩850 우량 ETF/STO 소수점 자동 매수', color: 'text-amber-400' },
                  { icon: '🪙', label: '신한저축/캐피탈', action: '0.1초 중금리 Cascade + 로봇 B2B 리스 승인', color: 'text-orange-400' },
                  { icon: '⚙️', label: '신한DS', action: 'API 게이트웨이 BaaS 통행료 ₩200 자동 징수', color: 'text-purple-400' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1E293B] rounded-xl px-3 py-2 border border-slate-700/60 gap-0.5">
                    <span className="text-white font-bold text-[11px] shrink-0">{item.icon} {item.label}</span>
                    <span className={`font-semibold ${item.color} text-[10.5px] leading-tight`}>{item.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSimulate}
              disabled={simulating}
              className={`
                w-full py-3 rounded-2xl font-black text-xs sm:text-sm transition-all mt-2 shadow-xl flex items-center justify-center gap-2 cursor-pointer
                ${simulating
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FB521C] via-orange-500 to-indigo-600 text-white hover:brightness-110 shadow-orange-500/25'}
              `}
            >
              {simulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>7-Core Saga 오케스트레이션 실행 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ 7-Core Saga 시뮬레이션 1회 실행 (0.1초 정산)</span>
                </>
              )}
            </motion.button>
          </div>

          {/* 실시간 피드 */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                <LiveDot />
                <span>7-Core 실시간 정산 원장 피드</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 font-bold">{data?.mode ?? 'MOCK'} MODE</span>
            </div>
            {data?.recentTransactions?.length ? (
              <TransactionFeed transactions={data.recentTransactions} />
            ) : (
              <div className="text-center text-slate-400 py-6 text-xs font-medium">
                정산 없음 → 상단 버튼으로 7-Core Saga 시뮬레이션을 실행해보세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
