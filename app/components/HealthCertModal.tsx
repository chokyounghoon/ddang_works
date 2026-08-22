'use client';

// app/components/HealthCertModal.tsx
// 상단 도담이 AI 및 프로필 연계: [보건증 AI Vision OCR 자동 인증 & SBT 평판 연동 모달]
// 식품위생법 제49조 준수 ➔ 점주 과태료(최대 500만원) 원천 차단 및 음식점/카페 프리패스

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, AlertCircle, Camera, ShieldCheck, Sparkles,
  FileCheck, Building2, Calendar, Award, RefreshCw, UploadCloud,
  Check, Lock, ChevronRight, UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface HealthCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  certVerified: boolean;
  setCertVerified: (verified: boolean) => void;
}

export default function HealthCertModal({
  isOpen,
  onClose,
  certVerified,
  setCertVerified,
}: HealthCertModalProps) {
  const { triggerPush } = useAppPush();
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);

  if (!isOpen) return null;

  const handleSimulateOcr = async () => {
    setIsScanning(true);
    setScanStep(1); // 1. AI Vision OCR 텍스트 추출
    await new Promise(r => setTimeout(r, 700));
    
    setScanStep(2); // 2. 정부24 & 관할 보건소 데이터베이스 진위 대조
    await new Promise(r => setTimeout(r, 800));

    setScanStep(3); // 3. SBT 신용 원장 박제 및 뱃지 발급
    await new Promise(r => setTimeout(r, 600));

    setCertVerified(true);
    setIsScanning(false);
    setScanStep(0);

    try {
      confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
    } catch {}

    triggerPush({
      title: '🩺 [보건증 AI Vision OCR 인증 완료]',
      body: '유효기간(~2027.03.14) 진위 검증 성공! 전국 음식점·카페 0초 즉시 지원 프리패스가 활성화되었습니다.',
      type: 'confirm',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden text-slate-900 flex flex-col max-h-[90vh]"
        >
          {/* 1. 모달 헤더 */}
          <div className="p-4.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg shadow-inner">
                🩺
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                    AI Vision OCR & SBT
                  </span>
                  <span className="text-[10px] font-bold text-emerald-100">
                    식품위생법 제49조 준수
                  </span>
                </div>
                <h3 className="font-black text-base mt-0.5">
                  보건증(건강진단결과서) 0.1초 AI 자동 검증
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. 모달 컨텐츠 바디 */}
          <div className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* 법적 리스크 해제 설명 배너 */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>점주 법적 과태료(최대 500만원) 리스크 100% 면책</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                알바생 가입 시 보건증 사진을 업로드하면, <strong>AI OCR 엔진이 0.1초 만에 유효기간과 진위 여부를 판독</strong>하여 <span className="font-bold underline">[보건증 인증 완료 🟢]</span> 배지를 부여합니다. <strong>검증된 워커만 음식점/카페에 즉시 지원</strong>할 수 있습니다.
              </p>
            </div>

            {/* 현재 보건증 상태 카드 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${certVerified ? 'bg-emerald-500 animate-ping' : 'bg-amber-500 animate-bounce'}`} />
                  <span className="font-black text-slate-900 text-sm">
                    {certVerified ? '🟢 보건증 진위 인증 완료' : '⚠️ 보건증 등록 필요'}
                  </span>
                </div>
                <span className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full border ${
                  certVerified
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {certVerified ? '식음료 프리패스 ACTIVE' : '음식점 지원 제한'}
                </span>
              </div>

              {/* OCR 판독 상세 명세 */}
              <div className="space-y-2 text-[11.5px]">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold">발급 기관</span>
                    <span className="font-black text-slate-900">서울 강남구 보건소</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold">전자관리번호</span>
                    <span className="font-mono font-black text-indigo-600">2026-강남보건-048291</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold">검진 판정 결과</span>
                    <span className="font-black text-emerald-600">정상 (전염성 질환 음성)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold">보건증 유효기간</span>
                    <span className="font-mono font-black text-emerald-700">~ 2027.03.14 (유효)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* OCR 스캔 시뮬레이션 상태창 */}
            {isScanning && (
              <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-4 space-y-2 border border-emerald-500/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" /> AI Vision OCR 판독 중
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Step {scanStep}/3</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 font-mono">
                  <p className={scanStep >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    &gt; 1. 모바일 카메라 이미지 텍스트 딥러닝 디로케이션 추출: {scanStep >= 1 ? '✓ COMPLETE' : '진행 중'}
                  </p>
                  <p className={scanStep >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    &gt; 2. 정부24 e-보건소 발급 원장 진위 대조: {scanStep >= 2 ? '✓ VERIFIED (정상)' : '대기'}
                  </p>
                  <p className={scanStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    &gt; 3. 신한 D-GCS SBT 평판 뱃지 실시간 민팅: {scanStep >= 3 ? '✓ MINTED' : '대기'}
                  </p>
                </div>
              </div>
            )}

            {/* 지원 가능 긱 직종 안내 */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
              <p className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider">
                🎯 보건증 인증 시 즉시 지원 가능한 긱 목록
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[10.5px]">
                  ☕ 카페 바리스타
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[10.5px]">
                  🍖 음식점 홀서빙/주방보조
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[10.5px]">
                  🍔 패스트푸드 조리
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[10.5px]">
                  🍱 편의점 푸드 관리
                </span>
              </div>
            </div>
          </div>

          {/* 3. 모달 하단 버튼 */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 shrink-0">
            <button
              onClick={handleSimulateOcr}
              disabled={isScanning}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 hover:brightness-105"
            >
              <Camera className="w-4 h-4 text-emerald-200" />
              <span>{certVerified ? '📸 보건증 재촬영 & 0.1초 재검증' : '📸 보건증 촬영 및 0.1초 AI 인증하기'}</span>
            </button>

            <button
              onClick={() => {
                setCertVerified(!certVerified);
                triggerPush({
                  title: certVerified ? '⚠️ [보건증 상태 전환: 미인증]' : '🟢 [보건증 상태 전환: 인증 완료]',
                  body: certVerified ? '보건증 미인증 상태로 전환되어 음식점 시프트 지원이 제한됩니다.' : '보건증 인증 완료 상태로 전환되었습니다.',
                  type: 'confirm',
                });
              }}
              className="py-3.5 px-3 rounded-2xl bg-white border border-slate-300 text-slate-600 font-bold text-[11px] hover:bg-slate-100 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
              상태 토글
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
