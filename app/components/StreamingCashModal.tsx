'use client';

// app/components/StreamingCashModal.tsx
// 💸 초(Second) 단위 실시간 스트리밍 급여 입금 시스템 (Streaming Money / Superfluid BaaS)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Zap, DollarSign, Landmark, ArrowRight, CheckCircle2,
  TrendingUp, Sparkles, Clock, ShieldCheck, Download, RefreshCw, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface StreamingCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  hourlyRate?: number;
  workerName?: string;
  storeName?: string;
}

export default function StreamingCashModal({
  isOpen,
  onClose,
  hourlyRate = 16000,
  workerName = '조이수',
  storeName = 'CU 강남파이낸스점',
}: StreamingCashModalProps) {
  const { triggerPush } = useAppPush();
  const [elapsedSeconds, setElapsedSeconds] = useState(2400); // 40분 기본 근무
  const [isStreaming, setIsStreaming] = useState(true);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);

  useEffect(() => {
    if (!isOpen || !isStreaming) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isStreaming]);

  if (!isOpen) return null;

  // 초당 누적액
  const perSecondRate = hourlyRate / 3600; // 4.444...
  const totalEarnedExact = elapsedSeconds * perSecondRate;
  const currentEarnedInt = Math.floor(totalEarnedExact);
  const fraction = (totalEarnedExact % 1).toFixed(3).substring(1); // .444

  // 신한 SOL 파킹통장 연 3.5% 일일 복리 이자 환산 (실시간 마이크로 이자)
  const interestEarned = (totalEarnedExact * 0.035 / 365).toFixed(4);

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const handleInstantWithdraw = () => {
    setWithdrawnAmount(currentEarnedInt);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FB521C', '#FFB800', '#0046FF', '#10B981'],
      });
    } catch {}

    triggerPush({
      title: `⚡ [스트리밍 급여 즉시 인출 완료]`,
      body: `현재까지 실시간 누적된 ₩${currentEarnedInt.toLocaleString()}원이 신한 주거래 모계좌로 0.1초 만에 이체되었습니다.`,
      type: 'confirm',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[32px] shadow-2xl border border-orange-200 max-w-md w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        >
          {/* 1. 땡겨요 X 신한 스트리밍 헤더 */}
          <div className="p-4.5 bg-gradient-to-r from-[#FB521C] via-[#FF6B3D] to-[#0046FF] text-white flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white text-lg shadow-inner border border-white/30">
                💸
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30 tracking-tight">
                    신한 BaaS 실시간 스트리밍
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-200">
                    Live Flowing Cash
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base mt-0.5 text-white tracking-tight">
                  초(Second) 단위 실시간 급여 입금
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. 스트리밍 라이브 인디케이터 */}
          <div className="bg-[#FFF7F2] px-4 py-2 border-b border-orange-100 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-slate-700 text-[11px]">
                {storeName} · <strong>1초마다 +₩4.44원</strong>
              </span>
            </div>
            <span className="text-[10px] font-black text-[#FB521C] font-mono bg-white px-2 py-0.5 rounded-lg border border-orange-200">
              STREAMPAY ON
            </span>
          </div>

          {/* 3. 모달 바디 */}
          <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
            {/* 메인 초단위 롤링 잔고 카드 */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-orange-500/30 text-center relative overflow-hidden shadow-xl">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>현재 실시간 적립 통장 잔고</span>
              </div>

              {/* 초단위 실시간 롤링 숫자 */}
              <div className="text-4xl font-black text-white font-mono tracking-tight flex items-baseline justify-center my-2">
                <span className="text-[#FB521C]">₩</span>
                <span>{currentEarnedInt.toLocaleString()}</span>
                <span className="text-lg text-amber-300 ml-0.5">{fraction}</span>
                <span className="text-sm font-sans text-slate-400 ml-1">원</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10.5px] text-slate-300 mt-2 font-mono">
                <span className="bg-white/10 px-2 py-0.5 rounded-full">
                  ⏱️ {hours > 0 ? `${hours}시간 ` : ''}{minutes}분 {seconds}초 근무
                </span>
                <span className="text-emerald-400 font-bold">
                  시급 ₩{hourlyRate.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 신한 SOL 파킹통장 연 3.5% 일일 복리 이자 카드 */}
            <div className="bg-blue-50/70 rounded-2xl p-3.5 border border-blue-200 space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-blue-600" />
                  <span>신한 SOL 파킹통장 실시간 복리 이자</span>
                </span>
                <span className="text-[10px] font-black text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  연 3.5%
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-slate-500">근무 시간 중 실시간 발생 이자:</span>
                <span className="font-black text-blue-700 font-mono">+₩{interestEarned}원</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                일하는 순간부터 초 단위로 이자가 쌓이며, 퇴근 시 원금과 함께 복리로 자동 입금됩니다.
              </p>
            </div>

            {/* 스트리밍 파이프라인 시각화 */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 text-[11px] block">
                🔄 신한 BaaS 실시간 자금 유동성 파이프라인
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">점주 에스크로</span>
                  <span className="font-bold text-slate-800">예치 완료</span>
                </div>
                <div className="bg-orange-50 p-2 rounded-xl border border-orange-200">
                  <span className="text-[#FB521C] block font-bold">1초 단위</span>
                  <span className="font-mono font-black text-[#FB521C]">+4.44원/s</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">워커 주거래 계좌</span>
                  <span className="font-bold text-emerald-600">즉시 수취</span>
                </div>
              </div>
            </div>

            {/* 인출 버튼 */}
            <button
              onClick={handleInstantWithdraw}
              className="w-full py-4 bg-gradient-to-r from-[#FB521C] via-orange-500 to-amber-500 hover:brightness-105 active:scale-98 text-white font-black rounded-2xl text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Zap className="w-4.5 h-4.5 text-amber-200 fill-amber-200" />
              <span>현재 누적 ₩{currentEarnedInt.toLocaleString()}원 지금 바로 땡겨받기</span>
            </button>
          </div>

          {/* 4. 모달 푸터 */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center shrink-0">
            <span className="text-[10px] text-slate-400">
              * 신한은행 금융규제 샌드박스 혁신금융서비스 지정 (Superfluid Streaming)
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
