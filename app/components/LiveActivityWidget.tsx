'use client';

// app/components/LiveActivityWidget.tsx
// Dynamic Island & Live Activity 초단위 급여 롤링 카운터 및 실시간 근무 위젯

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Clock, ShieldCheck, ChevronDown, ChevronUp, ArrowRight,
  Radio, MessageSquare, Landmark, Sparkles
} from 'lucide-react';

interface LiveActivityWidgetProps {
  storeName?: string;
  hourlyRate?: number;
  startTime?: Date;
  durationHours?: number;
  onClockOut?: () => void;
  isClockedIn?: boolean;
  onOpenGeofence?: () => void;
  onOpenChat?: () => void;
  onOpenStreamingCash?: () => void;
}

export default function LiveActivityWidget({
  storeName = 'CU 강남파이낸스점',
  hourlyRate = 16000,
  durationHours = 1,
  onClockOut,
  isClockedIn = true,
  onOpenGeofence,
  onOpenChat,
  onOpenStreamingCash,
}: LiveActivityWidgetProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(2140); // default ~35 min into shift
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isClockedIn) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isClockedIn]);

  if (!isClockedIn) return null;

  const totalSeconds = durationHours * 3600;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100));

  // 초당 누적 급여 (실시간 롤링)
  const earnedExact = (hourlyRate / 3600) * elapsedSeconds;
  const currentEarnedInt = Math.min(hourlyRate * durationHours, Math.floor(earnedExact));
  const earnedFraction = (earnedExact % 1).toFixed(2).substring(1); // .44

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
    <div className="sticky top-[38px] sm:top-[42px] z-40 px-2 py-1 bg-gradient-to-b from-slate-950/40 to-transparent backdrop-blur-xs">
      <motion.div
        layout
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-slate-950/95 text-white rounded-2xl border border-indigo-500/40 shadow-xl overflow-hidden backdrop-blur-xl"
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
              <span className="text-[8.5px] bg-indigo-500/30 text-indigo-300 font-bold px-1.5 py-0.2 rounded-full border border-indigo-400/30">
                실시간 근무 ({progressPercent}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 초단위 실시간 급여 롤링 카운터 (클릭 시 스트리밍 머니 뷰어 오픈) */}
            <div
              onClick={(e) => {
                if (onOpenStreamingCash) {
                  e.stopPropagation();
                  onOpenStreamingCash();
                }
              }}
              className="text-right cursor-pointer hover:opacity-85 transition-opacity"
              title="초단위 실시간 급여 스트리밍 머니 뷰어"
            >
              <div className="text-[11.5px] font-black text-amber-400 font-mono flex items-baseline justify-end">
                <span>₩{currentEarnedInt.toLocaleString()}</span>
                <span className="text-[9px] text-amber-300/80 font-normal">{earnedFraction}</span>
                <span className="text-[8.5px] font-black text-emerald-400 font-sans ml-1">스트리밍⚡</span>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </div>

        {/* 실시간 진행률 바 */}
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
                  <p className="text-[11px] font-black text-white flex items-center justify-center gap-0.5 mt-0.5 font-mono">
                    <Clock className="w-3 h-3 text-blue-400" />
                    {timeFormatted}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400">약정 시급</p>
                  <p className="text-[11px] font-black text-white mt-0.5 font-mono">
                    ₩{hourlyRate.toLocaleString()}
                  </p>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenGeofence) onOpenGeofence();
                  }}
                  className="cursor-pointer hover:bg-slate-800/80 rounded p-0.5 transition-colors"
                >
                  <p className="text-[9px] text-slate-400">지오펜싱</p>
                  <p className="text-[10px] font-black text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    15m 비콘
                  </p>
                </div>
              </div>

              {/* 퀵 액션 버튼 (스트리밍 머니, 1:1 안심채팅 & 0.1초 즉시 퇴근 정산) */}
              <div className="flex gap-1.5">
                {onOpenStreamingCash && (
                  <button
                    onClick={onOpenStreamingCash}
                    className="py-2.5 px-3 bg-gradient-to-r from-orange-950/80 to-amber-950/80 hover:bg-orange-900/80 border border-orange-500/40 active:scale-98 rounded-xl font-bold text-xs text-amber-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>스트리밍 머니</span>
                  </button>
                )}

                {onOpenChat && (
                  <button
                    onClick={onOpenChat}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-98 rounded-xl font-bold text-xs text-slate-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>점주 채팅</span>
                  </button>
                )}

                <button
                  onClick={handleSwipeEnd}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#FB521C] to-orange-500 hover:from-[#e04513] hover:to-orange-600 active:scale-98 rounded-xl font-black text-xs text-white shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>0.1초 신한 BaaS 에스크로 정산 처리 중...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>퇴근 완료 & 0.1초 즉시 정산</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
