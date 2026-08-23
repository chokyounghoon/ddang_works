'use client';

// app/components/ShinhanLoanCascadeModal.tsx
// 땡겨요 WORKS X 신한은행 · 신한저축은행 대안신용(ACS) 기반 Cascade 포용대출 심사 시뮬레이터 (땡겨요 시그니처 UX 에디션)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Landmark, Building2, ShieldCheck, CheckCircle2, AlertCircle,
  ArrowRight, Sparkles, CreditCard, ChevronRight, Lock, Check,
  Zap, HeartHandshake, DollarSign, Calculator, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface ShinhanLoanCascadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerName?: string;
  dgcsScore?: number;
}

export default function ShinhanLoanCascadeModal({
  isOpen,
  onClose,
  workerName = '조이수',
  dgcsScore = 980,
}: ShinhanLoanCascadeModalProps) {
  const { triggerPush } = useAppPush();
  const [requestedAmount, setRequestedAmount] = useState<number>(3000000); // 300만원
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [stage, setStage] = useState<'input' | 'evaluating_bank' | 'bank_approved' | 'cascade_offer' | 'disbursed'>('input');
  const [selectedOffer, setSelectedOffer] = useState<'bank' | 'savings'>('bank');

  if (!isOpen) return null;

  // 예상 월 이자 계산 (1금융: 연 3.2%, 저축은행 결합: 300만*3.2% + 초과분*6.8%)
  const calculateMonthlyInterest = (amount: number) => {
    if (amount <= 3000000) {
      return Math.round((amount * 0.032) / 12);
    }
    const bankPart = (3000000 * 0.032) / 12;
    const savingsPart = ((amount - 3000000) * 0.068) / 12;
    return Math.round(bankPart + savingsPart);
  };

  const monthlyInterest = calculateMonthlyInterest(requestedAmount);

  const handleStartEvaluation = async () => {
    setEvaluating(true);
    setStage('evaluating_bank');

    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([20, 30, 20]);
    }

    // 1단계: 신한은행 BaaS ACS 심사
    await new Promise((r) => setTimeout(r, 1400));

    if (requestedAmount <= 3000000) {
      setStage('bank_approved');
      setSelectedOffer('bank');
    } else {
      setStage('cascade_offer');
      setSelectedOffer('savings');
    }
    setEvaluating(false);

    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([40, 60, 40]);
    }
  };

  const handleDisburseLoan = () => {
    setStage('disbursed');
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FB521C', '#FFB800', '#0046FF', '#10B981'],
      });
    } catch {}

    const amountStr = requestedAmount.toLocaleString();
    const targetName = selectedOffer === 'bank' ? '신한은행 1금융 우대대출' : '신한저축은행 Cascade 포용대출';

    triggerPush({
      title: `⚡ [${targetName} 땡겨받기 완료]`,
      body: `${workerName}님의 신한 주거래 모계좌로 ₩${amountStr}원이 0.1초 만에 즉시 입금되었습니다.`,
      type: 'confirm',
    });
  };

  const addAmount = (add: number) => {
    setRequestedAmount((prev) => Math.min(6000000, Math.max(1000000, prev + add)));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[32px] shadow-2xl border border-orange-200/80 max-w-lg w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        >
          {/* 1. 땡겨요 X 신한 시그니처 듀얼 그라데이션 헤더 */}
          <div className="p-4.5 bg-gradient-to-r from-[#FB521C] via-[#FF6B3D] to-[#0046FF] text-white flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white text-lg shadow-inner border border-white/30">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30 tracking-tight">
                    땡겨요 WORKS 포용금융
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-200">
                    D-GCS {dgcsScore}점 프리미엄
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base mt-0.5 text-white tracking-tight">
                  신한은행 · 저축은행 0.1초 안심 대출
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

          {/* 2. 땡겨요 대안신용평가 (ACS) 상단 하이라이트 배너 */}
          <div className="bg-[#FFF7F2] px-4 py-2.5 border-b border-orange-100 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm">🏆</span>
              <span className="font-bold text-slate-800 text-[11px]">
                <strong>{workerName}</strong>님의 땡겨요 성실근태 신용점수:
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-orange-200 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FB521C]" />
              <span className="font-black text-[#FB521C] text-[11px]">
                ACS 875점 (1등급)
              </span>
            </div>
          </div>

          {/* 3. 모달 바디 */}
          <div className="p-4.5 overflow-y-auto space-y-4 text-xs flex-1">
            {stage === 'input' && (
              <div className="space-y-4">
                {/* 대출 금액 인터랙티브 설정 박스 */}
                <div className="p-4 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 border-2 border-orange-200 rounded-3xl space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-700 text-xs">
                      얼마를 땡겨받으시겠어요?
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FB521C]/10 text-[#FB521C] border border-[#FB521C]/20">
                      {requestedAmount <= 3000000 ? '신한은행 1금융권 최저금리' : '신한저축은행 Cascade 결합'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-3xl font-black text-[#FB521C] tracking-tight font-mono">
                      ₩{requestedAmount.toLocaleString()}원
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">예상 월 이자 (일할계산)</span>
                      <span className="text-xs font-black text-slate-800 font-mono">
                        약 ₩{monthlyInterest.toLocaleString()}원 / 월
                      </span>
                    </div>
                  </div>

                  {/* 커스텀 땡겨요 슬라이더 */}
                  <input
                    type="range"
                    min="1000000"
                    max="6000000"
                    step="500000"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(Number(e.target.value))}
                    className="w-full accent-[#FB521C] cursor-pointer"
                  />

                  {/* 퀵 증감 버튼 칩 */}
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => addAmount(500000)}
                      className="flex-1 py-1.5 bg-white border border-slate-200 hover:border-orange-300 rounded-xl font-bold text-[10.5px] text-slate-700 active:scale-95 transition-all shadow-2xs cursor-pointer"
                    >
                      +50만원
                    </button>
                    <button
                      onClick={() => addAmount(1000000)}
                      className="flex-1 py-1.5 bg-white border border-slate-200 hover:border-orange-300 rounded-xl font-bold text-[10.5px] text-slate-700 active:scale-95 transition-all shadow-2xs cursor-pointer"
                    >
                      +100만원
                    </button>
                    <button
                      onClick={() => setRequestedAmount(3000000)}
                      className="flex-1 py-1.5 bg-orange-100/60 border border-orange-200 rounded-xl font-black text-[10.5px] text-[#FB521C] active:scale-95 transition-all cursor-pointer"
                    >
                      1금융 한도 (300만)
                    </button>
                    <button
                      onClick={() => setRequestedAmount(6000000)}
                      className="flex-1 py-1.5 bg-slate-900 border border-slate-800 rounded-xl font-black text-[10.5px] text-white active:scale-95 transition-all cursor-pointer"
                    >
                      최대 (600만)
                    </button>
                  </div>
                </div>

                {/* 땡겨요 X 신한 2단계 Cascade 심사 안내 */}
                <div className="space-y-2">
                  <h4 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>땡겨요 WORKS만의 무서류 0.1초 포용 심사 프로세스</span>
                  </h4>

                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-2xl border border-blue-200 space-y-1 hover:border-blue-300 transition-colors shadow-2xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-blue-700 flex items-center gap-1.5 text-xs font-black">
                          <Landmark className="w-4 h-4" /> 1단계: 신한은행 청년안심대출
                        </span>
                        <span className="text-emerald-600 font-black text-xs">연 3.20% (최저)</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 pl-5">
                        지각/노쇼 0건 D-GCS 온체인 평판을 담보로 1금융권 최우대 금리 최대 300만원 즉시 승인
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-orange-200 space-y-1 hover:border-orange-300 transition-colors shadow-2xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-[#FB521C] flex items-center gap-1.5 text-xs font-black">
                          <Building2 className="w-4 h-4" /> 2단계: 신한저축은행 안심 Cascade
                        </span>
                        <span className="text-indigo-600 font-black text-xs">연 6.80% (중금리)</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 pl-5">
                        은행 한도 초과분은 고금리 사채(연 20%+) 대신 신한저축은행이 안전하게 자동 연계 방어
                      </p>
                    </div>
                  </div>
                </div>

                {/* 땡겨받기 심사 실행 버튼 */}
                <button
                  onClick={handleStartEvaluation}
                  className="w-full py-4 bg-gradient-to-r from-[#FB521C] via-orange-500 to-amber-500 hover:brightness-105 active:scale-98 text-white font-black rounded-2xl text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Zap className="w-4.5 h-4.5 text-amber-200 fill-amber-200" />
                  <span>D-GCS 980점으로 0.1초 한도 심사 땡겨보기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {stage === 'evaluating_bank' && (
              <div className="py-12 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full border-3 border-[#FB521C]/20 border-t-[#FB521C] animate-spin absolute" />
                  <Landmark className="w-7 h-7 text-[#FB521C] animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">신한 BaaS 통합 심사 엔진 가동 중...</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    땡겨요 근태 평판과 신한카드 ACS 대안신용 데이터를 0.1초 만에 심사 중입니다.
                  </p>
                </div>
                <div className="bg-[#FFF7F2] p-2.5 rounded-xl border border-orange-200 text-[10px] font-mono text-[#FB521C] max-w-xs mx-auto">
                  ⚡ Shinhhan-BaaS-Core: Instant Decisioning
                </div>
              </div>
            )}

            {stage === 'bank_approved' && (
              <div className="space-y-4">
                {/* 1금융 전액 승인 카드 (도장 날인 효과) */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-2 border-emerald-300 rounded-3xl space-y-3 relative overflow-hidden shadow-sm"
                >
                  {/* 신한은행 승인 도장 */}
                  <div className="absolute right-4 top-4 border-2 border-emerald-500 text-emerald-600 font-black text-[10px] px-2 py-1 rounded-xl rotate-[-8deg] shadow-xs select-none bg-emerald-50/80">
                    신한은행<br />1금융 승인
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        1금융권 100% 전액 승인
                      </span>
                      <h4 className="font-black text-sm text-slate-900 mt-0.5">
                        신한은행 청년 안심대출 승인 완료!
                      </h4>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3.5 border border-emerald-100 space-y-2 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">최종 대출 승인액</span>
                      <span className="font-black text-[#FB521C] text-base font-mono">
                        ₩{requestedAmount.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">적용 우대금리</span>
                      <span className="font-black text-blue-700">연 3.20% (근태 1등급 -1.2%p 감면)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">예상 월 이자</span>
                      <span className="font-bold text-slate-800">약 ₩{monthlyInterest.toLocaleString()}원 / 월</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">중도상환 수수료</span>
                      <span className="font-bold text-emerald-600">₩0원 (언제든 무료 상환)</span>
                    </div>
                  </div>
                </motion.div>

                <button
                  onClick={handleDisburseLoan}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:brightness-105 active:scale-98 text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Zap className="w-4.5 h-4.5 text-emerald-200 fill-emerald-200" />
                  <span>신한 주거래 모계좌로 0.1초 만에 땡겨받기</span>
                </button>
              </div>
            )}

            {stage === 'cascade_offer' && (
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 bg-gradient-to-br from-indigo-50 via-white to-orange-50 border-2 border-indigo-300 rounded-3xl space-y-3 shadow-sm relative"
                >
                  {/* Cascade 결합 승인 도장 */}
                  <div className="absolute right-4 top-4 border-2 border-indigo-500 text-indigo-600 font-black text-[10px] px-2 py-1 rounded-xl rotate-[-8deg] shadow-xs select-none bg-indigo-50/80">
                    신한 Cascade<br />결합 승인
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        One-Shinhan 안심 결합 승인
                      </span>
                      <h4 className="font-black text-sm text-slate-900 mt-0.5">
                        은행 300만 + 저축은행 ₩{(requestedAmount - 3000000).toLocaleString()}원 동시 승인!
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="bg-white p-3 rounded-2xl border border-blue-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-blue-700 block text-xs">신한은행 (1금융)</span>
                        <span className="text-slate-500 text-[10px]">연 3.20% · ₩3,000,000원</span>
                      </div>
                      <span className="font-bold text-emerald-600 text-xs">승인 완료</span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-orange-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#FB521C] block text-xs">신한저축은행 (Cascade 안심)</span>
                        <span className="text-slate-500 text-[10px]">
                          연 6.80% · ₩{(requestedAmount - 3000000).toLocaleString()}원
                        </span>
                      </div>
                      <span className="font-bold text-indigo-600 text-xs">Cascade 결합</span>
                    </div>
                  </div>
                </motion.div>

                <button
                  onClick={handleDisburseLoan}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-[#FB521C] hover:brightness-105 active:scale-98 text-white font-black rounded-2xl text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Zap className="w-4.5 h-4.5 text-amber-200 fill-amber-200" />
                  <span>결합 대출 총 ₩{requestedAmount.toLocaleString()}원 즉시 땡겨받기</span>
                </button>
              </div>
            )}

            {stage === 'disbursed' && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-black text-lg text-slate-900">0.1초 입금 완료! ⚡</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>₩{requestedAmount.toLocaleString()}원</strong>이 신한은행 주거래 모계좌(110-482-******)로 즉시 입금되었습니다.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 text-left text-[11px] space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">입금 계좌:</span>
                    <span className="font-bold text-slate-900">신한은행 110-482-****** ({workerName})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">예상 월 이자:</span>
                    <span className="font-black text-[#FB521C]">약 ₩{monthlyInterest.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">성실 긱 수행 혜택:</span>
                    <span className="text-emerald-600 font-bold">10회 완수 시 금리 연 0.5%p 추가 인하</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-black rounded-2xl text-xs transition-all cursor-pointer"
                >
                  확인 완료
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
