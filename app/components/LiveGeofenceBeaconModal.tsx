'use client';

// app/components/LiveGeofenceBeaconModal.tsx
// 매장 비콘 지오펜싱(Geofencing) 자동 출퇴근 레이더 & AI 노쇼 예측 시스템

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Radio, ShieldCheck, Zap, Phone, MessageSquare,
  CheckCircle2, Clock, Sparkles, Navigation, AlertCircle, Check,
  Store, User, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface LiveGeofenceBeaconModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  workerName?: string;
  onCheckInSuccess?: () => void;
  onOpenChat?: () => void;
}

export default function LiveGeofenceBeaconModal({
  isOpen,
  onClose,
  storeName = 'CU 강남파이낸스점',
  workerName = '조이수',
  onCheckInSuccess,
  onOpenChat,
}: LiveGeofenceBeaconModalProps) {
  const { triggerPush } = useAppPush();
  const [distanceM, setDistanceM] = useState<number>(120); // 120m -> 15m
  const [beaconStatus, setBeaconStatus] = useState<'approaching' | 'detected' | 'checked_in'>('approaching');
  const [etaMinutes, setEtaMinutes] = useState<number>(4);

  useEffect(() => {
    if (!isOpen) return;

    // 시뮬레이션: 1.5초 후 매장 15m 반경 진입 (BLE 비콘 페어링 성공)
    const timer1 = setTimeout(() => {
      setDistanceM(15);
      setEtaMinutes(0);
      setBeaconStatus('detected');

      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([30, 40, 30]);
      }

      triggerPush({
        title: `📍 [매장 지오펜싱 비콘 감지] ${storeName}`,
        body: `매장 15m 반경 내 진입이 확인되었습니다. 출근 스와이프를 진행해주세요.`,
        type: 'confirm',
      });
    }, 1800);

    return () => clearTimeout(timer1);
  }, [isOpen, storeName, triggerPush]);

  if (!isOpen) return null;

  const handlePerformCheckIn = () => {
    setBeaconStatus('checked_in');

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}

    triggerPush({
      title: `⚡ [출근 스와이프 완료 & 보험 개시]`,
      body: `${storeName} 출근이 인증되었습니다. 신한EZ 단기 상해보험(1,000만원)이 0.1초 만에 자동 개시되었습니다.`,
      type: 'confirm',
    });

    if (onCheckInSuccess) {
      onCheckInSuccess();
    }
  };

  const handleSendEta = (text: string) => {
    triggerPush({
      title: `💬 [점주 안심 브리핑 전송]`,
      body: `"${text}" 메시지가 ${storeName} 점주님 전용 포스기 및 앱으로 전송되었습니다.`,
      type: 'confirm',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 rounded-3xl shadow-2xl border border-indigo-500/40 max-w-md w-full overflow-hidden text-white flex flex-col max-h-[92vh]"
        >
          {/* 1. 모달 헤더 (땡겨요 오렌지-레드 X 신한 POS 지오펜싱 테마) */}
          <div className="p-4.5 bg-gradient-to-r from-[#FB521C] via-[#FF6B3D] to-indigo-950 text-white flex items-center justify-between shrink-0 relative overflow-hidden border-b border-orange-500/20">
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner font-black text-lg">
                📍
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30 tracking-tight">
                    땡겨요 WORKS POS 비콘
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-200">
                    실시간 레이더 감지
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base mt-0.5 text-white tracking-tight">
                  매장 지오펜싱 비콘 & AI 노쇼 예측
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

          {/* 2. 모달 바디 (레이더 & 상태) */}
          <div className="p-4.5 overflow-y-auto space-y-4 text-xs flex-1">
            {/* 레이더 펄스 뷰어 */}
            <div className="relative bg-slate-950/80 rounded-3xl p-6 border border-indigo-500/20 flex flex-col items-center justify-center overflow-hidden">
              {/* 레이더 원형 펄스 */}
              <div className="absolute w-44 h-44 rounded-full border border-indigo-500/10 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute w-32 h-32 rounded-full border border-indigo-500/20" />
              <div className="absolute w-20 h-20 rounded-full border border-indigo-500/30" />

              {/* 중심 매장 비콘 아이콘 */}
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                <Store className="w-7 h-7" />
              </div>

              {/* 위성 레이더 텍스트 */}
              <div className="mt-4 text-center space-y-1 relative z-10">
                <span className="font-black text-sm text-white block">
                  {storeName}
                </span>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[11px] text-indigo-300 font-mono font-bold">
                    현재 거리: {distanceM}m
                  </span>
                  <span className="text-[10px] text-slate-400">
                    · {beaconStatus === 'detected' || beaconStatus === 'checked_in' ? '매장 도착' : `도착 예정 ${etaMinutes}분 전`}
                  </span>
                </div>
              </div>
            </div>

            {/* AI 노쇼 방지 FDS 사전 스코어 카드 */}
            <div className="bg-slate-950/90 rounded-2xl p-3.5 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-slate-200">신한 AI 노쇼 사전 예측 엔진</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  노쇼 위험도 0.01% (안전)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">D-GCS 평판</span>
                  <span className="text-xs font-black text-indigo-300">980점</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">과거 지각 이력</span>
                  <span className="text-xs font-black text-emerald-400">0건</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">신한EZ 가동</span>
                  <span className="text-xs font-black text-cyan-300">출근 즉시</span>
                </div>
              </div>
            </div>

            {/* 점주 안심 1-Touch 퀵 브리핑 */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">
                📢 점주님께 실시간 도착 현황 1-Touch 전송
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSendEta('10분 뒤 매장 도착 예정입니다!')}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-2 rounded-xl text-left text-[10.5px] text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  🚶 10분 뒤 도착 예정
                </button>
                <button
                  onClick={() => handleSendEta('지금 매장 문 앞 도착했습니다!')}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-2 rounded-xl text-left text-[10.5px] text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  🏪 매장 앞 도착 완료
                </button>
              </div>
            </div>

            {/* 출근 인증 상태별 액션 버튼 */}
            {beaconStatus === 'detected' && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>비콘 지오펜싱(15m) 인식 완료!</span>
                </div>
                <p className="text-[10.5px] text-slate-300">
                  매장 내부 진입이 확인되었습니다. 출근 스와이프를 완료하면 0.1초 만에 근로계약 체결 및 신한EZ 보험이 가동됩니다.
                </p>
                <button
                  onClick={handlePerformCheckIn}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>출근 스와이프 완료 & 1,000만원 보험 가동</span>
                </button>
              </div>
            )}

            {beaconStatus === 'checked_in' && (
              <div className="p-3.5 bg-blue-950/40 border border-blue-500/40 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 mx-auto flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-black text-xs text-white">출근 인증 완료 (근무 중)</h4>
                <p className="text-[10.5px] text-slate-300">
                  상단 Live Activity 위젯에서 실시간 급여가 초 단위로 누적됩니다.
                </p>
              </div>
            )}
          </div>

          {/* 3. 모달 하단 버튼 */}
          <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
            {onOpenChat && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>점주 1:1 라이브 안심채팅</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
