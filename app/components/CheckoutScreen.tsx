'use client';

// app/components/CheckoutScreen.tsx
// 땡겨요 WORKS [정산/지갑] 화면
// 1. [에스크로 예치 ➔ 업무 종료 스와이프 ➔ 0.1초 신한은행 즉시 입금] 실시간 자금 흐름 시각화
// 2. 국세청 홈택스 & 근로복지공단 연동 '세무/행정 자동 대행 리포트' (월간 BATCH)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Zap, Lock, DollarSign, Building2, User, Clock,
  FileText, ShieldCheck, Landmark, Receipt, ArrowRight, Activity,
  ChevronRight, Sparkles, Download, Check, AlertCircle, FileCheck,
  CreditCard, TrendingUp, Store, Cpu, RefreshCw, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';
import ShinhanSolTransferModal from './ShinhanSolTransferModal';
import ShinhanBlockExplorerModal from './ShinhanBlockExplorerModal';

// ─── PoA 컨소시엄 합의 레이더 ───────────────────────────────────────────────

function PoAConsensusRadar({ step }: { step: number }) {
  const [consensusDone, setConsensusDone] = useState(false);

  useEffect(() => {
    if (step >= 2) {
      const t = setTimeout(() => setConsensusDone(true), 700);
      return () => clearTimeout(t);
    } else {
      setConsensusDone(false);
    }
  }, [step]);

  const nodes = [
    { name: '신한은행', icon: Landmark, cx: 150, cy: 50 },
    { name: '신한카드', icon: CreditCard, cx: 245, cy: 119 },
    { name: '신한투자증권', icon: TrendingUp, cx: 209, cy: 231 },
    { name: '신한라이프', icon: ShieldCheck, cx: 91, cy: 231 },
    { name: '땡겨요', icon: Store, cx: 55, cy: 119 },
  ];

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Shinhan Consortium Mainnet</p>
        <h3 className="text-lg font-black text-white">신한 PoA 컨소시엄 합의 중</h3>
        <p className="text-xs text-slate-400">S-BRIDGE 0.1초 즉시 정산 및 원장 기록 블록체인 검증</p>
      </div>

      <div className="relative w-[300px] h-[300px] bg-slate-950/40 rounded-full border border-indigo-500/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-4 border border-indigo-500/5 rounded-full animate-pulse" />
        <div className="absolute inset-16 border border-indigo-500/5 rounded-full" />
        <div className="absolute inset-28 border border-indigo-500/5 rounded-full" />

        <svg className="w-full h-full absolute inset-0 z-10 pointer-events-none">
          {nodes.map((node, i) => (
            <motion.line
              key={i}
              x1={150}
              y1={150}
              x2={node.cx}
              y2={node.cy}
              stroke={consensusDone ? "#10b981" : "#4f46e5"}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          ))}
        </svg>

        <div className="relative z-20 w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.5)]">
          <Cpu className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        {nodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <div
              key={i}
              className="absolute z-20 flex flex-col items-center gap-1 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: node.cx, top: node.cy }}
            >
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                consensusDone 
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                  : 'bg-slate-900 border border-indigo-500/40 text-indigo-300'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-slate-300 whitespace-nowrap bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                {node.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-slate-950/80 border border-indigo-900/40 rounded-2xl p-3 text-[10.5px] font-mono text-indigo-300/80 space-y-1">
        <p className="text-emerald-400 font-bold">&gt; S-BRIDGE Smart Contract: Executing</p>
        <p>&gt; Block Time: 0.1s (초고속 즉시 완결성)</p>
        <p>&gt; Gas Fee: ₩0 (신한DS 인프라 무상 지원)</p>
      </div>
    </div>
  );
}

// ─── 메인 정산/지갑 컴포넌트 ───────────────────────────────────────────────

interface CheckoutScreenProps {
  walletConnected?: boolean;
  walletAddress?: string;
  solcBalance?: number;
  setSolcBalance?: any;
}

export default function CheckoutScreen({
  walletConnected = true,
  walletAddress = '0x71C...38A9',
  solcBalance = 124.5,
  setSolcBalance,
}: CheckoutScreenProps) {
  const { triggerPush } = useAppPush();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'settlement' | 'tax_report'>('settlement');
  const [showSolTransferModal, setShowSolTransferModal] = useState<boolean>(false);
  const [showBlockExplorerModal, setShowBlockExplorerModal] = useState<boolean>(false);
  
  // 퇴근 도장 날인 상태 (기본 true)
  const [clockOutStamped, setClockOutStamped] = useState<boolean>(true);

  // 실시간 시프트 데이터 (CU 강남파이낸스점 / 스타벅스 강남2호점)
  const currentGig = {
    storeName: 'CU 강남파이낸스점',
    role: '1시간 물류 하역 초단기 알바',
    workHours: '12:00 ~ 13:00 (1.0h)',
    pay: 16000,
    escrowFunded: 16800, // 원금 + 5% 수수료
    employerFee: 800,
    hourlyRate: 16000,
  };

  const doCheckout = async () => {
    if (!clockOutStamped) return;

    setLoading(true);
    setResult(null);
    setCheckoutStep(1); // Step 1: S-BRIDGE Oracle 노드 검증
    
    await new Promise(r => setTimeout(r, 1000));
    setCheckoutStep(2); // Step 2: Smart Contract 호출 및 합의

    await new Promise(r => setTimeout(r, 1000));
    setCheckoutStep(3); // Step 3: 토크노믹스 분배 & 0.1초 계좌 입금

    await new Promise(r => setTimeout(r, 1200));
    
    const mockResult = {
      success: true,
      txId: `TX-SH-${Math.floor(Math.random()*9000)+1000}`,
      txHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      blockNumber: 12409823,
      timestamp: new Date().toLocaleTimeString(),
      grossPay: currentGig.pay,
      netDeposit: currentGig.pay,
      bankAccount: '신한은행 110-482-******',
    };

    setResult(mockResult);
    setCheckoutStep(4);
    if (setSolcBalance) {
      try {
        setSolcBalance((prev: number) => (typeof prev === 'number' ? prev + 16.0 : 140.5));
      } catch {
        setSolcBalance(solcBalance + 16.0);
      }
    }
    
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}

    triggerPush({
      title: '⚡ [0.1초 즉시 입금 완료] 신한은행',
      body: `조이수님의 신한은행 계좌(110-482-******)로 알바비 ₩${currentGig.pay.toLocaleString()}원이 0.1초 만에 즉시 입금되었습니다.`,
      type: 'confirm',
      actionText: '입금 내역 확인',
    });

    setLoading(false);
  };

  return (
    <div className="space-y-4 pb-8 text-slate-900">
      {/* 1. 상단 인트로 헤더 & 탭 스위처 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FB521C] flex items-center justify-center font-bold">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">0.1초 즉시 정산 & 행정 BATCH</h2>
              <p className="text-[10.5px] text-slate-500">신한 BaaS 스마트 에스크로 & 자동 세무 리포트</p>
            </div>
          </div>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            수수료 0원 100% 입금
          </span>
        </div>

        {/* 탭 스위처: [⚡ 0.1초 즉시 정산] vs [📋 세무/행정 자동 대행 리포트] */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setActiveSubTab('settlement')}
            className={`py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'settlement'
                ? 'bg-[#0F172A] text-white shadow-md shadow-slate-900/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>0.1초 즉시 정산 흐름</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tax_report')}
            className={`py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'tax_report'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-blue-200" />
            <span>세무·행정 BATCH 리포트</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </div>

      {checkoutStep > 0 && checkoutStep < 4 ? (
        <div className="fixed inset-0 z-50 bg-[#070b15]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <PoAConsensusRadar step={checkoutStep} />
        </div>
      ) : activeSubTab === 'settlement' ? (
        /* ═══════════════════════════════════════════════════════════════════════════
           탭 1: ⚡ [에스크로 ➔ 업무 종료 스와이프 ➔ 0.1초 신한 입금] 실시간 자금 흐름 시각화
           ═══════════════════════════════════════════════════════════════════════════ */
        !result ? (
          <>
            {/* 1. 3단계 실시간 자금 흐름 파이프라인 (Visual Fund Flow Visualizer) */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-5 text-white shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    One-Shinhan BaaS
                  </span>
                  <h3 className="text-xs font-black text-white">
                    투명 자금 흐름 파이프라인 (3-Step Fund Flow)
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Real-time Live
                </span>
              </div>

              {/* 3단계 인터랙티브 플로우 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Step 1. 에스크로 사전 예치 */}
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] flex items-center justify-center">
                      1
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      ✓ 예치 완료
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xs flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-300" /> 신한 에스크로 예치
                    </h4>
                    <p className="text-[10.5px] text-slate-300 mt-1">
                      점주 공고 확정 시 <strong>₩{currentGig.pay.toLocaleString()}원</strong>이 신한은행 모계좌에 100% 락업
                    </p>
                  </div>
                  <div className="text-[9.5px] text-slate-400 pt-1 border-t border-slate-800">
                    체불 리스크 0% 보증
                  </div>
                </div>

                {/* Step 2. 업무 종료 스와이프 */}
                <div className="bg-slate-900/90 border-2 border-indigo-500 rounded-2xl p-3.5 space-y-2 shadow-md shadow-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-black text-[10px] flex items-center justify-center">
                      2
                    </span>
                    <span className="text-[9px] font-black text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded animate-pulse">
                      ● 현재 단계
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-indigo-300 text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> 업무 종료 스와이프
                    </h4>
                    <p className="text-[10.5px] text-slate-200 mt-1">
                      매장 GPS(12m) & 점주 퇴근 도장 인증으로 <strong>근무 1.0시간</strong> 정합성 승인
                    </p>
                  </div>
                  <div className="text-[9.5px] text-indigo-300 pt-1 border-t border-slate-800 font-bold">
                    신한 S-BRIDGE 오라클
                  </div>
                </div>

                {/* Step 3. 0.1초 즉시 입금 */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2 opacity-90">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-black text-[10px] flex items-center justify-center">
                      3
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      대기 중
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xs flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-blue-400" /> 0.1초 계좌 입금
                    </h4>
                    <p className="text-[10.5px] text-slate-300 mt-1">
                      버튼 클릭 즉시 <strong>₩{currentGig.pay.toLocaleString()}원</strong>이 신한 주거래 계좌로 실시간 입금
                    </p>
                  </div>
                  <div className="text-[9.5px] text-slate-400 pt-1 border-t border-slate-800">
                    BaaS 실시간 이체
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 출퇴근 기록 & 퇴근 도장 검증 패널 */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FB521C] text-white flex items-center justify-center font-black text-lg shadow-md shadow-orange-500/20">
                    🏪
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">{currentGig.storeName}</h3>
                    <p className="text-xs text-slate-400">{currentGig.role} ({currentGig.workHours})</p>
                  </div>
                </div>
                <button
                  onClick={() => setClockOutStamped(prev => !prev)}
                  className={`text-[11px] font-black px-3 py-1.5 rounded-full border active:scale-95 transition-all ${
                    clockOutStamped
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 animate-bounce'
                  }`}
                >
                  {clockOutStamped ? '✓ 퇴근 도장 날인 완료' : '⚡ 퇴근 도장 찍기'}
                </button>
              </div>

              {/* 출퇴근 기록 타임스탬프 & GPS 로그 */}
              <div className="space-y-2 text-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commute Timestamp Logs</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-blue-500" /> 출근 완료
                    </span>
                    <p className="font-black text-slate-900 text-sm">12:00:02</p>
                    <p className="text-[9px] text-slate-400">매장 GPS 12m 검증 승인</p>
                  </div>

                  <div className={`border rounded-2xl p-3 space-y-1 ${
                    clockOutStamped ? 'bg-emerald-50/60 border-emerald-200/60' : 'bg-red-50/60 border-red-200/60'
                  }`}>
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${
                      clockOutStamped ? 'text-emerald-700' : 'text-red-600'
                    }`}>
                      <CheckCircle2 className={`w-3 h-3 ${clockOutStamped ? 'text-emerald-500' : 'text-red-400'}`} />
                      {clockOutStamped ? '퇴근 도장 승인' : '퇴근 도장 미확인'}
                    </span>
                    <p className={`font-black text-sm ${clockOutStamped ? 'text-slate-900' : 'text-red-500'}`}>
                      {clockOutStamped ? '13:00:04' : '미확인 (도장 필요)'}
                    </p>
                    <p className="text-[9px] text-slate-400">
                      {clockOutStamped ? '매장 GPS 15m 검증 (총 1.0h)' : '퇴근 버튼을 눌러주세요'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 정산 금액 요약 박스 */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>약정 급여 (1h × ₩16,000)</span>
                  <span className="font-semibold text-slate-800">₩16,000</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>점주 납부 5% 상생 수수료</span>
                  <span className="font-bold text-indigo-600">₩800</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>원천징수 세금 (일용직 비과세 혜택)</span>
                  <span className="font-bold text-emerald-600">₩0 (0원 공제)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-700">워커 실수령액 (즉시 이체)</span>
                  <span className="text-[#FB521C] font-black text-lg">₩{currentGig.pay.toLocaleString()}원</span>
                </div>
              </div>

              {/* ⚡ 정산 실행 버튼 */}
              <button
                onClick={doCheckout}
                disabled={loading || !clockOutStamped}
                className={`w-full py-4.5 rounded-2xl font-black text-base transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${
                  !clockOutStamped
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    : 'bg-gradient-to-r from-[#FB521C] via-orange-500 to-amber-500 text-white shadow-orange-500/30 hover:brightness-110'
                }`}
              >
                <Zap className="w-5 h-5 text-amber-200 fill-amber-200" />
                <span>
                  {loading ? '0.1초 신한은행 이체 처리 중...' : '⚡ 오늘의 긱 완료하고 0.1초 만에 땡겨받기'}
                </span>
              </button>
            </div>
          </>
        ) : (
          /* 정산 완료 후 영수증 */
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-[#0b0f19] border border-emerald-500/40 text-white p-6 rounded-3xl space-y-4 shadow-[0_0_25px_rgba(16,185,129,0.25)] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600/20 text-emerald-400 text-[10px] font-mono px-4 py-1.5 rounded-bl-2xl tracking-wider border-l border-b border-emerald-500/30">
                Receipt # {result.txId}
              </div>
              
              <div className="text-center pt-3 pb-2">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/40">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-mono text-xs tracking-widest text-emerald-400 uppercase">0.1s Instant Settlement Completed</h3>
                <p className="text-3xl font-black mt-2 font-mono text-white tracking-tight">
                  ₩{result?.netDeposit?.toLocaleString() ?? '16,000'}원
                </p>
                <p className="text-slate-400 text-xs mt-1">신한은행 주거래 모계좌(110-482-******) 0.1초 입금 완료</p>
              </div>

              {/* 영수증 메타데이터 */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">정산 매장:</span>
                  <span className="text-white font-bold">{currentGig.storeName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">정산 시간:</span>
                  <span className="text-emerald-400">{result?.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">원천징수 세액:</span>
                  <span className="text-blue-300 font-bold">₩0 (일용직 비과세)</span>
                </div>
                <div className="flex flex-col gap-1 pt-1 border-t border-slate-900">
                  <span className="text-slate-400 text-[10px]">BaaS 분산원장 Hash:</span>
                  <span className="text-indigo-400/90 break-all text-[9.5px]">{result?.txHash}</span>
                </div>
              </div>

              {/* 하단 액션 버튼 그룹 */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setShowSolTransferModal(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0046FF] to-[#0038CC] hover:brightness-105 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Landmark className="w-4 h-4" />
                  <span>⚡ 신한 SOL 공인 전자 이체확인증 발급 (PDF)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowBlockExplorerModal(true)}
                    className="py-3 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>온체인 블록 검증</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('tax_report')}
                    className="py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>세무 BATCH 리포트</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setResult(null);
                    setCheckoutStep(0);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 font-bold text-xs transition-colors cursor-pointer"
                >
                  다시 체험하기
                </button>
              </div>
            </div>
          </motion.div>
        )
      ) : (
        /* ═══════════════════════════════════════════════════════════════════════════
           탭 2: 📋 세무/행정 자동 대행 리포트 (국세청 홈택스 & 근로복지공단 월간 BATCH)
           ═══════════════════════════════════════════════════════════════════════════ */
        <div className="space-y-4">
          {/* 1. 세무/행정 BATCH 종합 인증서 카드 */}
          <div className="bg-gradient-to-br from-[#0c1a30] via-slate-900 to-[#071322] border-2 border-blue-500/40 rounded-3xl p-5 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      신한DS Gov-Tech
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-mono">
                      BATCH-EDI-202608
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    국세청 · 근로복지공단 세무/행정 자동 대행 리포트
                  </h3>
                </div>
              </div>

              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> BATCH 자동 대기
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              점주와 워커가 번거로운 세무 신고를 일일이 할 필요가 없습니다. 백엔드에서 <strong>일용근로소득 원천징수(비과세 판별) 및 4대보험(산재/고용) 신고 데이터</strong>를 정부 표준 API 규격으로 자동 생성하여 <strong>월간 BATCH로 안전하게 자동 제출</strong>합니다.
            </p>

            {/* 2대 기관 연동 현황 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* 국세청 홈택스 카드 */}
              <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5">
                    🏛️ 국세청 홈택스 (NTS)
                  </span>
                  <span className="text-[9.5px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                    API READY
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">신고 항목:</span>
                    <span className="font-bold text-white">일용근로소득 지급명세서</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">비과세 적용:</span>
                    <span className="font-bold text-emerald-400">1일 15만 원 이하 (100% 비과세)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">원천징수액:</span>
                    <span className="font-bold text-emerald-400">₩0원 (세금 공제 없이 전액 지급)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">제출 주기:</span>
                    <span className="font-medium text-slate-300">매월/분기별 BATCH 자동 전송</span>
                  </div>
                </div>
              </div>

              {/* 근로복지공단 EDI 카드 */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    🏥 근로복지공단 (COMWEL)
                  </span>
                  <span className="text-[9.5px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                    EDI READY
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">신고 항목:</span>
                    <span className="font-bold text-white">일용근로자 근로내용확인신고</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">산재·고용보험:</span>
                    <span className="font-bold text-emerald-400">초단기 월간 일괄 자동 산정</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">국민·건강보험:</span>
                    <span className="font-bold text-white">월 15시간 미만 법적 면제 적용</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">제출 마감:</span>
                    <span className="font-medium text-slate-300">익월 15일 EDI API 일괄 자동 제출</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 당월 행정 처리 누적 현황 */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                <span className="font-bold text-slate-200">조이수님의 8월 실시간 행정 처리 요약</span>
                <span className="text-blue-400 font-mono">D-GCS 980점</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10.5px]">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <div className="text-slate-400">누적 완수 긱</div>
                  <div className="text-sm font-black text-white mt-0.5">14건</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <div className="text-slate-400">총 정산 금액</div>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">₩584,000</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <div className="text-slate-400">세무/노무 리스크</div>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">0건 (완전 면책)</div>
                </div>
              </div>
            </div>

            {/* 하단 리포트 다운로드 액션 */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                * 신한금융그룹 BaaS 게이트웨이가 국세청/공단 규격에 100% 맞춰 대행합니다.
              </span>
              <button
                onClick={() => {
                  triggerPush({
                    title: '📥 [세무/행정 대행 증명서 발급 완료]',
                    body: '8월 국세청 홈택스 일용근로소득 및 산재보험 자동 BATCH 처리 확인서(PDF)가 발급되었습니다.',
                    type: 'confirm',
                  });
                }}
                className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>행정 대행 리포트 PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 신한 SOL 공인 전자 이체확인증 모달 */}
      <ShinhanSolTransferModal
        isOpen={showSolTransferModal}
        onClose={() => setShowSolTransferModal(false)}
        data={{
          txId: result?.txId || 'SHB-2026-0823-9941',
          senderName: `${currentGig.storeName} 에스크로`,
          senderBank: '신한은행',
          senderAccount: '100-928-381920',
          receiverName: '조이수 (워커 본인)',
          receiverBank: '신한은행 (주거래 모계좌)',
          receiverAccount: '110-482-881923',
          amount: currentGig.pay,
          fee: 0,
          txHash: result?.txHash || '0x3a91f8c7b41e829d554a908123ef6691c781a5330e2f',
          storeName: currentGig.storeName,
          jobTitle: currentGig.role,
          timestamp: result?.timestamp || new Date().toLocaleTimeString('ko-KR'),
        }}
        onOpenExplorer={(hash) => {
          setShowSolTransferModal(false);
          setShowBlockExplorerModal(true);
        }}
      />

      {/* 신한DS PoA 분산원장 온체인 블록 익스플로러 모달 */}
      <ShinhanBlockExplorerModal
        isOpen={showBlockExplorerModal}
        onClose={() => setShowBlockExplorerModal(false)}
        initialTxHash={result?.txHash || '0x3a91f8c7b41e829d554a908123ef6691c781a5330e2f'}
      />
    </div>
  );
}
