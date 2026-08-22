'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Percent, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Download, 
  Share2, 
  ArrowRight, 
  Building, 
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

interface ShinhanRateDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerName?: string;
  dgcsScore?: number;
}

export default function ShinhanRateDiscountModal({
  isOpen,
  onClose,
  workerName = '조이수',
  dgcsScore = 990,
}: ShinhanRateDiscountModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<'credit' | 'jeonse' | 'mycar'>('credit');

  if (!isOpen) return null;

  const loanOptions = {
    credit: {
      name: '신한 쏠편한 직장인/긱워커 신용대출',
      originalRate: '연 5.85%',
      discountedRate: '연 4.65%',
      saveAmountYear: '연간 약 360,000원 절감',
    },
    jeonse: {
      name: '신한 청년 안심 전세자금대출',
      originalRate: '연 4.40%',
      discountedRate: '연 3.20%',
      saveAmountYear: '연간 약 720,000원 절감',
    },
    mycar: {
      name: '신한 마이카(MyCar) 오토론',
      originalRate: '연 6.10%',
      discountedRate: '연 4.90%',
      saveAmountYear: '연간 약 240,000원 절감',
    },
  };

  const handleCopyCoupon = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([40, 60]);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-sm bg-slate-900 border border-amber-500/40 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 to-amber-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-tight text-white flex items-center gap-1">
                <span>D-GCS 1등급 우대금리 쿠폰</span>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-400/30 font-black">
                  -1.2%p
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">성실 근태 블록체인 SBT 연동 혜택</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 바디 */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* 황금 우대금리 인증서 카드 */}
          <div className="bg-gradient-to-br from-amber-500/15 via-slate-800/80 to-slate-900 border-2 border-amber-400/50 rounded-2xl p-4 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3 border-b border-amber-400/20 pb-2">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10.5px] font-black text-amber-300">신한은행 ✕ 땡겨요 WORKS</span>
              </div>
              <span className="text-[9px] font-mono text-amber-400/80">SBT: 0x8F9...2A1</span>
            </div>

            <div className="space-y-1.5 mb-3">
              <p className="text-[11px] text-slate-300">
                인증자: <strong className="text-white">{workerName}</strong> (D-GCS {dgcsScore}점 · 1등급)
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-amber-400 tracking-tight">-1.20%p</span>
                <span className="text-[10px] text-amber-200 font-bold">신한금융 전 계열사 즉시 할인</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-amber-400/20 text-[10px] space-y-1 text-slate-300">
              <p className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                최근 6개월 노쇼/지각 0건 (성실도 100%)
              </p>
              <p className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                보건증 및 바리스타 위생 SBT 온체인 검증 완료
              </p>
            </div>
          </div>

          {/* 대출 상품별 실시간 금리 시뮬레이터 */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-300 flex items-center justify-between">
              <span>적용 상품 시뮬레이션</span>
              <span className="text-amber-400 text-[10px]">클릭 시 할인율 비교</span>
            </label>
            
            <div className="grid grid-cols-3 gap-1.5">
              {(['credit', 'jeonse', 'mycar'] as const).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedLoan(key)}
                  className={`p-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                    selectedLoan === key
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-xs'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {key === 'credit' ? '신용대출' : key === 'jeonse' ? '전세대출' : '마이카'}
                </button>
              ))}
            </div>

            <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 space-y-2">
              <p className="font-bold text-white text-[11px]">{loanOptions[selectedLoan].name}</p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 line-through">{loanOptions[selectedLoan].originalRate}</span>
                <div className="flex items-center gap-1 text-emerald-400 font-black text-xs">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{loanOptions[selectedLoan].discountedRate}</span>
                </div>
              </div>
              <p className="text-[10px] text-amber-300 font-bold bg-amber-400/10 p-1.5 rounded-lg border border-amber-400/20 text-center">
                ✨ {loanOptions[selectedLoan].saveAmountYear}
              </p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCopyCoupon}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-98 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{copied ? '✅ 신한 SOL 금리 우대코드 복사완료!' : '신한 SOL 대출 신청 시 즉시 적용하기'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
