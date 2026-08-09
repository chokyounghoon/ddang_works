'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Star, Calendar, Zap, ShieldCheck, ArrowRight, RefreshCw, UserCheck } from 'lucide-react';

interface ShiftExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  workerName?: string;
  hourlyWage?: number;
}

export default function ShiftExtensionModal({
  isOpen,
  onClose,
  storeName = 'CU 강남파이낸스점',
  workerName = '조이수',
  hourlyWage = 16000,
}: ShiftExtensionModalProps) {
  const [step, setStep] = useState<'employer_offer' | 'worker_confirm' | 'completed'>('employer_offer');
  const [consecutiveDays, setConsecutiveDays] = useState(2);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0A1128] border border-indigo-500/40 rounded-3xl p-5 text-white shadow-[0_20px_60px_rgba(99,102,241,0.3)] relative overflow-hidden"
        >
          {/* 배배경 블러 효과 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs transition-all"
          >
            ✕
          </button>

          {/* 헤더 */}
          <div className="flex items-center gap-2.5 mb-4 border-b border-indigo-500/20 pb-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <RefreshCw className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider text-white">단골 알바 1초 시프트 연장</span>
                <span className="text-[8px] font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-0.5 rounded-full uppercase">
                  Auto-Renewal
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">구인 피로도 0% ➔ 맘에 드는 알바생 내일 즉시 연속 지정</p>
            </div>
          </div>

          {/* Step 1: 점주 제안 단계 */}
          {step === 'employer_offer' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">오늘 근무 평가</span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <p className="font-bold text-indigo-300">"{workerName} 알바생 태도 및 0.1초 정산 완료"</p>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">매장 물류 정리 속도가 빠르고 결근 없이 완벽 이행함</p>
                </div>
              </div>

              {/* 연장 수단 선택 및 신한 에스크로 예치 연동 */}
              <div className="bg-gradient-to-r from-indigo-950/70 to-slate-950 border border-indigo-500/40 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">내일 연장 시프트:</span>
                  <span className="font-mono font-black text-amber-300">내일 12:00 ~ 13:00 (1시간)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">신한 에스크로 예치금:</span>
                  <span className="font-mono font-black text-emerald-400">₩{hourlyWage.toLocaleString()} (자동 승인)</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>점주 승인 즉시 알바몬/알바천국과 달리 수수료 0원으로 내일 시프트 예약</span>
                </div>
              </div>

              <button
                onClick={() => setStep('worker_confirm')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                점주 ➔ {workerName} 알바생에게 1초 연장 제안 전송
              </button>
            </div>
          )}

          {/* Step 2: 알바생 수락 화면 */}
          {step === 'worker_confirm' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="font-black text-sm text-white">[{storeName}] 사장님의 단골 요청!</h4>
                <p className="text-xs text-slate-300">
                  "{workerName}님, 내일도 동일 시간대(12:00~13:00) 시프트로 연속 지원하시겠습니까?"
                </p>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/30 text-left space-y-1 text-[11px]">
                  <p className="font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> D-GCS 신용점수 +50점 가산 보너스!
                  </p>
                  <p className="text-slate-400">동일 사업장 연속 근무 시 신한 SOL 알바 비상금 대출 금리 0.5% 추가 감면</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onClose}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
                >
                  이번은 거절하기
                </button>
                <button
                  onClick={() => setStep('completed')}
                  className="py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  1초 연속 근무 확정
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 완료 & 단골 지정 성공 */}
          {step === 'completed' && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-base text-white">내일 시프트 연속 확정 완료!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  [{storeName}] 사장님과 {workerName} 알바생 간 2일 연속 근무 매칭이 자동 체결되었습니다.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3 text-left space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>단골 지정 상태:</span>
                  <span className="font-black text-emerald-400">⭐️ 1호 단골 알바 등록됨</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>신한 에스크로 원장:</span>
                  <span className="font-mono font-bold text-indigo-300">내일 ₩{hourlyWage.toLocaleString()} 자동 예약</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all"
              >
                확인 및 닫기
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
