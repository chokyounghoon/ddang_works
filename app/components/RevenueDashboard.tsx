'use client';

// app/components/RevenueDashboard.tsx
// 실시간 수익 대시보드 — 신한 5개 계열사 재무 지표 시각화
// Framer Motion + Tailwind CSS v4

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevenueStore } from '../../store/revenueStore';

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

// ── 계열사 수익 카드 ──
function SubsidiaryCard({
  name, color, revenuePerTx, annualProjection, isHighlight, index
}: {
  name: string; color: string; revenuePerTx: number;
  annualProjection: number; isHighlight?: boolean; index: number;
}) {
  const annualCount = useCountUp(annualProjection, 1500 + index * 200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 180 }}
      style={{ borderColor: color + '40' }}
      className={`
        relative rounded-2xl border p-4 backdrop-blur-sm overflow-hidden
        ${isHighlight ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/5'}
        hover:bg-white/10 transition-all duration-300
      `}
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20" style={{ background: color }} />

      {/* 이름 + 단가 */}
      <div className="flex items-start justify-between mb-3 relative gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-xs font-bold text-white/80 truncate">{name}</span>
        </div>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full font-mono flex-shrink-0 whitespace-nowrap"
          style={{ background: color + '30', color }}
        >
          ₩{revenuePerTx.toLocaleString()}/건
        </span>
      </div>

      {/* 연간 수익 */}
      <div className="relative">
        <p className="text-lg font-bold text-white tracking-tight">
          ₩{(annualCount / 100000000).toFixed(1)}
          <span className="text-xs font-normal text-white/50 ml-0.5">억/년</span>
        </p>
        <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (annualProjection / 3000000000) * 100)}%` }}
            transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[10px] text-white/40 mt-1">100만 워커 기준</p>
      </div>
    </motion.div>
  );
}

// ── 실시간 트랜잭션 피드 ──
function TransactionFeed({ transactions }: { transactions: Array<{ txId: string; grossPay: number; lifePremium: number; netDeposit: number; dsBaasFee: number; createdAt: string }> }) {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                W
              </div>
              <div>
                <p className="text-xs font-mono text-white/70">{tx.txId}</p>
                <p className="text-xs text-white/40">{new Date(tx.createdAt).toLocaleTimeString('ko-KR')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-400">+₩{tx.netDeposit.toLocaleString()}</p>
              <p className="text-xs text-white/40">DS: ₩{tx.dsBaasFee}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── 메인 대시보드 컴포넌트 ──
export default function RevenueDashboard() {
  const { data, loading, fetchRevenue, simulatedTx, simulateTransaction } = useRevenueStore();
  const [simulating, setSimulating] = useState(false);
  const totalTx = useCountUp((data?.summary?.totalTransactions ?? 0) + simulatedTx, 800);
  const totalRevenue = useCountUp(
    ((data?.summary?.totalGrossPay ?? 0) + simulatedTx * 48500) * 0.03 +
    simulatedTx * 302 + simulatedTx * 200,
    1000
  );

  useEffect(() => { fetchRevenue(); }, []);

  // 주기적 자동 갱신 (10초)
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
  const subList: Array<{
    key: string; index: number; isHighlight?: boolean;
    name: string; color: string; revenuePerTx: number; annualProjection: number;
  }> = subs ? [
    { key: 'bank',   ...subs.bank,   index: 0 },
    { key: 'life',   ...subs.life,   index: 1, isHighlight: true },
    { key: 'card',   ...subs.card,   index: 2 },
    { key: 'invest', ...subs.invest, index: 3 },
    { key: 'ds',     ...subs.ds,     index: 4, isHighlight: true },
  ] : [];

  return (
    <section className="py-10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#0d1140] to-[#080820] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-3">
            <LiveDot />
            <span className="text-[11px] text-emerald-400 font-semibold">실시간 수익 집계 엔진</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-2 leading-tight">
            신한 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">5-Core</span> 수익 대시보드
          </h2>
          <p className="text-white/50 text-xs leading-relaxed">
            트랜잭션 1건당 5개 계열사가 동시에 수익 창출하는 Flywheel 구조.
            Cloudflare D1 원장 실시간 적재.
          </p>
        </div>

        {/* KPI 카드 — 모바일 1열, 태블릿+ 3열 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            {
              label: '누적 트랜잭션',
              value: `${totalTx.toLocaleString()}건`,
              sub: `+${simulatedTx} 시뮬레이션`,
              color: 'from-blue-500/20 to-indigo-500/10',
              border: 'border-blue-500/30',
            },
            {
              label: '신한 총 수익 (추정)',
              value: `₩${totalRevenue.toLocaleString()}`,
              sub: 'PG 절감 + 보험 + BaaS',
              color: 'from-emerald-500/20 to-teal-500/10',
              border: 'border-emerald-500/30',
            },
            {
              label: 'PG 절감 (vs 경쟁사)',
              value: data ? `₩${Math.round((data?.competitive?.annualSavings ?? 0) / 100000000)}억/년` : '계산 중...',
              sub: '3% → 0% · 100만 워커 기준',
              color: 'from-violet-500/20 to-purple-500/10',
              border: 'border-violet-500/30',
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${kpi.color} border ${kpi.border} rounded-2xl p-4 backdrop-blur-sm`}
            >
              <p className="text-white/50 text-[11px] mb-1 font-medium">{kpi.label}</p>
              <p className="text-xl font-black text-white">{kpi.value}</p>
              <p className="text-[10px] text-white/40 mt-1">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* 계열사 수익 — 모바일 2열, sm+ 5열 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {subList.map(({ key: id, name, color, revenuePerTx, annualProjection, isHighlight, index }) => (
            <SubsidiaryCard
              key={id}
              name={name}
              color={color}
              revenuePerTx={revenuePerTx}
              annualProjection={annualProjection}
              isHighlight={isHighlight}
              index={index}
            />
          ))}
        </div>

        {/* 하단 — 상하로 배치 */}
        <div className="grid grid-cols-1 gap-4">
          {/* 실시간 피드 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white/80 flex items-center gap-2">
                <LiveDot />
                실시간 정산 피드
              </h3>
              <span className="text-[10px] text-white/30">{data?.mode ?? 'MOCK'} MODE</span>
            </div>
            {data?.recentTransactions?.length ? (
              <TransactionFeed transactions={data.recentTransactions} />
            ) : (
              <div className="text-center text-white/30 py-6 text-xs">
                정산 없음 → 아래 버튼으로 시뮬레이션
              </div>
            )}
          </div>

          {/* 시뮬레이션 패널 */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-4 backdrop-blur-sm flex flex-col justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white/80 mb-1">⚡ 퇴근 정산 시뮬레이션</h3>
              <p className="text-[11px] text-white/50 mb-3">이지성 4시간 → BFF Saga 실행</p>
              <div className="space-y-1.5">
                {[
                  { icon: '🏦', label: '신한은행', value: '₩49,850 즉시 이체', color: 'text-blue-400' },
                  { icon: '☂️', label: '신한라이프', value: '₩302 차감', color: 'text-emerald-400' },
                  { icon: '💳', label: '신한카드', value: 'ACS +5점', color: 'text-red-400' },
                  { icon: '📈', label: '신한투자증권', value: '₩850 ETF', color: 'text-orange-400' },
                  { icon: '⚙️', label: '신한DS', value: '₩200 BaaS', color: 'text-violet-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-1.5">
                    <span className="text-[11px] text-white/60">{item.icon} {item.label}</span>
                    <span className={`text-[11px] font-bold ${item.color}`}>{item.value}</span>
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
                w-full py-3 rounded-xl font-bold text-sm transition-all
                ${simulating
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'}
              `}
            >
              {simulating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Saga 실행 중...
                </span>
              ) : '▶ 퇴근 정산 실행 (D1 원장 기록)'}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
