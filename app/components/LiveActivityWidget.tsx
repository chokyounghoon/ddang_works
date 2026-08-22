'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ShieldCheck, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface LiveActivityWidgetProps {
  storeName?: string;
  hourlyRate?: number;
  startTime?: Date;
  durationHours?: number;
  onClockOut?: () => void;
  isClockedIn?: boolean;
}

export default function LiveActivityWidget({
  storeName = '컴포즈커피 역삼점',
  hourlyRate = 16000,
  durationHours = 2,
  onClockOut,
  isClockedIn = true,
}: LiveActivityWidgetProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(2880); // default 48 min
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isClockedIn) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isClockedIn]);

  if (!isClockedIn) return null;

  const totalSeconds = durationHours * 3600;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100));
  
  // 실시간 적립 급여 (초 단위 계산)
  const currentEarned = Math.min(
    hourlyRate * durationHours,
    Math.round((hourlyRate / 3600) * elapsedSeconds)
  );

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${hours > 0 ? `${hours}시간 ` : ''}${minutes}분 ${seconds < 10 ? '0' : ''}${seconds}초`;

  const handleSwipeEnd = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([40, 60, 40]);
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (onClockOut) onClockOut();
    }, 600);
  };

  return (
    <div className="sticky top-[42px] z-40 px-2 py-1 bg-gradient-to-b from-slate-950/20 to-transparent backdrop-blur-xs">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-slate-950/95 text-white rounded-2xl border border-blue-500/40 shadow-xl overflow-hidden backdrop-blur-xl"
      >
        {/* 상단 다이내믹 바 */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 flex items-center justify-between cursor-pointer select-none hover:bg-white/5 transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-white">{storeName}</span>
              <span className="text-[9px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.2 rounded-full border border-blue-400/30">
                근무 중 ({progressPercent}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[11px] font-black text-amber-400">
                ₩{currentEarned.toLocaleString()} <span className="text-[9px] font-normal text-slate-400">적립 중</span>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="w-full h-1 bg-slate-800 relative overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* 확장 상세 패널 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 pb-3 pt-2 border-t border-slate-800 space-y-2.5 text-xs"
            >
              <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-center">
                <div>
                  <p className="text-[9px] text-slate-400">경과 시간</p>
                  <p className="text-[11px] font-black text-white flex items-center justify-center gap-0.5 mt-0.5">
                    <Clock className="w-3 h-3 text-blue-400" />
                    {timeFormatted}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400">시급 기준</p>
                  <p className="text-[11px] font-black text-white mt-0.5">
                    ₩{hourlyRate.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400">보호 혜택</p>
                  <p className="text-[10px] font-black text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    신한EZ 상해
                  </p>
                </div>
              </div>

              {/* 0.1초 퇴근 및 정산 버튼 */}
              <button
                onClick={handleSwipeEnd}
                disabled={isProcessing}
                className="w-full py-2.5 bg-gradient-to-r from-[#FB521C] to-orange-500 hover:from-[#e04513] hover:to-orange-600 active:scale-98 rounded-xl font-black text-xs text-white shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>0.1초 신한 BaaS 에스크로 정산 처리 중...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>퇴근 완료 & 0.1초 즉시 정산받기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
