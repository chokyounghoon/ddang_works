'use client';

// app/components/EmployerMyPage.tsx — Premium 점주 마이페이지 리뉴얼

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown,
  User, Wallet, BarChart3, Receipt, CreditCard, Building2,
  ChevronDown, ChevronUp, RefreshCw, Wifi, WifiOff,
  ShieldCheck, Star, Clock, CheckCircle2, AlertTriangle,
  Banknote, PieChart, Layers, Zap, FileText,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

interface TxItem {
  tx_id: string; type: 'in' | 'out'; label: string; amount: number;
  date: string; method: string; detail: string; category: string;
}
interface AlbaItem {
  id: string; name: string; age: number; gender: string; role: string;
  store: string; date: string; pay: number; dgcs: number; noshow: boolean;
}
interface InvestItem {
  name: string; pct: number; amount: number; color: string;
  badge: string; accum: number; note: string;
}
interface KPI {
  revenue: number; laborCost: number; feePaid: number; netProfit: number;
  feeRefund: number; effectiveFee: number;
  etfAccum: number; pensionAccum: number; feeRebate: number; netSaved: number; txCount?: number;
}
interface DashboardData {
  source: 'd1' | 'fallback'; dataTimestamp: string;
  transactions: TxItem[]; albaList: AlbaItem[];
  investAlloc: InvestItem[]; kpi: KPI;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const CAT_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  인건비: { bg: 'bg-blue-500/15',    text: 'text-blue-300',    border: 'border-blue-500/30'    },
  수수료: { bg: 'bg-amber-500/15',   text: 'text-amber-300',   border: 'border-amber-500/30'   },
  매출:   { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  수익:   { bg: 'bg-violet-500/15',  text: 'text-violet-300',  border: 'border-violet-500/30'  },
  환불:   { bg: 'bg-rose-500/15',    text: 'text-rose-300',    border: 'border-rose-500/30'    },
};

// ─── Micro Components ──────────────────────────────────────────────────────

function StatCard({
  label, value, sub, color, Icon, delay = 0,
}: {
  label: string; value: string; sub?: string;
  color: string; Icon: React.ElementType; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden bg-white/[0.04] border border-white/10 rounded-2xl p-3.5"
    >
      {/* glow */}
      <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-20 ${color}`} />
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${color} bg-opacity-20 border border-white/10`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <p className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest leading-none">{label}</p>
      </div>
      <p className="text-lg font-black text-white leading-none">{value}</p>
      {sub && <p className="text-[9.5px] text-white/40 mt-1 leading-none">{sub}</p>}
    </motion.div>
  );
}

function AnimatedNumber({ value, prefix = '₩' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(0);
  useEffect(() => {
    const duration = 900;
    const startTime = performance.now();
    const from = start.current;
    const to = value;
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
      else start.current = to;
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}</>;
}

// ─── TxRow ─────────────────────────────────────────────────────────────────

function TxRow({ tx, index }: { tx: TxItem; index: number }) {
  const [open, setOpen] = useState(false);
  const isIn = tx.type === 'in';
  const cat = CAT_STYLE[tx.category] ?? { bg: 'bg-white/5', text: 'text-white/50', border: 'border-white/10' };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
    >
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 p-3.5 text-left">
        {/* icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isIn ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-rose-500/15 border border-rose-400/25'}`}>
          {isIn
            ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            : <ArrowUpRight className="w-4 h-4 text-rose-400" />
          }
        </div>
        {/* info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{tx.label}</p>
          <p className="text-[9.5px] text-white/35 font-mono mt-0.5">{tx.date}</p>
        </div>
        {/* amount + category */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <p className={`text-sm font-black ${isIn ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isIn ? '+' : '−'}₩{tx.amount.toLocaleString()}
          </p>
          <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
            {tx.category}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/30 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-3.5 mb-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-[10.5px]">
              <div className="flex gap-2">
                <span className="text-white/35 font-bold shrink-0">처리방식</span>
                <span className="text-white/70">{tx.method}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-white/35 font-bold shrink-0">상세내역</span>
                <span className="text-white/70 leading-relaxed">{tx.detail}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── AlbaRow ───────────────────────────────────────────────────────────────

function AlbaRow({ a, index }: { a: AlbaItem; index: number }) {
  const [open, setOpen] = useState(false);
  const initial = a.name[0] ?? '?';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
    >
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 p-3.5 text-left">
        {/* avatar */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${a.noshow ? 'bg-rose-500/20 border border-rose-400/30 text-rose-300' : 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-200'}`}>
          {initial}
        </div>
        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs font-bold text-white">{a.name}</p>
            {a.gender !== '-' && (
              <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/50">{a.gender} · {a.age}세</span>
            )}
            {a.noshow
              ? <span className="text-[8.5px] font-black px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" /> 노쇼</span>
              : <span className="text-[8.5px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" /> 완료</span>
            }
          </div>
          <p className="text-[9.5px] text-white/35 mt-0.5 truncate">{a.role} · {a.store}</p>
        </div>
        {/* pay */}
        <div className="text-right shrink-0">
          <p className="text-sm font-black text-white">{a.pay > 0 ? `₩${a.pay.toLocaleString()}` : '—'}</p>
          {a.dgcs > 0 && <p className="text-[9px] text-indigo-300/80 mt-0.5">D-GCS {a.dgcs}</p>}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/30 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-3.5 mb-3.5 grid grid-cols-2 gap-2 text-[10.5px]">
              {[
                { label: '근무 일시', value: a.date || '—' },
                { label: 'D-GCS', value: a.dgcs > 0 ? `${a.dgcs}점` : '—' },
                { label: '알바비', value: a.pay > 0 ? `₩${a.pay.toLocaleString()}` : '—' },
                { label: '처리 상태', value: a.noshow ? '노쇼 → 에스크로 자동 환불' : '정상 완료 · 0.1초 즉시정산' },
              ].map(item => (
                <div key={item.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-2.5">
                  <p className="text-white/35 font-bold text-[9px] uppercase tracking-wide">{item.label}</p>
                  <p className="text-white font-black mt-0.5 leading-snug">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Invest Bar ────────────────────────────────────────────────────────────

function InvestBar({ item, index }: { item: InvestItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="space-y-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-white/80 truncate">{item.name}</p>
          <p className="text-[9px] text-white/35 mt-0.5 leading-snug">{item.note}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r ${item.color} text-white`}>
            {item.badge}
          </span>
          <span className="text-xs font-black text-white">₩{item.amount}</span>
          <span className="text-[9px] text-white/40">({item.pct}%)</span>
        </div>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
        />
      </div>
      {item.accum > 0 && (
        <p className="text-[9px] text-white/30">누적 적립 <span className="text-white/70 font-black">₩{item.accum.toLocaleString()}</span></p>
      )}
    </motion.div>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────────────

type Section = 'overview' | 'tx' | 'alba' | 'invest' | 'profit';

function TabBtn({ id, label, Icon, active, onClick }: {
  id: string; label: string; Icon: React.ElementType; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center gap-1 py-2.5 px-1 w-full">
      {active && (
        <motion.div layoutId="tab-indicator"
          className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent border border-white/15 rounded-xl"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className={`relative w-4 h-4 transition-colors ${active ? 'text-white' : 'text-white/30'}`} />
      <span className={`relative text-[9.5px] font-black transition-colors ${active ? 'text-white' : 'text-white/30'}`}>{label}</span>
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function EmployerMyPage() {
  const [section, setSection] = useState<Section>('overview');
  const [txFilter, setTxFilter] = useState<'all' | 'in' | 'out'>('all');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

const FALLBACK_DASHBOARD_DATA: DashboardData = {
  source: 'fallback',
  dataTimestamp: new Date().toISOString(),
  transactions: [
    { tx_id: 'tx_001', type: 'out', label: '조이수 알바비 정산',           amount: 58000,  date: '08.02 22:01', method: '신한 에스크로 0.1초 즉시',  detail: '하남돼지집 부평역점 야간 서빙 4h',                            category: '인건비' },
    { tx_id: 'tx_002', type: 'out', label: '5% 시너지 수수료',             amount: 2900,   date: '08.02 22:01', method: '신한DS 자동 정산',           detail: '신한EZ보험₩1,450 + ETF기여분₩850(점주100%부담) + Infra₩600', category: '수수료' },
    { tx_id: 'tx_003', type: 'in',  label: '신한카드 매출 입금',           amount: 423000, date: '08.02 18:30', method: '신한카드 가맹점 정산',        detail: '스타벅스 강남2호점 D-1 정산',                                  category: '매출'   },
    { tx_id: 'tx_004', type: 'out', label: '박민준 알바비 정산',           amount: 54000,  date: '08.02 14:00', method: '신한 에스크로 0.1초 즉시',   detail: '스타벅스 강남2호점 홀서빙 4h',                                 category: '인건비' },
    { tx_id: 'tx_005', type: 'out', label: '5% 시너지 수수료',             amount: 2700,   date: '08.02 14:00', method: '신한DS 자동 정산',           detail: '증권ETF ₩850 — 점주 수수료 100% 지원',                        category: '수수료' },
    { tx_id: 'tx_006', type: 'in',  label: '대출 이자 감면 리베이트',       amount: 4250,   date: '08.01 23:59', method: '신한투자증권 자동 적립',      detail: '점주 ETF 적립금 B2B 대출 이자 감면 환원',                     category: '수익'   },
    { tx_id: 'tx_007', type: 'out', label: '김수아 알바비 정산',           amount: 30000,  date: '08.01 13:30', method: '신한 에스크로 0.1초 즉시',   detail: '컴포즈커피 역삼역점 오전 2h',                                  category: '인건비' },
    { tx_id: 'tx_008', type: 'in',  label: '카드매출 입금',                amount: 287000, date: '08.01 18:00', method: '신한카드 가맹점 정산',        detail: 'D-1 정산 (신한카드 가맹점 수수료 0%)',                         category: '매출'   },
  ],
  albaList: [
    { id: 'a1', name: '조이수', age: 24, gender: '남', role: '야간 서빙',   store: '하남돼지집 부평역점', date: '08.02 18:00–22:00', pay: 58000, dgcs: 980, noshow: false },
    { id: 'a2', name: '박민준', age: 22, gender: '남', role: '홀 서빙',     store: '스타벅스 강남2호점',  date: '08.02 14:00–18:00', pay: 54000, dgcs: 920, noshow: false },
    { id: 'a3', name: '김수아', age: 21, gender: '여', role: '음료 조리',   store: '컴포즈커피 역삼역점', date: '08.01 11:30–13:30', pay: 30000, dgcs: 860, noshow: false },
    { id: 'a4', name: '최현우', age: 25, gender: '남', role: '편의점 세팅', store: 'CU 강남파이낸스점',   date: '07.31 12:00–13:00', pay: 16000, dgcs: 640, noshow: true  },
    { id: 'a5', name: '정예은', age: 20, gender: '여', role: '매장 진열',   store: '이마트 역삼점',       date: '07.30 10:00–15:00', pay: 65000, dgcs: 910, noshow: false },
  ],
  investAlloc: [
    { name: '신한투자증권 KODEX 미국S&P500 ETF', pct: 34, amount: 850, color: 'from-blue-500 to-indigo-600', badge: '점주 100% 지원', accum: 42500, note: '알바생 ETF 적립금 전액 지원' },
    { name: '신한EZ손해보험 마이크로 상해보험', pct: 46, amount: 1150, color: 'from-emerald-500 to-teal-600', badge: '보장중', accum: 0, note: '출근 스와이프 자동 보장' },
    { name: '신한라이프 마이크로 퇴직연금', pct: 12, amount: 300, color: 'from-violet-500 to-purple-600', badge: '적립중', accum: 18900, note: '마이크로 연금 적립' },
    { name: '신한DS 7-Core 인프라 운영', pct: 8, amount: 200, color: 'from-amber-500 to-orange-500', badge: '운영비', accum: 0, note: '인프라 서버 운영비' },
  ],
  kpi: {
    revenue: 710000, laborCost: 238000, feePaid: 11900, netProfit: 460100,
    feeRefund: 4250, effectiveFee: 7650, etfAccum: 42500, pensionAccum: 18900,
    feeRebate: 18200, netSaved: 43800, txCount: 10,
  },
};

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employer/dashboard?employer_id=employer-demo');
      if (res.ok) {
        const json: DashboardData = await res.json();
        setData(json);
        setIsLive(json.source === 'd1');
      } else {
        setData(FALLBACK_DASHBOARD_DATA);
        setIsLive(false);
      }
    } catch {
      setData(FALLBACK_DASHBOARD_DATA);
      setIsLive(false);
    } finally {
      setLastFetched(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const kpi = data?.kpi;
  const filteredTx = (data?.transactions ?? []).filter(t => txFilter === 'all' || t.type === txFilter);
  const noShowCount = (data?.albaList ?? []).filter(a => a.noshow).length;
  const doneCount   = (data?.albaList ?? []).filter(a => !a.noshow).length;
  const totalPay    = (data?.albaList ?? []).filter(a => !a.noshow).reduce((s, a) => s + a.pay, 0);

  const navTabs: { id: Section; label: string; Icon: React.ElementType }[] = [
    { id: 'overview', label: '종합',   Icon: BarChart3 },
    { id: 'tx',       label: '입출금', Icon: Wallet },
    { id: 'alba',     label: '알바',   Icon: User },
    { id: 'invest',   label: '투자',   Icon: TrendingUp },
    { id: 'profit',   label: '수익',   Icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-[#060818]">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden">
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/25 via-indigo-800/20 to-violet-900/30" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-8 right-8 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl" />

        <div className="relative px-5 pt-7 pb-5">
          {/* 상단 행 */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[8.5px] font-black text-blue-300/80 tracking-[0.2em] uppercase">Employer Dashboard</span>
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black ${isLive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'}`}>
                  {isLive ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                  {isLive ? 'D1 Live' : 'Local'}
                </div>
              </div>
              <h1 className="text-2xl font-black text-white leading-tight">점주 마이페이지</h1>
            </div>
            <button onClick={fetchData} disabled={loading}
              className="w-9 h-9 bg-white/8 border border-white/15 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/12 active:scale-95 transition-all disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* 매장 정보 카드 */}
          <div className="bg-white/[0.06] border border-white/[0.12] rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg shadow-blue-500/30 shrink-0">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white">스타벅스 강남2호점</p>
              <p className="text-[9.5px] text-white/40 mt-0.5">사업자 112-34-56789</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
                Gold 파트너
              </span>
              {lastFetched && <p className="text-[8.5px] text-white/30 mt-1">업데이트 {lastFetched}</p>}
            </div>
          </div>

          {/* 순이익 히어로 숫자 */}
          {kpi && (
            <div className="mt-4 text-center">
              <p className="text-[9.5px] text-white/40 font-bold uppercase tracking-widest mb-1">8월 추정 순이익</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                <AnimatedNumber value={kpi.netProfit} />
              </p>
              <p className="text-[9.5px] text-white/30 mt-1.5">알바몬 대비 ₩34,200 절감 · 광고비 0원</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="sticky top-0 z-20 bg-[#060818]/95 backdrop-blur-md border-b border-white/[0.06] px-4 py-1">
        <div className="grid grid-cols-5 gap-0.5">
          {navTabs.map(t => (
            <TabBtn key={t.id} id={t.id} label={t.label} Icon={t.Icon}
              active={section === t.id} onClick={() => setSection(t.id as Section)} />
          ))}
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="px-4 py-6 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 rounded-2xl bg-white/[0.04] animate-pulse border border-white/[0.06]" />
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {!loading && data && (
        <AnimatePresence mode="wait">
          <motion.div key={section}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="px-4 py-5 space-y-4"
          >

            {/* ════ OVERVIEW ════ */}
            {section === 'overview' && kpi && (
              <div className="space-y-4">
                {/* KPI 그리드 */}
                <div className="grid grid-cols-2 gap-2.5">
                  <StatCard label="총 매출"     value={`₩${kpi.revenue.toLocaleString()}`}   color="bg-emerald-500" Icon={TrendingUp}   delay={0}    />
                  <StatCard label="총 인건비"   value={`₩${kpi.laborCost.toLocaleString()}`}  color="bg-blue-500"    Icon={User}         delay={0.05} />
                  <StatCard label="납부 수수료" value={`₩${kpi.feePaid.toLocaleString()}`}     color="bg-amber-500"   Icon={CreditCard}   delay={0.1}  />
                  <StatCard label="실질 수수료" value={`₩${kpi.effectiveFee.toLocaleString()}`} sub="리베이트 차감 후" color="bg-violet-500" Icon={Zap} delay={0.15} />
                </div>

                {/* 절감 하이라이트 */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs font-black text-emerald-300">수수료 리베이트 구조</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-[9px] text-white/40">납부 수수료</p>
                      <p className="text-base font-black text-rose-400">₩{kpi.feePaid.toLocaleString()}</p>
                    </div>
                    <div className="text-white/30 text-sm">−</div>
                    <div className="text-center">
                      <p className="text-[9px] text-white/40">ETF 리베이트</p>
                      <p className="text-base font-black text-blue-400">₩{kpi.feeRefund.toLocaleString()}</p>
                    </div>
                    <div className="text-white/30 text-sm">=</div>
                    <div className="text-center">
                      <p className="text-[9px] text-white/40">실질 부담</p>
                      <p className="text-base font-black text-emerald-300">₩{kpi.effectiveFee.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* 빠른 이동 */}
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: 'tx',     label: '입출금 내역', sub: `총 ${data.transactions.length}건`, Icon: Wallet,    color: 'from-blue-500/20 to-indigo-500/20' },
                    { id: 'alba',   label: '알바 정보',  sub: `완료 ${doneCount}건 · 노쇼 ${noShowCount}건`, Icon: User, color: 'from-violet-500/20 to-purple-500/20' },
                    { id: 'invest', label: '투자 내역',  sub: `ETF 누적 ₩${kpi.etfAccum.toLocaleString()}`, Icon: TrendingUp, color: 'from-emerald-500/20 to-teal-500/20' },
                    { id: 'profit', label: '수익 현황',  sub: `절감액 ₩${kpi.netSaved.toLocaleString()}`, Icon: BarChart3, color: 'from-amber-500/20 to-orange-500/20' },
                  ] as { id: Section; label: string; sub: string; Icon: React.ElementType; color: string }[]).map(item => (
                    <button key={item.id} onClick={() => setSection(item.id)}
                      className={`bg-gradient-to-br ${item.color} border border-white/10 rounded-2xl p-3.5 text-left hover:border-white/25 active:scale-95 transition-all`}>
                      <item.Icon className="w-4 h-4 text-white/60 mb-2" />
                      <p className="text-xs font-black text-white">{item.label}</p>
                      <p className="text-[9.5px] text-white/40 mt-0.5">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ════ 입출금 내역 ════ */}
            {section === 'tx' && (
              <div className="space-y-3">
                {/* 잔액 요약 */}
                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-400/20 rounded-2xl p-4">
                  <p className="text-[9.5px] text-blue-300/70 font-bold uppercase tracking-widest mb-1">이번달 순 입출금</p>
                  <p className="text-3xl font-black text-white">+₩480,350</p>
                  <div className="flex gap-4 mt-2 text-[10px]">
                    <p className="text-emerald-300 font-bold">↓ 입금 ₩730,250</p>
                    <p className="text-rose-300 font-bold">↑ 출금 ₩249,900</p>
                  </div>
                </div>

                {/* 필터 */}
                <div className="flex gap-2">
                  {(['all', 'in', 'out'] as const).map(f => (
                    <button key={f} onClick={() => setTxFilter(f)}
                      className={`flex-1 py-2 rounded-xl text-[10.5px] font-black transition-all ${txFilter === f ? 'bg-white/15 text-white border border-white/20' : 'bg-white/[0.03] text-white/35 border border-white/8 hover:text-white/60'}`}>
                      {f === 'all' ? '전체' : f === 'in' ? '↓ 입금' : '↑ 출금'}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {filteredTx.map((tx, i) => <TxRow key={tx.tx_id} tx={tx} index={i} />)}
                </div>
              </div>
            )}

            {/* ════ 알바 정보 ════ */}
            {section === 'alba' && (
              <div className="space-y-3">
                {/* 스탯 배너 */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '근무 완료', value: `${doneCount}건`,  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-400/20' },
                    { label: '노쇼 발생', value: `${noShowCount}건`, color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-400/20' },
                    { label: '지급 알바비', value: `₩${totalPay.toLocaleString()}`, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-400/20' },
                  ].map(s => (
                    <div key={s.label} className={`${s.bg} border rounded-2xl p-3 text-center`}>
                      <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] text-white/35 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* 노쇼 에스크로 알림 */}
                {noShowCount > 0 && (
                  <div className="bg-rose-500/10 border border-rose-400/20 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-rose-300">노쇼 {noShowCount}건 에스크로 자동 환불 완료</p>
                      <p className="text-[9.5px] text-white/40 mt-0.5">신한은행 스마트 계약 — 0.1초 즉시 반환</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {data.albaList.map((a, i) => <AlbaRow key={a.id} a={a} index={i} />)}
                </div>
              </div>
            )}

            {/* ════ 투자 내역 ════ */}
            {section === 'invest' && (
              <div className="space-y-4">
                {/* ETF 점주 지원 배너 */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-400/25 rounded-2xl p-4">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400/15 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      <p className="text-xs font-black text-white">신한투자증권 ETF — 점주 수수료 100% 전액 지원</p>
                    </div>
                    <p className="text-[10.5px] text-white/55 leading-relaxed">
                      알바생 ETF 적립 비용(₩850/건)은 점주 납부 5% 수수료에서 전액 충당됩니다. 알바생 추가 부담 <span className="text-emerald-400 font-black">0원</span>
                    </p>
                  </div>
                </div>

                {/* 분배 바 */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 space-y-4">
                  <p className="text-[9.5px] font-black text-white/40 uppercase tracking-widest">건당 수수료 분배 (₩2,500)</p>
                  {(data.investAlloc ?? []).map((item, i) => (
                    <InvestBar key={item.name} item={item} index={i} />
                  ))}
                </div>

                {/* 누적 포트폴리오 */}
                <div className="bg-gradient-to-br from-indigo-600/15 to-violet-600/15 border border-indigo-400/20 rounded-2xl p-4 space-y-3">
                  <p className="text-[9.5px] font-black text-indigo-300/70 uppercase tracking-widest">누적 투자 포트폴리오</p>
                  {kpi && [
                    { label: '신한투자증권 ETF 적립 (점주 100% 지원)', value: `₩${kpi.etfAccum.toLocaleString()}`,     color: 'text-blue-300',    sub: 'KODEX 미국S&P500' },
                    { label: '신한라이프 마이크로 연금',                 value: `₩${kpi.pensionAccum.toLocaleString()}`, color: 'text-violet-300',  sub: '알바생 1% 연금 적립' },
                    { label: '대출 이자 감면 리베이트 합계',              value: `₩${kpi.feeRebate.toLocaleString()}`,    color: 'text-emerald-300', sub: '연 0.5% 이자 자동 감면' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.06] last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-[10.5px] font-bold text-white/70 leading-snug">{item.label}</p>
                        <p className="text-[9px] text-white/30">{item.sub}</p>
                      </div>
                      <p className={`text-sm font-black shrink-0 ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ 수익 현황 ════ */}
            {section === 'profit' && kpi && (
              <div className="space-y-4">
                {/* 손익 계산서 */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs font-black text-white">8월 손익 계산서</p>
                    <span className="ml-auto text-[8.5px] text-white/30 font-mono">가계정</span>
                  </div>
                  <div className="p-4 space-y-0">
                    {[
                      { label: '총 매출 (카드매출 + 기타)',          value: kpi.revenue,   sign: '+', color: 'text-emerald-400' },
                      { label: '인건비 (알바비 정산 합계)',           value: kpi.laborCost, sign: '−', color: 'text-rose-400' },
                      { label: '수수료 (ETF 포함 점주 100% 지원)',   value: kpi.feePaid,   sign: '−', color: 'text-amber-400' },
                      { label: '증권 ETF 리베이트 환원',             value: kpi.feeRefund, sign: '+', color: 'text-blue-400' },
                    ].map((row, i) => (
                      <div key={row.label} className={`flex justify-between items-center py-2.5 ${i < 3 ? 'border-b border-white/[0.05]' : ''}`}>
                        <p className="text-[10.5px] text-white/55 font-medium">{row.label}</p>
                        <p className={`text-xs font-black ${row.color}`}>{row.sign}₩{row.value.toLocaleString()}</p>
                      </div>
                    ))}

                    {/* 순이익 결과 */}
                    <div className="mt-3 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-400/25 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[9.5px] text-emerald-300/70 font-bold uppercase tracking-widest">추정 순이익</p>
                        <p className="text-2xl font-black text-emerald-300 mt-0.5">
                          <AnimatedNumber value={kpi.netProfit} />
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-white/30">알바몬 대비</p>
                        <p className="text-sm font-black text-white">₩34,200 절감</p>
                        <p className="text-[9.5px] text-emerald-400 font-bold mt-0.5">광고비 + 행정 0원</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 절감 효과 비교 */}
                <div className="bg-gradient-to-br from-indigo-600/12 to-blue-600/12 border border-indigo-400/20 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <p className="text-xs font-black text-white">알바몬 대비 절감 효과 (누적)</p>
                  </div>
                  {[
                    { label: '광고비 절감',               value: '₩0',               sub: '상단노출 ₩3~5만/회 → 0원',    plus: true },
                    { label: '행정비용 절감',              value: '₩0',               sub: '계약·정산·보험 자동화 → 0원', plus: true },
                    { label: '증권 ETF 리베이트',          value: `₩${kpi.feeRebate.toLocaleString()}`, sub: '점주 지원 ETF → 대출 이자 감면', plus: true },
                    { label: '노쇼 손실 방지',             value: '₩16,000',          sub: '에스크로 0.1초 자동 환불',    plus: true },
                    { label: '총 절감액 (추정)',            value: `₩${kpi.netSaved.toLocaleString()}`, sub: '이번달 총 비용 절감 추정액', plus: true },
                  ].map((item, i) => (
                    <div key={item.label}
                      className={`flex justify-between items-center py-2.5 ${i < 4 ? 'border-b border-white/[0.05]' : 'bg-white/[0.03] rounded-xl px-3 mt-2'}`}>
                      <div className="min-w-0">
                        <p className="text-[10.5px] text-white/60 font-bold">{item.label}</p>
                        <p className="text-[9px] text-white/30">{item.sub}</p>
                      </div>
                      <p className="text-sm font-black text-emerald-400 ml-2 shrink-0">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
