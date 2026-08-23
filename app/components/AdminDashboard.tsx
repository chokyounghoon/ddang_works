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
      {/* 1. 최고 경영진(C-Suite) C-Level 핀테크 통제 센터 헤더 & 실시간 KPI 전광판 */}
      <div className="bg-gradient-to-br from-[#0B0F19] via-[#10172A] to-[#080D1A] rounded-3xl p-5 border border-blue-500/30 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#FB521C]/20 via-blue-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* 상단 타이틀 & 시스템 라이브 뱃지 & 주기 필터 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FB521C] via-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-orange-500/20 border border-white/20 shrink-0">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-black text-[#FB521C] uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/30">
                  땡겨요 WORKS · One Shinhan C-Suite
                </span>
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE OPERATIONAL
                </span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-white tracking-tight mt-0.5">
                신한금융 7대 시너지 & Web3 그룹 통제 센터
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            {/* 기간 필터 */}
            <div className="bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 flex items-center gap-0.5 text-[10.5px] font-bold">
              {(['today', '7d', '30d', 'year'] as TimePeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setTimePeriod(p)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    timePeriod === p
                      ? 'bg-[#FB521C] text-white font-black shadow-2xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p === 'today' ? '오늘' : p === '7d' ? '7일' : p === '30d' ? '30일' : '연간'}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/90 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FB521C] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">동기화</span>
            </button>
          </div>
        </div>

        {/* 2. C-Level 총괄 4대 핵심 KPI 전광판 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-center shadow-inner relative z-10">
          <div className="p-2 border-r border-slate-800/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">7대 계열사 시너지 창출</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5 font-mono">{currentMetric.synergy}</p>
            <p className="text-[9px] font-semibold text-emerald-300/80 mt-0.5 flex items-center justify-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +14.8% YoY 증가
            </p>
          </div>

          <div className="p-2 border-r border-slate-800/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">0.1초 즉시 정산 건수</p>
            <p className="text-xl font-black text-blue-400 mt-0.5 font-mono">{currentMetric.txCount}</p>
            <p className="text-[9px] font-semibold text-blue-300/80 mt-0.5">성공률 100.0% 달성</p>
          </div>

          <div className="p-2 border-r border-slate-800/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI FDS 사전 차단</p>
            <p className="text-xl font-black text-amber-400 mt-0.5 font-mono">{currentMetric.fdsBlocked}</p>
            <p className="text-[9px] font-semibold text-amber-300/80 mt-0.5">손실률 0.01% 방어</p>
          </div>

          <div className="p-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">국세청 BATCH 자동신고</p>
            <p className="text-xl font-black text-indigo-300 mt-0.5 font-mono">{currentMetric.taxReported}</p>
            <p className="text-[9px] font-semibold text-indigo-300/80 mt-0.5">100% 비과세 적법 처리</p>
          </div>
        </div>

        {/* 3. 4대 서브 탭 통제 스위처 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold mt-3.5 relative z-10">
          <button
            onClick={() => setSubTab('revenue')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              subTab === 'revenue'
                ? 'bg-gradient-to-r from-[#FB521C] to-orange-600 text-white font-black shadow-lg shadow-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
            <span className="truncate">1. 7대 시너지 수익</span>
          </button>

          <button
            onClick={() => setSubTab('web3')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              subTab === 'web3'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-300" />
            <span className="truncate">2. Web3 온체인 원장</span>
          </button>

          <button
            onClick={() => setSubTab('fds_health')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              subTab === 'fds_health'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-lg shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-300" />
            <span className="truncate">3. AI FDS & 헬스</span>
          </button>

          <button
            onClick={() => setSubTab('b2b_tax')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              subTab === 'b2b_tax'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-lg shadow-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-300" />
            <span className="truncate">4. B2B 세무 & 정산풀</span>
          </button>
        </div>
      </div>

      {/* 4. 서브 탭 콘텐츠 영역 */}
      <AnimatePresence mode="wait">
        {subTab === 'revenue' && (
          <motion.div
            key="revenue-sub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 p-4 rounded-3xl text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-black text-sm text-white">7대 금융 계열사 시너지 실시간 집계 센터</h4>
                  <p className="text-xs text-slate-300">각 계열사를 클릭하시면 건당 수수료 및 연간 시너지 수익 상세 명세를 확인하실 수 있습니다.</p>
                </div>
              </div>
            </div>

            {/* 7대 계열사 시너지 메커니즘 총괄 보고서 카드 */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#090D16] rounded-3xl p-5 border border-indigo-500/40 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="font-black text-base text-white">One Shinhan 7대 계열사 독점 시너지 메커니즘 분석</h4>
                    <p className="text-[11px] text-slate-300">플랫폼 100% 무료 선언의 비결: 백엔드 금융 독점 가치 창출</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                  C-Suite Executive Summary
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* 1. 신한은행 */}
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-blue-500/30 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-blue-400 text-xs">🏦 1. 신한은행 (CASA 유입 & 에스크로)</span>
                    <span className="text-[9.5px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">연간 +₩3.2억원</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    알바비 0.1초 즉시 정산 모계좌 개설(저원가성 예금 CASA 유입)과 점주 정산금 예치, 노쇼 방지 에스크로 스마트계약 유휴 자금을 운용하여 파생 이자 수익 창출.
                  </p>
                </div>

                {/* 2. 신한EZ손해보험 */}
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-emerald-500/30 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-emerald-400 text-xs">🛡️ 2. 신한EZ손해보험 (마이크로 상해보험)</span>
                    <span className="text-[9.5px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">연간 +₩1.8억원</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    출근 스와이프 1번으로 점주 지불 5% 수수료 중 건당 ₩1,450 자동 차감 가입. 손해율 12% 미만의 초단기 긱워크 마이크로 상해보험 시장 독점.
                  </p>
                </div>

                {/* 3. 신한카드 */}
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-red-500/30 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-red-400 text-xs">💳 3. 신한카드 (가맹점 결제 & ACS)</span>
                    <span className="text-[9.5px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">연간 +₩2.4억원</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    점주 인건비 결제 가맹점 카드 수수료 수익 및 알바생 성실 출근 데이터(D-GCS) 기반 대안신용평가(ACS) 전용 체크·신용카드 발급 락인.
                  </p>
                </div>

                {/* 4. 신한라이프 */}
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-teal-500/30 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-teal-400 text-xs">🌿 4. 신한라이프 (마이크로 연금)</span>
                    <span className="text-[9.5px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">연간 +₩3.1억원</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    알바비 0.1초 입금 시 1% 자동 떼기 마이크로 연금 펀드로 2030 긱워커층의 장기 자산관리 타깃 고객을 극초기에 전격 선점.
                  </p>
                </div>

                {/* 5. 신한투자증권 */}
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-purple-500/30 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-purple-400 text-xs">📈 5. 신한투자증권 (잔돈 ETF 소수점 매수)</span>
                    <span className="text-[9.5px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">연간 +₩8.5천만원</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    알바비 끝전(1천원 미만)과 점주 수수료 지원금 매칭으로 KODEX/TIGER/SOL ETF 소수점 자동 매수 수수료 및 토큰증권(STO) 파생 수익.
                  </p>
                </div>

                {/* 6. 신한저축은행/캐피탈 */}
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-amber-500/30 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-400 text-xs">🏦 6. 신한저축은행/캐피탈 (맞춤 대출)</span>
                    <span className="text-[9.5px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">연간 +₩4.2억원</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    점주 비상 인건비 대출 및 D-GCS 고신용 알바생 대상 0초 서류검증 비상금 소액대출(1인당 250만원) 운영 이자 수익.
                  </p>
                </div>

                {/* 7. 신한DS */}
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-indigo-500/30 space-y-1.5 col-span-1 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-indigo-400 text-xs">⚙️ 7. 신한DS (Web3 S-BRIDGE BaaS 인프라 통행료)</span>
                    <span className="text-[9.5px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">연간 +₩2.1억원</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    블록체인 온체인 원장(SOLC 토큰 & D-GCS SBT) 및 7개 계열사 API 트랜잭션 처리 건당 BaaS 통행료(₩600) 독점 수임.
                  </p>
                </div>
              </div>
            </div>

            <RevenueDashboard />
          </motion.div>
        )}

        {subTab === 'web3' && (
          <motion.div
            key="web3-sub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-blue-900/40 border border-indigo-500/30 p-4 rounded-3xl text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="font-black text-sm text-white">신한DS 메인넷 Web3 블록체인 온체인 원장</h4>
                  <p className="text-xs text-slate-300">SOLC 토큰 잔액, D-GCS SBT 신용증명서, 실시간 블록 생성 피드를 모니터링합니다.</p>
                </div>
              </div>
            </div>

            {/* 토큰 현황 대시보드 */}
            <TokenDashboard userBalance={48.85} address="0x71C8a9dF2309110a" />

            {/* SBT 영구 증명서 뷰어 */}
            <SBTViewer address="0x71C8a9dF2309110a" score={990} workerName="조이수" />

            {/* 온체인 블록 피드 익스플로러 */}
            <BlockFeed />
          </motion.div>
        )}

        {subTab === 'fds_health' && (
          <motion.div
            key="fds-health-sub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* 🛡️ AI FDS 실시간 이상징후 탐지 & 고의 도덕적해이 방어 관제 배너 */}
            <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 p-4.5 rounded-3xl text-white space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-black">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-white">신한EZ 4중 AI FDS 실시간 이상거래 관제 센터</h4>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        24/7 AI SCANNING
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">고의 자해 · 허위 출퇴근 · 중복 보험 청구 0.1초 원천 차단율 99.98% 달성</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">이상 거래 차단 누적</span>
                  <span className="text-lg font-black text-rose-400 font-mono">1,842건 (100% 방어)</span>
                </div>
              </div>

              {/* 실시간 AI FDS 탐지 스트림 피드 */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  실시간 FDS 탐지 스트림 로그 (최근 1시간)
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {[
                    { time: '14:21:05', type: 'SAFE', desc: '역삼동 CU 강남파이낸스점 BLE 비콘 15m 지오펜스 일치', result: '정상 승인 (신뢰도 99.9%)', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30' },
                    { time: '14:18:42', type: 'BLOCK', desc: '가상 GPS 모의위치 변조 시도 탐지 ➔ 출근 도장 원천 차단', result: 'FDS Rule #4 작동 (차단)', color: 'text-rose-400 bg-rose-950/50 border-rose-500/30' },
                    { time: '14:12:10', type: 'BLOCK', desc: '동일 사고 10분 내 신한EZ 중복 청구 시도 차단', result: 'FDS Rule #2 작동 (반려)', color: 'text-rose-400 bg-rose-950/50 border-rose-500/30' },
                    { time: '13:58:30', type: 'SAFE', desc: '강남구 역삼동 래미안 P2P 의뢰 에스크로 ₩30,000 정상 릴리즈', result: '정상 정산 완료', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30' },
                  ].map((log, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${log.color}`}>
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-slate-400 font-bold shrink-0">{log.time}</span>
                        <span className="truncate">{log.desc}</span>
                      </div>
                      <span className="text-[10px] font-black shrink-0 px-2 py-0.5 rounded-md bg-black/40 border border-white/10">
                        {log.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7개 계열사 API 헬스 체크 그리드 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4.5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">System Infrastructure</span>
                  <h4 className="font-black text-sm text-slate-900 mt-0.5">신한금융 7-Core API 가동율 & 서버 상태</h4>
                  <p className="text-xs text-slate-500">전 계열사 API 응답 속도 평균 1.2ms · Uptime 99.999% 가동 중</p>
                </div>
                <span className="text-[10.5px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ALL SYSTEMS ONLINE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { name: '신한은행 CASA API', latency: '0.8ms', status: '정상', isOk: true },
                  { name: '신한EZ손보 Micro API', latency: '1.1ms', status: '정상', isOk: true },
                  { name: '신한카드 ACS API', latency: '1.4ms', status: '정상', isOk: true },
                  { name: '신한라이프 연금 API', latency: '1.0ms', status: '정상', isOk: true },
                  { name: '신한투자증권 ETF API', latency: '1.6ms', status: '정상', isOk: true },
                  { name: '신한저축/캐피탈 B2B API', latency: '0.9ms', status: '정상', isOk: true },
                  { name: '신한DS Web3 Mainnet', latency: '0.4ms', status: '정상 (Block #18.4M)', isOk: true },
                  { name: '국세청/공단 BATCH API', latency: '2.1ms', status: '정상 (0초 대행)', isOk: true },
                ].map(node => (
                  <div key={node.name} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h5 className="font-black text-slate-900 text-xs">{node.name}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">응답 지연시간: <span className="font-mono font-bold text-slate-700">{node.latency}</span></p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {node.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 📑 서브탭 4: B2B 세무 & 실시간 정산 풀 현황 */}
        {subTab === 'b2b_tax' && (
          <motion.div
            key="b2b-tax-sub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* 정산 풀 유동성 현황 카드 */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-3xl p-5 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">신한 BaaS 실시간 정산 유동성 풀 (Liquidity Pool)</h4>
                    <p className="text-xs text-slate-300">신한은행 0.1초 실시간 입금 전용 스마트 에스크로 풀</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  HEALTH 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">총 에스크로 예탁 잔고</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">₩84.5억원</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">신한카드 팩토링 가동액</span>
                  <span className="text-lg font-black text-blue-400 font-mono">₩18.4억원</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">일일 정산 지급 완료율</span>
                  <span className="text-lg font-black text-amber-300 font-mono">100.0% (연체 0건)</span>
                </div>
              </div>

              {/* 비상 서킷 브레이커 (Emergency Pause) 스위치 */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${isCircuitBreakerActive ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-black text-white block">비상 정산 서킷브레이커 (Circuit Breaker)</span>
                    <span className="text-[10px] text-slate-400">금융 이상 징후 발생 시 0.1초 전 계열사 정산 즉시 일시정지</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCircuitBreakerActive(!isCircuitBreakerActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isCircuitBreakerActive
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isCircuitBreakerActive ? '🚨 서킷브레이커 작동 중' : '정상 가동 (대기)'}
                </button>
              </div>
            </div>

            {/* 국세청 및 근로복지공단 B2B BATCH 현황 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4.5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] font-black text-purple-600 tracking-widest uppercase">Gov-Tech B2B Integration</span>
                  <h4 className="font-black text-sm text-slate-900 mt-0.5">국세청 · 근로복지공단 EDI BATCH 자동화 관제</h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  전송 성공률 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-purple-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      국세청 간이지급명세서 (일용근로소득)
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                      오늘 14,280건 완료
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    소득세법 제164조의3 의거, 일 15만원 비과세 한도 자동 계산 후 익월 10일 전산 BATCH 100% 무인 전송 완료.
                  </p>
                </div>

                <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-blue-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      근로복지공단 고용·산재 토탈 EDI
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      0초 즉시 취득/상실
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    출퇴근 지오펜싱 비콘 검증 즉시 근로내용확인신고서가 공단 전산망으로 0초 자동 접수되어 과태료 리스크 0% 실현.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
