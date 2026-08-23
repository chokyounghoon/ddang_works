'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Landmark, CreditCard, AlertTriangle, ShieldCheck,
  Zap, RefreshCw, CheckCircle2, ArrowUpRight, TrendingUp, Lock, Unlock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

export default function AdminSettlementScreen() {
  const { triggerPush } = useAppPush();
  const [isCircuitBreakerActive, setIsCircuitBreakerActive] = useState(false);
  const [isInjectingLiquidity, setIsInjectingLiquidity] = useState(false);
  const [escrowPoolBalance, setEscrowPoolBalance] = useState(8450000000); // 84.5억원
  const [factoringCapacity, setFactoringCapacity] = useState(1840000000); // 18.4억원

  const handleInjectPool = async () => {
    setIsInjectingLiquidity(true);
    await new Promise((r) => setTimeout(r, 800));
    setEscrowPoolBalance((prev) => prev + 500000000); // +5억원 충전
    setIsInjectingLiquidity(false);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    triggerPush({
      title: '💧 [신한 BaaS 유동성 충전 완료]',
      body: '신한은행 스마트 에스크로 정산 풀에 ₩500,000,000원이 긴급 보강되었습니다.',
      type: 'confirm',
    });
  };

  const handleToggleCircuitBreaker = () => {
    const nextVal = !isCircuitBreakerActive;
    setIsCircuitBreakerActive(nextVal);
    triggerPush({
      title: nextVal ? '🚨 [서킷브레이커 발동]' : '🟢 [서킷브레이커 해제]',
      body: nextVal ? '전 계열사 0.1초 즉시 정산 및 출금이 일시 중지되었습니다.' : '전 계열사 정상 정산 시스템이 복구되었습니다.',
      type: 'confirm',
    });
  };

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* 1. 실시간 에스크로 & 팩토링 유동성 풀 현황 */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-5 text-white border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FB521C] to-indigo-600 flex items-center justify-center text-white font-black shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm text-white">신한 BaaS 실시간 정산 유동성 풀 통제</h4>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  HEALTH 100%
                </span>
              </div>
              <p className="text-xs text-slate-300">0.1초 즉시 정산 스마트 에스크로 계좌 잔고 및 팩토링 유동성 풀</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInjectPool}
            disabled={isInjectingLiquidity}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1 shadow-md cursor-pointer"
          >
            {isInjectingLiquidity ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-300" />}
            <span>+5억 긴급 보강</span>
          </button>
        </div>

        {/* 3대 핵심 유동성 지표 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">총 에스크로 예탁 잔고</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              ₩{(escrowPoolBalance / 100000000).toFixed(1)}억원
            </span>
            <span className="text-[9.5px] text-emerald-300/80 block mt-0.5 font-bold">100% 안전 지급준비금</span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">신한카드 팩토링 가동액</span>
            <span className="text-lg font-black text-blue-400 font-mono">
              ₩{(factoringCapacity / 100000000).toFixed(1)}억원
            </span>
            <span className="text-[9.5px] text-blue-300/80 block mt-0.5 font-bold">연체율 0.00% 무결</span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">오늘 실시간 정산 처리액</span>
            <span className="text-lg font-black text-amber-300 font-mono">₩2억 4,850만원</span>
            <span className="text-[9.5px] text-amber-200/80 block mt-0.5 font-bold">14,280건 0.1초 입금</span>
          </div>
        </div>

        {/* 비상 서킷 브레이커 (Emergency Circuit Breaker) */}
        <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className={`w-5 h-5 ${isCircuitBreakerActive ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <div>
              <span className="text-xs font-black text-white block">비상 정산 서킷브레이커 (Emergency Circuit Breaker)</span>
              <span className="text-[10.5px] text-slate-400">금융 이상 징후/해킹 시도 탐지 시 0.1초 전 계열사 정산 즉시 일시정지</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleCircuitBreaker}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              isCircuitBreakerActive
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isCircuitBreakerActive ? '🚨 서킷브레이커 작동 중' : '정상 가동 (대기)'}
          </button>
        </div>
      </div>

      {/* 2. 가맹점별 팩토링 및 일일 정산 승인 대기 리스트 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-4.5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Real-Time Settlements</span>
            <h4 className="font-black text-sm text-slate-900 mt-0.5">실시간 정산 및 팩토링 집행 내역</h4>
          </div>
          <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            실시간 0.1초 자동승인
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { store: 'CU 강남파이낸스점', amount: '₩16,000', worker: '조이수', type: '0.1초 출퇴근 즉시입금', time: '방금 전', status: '입금완료' },
            { store: '역삼동 래미안 (이웃 의뢰)', amount: '₩30,000', worker: '김서연', type: '신한 에스크로 릴리즈', time: '2분 전', status: '입금완료' },
            { store: '빽다방 역삼역점', amount: '₩32,000', worker: '박민우', type: '신한카드 매출담보 팩토링', time: '5분 전', status: '입금완료' },
            { store: '투썸플레이스 선릉점', amount: '₩48,000', worker: '최지훈', type: '0.1초 출퇴근 즉시입금', time: '8분 전', status: '입금완료' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-black text-slate-900">{item.store}</h5>
                  <span className="text-[10px] text-slate-400 font-mono">({item.worker} 워커)</span>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">{item.type} · <span className="text-slate-400">{item.time}</span></p>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-sm text-[#FB521C] block">{item.amount}</span>
                <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  ✓ {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
