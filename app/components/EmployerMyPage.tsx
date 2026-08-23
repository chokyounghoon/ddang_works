'use client';

// app/components/EmployerMyPage.tsx — 땡겨요 WORKS 점주 인건비 & 수수료 통제 센터
// 땡겨요 시그니처 오렌지(#FB521C) + 신한 딥 네이비 + 클린 라이트 테마

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown,
  User, Wallet, BarChart3, Receipt, CreditCard, Building2,
  ChevronDown, ChevronUp, ChevronRight, RefreshCw, Wifi, WifiOff,
  ShieldCheck, Star, Clock, CheckCircle2, AlertTriangle,
  Banknote, PieChart, Layers, Zap, FileText, HelpCircle,
  Coins, Award, ShieldAlert, Sparkles, Check
} from 'lucide-react';
import EmployerTaxFactoringModal from './EmployerTaxFactoringModal';

// ─── Types ─────────────────────────────────────────────────────────────────

interface TxItem {
  tx_id: string;
  type: 'in' | 'out';
  label: string;
  amount: number;
  date: string;
  method: string;
  detail: string;
  category: '인건비' | '수수료' | '환불' | '정산';
}

interface AlbaItem {
  id: string;
  name: string;
  age: number;
  gender: string;
  role: string;
  store: string;
  date: string;
  hours: number;
  pay: number;
  feePaid: number;
  dgcs: number;
  noshow: boolean;
  status: '정상정산' | '노쇼환불';
}

interface FeeAllocationItem {
  name: string;
  category: string;
  pct: number;
  amountPerTx: number;
  accumTotal: number;
  color: string;
  icon: string;
  benefitToEmployer: string;
  description: string;
}

interface EmployerKPI {
  totalLaborCost: number;       // 나간 총 인건비
  totalFeePaid: number;         // 나간 총 플랫폼 수수료 (5%)
  effectiveFee: number;         // 실효 수수료 (리베이트 감면 후)
  noShowDefendedAmount: number; // 노쇼 방어로 지킨 돈 (환불)
  workerCount: number;          // 총 고용 인원
  totalWorkHours: number;       // 총 근무 시간
  insuranceCoverage: string;    // 상해/배상책임 보장액
  taxFilingCount: number;       // 국세청/공단 자동신고 건수
}

interface DashboardData {
  source: 'd1' | 'fallback';
  dataTimestamp: string;
  kpi: EmployerKPI;
  transactions: TxItem[];
  albaList: AlbaItem[];
  feeAllocations: FeeAllocationItem[];
}

type Section = 'overview' | 'labor' | 'fee_usage' | 'alba' | 'tx';

// ─── Constants ─────────────────────────────────────────────────────────────

const CAT_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  인건비: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  수수료: { bg: 'bg-orange-50',  text: 'text-[#FB521C]',  border: 'border-orange-200' },
  환불:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  정산:   { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200' },
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
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs text-left"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${color} bg-slate-50 border border-slate-200/60`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-none">{label}</p>
      </div>
      <p className="text-base font-black text-slate-900 leading-none font-mono">{value}</p>
      {sub && <p className="text-[9.5px] text-slate-400 mt-1 leading-none font-medium truncate">{sub}</p>}
    </motion.div>
  );
}

function AnimatedNumber({ value, prefix = '₩' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(0);
  useEffect(() => {
    const duration = 800;
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

// ─── Main Component ────────────────────────────────────────────────────────

export default function EmployerMyPage() {
  const [section, setSection] = useState<Section>('overview');
  const [txFilter, setTxFilter] = useState<'all' | 'labor' | 'fee'>('all');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [showFactoringModal, setShowFactoringModal] = useState(false);
  const [selectedFeeItem, setSelectedFeeItem] = useState<string | null>(null);

  const FALLBACK_DATA: DashboardData = {
    source: 'fallback',
    dataTimestamp: new Date().toISOString(),
    kpi: {
      totalLaborCost: 238000,
      totalFeePaid: 11900,
      effectiveFee: 7650,
      noShowDefendedAmount: 16000,
      workerCount: 5,
      totalWorkHours: 15,
      insuranceCoverage: '최대 3,000만원',
      taxFilingCount: 5,
    },
    transactions: [
      { tx_id: 'tx_001', type: 'out', label: '조이수 알바비 지급', amount: 58000, date: '08.02 22:01', method: '신한 에스크로 0.1초 즉시정산', detail: '야간 서빙 4시간 근무 완료', category: '인건비' },
      { tx_id: 'tx_002', type: 'out', label: '플랫폼 5% 수수료 지출', amount: 2900, date: '08.02 22:01', method: '신한DS 자동 분배', detail: '신한EZ보험 ₩1,450 + 알바생ETF ₩850 + 세무EDI ₩600', category: '수수료' },
      { tx_id: 'tx_004', type: 'out', label: '박민준 알바비 지급', amount: 54000, date: '08.02 14:00', method: '신한 에스크로 0.1초 즉시정산', detail: '홀 서빙 4시간 근무 완료', category: '인건비' },
      { tx_id: 'tx_005', type: 'out', label: '플랫폼 5% 수수료 지출', amount: 2700, date: '08.02 14:00', method: '신한DS 자동 분배', detail: '신한EZ보험 ₩1,350 + 알바생ETF ₩750 + 세무EDI ₩600', category: '수수료' },
      { tx_id: 'tx_007', type: 'out', label: '김수아 알바비 지급', amount: 30000, date: '08.01 13:30', method: '신한 에스크로 0.1초 즉시정산', detail: '음료 조리 2시간 근무 완료', category: '인건비' },
      { tx_id: 'tx_009', type: 'in', label: '최현우 노쇼 에스크로 환불', amount: 16000, date: '07.31 12:15', method: '스마트계약 자동 반환', detail: '지오펜스 미출근 확인 후 전액 환불', category: '환불' },
      { tx_id: 'tx_010', type: 'out', label: '정예은 알바비 지급', amount: 65000, date: '07.30 15:00', method: '신한 에스크로 0.1초 즉시정산', detail: '매장 진열 5시간 근무 완료', category: '인건비' },
    ],
    albaList: [
      { id: 'a1', name: '조이수', age: 24, gender: '남', role: '야간 서빙', store: '스타벅스 강남2호점', date: '08.02 18:00–22:00', hours: 4, pay: 58000, feePaid: 2900, dgcs: 980, noshow: false, status: '정상정산' },
      { id: 'a2', name: '박민준', age: 22, gender: '남', role: '홀 서빙', store: '스타벅스 강남2호점', date: '08.02 14:00–18:00', hours: 4, pay: 54000, feePaid: 2700, dgcs: 920, noshow: false, status: '정상정산' },
      { id: 'a3', name: '김수아', age: 21, gender: '여', role: '음료 조리', store: '스타벅스 강남2호점', date: '08.01 11:30–13:30', hours: 2, pay: 30000, feePaid: 1500, dgcs: 860, noshow: false, status: '정상정산' },
      { id: 'a4', name: '최현우', age: 25, gender: '남', role: '편의점 세팅', store: '스타벅스 강남2호점', date: '07.31 12:00–13:00', hours: 1, pay: 0, feePaid: 0, dgcs: 640, noshow: true, status: '노쇼환불' },
      { id: 'a5', name: '정예은', age: 20, gender: '여', role: '매장 진열', store: '스타벅스 강남2호점', date: '07.30 10:00–15:00', hours: 5, pay: 65000, feePaid: 3250, dgcs: 910, noshow: false, status: '정상정산' },
    ],
    feeAllocations: [
      {
        name: '신한EZ손해보험 마이크로 상해/배상책임',
        category: '점주 법적 리스크 100% 면책',
        pct: 46,
        amountPerTx: 1450,
        accumTotal: 5800,
        color: '#10B981',
        icon: '🛡️',
        benefitToEmployer: '근무 중 알바생 화상/골절 산재 처리 및 손님 배상책임 3,000만원 전액 보장 (점주 사비 지출 0원)',
        description: '출근 스와이프 즉시 0초 자동 가입되어 별도 보험 가입 절차 없이 사장님 민형사상 리스크를 원천 차단합니다.',
      },
      {
        name: '알바생 KODEX / SOL 미국 ETF 매수 지원',
        category: '성실 근무 유인 & 노쇼 방어',
        pct: 34,
        amountPerTx: 850,
        accumTotal: 3400,
        color: '#3B82F6',
        icon: '📈',
        benefitToEmployer: '알바생 명의 미국 S&P500 ETF 소수점 매수 적립 ➔ 당일 무단결근 및 지각 리스크 방지',
        description: '점주가 지원하는 ETF 적립금은 알바생이 성실 출근을 완료할 때만 확정 지급되어 최상의 근무 퀄리티를 유도합니다.',
      },
      {
        name: '국세청 홈택스 & 근로복지공단 EDI 0초 자동신고',
        category: '세무 기장료 & 행정 비용 절감',
        pct: 12,
        amountPerTx: 400,
        accumTotal: 1600,
        color: '#8B5CF6',
        icon: '🏢',
        benefitToEmployer: '일용근로소득 지급명세서 + 고용·산재 신고 100% 자동 대행 (세무사 기장 대행비 0원)',
        description: '소득세법 제164조의3 일 15만원 비과세 한도 자동 계산 후 익월 10일 국세청으로 무인 자동 전송됩니다.',
      },
      {
        name: '신한DS 7-Core 및 실시간 에스크로 인프라',
        category: '0.1초 즉시 정산 & 위변조 방지',
        pct: 8,
        amountPerTx: 200,
        accumTotal: 1100,
        color: '#F59E0B',
        icon: '⚙️',
        benefitToEmployer: '노쇼 시 100% 즉시 에스크로 자동 환불 & 블록체인 타임스탬프 영구 박제',
        description: '근태 조작 방지 지오펜싱 비콘 검증 및 금융 결제망 통행료로 안전한 정산을 보장합니다.',
      },
    ],
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employer/dashboard?employer_id=employer-demo');
      if (res.ok) {
        const json = (await res.json()) as Partial<DashboardData>;
        setData({
          ...FALLBACK_DATA,
          ...json,
          kpi: {
            ...FALLBACK_DATA.kpi,
            ...(json.kpi || {}),
          },
        });
        setIsLive(json.source === 'd1');
      } else {
        setData(FALLBACK_DATA);
        setIsLive(false);
      }
    } catch {
      setData(FALLBACK_DATA);
      setIsLive(false);
    } finally {
      setLastFetched(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const kpi = data?.kpi || FALLBACK_DATA.kpi;
  const filteredTx = (data?.transactions ?? []).filter(t => {
    if (txFilter === 'all') return true;
    if (txFilter === 'labor') return t.category === '인건비';
    if (txFilter === 'fee') return t.category === '수수료';
    return true;
  });

  const navTabs: { id: Section; label: string; Icon: React.ElementType }[] = [
    { id: 'overview',   label: '종합 요약',     Icon: BarChart3 },
    { id: 'labor',      label: '나간 인건비',   Icon: User },
    { id: 'fee_usage',  label: '수수료 사용처', Icon: Receipt },
    { id: 'tx',         label: '입출금 내역',   Icon: Wallet },
  ];

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-10 text-slate-900 font-sans">
      {/* ── Hero Header ── */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-5 pt-4 pb-4 space-y-3.5 shadow-xs text-left">
        {/* 상단 행 */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9.5px] font-black text-[#FB521C] tracking-widest uppercase">
                Store Cost & Fee Center
              </span>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold ${isLive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-orange-50 text-[#FB521C] border border-orange-200'}`}>
                {isLive ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                {isLive ? 'D1 Live' : '실시간 연동'}
              </div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">점주 인건비 & 수수료 관리</h1>
          </div>
          <button onClick={fetchData} disabled={loading}
            className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            title="새로고침">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 매장 정보 카드 */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FB521C] rounded-xl flex items-center justify-center font-bold text-base text-white shadow-xs shrink-0">
            S
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-900">스타벅스 강남2호점</p>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-50 text-[#FB521C] border border-orange-200">
                Gold 가맹점
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">사업자 112-34-56789 · 신한 주거래</p>
          </div>
          {lastFetched && <p className="text-[8.5px] text-slate-400 shrink-0 font-medium">{lastFetched} 기준</p>}
        </div>

        {/* 💰 이번 달 나간 인건비 & 나간 수수료 2대 핵심 지표 (추정 순이익 제거 ➔ 실지출 관리) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 나간 총 인건비 */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/40 p-3.5 rounded-2xl border border-blue-200/80 space-y-1">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide block">
              8월 나간 인건비
            </span>
            <p className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight font-mono">
              <AnimatedNumber value={kpi.totalLaborCost} />
            </p>
            <p className="text-[9.5px] text-blue-600/90 font-medium mt-0.5">
              총 {kpi.workerCount}명 · {kpi.totalWorkHours}시간 0.1초 즉시정산
            </p>
          </div>

          {/* 나간 총 수수료 */}
          <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/40 p-3.5 rounded-2xl border border-orange-200/80 space-y-1">
            <span className="text-[10px] font-bold text-[#FB521C] uppercase tracking-wide block">
              8월 나간 수수료 (5%)
            </span>
            <p className="text-xl sm:text-2xl font-black text-[#FB521C] tracking-tight font-mono">
              <AnimatedNumber value={kpi.totalFeePaid} />
            </p>
            <p className="text-[9.5px] text-amber-700/90 font-medium mt-0.5">
              광고비 0원 · 100% 혜택 환원
            </p>
          </div>
        </div>

        {/* 🛡️ 수수료로 얻은 점주 혜택 요약 바 */}
        <div className="bg-slate-900 rounded-2xl p-3 text-white border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-200 font-medium">
              수수료 5%로 <span className="text-emerald-400 font-bold">상해보험 3,000만</span> + <span className="text-blue-400 font-bold">국세청 세무 0원 대행</span> 적용
            </span>
          </div>
          <button
            onClick={() => setSection('fee_usage')}
            className="text-[10px] font-bold text-orange-400 hover:text-orange-300 shrink-0 underline ml-1 cursor-pointer"
          >
            명세보기
          </button>
        </div>

        {/* 💳 신한카드 매출담보 선정산 팩토링 & 세무 B2B 대시보드 바로가기 */}
        <div
          onClick={() => setShowFactoringModal(true)}
          className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-3 text-white border border-slate-800 shadow-xs cursor-pointer hover:brightness-110 transition-all active:scale-[0.99] flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-400/30 flex items-center justify-center font-bold shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-white">신한카드 매출담보 인건비 한도</span>
                <span className="text-[9px] bg-pink-500/20 text-pink-300 font-bold px-1.5 py-0.2 rounded-full border border-pink-400/30">
                  선정산 팩토링
                </span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5">
                미정산 매출 ₩1,840,000 담보 ➔ 알바비 즉시 지급 한도 ₩500,000 오픈
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-1">
        <div className="grid grid-cols-4 gap-1">
          {navTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setSection(t.id)}
              className={`relative flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                section === t.id
                  ? 'bg-orange-50 text-[#FB521C] font-black border border-orange-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <t.Icon className={`w-3.5 h-3.5 ${section === t.id ? 'text-[#FB521C]' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-3 sm:px-4 py-4 space-y-4 text-left">
        {/* ════ 1. 종합 요약 (OVERVIEW) ════ */}
        {section === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <StatCard
                label="나간 인건비 총액"
                value={`₩${kpi.totalLaborCost.toLocaleString()}`}
                sub="0.1초 에스크로 즉시지급"
                color="text-blue-600"
                Icon={User}
              />
              <StatCard
                label="나간 수수료 총액"
                value={`₩${kpi.totalFeePaid.toLocaleString()}`}
                sub="건당 5% (광고비 0원)"
                color="text-[#FB521C]"
                Icon={Receipt}
                delay={0.05}
              />
              <StatCard
                label="노쇼 방어 환불금"
                value={`₩${kpi.noShowDefendedAmount.toLocaleString()}`}
                sub="100% 자동 환불 완료"
                color="text-emerald-600"
                Icon={ShieldAlert}
                delay={0.1}
              />
              <StatCard
                label="국세청 자동 세무신고"
                value={`${kpi.taxFilingCount}건 완료`}
                sub="세무사 기장비 0원 절감"
                color="text-purple-600"
                Icon={FileText}
                delay={0.15}
              />
            </div>

            {/* 수수료 사용처 미리보기 배너 */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-4 text-white border border-indigo-500/30 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-white">내가 낸 수수료(5%), 어디에 쓰였을까?</h3>
                    <p className="text-[10px] text-slate-300">단순 플랫폼 수수료가 아닌 사장님 리스크 방어 혜택으로 100% 환원</p>
                  </div>
                </div>
                <button
                  onClick={() => setSection('fee_usage')}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/10 text-amber-300 border border-white/15 hover:bg-white/20 shrink-0 cursor-pointer"
                >
                  상세보기 →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold">🛡️ 신한EZ 상해보험 (46%)</span>
                  <p className="text-[10.5px] text-slate-200 leading-tight">알바생 산재·상해 및 매장 배상책임 3천만원 보장</p>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-blue-400 font-bold">📈 알바생 ETF 적립 (34%)</span>
                  <p className="text-[10.5px] text-slate-200 leading-tight">성실 출근 완료 시 미국 S&P500 ETF 매수 (노쇼 방지)</p>
                </div>
              </div>
            </div>

            {/* 최근 지급 내역 3건 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900">최근 인건비 & 수수료 지출 내역</h3>
                <button onClick={() => setSection('tx')} className="text-[10.5px] font-bold text-[#FB521C] hover:underline cursor-pointer">
                  전체보기 →
                </button>
              </div>
              <div className="space-y-2">
                {data?.transactions.slice(0, 3).map((tx) => (
                  <div key={tx.tx_id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900">{tx.label}</p>
                        <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full border ${CAT_STYLE[tx.category]?.bg} ${CAT_STYLE[tx.category]?.text} ${CAT_STYLE[tx.category]?.border}`}>
                          {tx.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{tx.detail} · {tx.date}</p>
                    </div>
                    <span className={`text-xs font-black font-mono ${tx.type === 'in' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'in' ? '+' : '−'}₩{tx.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ 2. 나간 인건비 (LABOR) ════ */}
        {section === 'labor' && (
          <div className="space-y-3">
            {/* 인건비 요약 바 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex justify-around text-center shadow-xs">
              <div>
                <p className="text-[9.5px] text-slate-400 font-bold">지급 완료 인원</p>
                <p className="text-sm font-black text-blue-700 font-mono mt-0.5">4명 (14h)</p>
              </div>
              <div className="border-r border-slate-100" />
              <div>
                <p className="text-[9.5px] text-slate-400 font-bold">노쇼 환불</p>
                <p className="text-sm font-black text-emerald-600 font-mono mt-0.5">1명 (₩16,000)</p>
              </div>
              <div className="border-r border-slate-100" />
              <div>
                <p className="text-[9.5px] text-slate-400 font-bold">총 인건비 지출</p>
                <p className="text-sm font-black text-slate-900 font-mono mt-0.5">₩{kpi.totalLaborCost.toLocaleString()}</p>
              </div>
            </div>

            {/* 알바생별 인건비 지급 상세 리스트 */}
            <div className="space-y-2">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                알바생별 0.1초 즉시정산 인건비 지급 명세
              </span>
              {data?.albaList.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${a.noshow ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        {a.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900">{a.name}</p>
                          <span className="text-[9px] text-slate-500 font-medium">({a.gender} · {a.age}세)</span>
                          {a.noshow ? (
                            <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                              노쇼 환불
                            </span>
                          ) : (
                            <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              정산완료
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{a.role} · {a.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 font-mono">
                        {a.pay > 0 ? `₩${a.pay.toLocaleString()}` : '₩0 (환불)'}
                      </p>
                      <p className="text-[9.5px] text-[#FB521C] font-semibold">
                        수수료 5%: ₩{a.feePaid.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {!a.noshow && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 bg-slate-50/60 p-2 rounded-xl">
                      <span>✓ 0.1초 신한 에스크로 이체 완료</span>
                      <span>국세청 간이지급명세서 자동 접수 완료</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ 3. 수수료 사용처 명세 (FEE_USAGE) ════ */}
        {section === 'fee_usage' && (
          <div className="space-y-4">
            {/* 수수료 투명 명세서 헤더 */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 sm:p-5 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">5% 플랫폼 수수료 투명 사용처 명세서</h3>
                    <p className="text-[10px] text-slate-300">사장님이 지불하신 수수료(₩11,900)는 이렇게 전액 가치로 환원되었습니다.</p>
                  </div>
                </div>
                <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-mono">
                  100% 투명 분배
                </span>
              </div>

              {/* 4대 분배 영역 카드 */}
              <div className="space-y-2.5">
                {data?.feeAllocations.map((item, idx) => (
                  <div
                    key={item.name}
                    onClick={() => setSelectedFeeItem(selectedFeeItem === item.name ? null : item.name)}
                    className="bg-white/5 hover:bg-white/10 transition-colors p-3.5 rounded-2xl border border-white/10 cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-[9.5px] font-bold text-emerald-300">{item.category}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-amber-300 font-mono">
                          {item.pct}% (건당 ₩{item.amountPerTx})
                        </span>
                        <p className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                          누적 ₩{item.accumTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* 프로그레스 바 */}
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>

                    {/* 점주 직접 혜택 설명 */}
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <p className="text-[10.5px] text-slate-200 leading-snug font-medium">
                        💡 <span className="text-amber-300 font-bold">사장님 혜택:</span> {item.benefitToEmployer}
                      </p>
                      {selectedFeeItem === item.name && (
                        <p className="text-[10px] text-slate-400 pt-1 border-t border-white/10 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 수수료 비교 및 혜택 요약 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                타 플랫폼(알바몬 등) vs 땡겨요 WORKS 수수료 가치 비교
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500">기존 알바 구인 플랫폼</span>
                  <p className="text-xs font-black text-rose-600">월 20~50만원 광고비</p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    • 구인 실패해도 환불 불가<br />
                    • 상해보험 사장님 사비 가입<br />
                    • 세무신고 사장님 직접 처리
                  </p>
                </div>
                <div className="bg-orange-50/60 p-3 rounded-2xl border border-orange-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#FB521C]">땡겨요 WORKS</span>
                  <p className="text-xs font-black text-[#FB521C]">광고비 0원 (성공 시 5%)</p>
                  <p className="text-[10px] text-slate-700 leading-tight font-medium">
                    • 노쇼 시 100% 즉시 환불<br />
                    • 상해보험 수수료 자동 가입<br />
                    • 국세청 세무신고 0원 자동대행
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ 4. 입출금 내역 (TX) ════ */}
        {section === 'tx' && (
          <div className="space-y-3">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {(['all', 'labor', 'fee'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    txFilter === f ? 'bg-[#FB521C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f === 'all' ? '전체 내역' : f === 'labor' ? '인건비 지급' : '수수료 지출'}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredTx.map((tx) => (
                <div key={tx.tx_id} className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${tx.type === 'in' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-orange-50 text-[#FB521C] border border-orange-200'}`}>
                      {tx.type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900">{tx.label}</p>
                        <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full border ${CAT_STYLE[tx.category]?.bg} ${CAT_STYLE[tx.category]?.text} ${CAT_STYLE[tx.category]?.border}`}>
                          {tx.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{tx.detail} · {tx.date}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-sm font-black font-mono ${tx.type === 'in' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'in' ? '+' : '−'}₩{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">{tx.method}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 💳 신한카드 매출담보 선정산 팩토링 & 세무 B2B 대시보드 모달 */}
      <EmployerTaxFactoringModal
        isOpen={showFactoringModal}
        onClose={() => setShowFactoringModal(false)}
        storeName="스타벅스 강남2호점"
      />
    </div>
  );
}
