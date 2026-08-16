'use client';

// app/components/EmployerMyPage.tsx — 땡겨요 WORKS 점주 마이페이지 리뉴얼
// 땡겨요 공식 시그니처 레드(#FB521C) + 신한 딥 네이비(#0F172A) + 클린 라이트(#F8FAFC) 테마

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
  인건비: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
  수수료: { bg: 'bg-orange-50',  text: 'text-[#FB521C]',  border: 'border-orange-200'  },
  매출:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  수익:   { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200'  },
  환불:   { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200'    },
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
      className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${color} bg-orange-50`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-none">{label}</p>
      </div>
      <p className="text-base font-black text-slate-900 leading-none">{value}</p>
      {sub && <p className="text-[9.5px] text-slate-400 mt-1 leading-none font-medium">{sub}</p>}
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
  const cat = CAT_STYLE[tx.category] ?? { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
    >
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 p-3.5 text-left">
        {/* icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isIn ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-orange-50 text-[#FB521C] border border-orange-200'}`}>
          {isIn
            ? <ArrowDownLeft className="w-4 h-4" />
            : <ArrowUpRight className="w-4 h-4" />
          }
        </div>
        {/* info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{tx.label}</p>
          <p className="text-[9.5px] text-slate-400 font-mono mt-0.5">{tx.date}</p>
        </div>
        {/* amount + category */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <p className={`text-sm font-black ${isIn ? 'text-emerald-600' : 'text-[#FB521C]'}`}>
            {isIn ? '+' : '−'}₩{tx.amount.toLocaleString()}
          </p>
          <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
            {tx.category}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-3.5 mb-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-[10.5px]">
              <div className="flex gap-2">
                <span className="text-slate-400 font-bold shrink-0">처리방식</span>
                <span className="text-slate-700 font-medium">{tx.method}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 font-bold shrink-0">상세내역</span>
                <span className="text-slate-700 font-medium leading-relaxed">{tx.detail}</span>
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
      className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
    >
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 p-3.5 text-left">
        {/* avatar */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${a.noshow ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-orange-50 text-[#FB521C] border border-orange-200'}`}>
          {initial}
        </div>
        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs font-bold text-slate-900">{a.name}</p>
            {a.gender !== '-' && (
              <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">{a.gender} · {a.age}세</span>
            )}
            {a.noshow
              ? <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" /> 노쇼</span>
              : <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" /> 완료</span>
            }
          </div>
          <p className="text-[9.5px] text-slate-400 mt-0.5 truncate font-medium">{a.role} · {a.store}</p>
        </div>
        {/* pay */}
        <div className="text-right shrink-0">
          <p className="text-sm font-black text-slate-900">{a.pay > 0 ? `₩${a.pay.toLocaleString()}` : '—'}</p>
          {a.dgcs > 0 && <p className="text-[9px] text-[#FB521C] font-bold mt-0.5">D-GCS {a.dgcs}</p>}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
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
                <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wide">{item.label}</p>
                  <p className="text-slate-800 font-bold mt-0.5 leading-snug">{item.value}</p>
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
      className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 shadow-xs"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
          <p className="text-[9.5px] text-slate-500 mt-0.5 leading-snug font-medium">{item.note}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FB521C] border border-orange-200">
            {item.badge}
          </span>
          <span className="text-xs font-bold text-slate-900">₩{item.amount}</span>
          <span className="text-[9px] text-slate-400">({item.pct}%)</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-[#FB521C]"
        />
      </div>
      {item.accum > 0 && (
        <p className="text-[9.5px] text-slate-500">누적 적립 <span className="text-slate-800 font-bold">₩{item.accum.toLocaleString()}</span></p>
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
    <button onClick={onClick} className="relative flex flex-col items-center gap-1 py-2 px-1 w-full transition-all active:scale-95">
      {active && (
        <motion.div layoutId="tab-indicator-emp"
          className="absolute inset-0 bg-orange-50 border border-orange-200 rounded-xl shadow-xs"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className={`relative w-4 h-4 transition-colors ${active ? 'text-[#FB521C]' : 'text-slate-400'}`} />
      <span className={`relative text-[10px] font-bold transition-colors ${active ? 'text-[#FB521C]' : 'text-slate-500'}`}>{label}</span>
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
    <div className="min-h-full bg-[#F8FAFC] pb-8 text-slate-900 font-sans">

      {/* ── Hero Header ── */}
      <div className="bg-white border-b border-slate-200/80 px-5 pt-5 pb-4 space-y-3.5 shadow-xs">
        {/* 상단 행 */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-black text-[#FB521C] tracking-widest uppercase">Employer Dashboard</span>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold ${isLive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-orange-50 text-[#FB521C] border border-orange-200'}`}>
                {isLive ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                {isLive ? 'D1 Live' : '스마트 연동'}
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">점주 마이페이지</h1>
          </div>
          <button onClick={fetchData} disabled={loading}
            className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all disabled:opacity-40">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 매장 정보 카드 */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FB521C] rounded-xl flex items-center justify-center font-bold text-base text-white shadow-xs shrink-0">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900">스타벅스 강남2호점</p>
            <p className="text-[10px] text-slate-500 mt-0.5">사업자 112-34-56789</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FB521C] border border-orange-200">
              Gold 파트너
            </span>
            {lastFetched && <p className="text-[8.5px] text-slate-400 mt-1">업데이트 {lastFetched}</p>}
          </div>
        </div>

        {/* 순이익 히어로 숫자 */}
        {kpi && (
          <div className="text-center py-2 bg-gradient-to-br from-orange-50/60 to-amber-50/40 rounded-2xl border border-orange-200/60">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">8월 추정 순이익</p>
            <p className="text-3xl font-black text-[#FB521C] tracking-tight">
              <AnimatedNumber value={kpi.netProfit} />
            </p>
            <p className="text-[10px] text-slate-500 mt-1">알바몬 대비 ₩34,200 절감 · 광고비 0원</p>
          </div>
        )}
      </div>

      {/* ── Tab Navigation ── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-1">
        <div className="grid grid-cols-5 gap-1">
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
            <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {!loading && data && (
        <AnimatePresence mode="wait">
          <motion.div key={section}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="px-4 py-4 space-y-4"
          >

            {/* ════ OVERVIEW ════ */}
            {section === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <StatCard label="총 매출" value={`₩${(kpi?.revenue ?? 0).toLocaleString()}`} sub="신한카드 D-1 정산" color="text-emerald-600" Icon={TrendingUp} />
                  <StatCard label="총 인건비" value={`₩${(kpi?.laborCost ?? 0).toLocaleString()}`} sub="0.1초 에스크로 지급" color="text-blue-600" Icon={User} delay={0.05} />
                  <StatCard label="시너지 수수료" value={`₩${(kpi?.effectiveFee ?? 0).toLocaleString()}`} sub="5% (광고비 0원)" color="text-[#FB521C]" Icon={Receipt} delay={0.1} />
                  <StatCard label="투자/연금 적립" value={`₩${((kpi?.etfAccum ?? 0) + (kpi?.pensionAccum ?? 0)).toLocaleString()}`} sub="알바생 자산 형성" color="text-purple-600" Icon={BarChart3} delay={0.15} />
                </div>

                {/* 최근 입출금 미리보기 */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-900">최근 입출금 내역</h3>
                    <button onClick={() => setSection('tx')} className="text-[10.5px] font-bold text-[#FB521C] hover:underline">
                      전체보기 →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {data.transactions.slice(0, 3).map((tx, i) => (
                      <TxRow key={tx.tx_id} tx={tx} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════ TRANSACTIONS ════ */}
            {section === 'tx' && (
              <div className="space-y-3">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  {(['all', 'in', 'out'] as const).map(f => (
                    <button key={f} onClick={() => setTxFilter(f)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${txFilter === f ? 'bg-[#FB521C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                      {f === 'all' ? '전체' : f === 'in' ? '입금(+)' : '출금(−)'}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {filteredTx.map((tx, i) => (
                    <TxRow key={tx.tx_id} tx={tx} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* ════ ALBA LIST ════ */}
            {section === 'alba' && (
              <div className="space-y-3">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex justify-around text-center shadow-xs">
                  <div>
                    <p className="text-[9.5px] text-slate-400 font-bold">정상 완료</p>
                    <p className="text-sm font-black text-emerald-600 mt-0.5">{doneCount}명</p>
                  </div>
                  <div className="border-r border-slate-100" />
                  <div>
                    <p className="text-[9.5px] text-slate-400 font-bold">노쇼</p>
                    <p className="text-sm font-black text-rose-600 mt-0.5">{noShowCount}명</p>
                  </div>
                  <div className="border-r border-slate-100" />
                  <div>
                    <p className="text-[9.5px] text-slate-400 font-bold">지급 알바비</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">₩{totalPay.toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {data.albaList.map((a, i) => (
                    <AlbaRow key={a.id} a={a} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* ════ INVEST ════ */}
            {section === 'invest' && (
              <div className="space-y-3">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-900">5% 수수료 자동 분배 현황</h3>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FB521C] border border-orange-200">
                      100% 투명 분배
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {data.investAlloc.map((item, i) => (
                      <InvestBar key={item.name} item={item} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════ PROFIT ════ */}
            {section === 'profit' && (
              <div className="space-y-3">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3.5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">8월 손익 정산서</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">총 카드 매출</span>
                      <span className="font-bold text-slate-900">₩{(kpi?.revenue ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">총 인건비 지출</span>
                      <span className="font-bold text-[#FB521C]">−₩{(kpi?.laborCost ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">5% 플랫폼 수수료</span>
                      <span className="font-bold text-[#FB521C]">−₩{(kpi?.effectiveFee ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1.5 font-bold text-sm bg-orange-50/50 p-2 rounded-xl border border-orange-100">
                      <span className="text-slate-900">추정 순이익</span>
                      <span className="text-[#FB521C]">₩{(kpi?.netProfit ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
