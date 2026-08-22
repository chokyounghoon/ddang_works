'use client';

// app/components/WorkerProfileDetailModal.tsx
// 상단 우측 [조이수 🏆] 클릭 시 표출되는 워커 상세 프로필 & SBT 신용/보건증 모달

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Award, ShieldCheck, CheckCircle2, AlertCircle, FileCheck,
  Building2, Landmark, CreditCard, ChevronRight, Sparkles, User,
  Calendar, Phone, MapPin, ExternalLink
} from 'lucide-react';

import MerchantFeeSynergyNoticeModal from './MerchantFeeSynergyNoticeModal';

interface WorkerProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthCertVerified: boolean;
  onOpenHealthCertModal: () => void;
  onOpenRateDiscountModal?: () => void;
  onOpenEZClaimModal?: () => void;
  solcBalance?: number;
}

export default function WorkerProfileDetailModal({
  isOpen,
  onClose,
  healthCertVerified,
  onOpenHealthCertModal,
  onOpenRateDiscountModal,
  onOpenEZClaimModal,
  solcBalance = 12.5,
}: WorkerProfileDetailModalProps) {
  const [showFeeNoticeModal, setShowFeeNoticeModal] = React.useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden text-slate-900 flex flex-col max-h-[90vh]"
        >
          {/* 헤더 */}
          <div className="p-4.5 bg-gradient-to-r from-slate-900 via-[#0c1a30] to-blue-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-md shrink-0 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                  alt="조이수"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 p-0.5 bg-amber-500 rounded-tl text-slate-950 font-black text-[9px]">
                  🏆
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-lg text-white">조이수</h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    SBT Gold
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    24세 · 남
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                  신한 씬파일러 1등급 · SOL Top Pro
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 바디 컨텐츠 */}
          <div className="p-4.5 overflow-y-auto space-y-3.5 text-xs">
            {/* 📢 [신한 상생 공지] 점주 5% 수수료 ➔ 긱워커 100% 금융 환원 시너지 배너 */}
            <div 
              onClick={() => setShowFeeNoticeModal(true)}
              className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/50 hover:border-amber-400 rounded-2xl p-3 space-y-1.5 shadow-sm cursor-pointer transition-all active:scale-[0.99] group text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                    📢 [신한 상생 공지]
                  </span>
                  <span className="text-[9.5px] font-extrabold text-amber-300 font-mono">
                    점주 수수료 5% ➔ 100% 금융 환원
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  자세히 보기 <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <div>
                <p className="text-xs font-black text-white flex items-center gap-1">
                  <span>점주 부담 5% 수수료는</span>
                  <span className="text-amber-400">어떻게 긱워커에게 환원될까요?</span>
                </p>
                <p className="text-[10.5px] text-slate-300 mt-0.5 leading-snug">
                  신한EZ 무상 상해보험(2%) + 신한투자증권 ETF 잔돈매칭(1.5%) + 신한라이프 연금(1%) + 신한DS 세무대행(0.5%) 시너지 구조를 확인하세요.
                </p>
              </div>
            </div>

            {/* 1. D-GCS 신용 평판 & 근태 요약 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  블록체인 SBT 근태 평판 점수
                </span>
                <span className="text-sm font-black text-[#FB521C] font-mono">
                  D-GCS 980점
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block font-bold">노쇼 이력</span>
                  <span className="font-black text-emerald-600">0건 (완전 클린)</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block font-bold">출근 정합률</span>
                  <span className="font-black text-blue-600">100% (GPS 정시)</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block font-bold">완수 긱</span>
                  <span className="font-black text-purple-600">18회 완료</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200 font-mono">
                <span>신한DS PoA 메인넷 인증:</span>
                <span className="text-slate-700 font-bold">0x71C...4e89</span>
              </div>
            </div>

            {/* 2. 보건증 AI Vision OCR 상태 카드 */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                healthCertVerified
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck
                    className={`w-5 h-5 ${
                      healthCertVerified ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs">
                        식품위생법 제49조 보건증
                      </span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          healthCertVerified
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {healthCertVerified ? '검증 완료 🟢' : '미검증 ⚠️'}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-600 mt-0.5">
                      {healthCertVerified
                        ? '서울 강남구 보건소 (유효기간: 2027.03.14)'
                        : '음식점/카페 시프트 지원을 위해 보건증을 인증해주세요'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenHealthCertModal();
                  }}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10.5px] rounded-xl shadow-xs active:scale-95 transition-all shrink-0 flex items-center gap-1"
                >
                  <span>{healthCertVerified ? '상세보기' : '촬영 인증'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 3. 신한금융 연계 혜택 요약 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <span className="font-black text-slate-800 text-xs block">
                연계된 신한금융 계좌 및 혜택
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-600 flex items-center gap-1 font-medium">
                    <Landmark className="w-3.5 h-3.5 text-blue-600" />
                    신한은행 주거래 모계좌
                  </span>
                  <span className="font-black text-slate-900 font-mono">110-482-****** (0.1초 정산)</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-600 flex items-center gap-1 font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-pink-600" />
                    신한카드 대안신용(ACS)
                  </span>
                  <span className="font-black text-pink-600 font-mono">875점 (+250만원 한도)</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-600 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                    신한EZ손보 초단기 보험
                  </span>
                  <span className="font-black text-emerald-600">출근 즉시 100% 무상 가동</span>
                </div>
              </div>
            </div>

            {/* 4. One Shinhan 퀵 혜택 액션 바 */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenRateDiscountModal) onOpenRateDiscountModal();
                }}
                className="p-2.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-400/40 rounded-2xl text-left transition-all active:scale-98 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-black text-amber-700">D-GCS 1등급 특권</span>
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="mt-1 font-black text-[11px] text-slate-900 leading-tight">
                  우대금리 -1.2%p 쿠폰
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenEZClaimModal) onOpenEZClaimModal();
                }}
                className="p-2.5 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 hover:from-cyan-500/25 hover:to-blue-500/25 border border-cyan-400/40 rounded-2xl text-left transition-all active:scale-98 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-black text-cyan-700">신한EZ 무상케어</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                </div>
                <div className="mt-1 font-black text-[11px] text-slate-900 leading-tight">
                  상해보험 0.1초 실비 청구
                </div>
              </button>
            </div>
          </div>

          {/* 푸터 */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs active:scale-98 transition-all"
            >
              확인 닫기
            </button>
          </div>
        </motion.div>
      </div>

      {/* 📢 [신한 상생 공지] 5% 점주 수수료 100% 금융 환원 상세 모달 */}
      <MerchantFeeSynergyNoticeModal
        isOpen={showFeeNoticeModal}
        onClose={() => setShowFeeNoticeModal(false)}
      />
    </AnimatePresence>
  );
}
