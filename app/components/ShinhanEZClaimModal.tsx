'use client';

// app/components/ShinhanEZClaimModal.tsx
// 신한EZ손해보험 AI 자동 사고접수 & 즉시 보상금 지급 파이프라인 (AI Claims & Instant Payout System)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, UploadCloud, CheckCircle2, FileText, Building2, 
  CreditCard, AlertCircle, Sparkles, X, Camera, ArrowRight,
  Receipt, Landmark, Activity, Check, Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface ShinhanEZClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerName?: string;
  onOpenExplorer?: (txHash: string) => void;
}

const CLAIM_PRESETS = [
  {
    id: 'cut',
    title: '주방 조리 중 칼 베임 / 봉합 치료',
    category: '비급여 외상 상해',
    hospital: '역삼 바른본정형외과의원',
    amount: 48000,
    icon: '🩹',
    coverType: '상해 의료실비 (100% 실손)',
  },
  {
    id: 'burn',
    title: '튀김기 기름 튐 경미 화상 치료',
    category: '비급여 화상 드레싱',
    hospital: '강남 베스트피부과의원',
    amount: 62000,
    icon: '🔥',
    coverType: '화상치료 및 비급여 주사비',
  },
  {
    id: 'slip',
    title: '물류 하역 중 발목 염좌 및 물리치료',
    category: '상해 엑스레이 및 도수치료',
    hospital: '선릉 제일정형외과',
    amount: 85000,
    icon: '⚡',
    coverType: '비급여 정밀검사 및 약제비',
  },
  {
    id: 'property',
    title: '홀 서빙 중 와인잔/식기 파손 배상',
    category: '현장 대물 배상책임',
    hospital: 'CU 강남파이낸스점 매장 파손',
    amount: 35000,
    icon: '🍷',
    coverType: '점주 및 알바생 100% 면책 배상',
  },
];

export default function ShinhanEZClaimModal({
  isOpen,
  onClose,
  workerName = '조이수',
  onOpenExplorer,
}: ShinhanEZClaimModalProps) {
  const { triggerPush } = useAppPush();
  const [step, setStep] = useState<'upload' | 'analyzing' | 'confirm' | 'success'>('upload');
  const [selectedPreset, setSelectedPreset] = useState(CLAIM_PRESETS[0]);
  const [fdsPassed, setFdsPassed] = useState(false);

  if (!isOpen) return null;

  const handleStartOCR = (preset = selectedPreset) => {
    setSelectedPreset(preset);
    setStep('analyzing');
    setFdsPassed(false);

    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([20, 30, 20]);
    }

    setTimeout(() => {
      setFdsPassed(true);
      setTimeout(() => {
        setStep('confirm');
      }, 700);
    }, 1500);
  };

  const handleClaimSubmit = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([50, 100, 50, 100]);
    }
    setStep('success');

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}

    triggerPush({
      title: '⚡ [신한EZ손해보험 즉시 보상금 지급]',
      body: `${workerName}님의 신한은행 계좌(110-482-******)로 보상금 ₩${selectedPreset.amount.toLocaleString()}원이 0.1초 만에 입금되었습니다.`,
      type: 'confirm',
    });
  };

  const handleResetAndClose = () => {
    setStep('upload');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-slate-900 border border-slate-700 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* 헤더 */}
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>신한EZ손해보험</span>
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full border border-cyan-400/30">
                    원클릭 AI 즉시 보상
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">비급여 상해의료비 & 대물배상 0.1초 입금</p>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 바디 컨텐츠 */}
          <div className="p-4.5 overflow-y-auto space-y-4 text-xs flex-1">
            <AnimatePresence mode="wait">
              {step === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3.5"
                >
                  <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl">
                    <div className="flex items-start gap-2 text-cyan-200 text-[11px] leading-relaxed">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>{workerName}</strong>님은 땡겨요 출근 스와이프와 동시에 <strong>신한EZ손해보험 단기 상해 특약(최대 1,000만원)</strong>에 100% 무상 가입되어 있습니다.
                      </span>
                    </div>
                  </div>

                  {/* 사고 유형 빠른 선택 프리셋 */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      📌 발생한 상해/사고 유형 선택
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {CLAIM_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleStartOCR(p)}
                          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/50 p-2.5 rounded-2xl text-left transition-all active:scale-98 flex flex-col justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-base">{p.icon}</span>
                            <span className="font-bold text-[11px] text-white line-clamp-1 group-hover:text-cyan-300">
                              {p.title}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-700/60">
                            <span>{p.category}</span>
                            <span className="font-black text-cyan-300">₩{p.amount.toLocaleString()}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 영수증 직접 촬영 카드 */}
                  <div
                    onClick={() => handleStartOCR(CLAIM_PRESETS[0])}
                    className="border-2 border-dashed border-cyan-500/50 hover:border-cyan-400 bg-slate-800/60 hover:bg-slate-800/90 rounded-2xl p-5 text-center cursor-pointer transition-all active:scale-98 group flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-all border border-cyan-500/30 shadow-inner">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-200 text-xs">병원 / 약국 진료비 영수증 직접 촬영</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">클릭 시 AI OCR이 항목과 금액을 0.1초 자동 판독합니다</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full border-3 border-cyan-400/30 border-t-cyan-400 animate-spin absolute" />
                    <FileText className="w-7 h-7 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">신한 AI OCR 영수증 정밀 판독 중...</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {selectedPreset.hospital} 비급여 진료 항목을 자동 추출하고 있습니다.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[10.5px] font-mono text-cyan-300/80 space-y-1 max-w-xs mx-auto text-left">
                    <p>✓ OCR Text Extraction: Done</p>
                    <p>✓ GPS & Shift Match: Verified (15m 반경 내)</p>
                    <p>✓ AI FDS Fraud Filter: 0 Risk Detected</p>
                  </div>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                >
                  {/* AI 안심 FDS 검증 배지 */}
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-300 text-xs">AI FDS 사전 적격 심사 통과</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">100% 전액 지원</span>
                  </div>

                  <div className="bg-slate-800/90 border border-cyan-500/40 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400 text-[10.5px]">판독 의료기관</span>
                      <span className="font-bold text-white text-[11px]">{selectedPreset.hospital}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400 text-[10.5px]">상해 진료 항목</span>
                      <span className="font-bold text-white text-[11px]">{selectedPreset.title}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400 text-[10.5px]">보장 담보 종류</span>
                      <span className="font-bold text-cyan-300 text-[10.5px]">{selectedPreset.coverType}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400 text-[10.5px]">환급 예정 보상금</span>
                      <span className="font-black text-base text-cyan-300 font-mono">
                        ₩{selectedPreset.amount.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="text-[10.5px] text-blue-200">
                      입금 계좌: <strong>신한은행 (110-***-482910 {workerName})</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleClaimSubmit}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>신한EZ 즉시 환급 보상금 수령 (0.1초 입금)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4 text-center space-y-3.5"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">신한EZ 보상금 즉시 입금 완료!</h4>
                    <p className="text-[11px] text-slate-300 mt-1">
                      <strong>₩{selectedPreset.amount.toLocaleString()}원</strong>이 신한 BaaS 즉시 정산망을 통해 <br />
                      신한 주거래 모계좌로 0.1초 만에 입금되었습니다.
                    </p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-left text-[10.5px] space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span>접수번호:</span>
                      <span className="text-cyan-400 font-mono">EZ-2026-0823-9941</span>
                    </div>
                    <div className="flex justify-between">
                      <span>워커 및 점주 부담금:</span>
                      <span className="text-emerald-400 font-bold">₩0원 (신한 전액 보상)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>스마트 증권 해시:</span>
                      <span className="text-indigo-300 font-mono">0x4d19...aa31</span>
                    </div>
                  </div>

                  {onOpenExplorer && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenExplorer('0x4d19aa3182ef8910243452b419c814120392fa91');
                      }}
                      className="w-full py-2.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span>신한DS 온체인 블록체인에서 보상 내역 검증</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={handleResetAndClose}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    닫기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
