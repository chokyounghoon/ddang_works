'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, FileText, Download, Send, CheckCircle2,
  RefreshCw, ShieldCheck, DollarSign, ArrowUpRight, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

export default function AdminTaxScreen() {
  const { triggerPush } = useAppPush();
  const [isTransmittingNts, setIsTransmittingNts] = useState(false);
  const [isTransmittingComwel, setIsTransmittingComwel] = useState(false);
  const [ntsBatchSuccess, setNtsBatchSuccess] = useState(true);
  const [comwelBatchSuccess, setComwelBatchSuccess] = useState(true);

  // 국세청 BATCH 즉시 전송
  const handleTransmitNts = async () => {
    setIsTransmittingNts(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsTransmittingNts(false);
    setNtsBatchSuccess(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    triggerPush({
      title: '🏢 [국세청 홈택스 EDI BATCH 전송 완료]',
      body: '오늘 발생한 14,280건의 일용근로소득 간이지급명세서가 100% 정상 접수되었습니다.',
      type: 'confirm',
    });
  };

  // 근로복지공단 EDI 즉시 전송
  const handleTransmitComwel = async () => {
    setIsTransmittingComwel(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsTransmittingComwel(false);
    setComwelBatchSuccess(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    triggerPush({
      title: '🛡️ [근로복지공단 토탈 EDI 접수 완료]',
      body: '14,280건의 근로내용확인신고서가 공단 전산망으로 0초 자동 접수되었습니다.',
      type: 'confirm',
    });
  };

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* 1. 세무 EDI 관제 상단 헤더 */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 rounded-3xl p-5 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm text-white">Gov-Tech 국세청 & 근로복지공단 EDI 총괄 관제</h4>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  전송 성공률 100%
                </span>
              </div>
              <p className="text-xs text-slate-300">소득세법 제164조의3 및 고용·산재보험법 100% 적법 자동화</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-500/30">
            신한DS Gov-Tech v2.4
          </span>
        </div>

        {/* 4대 세무 지표 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">국세청 간이지급명세서</span>
            <span className="text-base font-black text-purple-400 font-mono">14,280건</span>
            <span className="text-[9px] text-emerald-400 block mt-0.5">100% 비과세 판정</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">근로내용확인신고</span>
            <span className="text-base font-black text-blue-400 font-mono">14,280건</span>
            <span className="text-[9px] text-blue-400 block mt-0.5">과태료 0% 실현</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">점주 세무대행 절감액</span>
            <span className="text-base font-black text-amber-300 font-mono">₩4.2억원</span>
            <span className="text-[9px] text-amber-300 block mt-0.5">기장료 ₩0 면제</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">EDI BATCH 전송 주기</span>
            <span className="text-base font-black text-emerald-400 font-mono">매 10분</span>
            <span className="text-[9px] text-emerald-400 block mt-0.5">실시간 무인 가동</span>
          </div>
        </div>
      </div>

      {/* 2. 전송 액션 카드: 국세청 & 공단 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 국세청 카드 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4.5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              <h5 className="font-black text-xs text-slate-900">국세청 홈택스 일용직 EDI</h5>
            </div>
            <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              익월 10일 대행 완료
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            일 15만원 비과세 한도 자동 적용 ➔ 원천징수세액 ₩0 판정 리포트 생성 및 홈택스 표준 전산 파일(XLSX) 자동 전송.
          </p>
          <button
            type="button"
            onClick={handleTransmitNts}
            disabled={isTransmittingNts}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-2xs transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isTransmittingNts ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>국세청 EDI BATCH 수동 강제 전송</span>
          </button>
        </div>

        {/* 근로복지공단 카드 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4.5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h5 className="font-black text-xs text-slate-900">근로복지공단 토탈 EDI</h5>
            </div>
            <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              0초 즉시 취득/상실
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            비콘 지오펜싱 출퇴근 검증 즉시 근로복지공단 전산망으로 전자 신고서가 실시간 접수되어 과태료(최대 300만원) 리스크 100% 차단.
          </p>
          <button
            type="button"
            onClick={handleTransmitComwel}
            disabled={isTransmittingComwel}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-2xs transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isTransmittingComwel ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>공단 EDI BATCH 수동 강제 전송</span>
          </button>
        </div>
      </div>
    </div>
  );
}
