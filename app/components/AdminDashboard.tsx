'use client';

// app/components/AdminDashboard.tsx
// Shinhan Financial Group C-Suite Executive Command Center Dashboard
// 7대 계열사 시너지 수익 & Web3 온체인 원장 통합 통제 센터

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Layers, ShieldCheck, Cpu, Activity, Landmark, Sparkles,
  TrendingUp, Lock, RefreshCw, CheckCircle2, Server, ArrowUpRight, Zap, FileText,
  ShieldAlert, Building2, CreditCard, DollarSign, Users, AlertTriangle, Radio
} from 'lucide-react';
import dynamic from 'next/dynamic';

const RevenueDashboard = dynamic(() => import('./RevenueDashboard'), { ssr: false });
const TokenDashboard   = dynamic(() => import('./TokenDashboard'),   { ssr: false });
const BlockFeed        = dynamic(() => import('./BlockFeed'),        { ssr: false });
const SBTViewer        = dynamic(() => import('./SBTViewer'),        { ssr: false });

type AdminSubTab = 'revenue' | 'web3' | 'fds_health' | 'b2b_tax';
type TimePeriod = 'today' | '7d' | '30d' | 'year';

export default function AdminDashboard() {
  const [subTab, setSubTab] = useState<AdminSubTab>('revenue');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCircuitBreakerActive, setIsCircuitBreakerActive] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setIsRefreshing(false);
  };

  const periodMetrics = {
    today: { synergy: '₩4,820만', txCount: '14,280건', fdsBlocked: '12건', taxReported: '14,280건' },
    '7d': { synergy: '₩3.4억원', txCount: '98,450건', fdsBlocked: '84건', taxReported: '98,450건' },
    '30d': { synergy: '₩14.6억원', txCount: '412,000건', fdsBlocked: '320건', taxReported: '412,000건' },
    year: { synergy: '₩48.2억원', txCount: '5,240,000건', fdsBlocked: '4,150건', taxReported: '5,240,000건' },
  };

  const currentMetric = periodMetrics[timePeriod];

  return (
    <div className="space-y-4 pb-8 font-sans">
      {/* 1. C-Suite 핀테크 통제 센터 헤더 & 실시간 KPI 전광판 */}
      <div className="bg-gradient-to-br from-[#0B0F19] via-[#10172A] to-[#080D1A] rounded-3xl p-4 sm:p-5 border border-blue-500/30 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-[#FB521C]/20 via-blue-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* 상단 뱃지 & 동기화 버튼 */}
        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9.5px] font-black text-[#FB521C] uppercase tracking-wider bg-orange-500/15 px-2 py-0.5 rounded-md border border-orange-500/30">
              One Shinhan C-Suite
            </span>
            <span className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* 기간 필터 */}
            <div className="bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 flex items-center gap-0.5 text-[10px] font-bold">
              {(['today', '7d', '30d', 'year'] as TimePeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setTimePeriod(p)}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    timePeriod === p
                      ? 'bg-[#FB521C] text-white font-black shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p === 'today' ? '오늘' : p === '7d' ? '7일' : p === '30d' ? '30일' : '연간'}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              className="p-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
              title="데이터 새로고침"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FB521C] ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 타이틀 */}
        <div className="mb-3.5 relative z-10 text-left">
          <h3 className="font-black text-base sm:text-lg text-white tracking-tight leading-snug">
            신한금융 7대 시너지 & Web3 그룹 통제
          </h3>
          <p className="text-[11px] text-slate-300 mt-0.5">
            0.1초 퇴근 스와이프로 가동되는 7대 금융 계열사 독점 시너지 실시간 집계
          </p>
        </div>

        {/* 2. C-Level 총괄 4대 핵심 KPI 전광판 (모바일 2x2 고가독성 그리드) */}
        <div className="grid grid-cols-2 gap-2.5 text-left relative z-10">
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800/90 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 block">7대 계열사 시너지</span>
            <span className="text-lg font-black text-emerald-400 font-mono tracking-tight block my-0.5">
              {currentMetric.synergy}
            </span>
            <span className="text-[9.5px] font-semibold text-emerald-300/90 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +14.8% YoY 증가
            </span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800/90 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 block">0.1초 즉시 정산</span>
            <span className="text-lg font-black text-blue-400 font-mono tracking-tight block my-0.5">
              {currentMetric.txCount}
            </span>
            <span className="text-[9.5px] font-semibold text-blue-300/90 block">
              성공률 100.0% 달성
            </span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800/90 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 block">AI FDS 사전 차단</span>
            <span className="text-lg font-black text-amber-400 font-mono tracking-tight block my-0.5">
              {currentMetric.fdsBlocked}
            </span>
            <span className="text-[9.5px] font-semibold text-amber-300/90 block">
              손실률 0.01% 방어
            </span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800/90 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 block">국세청 자동 신고</span>
            <span className="text-lg font-black text-indigo-300 font-mono tracking-tight block my-0.5">
              {currentMetric.taxReported}
            </span>
            <span className="text-[9.5px] font-semibold text-indigo-300/90 block">
              100% 비과세 적법 처리
            </span>
          </div>
        </div>
      </div>

      {/* 3. 7대 계열사 독점 시너지 메커니즘 분석 요약 카드 */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#090D16] rounded-3xl p-4 sm:p-5 border border-indigo-500/40 text-white space-y-3.5 shadow-xl text-left">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-black text-sm sm:text-base text-white">One Shinhan 7대 계열사 독점 시너지 메커니즘</h4>
              <p className="text-[10.5px] text-slate-300">플랫폼 100% 무료 선언의 비결: 백엔드 금융 독점 가치 창출</p>
            </div>
          </div>
          <span className="text-[9.5px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shrink-0">
            C-Suite Summary
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* 1. 신한은행 */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-blue-500/30 space-y-1.5">
            <div className="flex justify-between items-center gap-1">
              <span className="font-black text-blue-400 text-xs">🏦 1. 신한은행</span>
              <span className="text-[9.5px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 shrink-0">연간 +₩3.2억</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              0.1초 즉시 정산 모계좌 개설(CASA 저원가성 예금 유치) 및 에스크로 유휴 자금 운용 파생 수익.
            </p>
          </div>

          {/* 2. 신한EZ손해보험 */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-emerald-500/30 space-y-1.5">
            <div className="flex justify-between items-center gap-1">
              <span className="font-black text-emerald-400 text-xs">🛡️ 2. 신한EZ손해보험</span>
              <span className="text-[9.5px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">연간 +₩1.8억</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              출근 스와이프 1번으로 건당 ₩150 마이크로 상해보험 자동 가입. 손해율 12% 미만 독점 시장 선점.
            </p>
          </div>

          {/* 3. 신한카드 */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-red-500/30 space-y-1.5">
            <div className="flex justify-between items-center gap-1">
              <span className="font-black text-red-400 text-xs">💳 3. 신한카드</span>
              <span className="text-[9.5px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 shrink-0">연간 +₩2.4억</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              점주 인건비 결제 가맹점 카드 수수료 및 성실 출근(D-GCS) 기반 대안신용평가(ACS) 카드 발급 락인.
            </p>
          </div>

          {/* 4. 신한라이프 */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-teal-500/30 space-y-1.5">
            <div className="flex justify-between items-center gap-1">
              <span className="font-black text-teal-400 text-xs">🌿 4. 신한라이프</span>
              <span className="text-[9.5px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 shrink-0">연간 +₩3.1억</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              알바비 1% 자동 떼기 마이크로 연금 펀드로 2030 긱워커층 장기 자산관리 고객 극초기 선점.
            </p>
          </div>

          {/* 5. 신한투자증권 */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-purple-500/30 space-y-1.5">
            <div className="flex justify-between items-center gap-1">
              <span className="font-black text-purple-400 text-xs">📈 5. 신한투자증권</span>
              <span className="text-[9.5px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 shrink-0">연간 +₩8.5천만</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              알바비 끝전(1천원 미만) ETF 소수점 자동 매수 수수료 및 토큰증권(STO) 파생 수익.
            </p>
          </div>

          {/* 6. 신한저축은행/캐피탈 */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-amber-500/30 space-y-1.5">
            <div className="flex justify-between items-center gap-1">
              <span className="font-black text-amber-400 text-xs">🪙 6. 신한저축/캐피탈</span>
              <span className="text-[9.5px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">연간 +₩4.2억</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              점주 비상 인건비 대출 및 D-GCS 고신용 알바생 0초 서류검증 비상금 소액대출 이자 수익.
            </p>
          </div>

          {/* 7. 신한DS */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-indigo-500/30 space-y-1.5 sm:col-span-2">
            <div className="flex justify-between items-center gap-1">
              <span className="font-black text-indigo-400 text-xs">⚙️ 7. 신한DS (BaaS 인프라 통행료)</span>
              <span className="text-[9.5px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 shrink-0">연간 +₩2.1억</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              블록체인 온체인 원장 및 7개 계열사 API 트랜잭션 처리 건당 BaaS 통행료(₩200~₩600) 독점 수임.
            </p>
          </div>
        </div>
      </div>

      {/* 4. 실시간 수익 대시보드 컴포넌트 */}
      <RevenueDashboard />
    </div>
  );
}
