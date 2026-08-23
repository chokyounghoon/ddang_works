'use client';

// app/components/RevenueDashboard.tsx
// 실시간 수익 대시보드 — 신한 7개 계열사 통합 금융 시너지 시각화
// Framer Motion + Tailwind CSS

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevenueStore, SubsidiaryMetric } from '../../store/revenueStore';
import { ShieldCheck, ChevronDown, Sparkles, Building2, CreditCard, Landmark, LineChart, Cpu, Coins, ShieldAlert } from 'lucide-react';

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
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
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
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
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

// ── 계열사 수익 & 시너지 카드 ──
function SubsidiaryCard({
  id, item, isSelected, onClick, index
}: {
  id: string; item: SubsidiaryMetric; isSelected: boolean; onClick: () => void; index: number;
}) {
  const annualCount = useCountUp(item.annualProjection, 1500 + index * 150);
  const Icon = affiliateIcons[id] || Building2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 180 }}
      onClick={onClick}
      style={{ borderColor: isSelected ? item.color : item.color + '40' }}
      className={`
        relative rounded-2xl border p-3.5 backdrop-blur-sm cursor-pointer transition-all duration-200 overflow-hidden text-left flex flex-col justify-between
        ${isSelected ? 'bg-white/15 shadow-lg shadow-indigo-950/60 ring-2 ring-white/20' : 'bg-slate-900/80 hover:bg-slate-800/90'}
      `}
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20" style={{ background: item.color }} />

      {/* 헤더 */}
      <div className="space-y-1 relative mb-2">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="p-1.5 rounded-lg shrink-0" style={{ background: item.color + '25' }}>
              <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
            </div>
            <span className="text-xs font-black text-white truncate">{item.name}</span>
          </div>
          <span
            className="text-[9px] font-black px-1.5 py-0.5 rounded-md font-mono shrink-0 whitespace-nowrap"
            style={{ background: item.color + '30', color: item.color }}
          >
            ₩{item.revenuePerTx.toLocaleString()}
          </span>
        </div>

        {item.subtitle && (
          <p className="text-[10px] text-slate-300 truncate font-medium">{item.subtitle}</p>
        )}
      </div>

      {/* 연간 수익 */}
      <div className="relative mt-auto">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] text-slate-400 font-medium">연간 창출</span>
          <p className="text-base font-black text-white tracking-tight font-mono">
            ₩{(annualCount / 100000000).toFixed(1)}
            <span className="text-[10.5px] font-normal text-white/70 ml-0.5">억/년</span>
          </p>
        </div>
        <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}99)` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (item.annualProjection / 2500000000) * 100)}%` }}
            transition={{ duration: 1.5, delay: index * 0.08, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px]">
        <span className="text-white/60 font-medium truncate">{item.synergyGoal || '그룹 시너지'}</span>
        <span className="text-indigo-300 font-bold shrink-0 flex items-center gap-0.5">
          {isSelected ? '접기 ▲' : '상세 ▼'}
        </span>
      </div>
    </motion.div>
  );
}

// ── 실시간 트랜잭션 피드 ──
function TransactionFeed({ transactions }: { transactions: Array<{ txId: string; grossPay: number; lifePremium: number; netDeposit: number; dsBaasFee: number; ezInsuranceFee?: number; createdAt: string }> }) {
  return (
    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
      <AnimatePresence initial={false}>
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.txId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                7
              </div>
              <div>
                <p className="text-xs font-mono text-white/80">{tx.txId}</p>
                <p className="text-[10px] text-white/40">{new Date(tx.createdAt).toLocaleTimeString('ko-KR')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-400">+₩{tx.netDeposit.toLocaleString()}</p>
              <p className="text-[10px] text-white/40">DS BaaS 통행료: ₩{tx.dsBaasFee}</p>
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
    <section className="py-10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#07071e] via-[#0b0e36] to-[#050518] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[32rem] h-80 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-3">
            <LiveDot />
            <span className="text-xs text-indigo-300 font-semibold tracking-wide">신한금융그룹 7대 계열사 독점 시너지엔진</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
            신한 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">7-Core</span> 금융 시너지 & 수익 대시보드
          </h2>
          <p className="text-white/60 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            점주와 알바생의 현장 고통을 해결하는 순간, 0.1초 퇴근 스와이프 1번으로 7개 계열사의 독점적 정산·대출·보험·투자·BaaS 결제망이 일제히 가동됩니다.
          </p>
        </div>

        {/* KPI 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 break-keep">
          {[
            {
              label: '누적 7-Core 트랜잭션',
              value: `${totalTx.toLocaleString()}건`,
              sub: `+${simulatedTx} 시뮬레이션 합산`,
              color: 'from-blue-500/20 to-indigo-500/10',
              border: 'border-blue-500/30',
            },
            {
              label: '신한 7대 계열사 연간 창출 수익',
              value: totalRevenue > 0 ? `₩${(totalRevenue / 100000000).toFixed(1)}억/년` : '₩48.2억/년',
              sub: 'CASA + 마이크로보험 + 카드결제 + ETF + BaaS 통행료',
              color: 'from-emerald-500/20 to-teal-500/10',
              border: 'border-emerald-500/30',
            },
            {
              label: 'PG 수수료 절감 (vs 알바몬)',
              value: data ? `₩${Math.round((data?.competitive?.annualSavings ?? 0) / 100000000)}억/년` : '₩15억/년',
              sub: '3.0% → 0.0% · 100만 워커 기준',
              color: 'from-purple-500/20 to-violet-500/10',
              border: 'border-purple-500/30',
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${kpi.color} border ${kpi.border} rounded-2xl p-3.5 backdrop-blur-sm break-keep`}
            >
              <p className="text-white/70 text-[11px] mb-1 font-medium leading-snug break-keep">{kpi.label}</p>
              <p className="text-xl font-black text-white whitespace-nowrap font-mono">{kpi.value}</p>
              <p className="text-[10px] text-white/50 mt-1 break-keep leading-tight">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* 7개 계열사 그리드 (모바일 2열 고가독성) */}
        <div>
          <div className="flex items-center justify-between mb-2.5 break-keep">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 break-keep">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>신한 7대 계열사 비즈니스 시너지 파이프라인</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
              7개사 전원 가동
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 border rounded-2xl p-5 backdrop-blur-md relative overflow-hidden"
              style={{ borderColor: activeSubData.color + '60' }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 blur-3xl opacity-15 pointer-events-none" style={{ background: activeSubData.color }} />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: activeSubData.color }} />
                  <h4 className="text-lg font-black text-white">{activeSubData.name}</h4>
                  {activeSubData.subtitle && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-white/70 font-medium">
                      {activeSubData.subtitle}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full text-white" style={{ background: activeSubData.color + '40' }}>
                  {activeSubData.synergyGoal}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 현장 고통 */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-red-400 px-2 py-0.5 bg-red-500/20 rounded-md">
                      🚨 [현장 고통]
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">
                    {activeSubData.painPoint}
                  </p>
                </div>

                {/* 수익 시너지 */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/20 rounded-md">
                      💰 [수익 시너지]
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">
                    {activeSubData.synergy}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 하단 패널: 실시간 정산 피드 + 7-Core Saga 시뮬레이션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 실시간 피드 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white/90 flex items-center gap-2">
                <LiveDot />
                7-Core 실시간 정산 원장 피드
              </h3>
              <span className="text-[10px] text-white/40">{data?.mode ?? 'MOCK'} MODE</span>
            </div>
            {data?.recentTransactions?.length ? (
              <TransactionFeed transactions={data.recentTransactions} />
            ) : (
              <div className="text-center text-white/30 py-6 text-xs">
                정산 없음 → 오른쪽 버튼으로 시뮬레이션 실행
              </div>
            )}
          </div>

          {/* 7-Core 시뮬레이션 패널 */}
          <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-500/20 rounded-2xl p-4 backdrop-blur-sm flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  ⚡ 0.1초 퇴근 정산 7-Core Saga 시뮬레이션
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Saga v2 Engine
                </span>
              </div>
              <p className="text-[11px] text-white/60 mb-3">알바생 4시간 근무 완료 → 출퇴근 스와이프 1번으로 7개 계열사 일제 연동</p>
              
              <div className="space-y-1.5 text-[11px]">
                {[
                  { icon: '🏦', label: '신한은행', action: 'CASA 모계좌 ₩50,000 이체 + SBT 근태 박제', color: 'text-blue-400' },
                  { icon: '🛡️', label: '신한EZ손해보험', action: '마이크로 상해/배상책임 ₩150 자동 정산', color: 'text-cyan-400' },
                  { icon: '💳', label: '신한카드', action: '점주 일일한도 부여 + ACS 대안신용 +5점', color: 'text-pink-400' },
                  { icon: '🌿', label: '신한라이프', action: '1% 마이크로 연금 ₩302 적립 + GPS 생체DB', color: 'text-emerald-400' },
                  { icon: '📈', label: '신한투자증권', action: '끝전 ₩850 우량 ETF/STO 소수점 자동 매수', color: 'text-amber-400' },
                  { icon: '🪙', label: '신한저축/캐피탈', action: '0.1초 중금리 Cascade + 로봇 B2B 리스 승인', color: 'text-orange-400' },
                  { icon: '⚙️', label: '신한DS', action: 'API 게이트웨이 BaaS 통행료 ₩200 자동 징수', color: 'text-purple-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/5">
                    <span className="text-white/70 font-medium">{item.icon} {item.label}</span>
                    <span className={`font-bold ${item.color} truncate max-w-[14rem]`}>{item.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSimulate}
              disabled={simulating}
              className={`
                w-full py-3 rounded-xl font-bold text-sm transition-all mt-2 shadow-lg
                ${simulating
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'}
              `}
            >
              {simulating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  7-Core Saga 무중단 실행 중...
                </span>
              ) : '▶ 0.1초 퇴근 정산 실행 (7-Core 원장 기록)'}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
