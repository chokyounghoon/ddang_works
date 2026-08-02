'use client';

// app/components/AdminDashboard.tsx
// Shinhan Financial Group C-Suite Executive Command Center Dashboard
// 7대 계열사 시너지 수익 & Web3 온체인 원장 통합 통제 센터

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Layers, ShieldCheck, Cpu, Activity, Landmark, Sparkles,
  TrendingUp, Lock, RefreshCw, CheckCircle2, Server, ArrowUpRight, Zap, FileText
} from 'lucide-react';
import dynamic from 'next/dynamic';

const RevenueDashboard = dynamic(() => import('./RevenueDashboard'), { ssr: false });
const TokenDashboard   = dynamic(() => import('./TokenDashboard'),   { ssr: false });
const BlockFeed        = dynamic(() => import('./BlockFeed'),        { ssr: false });
const SBTViewer        = dynamic(() => import('./SBTViewer'),        { ssr: false });

type AdminSubTab = 'revenue' | 'web3' | 'health';

export default function AdminDashboard() {
  const [subTab, setSubTab] = useState<AdminSubTab>('revenue');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* 1. 최고 경영진(C-Suite) C-Level 핀테크 통제 센터 헤더 & 실시간 KPI 전광판 */}
      <div className="bg-gradient-to-br from-[#0B0F19] via-[#10172A] to-[#080D1A] rounded-3xl p-5 border-2 border-blue-500/40 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* 상단 타이틀 & 시스템 라이브 뱃지 */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/40 border border-blue-400/30">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/30">
                  One Shinhan Group C-Suite Command
                </span>
                <span className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REAL-TIME OPERATIONAL
                </span>
              </div>
              <h3 className="font-black text-lg text-white tracking-tight mt-0.5">신한금융 시너지 & Web3 그룹 통제 센터</h3>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/90 hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-700 active:scale-95 transition-all shadow-md shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            데이터 동기화
          </button>
        </div>

        {/* 2. C-Level 총괄 4대 핵심 KPI 전광판 (고가독성) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-center shadow-inner relative z-10">
          <div className="p-2.5 border-r border-slate-800/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">7대 계열사 총 시너지 수익</p>
            <p className="text-xl font-black text-emerald-400 mt-1">₩48.2억원</p>
            <p className="text-[9.5px] font-semibold text-emerald-300/80 mt-0.5 flex items-center justify-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +14.8% YoY 증가
            </p>
          </div>

          <div className="p-2.5 border-r border-slate-800/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">일일 0.1초 처리 건수</p>
            <p className="text-xl font-black text-blue-400 mt-1">14,280건</p>
            <p className="text-[9.5px] font-semibold text-blue-300/80 mt-0.5">원체인 Instant Pay</p>
          </div>

          <div className="p-2.5 border-r border-slate-800/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Web3 메인넷 검증률</p>
            <p className="text-xl font-black text-indigo-300 mt-1">100.0%</p>
            <p className="text-[9.5px] font-semibold text-indigo-300/80 mt-0.5">S-BRIDGE Block #18.4M</p>
          </div>

          <div className="p-2.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI 사전 방어 손실률</p>
            <p className="text-xl font-black text-amber-400 mt-1">0.02%</p>
            <p className="text-[9.5px] font-semibold text-amber-300/80 mt-0.5">노쇼 0건 락인 달성</p>
          </div>
        </div>

        {/* 3. 명확하고 직관적인 3대 서브 탭 통제 스위처 */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold mt-3.5 relative z-10">
          <button
            onClick={() => setSubTab('revenue')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'revenue'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-300" />
            <span>1. 7대 계열사 수익 분석</span>
          </button>

          <button
            onClick={() => setSubTab('web3')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'web3'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-300" />
            <span>2. Web3 온체인 원장</span>
          </button>

          <button
            onClick={() => setSubTab('health')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'health'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-300" />
            <span>3. 7-Core 시스템 헬스</span>
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

        {subTab === 'health' && (
          <motion.div
            key="health-sub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">System Infrastructure</span>
                  <h4 className="font-black text-base text-slate-900 mt-0.5">신한금융 7-Core API 가동율 & 서버 상태</h4>
                  <p className="text-xs text-slate-500 mt-0.5">전 계열사 API 응답 속도 평균 1.2ms · Uptime 99.999% 달성 중</p>
                </div>
                <span className="text-[10.5px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ALL SYSTEMS ONLINE
                </span>
              </div>

              {/* 7개 계열사 API 헬스 체크 그리드 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
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
      </AnimatePresence>
    </div>
  );
}
