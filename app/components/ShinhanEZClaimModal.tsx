'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Building2, 
  CreditCard, 
  AlertCircle, 
  Sparkles, 
  X, 
  Camera, 
  ArrowRight 
} from 'lucide-react';

interface ShinhanEZClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerName?: string;
}

export default function ShinhanEZClaimModal({
  isOpen,
  onClose,
  workerName = '조이수',
}: ShinhanEZClaimModalProps) {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'confirm' | 'success'>('upload');
  const [claimAmount, setClaimAmount] = useState(48000);
  const [hospitalName, setHospitalName] = useState('역삼 바른본정형외과의원');
  const [injuryType, setInjuryType] = useState('근무 중 손가락 경미 찰과상 및 봉합 치료');

  if (!isOpen) return null;

  const handleStartOCR = () => {
    setStep('analyzing');
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([20, 30, 20]);
    }
    setTimeout(() => {
      setStep('confirm');
    }, 1800);
  };

  const handleClaimSubmit = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([50, 100, 50, 100]);
    }
    setStep('success');
  };

  const handleResetAndClose = () => {
    setStep('upload');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-700 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-tight text-white flex items-center gap-1">
                <span>신한EZ손해보험</span>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full border border-cyan-400/30">
                  무상 안전케어
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">비급여 상해의료비 원클릭 즉시 환급</p>
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
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
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

                {/* 영수증 업로드 카드 */}
                <div
                  onClick={handleStartOCR}
                  className="border-2 border-dashed border-cyan-500/50 hover:border-cyan-400 bg-slate-800/60 hover:bg-slate-800/90 rounded-2xl p-6 text-center cursor-pointer transition-all active:scale-98 group flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-all border border-cyan-500/30 shadow-inner">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 text-xs">병원/약국 진료비 영수증 촬영</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">클릭 시 AI OCR이 항목과 금액을 자동 판독합니다</p>
                  </div>
                  <span className="mt-1 text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    📸 샘플 영수증으로 1초 자동 인식하기
                  </span>
                </div>

                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-1.5 text-[10px] text-slate-400">
                  <p className="font-bold text-slate-300">✅ 보장 내용 요약</p>
                  <p>· 점주 합의 불필요 · 본인 부담금 0원</p>
                  <p>· 응급 치료비, 비급여 주사료, 약제비 전액 당일 환급</p>
                </div>
              </motion.div>
            )}

            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-8 text-center space-y-3"
              >
                <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin absolute" />
                  <FileText className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">신한 AI OCR 영수증 분석 중...</h4>
                  <p className="text-[11px] text-slate-400 mt-1">병원명, 급여/비급여 진료비 내역을 추출하고 있습니다.</p>
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
                <div className="bg-slate-800/90 border border-cyan-500/40 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400 text-[10.5px]">판독 의료기관</span>
                    <span className="font-bold text-white text-[11px]">{hospitalName}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400 text-[10.5px]">상해 진료 사유</span>
                    <span className="font-bold text-white text-[11px]">{injuryType}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 text-[10.5px]">환급 예정 금액</span>
                    <span className="font-black text-sm text-cyan-300">
                      ₩{claimAmount.toLocaleString()} <span className="text-[10px] text-cyan-400 font-normal">(100% 전액)</span>
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="text-[10.5px] text-blue-200">
                    입금 계좌: <strong>신한은행 (110-***-482910 조이수)</strong>
                  </div>
                </div>

                <button
                  onClick={handleClaimSubmit}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>신한EZ 즉시 환급 승인 접수</span>
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
                  <h4 className="font-black text-sm text-white">신한EZ 환급 접수 승인 완료!</h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    <strong>₩{claimAmount.toLocaleString()}</strong>원이 신한 BaaS 즉시 정산망을 통해 <br />
                    10분 내 신한은행 계좌로 입금됩니다.
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-left text-[10.5px] space-y-1 text-slate-300">
                  <p>· 접수번호: <span className="text-cyan-400 font-mono">EZ-2026-0822-0941</span></p>
                  <p>· 점주 및 근로자 비용 부담: <strong>0원 (신한 전액 지원)</strong></p>
                </div>
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
  );
}
