'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle2, ShieldCheck, Zap, Lock, Download,
  ExternalLink, Building2, User, Clock, DollarSign, Scale,
  AlertCircle, X, Sparkles, Check, ChevronRight, Copy, Landmark,
  Layers, ArrowRight, Shield, Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

export interface ContractGigData {
  id: string;
  storeName: string;
  category: string;
  district: string;
  distanceM: number;
  role: string;
  hours: number;
  startTime: string;
  endTime: string;
  pay: number;
  hourlyRate: number;
  aiScore: number;
  urgency?: boolean;
  applied?: boolean;
}

interface InstantContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: ContractGigData | null;
  onConfirm?: (gigId: string) => void;
}

export default function InstantContractModal({
  isOpen,
  onClose,
  gig,
  onConfirm,
}: InstantContractModalProps) {
  const { triggerPush } = useAppPush();
  const [activeTab, setActiveTab] = useState<'contract' | 'escrow'>('contract');
  const [isGenerating, setIsGenerating] = useState(true);
  const [copiedPdf, setCopiedPdf] = useState(false);
  const [contractId, setContractId] = useState('');
  const [escrowTxId, setEscrowTxId] = useState('');
  const [signTime, setSignTime] = useState('');

  useEffect(() => {
    if (isOpen && gig) {
      setIsGenerating(true);
      setCopiedPdf(false);
      
      const now = new Date();
      const timeStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setSignTime(timeStr);
      setContractId(`SH-CTR-${gig.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setEscrowTxId(`0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`);

      // 0.5초 초고속 백엔드 전자서명 및 에스크로 락업 생성 시뮬레이션
      const timer = setTimeout(() => {
        setIsGenerating(false);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FB521C', '#3B82F6', '#10B981', '#F59E0B'],
          });
        } catch {
          // ignore if canvas-confetti fails
        }

        // 푸시 알림 트리거 (요구사항: [근로기준법 제17조 표준 전자근로계약서가 0.5초 만에 백엔드에서 자동 서명·생성되었습니다])
        triggerPush({
          title: `⚡ [0초 전자계약 & 에스크로 예치 완료] ${gig.storeName}`,
          body: `근로기준법 제17조 표준 전자근로계약서가 0.5초 만에 자동 생성되었으며 신한은행 에스크로에 ₩${gig.pay.toLocaleString()}이 안전하게 예치되었습니다.`,
          type: 'confirm',
          actionText: '계약서 확인',
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, gig, triggerPush]);

  if (!isOpen || !gig) return null;

  const minWage2026 = 10030;
  const isAboveMinWage = gig.hourlyRate >= minWage2026;
  const wageRatio = Math.round((gig.hourlyRate / minWage2026) * 100);

  const handleCopyPdf = () => {
    setCopiedPdf(true);
    setTimeout(() => setCopiedPdf(false), 2500);
    triggerPush({
      title: '📄 [전자계약서 교부 완료]',
      body: `근로기준법 제17조에 따른 전자근로계약서 사본(PDF) 및 신한 SOL 블록체인 원본 증명서가 발급되었습니다.`,
      type: 'apply',
    });
  };

  const handleFinalConfirm = () => {
    if (onConfirm) {
      onConfirm(gig.id);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b1120] border border-blue-500/40 rounded-3xl shadow-2xl text-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 네온 헤더 */}
          <div className="relative p-4 sm:p-5 bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FB521C] via-amber-500 to-emerald-400 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/20">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      근로기준법 제17조 준수
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> 신한 SOL 인증
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-0.5 flex items-center gap-1">
                    0초 전자근로계약 & 에스크로 예치
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 0.5초 백엔드 서명 생성 상태 바 */}
            <div className="mt-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between gap-2">
              {isGenerating ? (
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>백엔드 0.5초 서명 생성 & 신한 에스크로 락업 연동 중...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                  <span>0.5초 자동 서명 체결 & 신한 에스크로 ₩{gig.pay.toLocaleString()} 예치 완료!</span>
                </div>
              )}
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {contractId}
              </span>
            </div>

            {/* 탭 네비게이션 (전자근로계약서 vs 신한 에스크로 예치 원장) */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
              <button
                onClick={() => setActiveTab('contract')}
                className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'contract'
                    ? 'bg-gradient-to-r from-[#FB521C] to-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>표준 전자근로계약서</span>
              </button>
              <button
                onClick={() => setActiveTab('escrow')}
                className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'escrow'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'bg-slate-950/70 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>신한 에스크로 예치 현황</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </button>
            </div>
          </div>

          {/* 메인 뷰 영역 (Scrollable Body) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
            {activeTab === 'contract' ? (
              <>
                {/* 1. 계약서 문서 헤더 표지 */}
                <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3">
                    <span className="text-[70px] font-black text-white/[0.03] select-none pointer-events-none">
                      LEGAL
                    </span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10.5px] font-bold mb-1">
                    고용노동부 고시 초단기 긱 표준 서식
                  </div>
                  <h2 className="text-lg font-black text-white tracking-tight">
                    표준 전자근로계약서
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    [근로기준법 제17조] 및 [전자문서 및 전자거래 기본법 제4조]에 의거하여 체결된 법적 효력 계약서
                  </p>
                </div>

                {/* 🔒 신한은행 스마트 에스크로 실시간 락업 배너 */}
                <div className="bg-gradient-to-r from-emerald-950/90 via-slate-950 to-blue-950/90 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Lock className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wide">
                          신한은행 에스크로 100% 예치 완료
                        </span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                          0.1초 즉시정산 보증
                        </span>
                      </div>
                      <div className="text-sm font-black text-white mt-0.5">
                        ₩{gig.pay.toLocaleString()} <span className="text-xs font-normal text-slate-400">(신한 BaaS 모계좌 락업)</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('escrow')}
                    className="text-[11px] font-bold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl flex items-center gap-1 shrink-0 transition-all"
                  >
                    <span>원장 보기</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 계약 당사자 정보 (사용자 vs 근로자) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* 사업주 (갑) */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold border-b border-slate-800 pb-1.5">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> 사업주 (사용자)
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        신한인증 점주
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-300 text-[11.5px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">상호명:</span>
                        <span className="font-bold text-white">{gig.storeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">소재지:</span>
                        <span className="font-medium text-slate-300 truncate max-w-[150px]">{gig.district} 테헤란로 152</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">대표자:</span>
                        <span className="font-medium text-slate-300">신한가맹 점주 (본인확인)</span>
                      </div>
                    </div>
                  </div>

                  {/* 근로자 (을) */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-orange-400 font-bold border-b border-slate-800 pb-1.5">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> 근로자 (워커)
                      </span>
                      <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        D-GCS 980점 Gold
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-300 text-[11.5px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">성명:</span>
                        <span className="font-bold text-white">조이수 (신한인증)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">생년월일:</span>
                        <span className="font-medium text-slate-300">1998.05.14</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">연락처:</span>
                        <span className="font-mono text-slate-300">010-9876-5432</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 핵심 계약 조건 (근무시간, 직무, 급여) */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    근로계약 주요 조건 (자동 매칭 데이터 반영)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* 근무 일시 & 시간 */}
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-[10.5px] text-slate-400 font-bold mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" /> 근무 시간 (소정근로시간)
                      </div>
                      <div className="text-sm font-black text-white">
                        오늘 {gig.startTime} ~ {gig.endTime}
                        <span className="ml-1.5 text-xs text-blue-400 font-bold">({gig.hours}시간)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        초단기 4시간 미만 시프트 (휴게시간 대상 제외)
                      </div>
                    </div>

                    {/* 약정 시급 & 총 지급액 */}
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-[10.5px] text-slate-400 font-bold mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-[#FB521C]" /> 약정 시급 및 총액
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-[#FB521C]">
                          시급 ₩{gig.hourlyRate.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-white">
                          (총 ₩{gig.pay.toLocaleString()})
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> 2026 최저임금(₩{minWage2026.toLocaleString()}) 대비 {wageRatio}% 준수
                      </div>
                    </div>
                  </div>

                  {/* 직무 및 담당 업무 */}
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 text-xs">
                    <div className="text-[10.5px] text-slate-400 font-bold mb-1">
                      직무 및 업무 내용
                    </div>
                    <div className="text-slate-200 font-bold flex items-center justify-between">
                      <span>{gig.role}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {gig.category} 긴급 알바
                      </span>
                    </div>
                  </div>
                </div>

                {/* 🛡️ 사장님 & 워커 법적 리스크 해제 3대 조항 (핵심 PoC) */}
                <div className="bg-gradient-to-br from-indigo-950/70 via-slate-950 to-blue-950/70 border-2 border-indigo-500/40 rounded-2xl p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-black text-white">
                        사장님 · 워커 노무 리스크 완전 해제 3대 조항
                      </h4>
                    </div>
                    <span className="text-[9.5px] font-black text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/30">
                      100% 면책
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300">
                    {/* 1. 주휴수당 예외 조항 */}
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-indigo-500/20 space-y-1">
                      <div className="flex items-center gap-1 text-amber-300 font-black text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        제1조 [주휴수당 예외 조항 (주 15시간 미만 초단기 근로)]
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        본 근로계약은 <strong>근로기준법 제55조 제2항</strong> 및 동법 시행령 제30조에 의거하여, 4주간을 평균하여 1주 소정근로시간이 15시간 미만인 <strong>초단시간 근로(총 {gig.hours}시간)</strong>이므로 <strong>주휴수당 지급 대상에서 법적으로 완전 제외</strong>됩니다. (사장님의 추가 수당 청구 리스크 0원 해제)
                      </p>
                    </div>

                    {/* 2. 최저임금법 준수 및 일용직 비과세 */}
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-indigo-500/20 space-y-1">
                      <div className="flex items-center gap-1 text-emerald-300 font-black text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        제2조 [최저임금법 제6조 준수 및 원천징수 비과세]
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        약정 시급(₩{gig.hourlyRate.toLocaleString()})은 2026년 법정 최저시급(₩{minWage2026.toLocaleString()})을 100% 이상 상회하며, 소득세법상 일용근로소득 공제(일 15만 원 이하 비과세) 적용으로 세금 공제 없이 <strong>총 ₩{gig.pay.toLocaleString()} 전액이 지급</strong>됩니다.
                      </p>
                    </div>

                    {/* 3. 산재보험 & 신한 에스크로 0.1초 즉시 지급 보증 */}
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-indigo-500/20 space-y-1">
                      <div className="flex items-center gap-1 text-blue-300 font-black text-[11px]">
                        <Lock className="w-3.5 h-3.5 text-blue-400" />
                        제3조 [산재보험 자동 보장 및 신한은행 에스크로 즉시 정산]
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        근로복지공단 초단기 산재보험 월간 BATCH 자동 신고와 신한 EZ손해보험 1일 안심케어가 적용되며, 임금은 <strong>신한은행 에스크로 원장에 사전 예치</strong>되어 근무 완료 스와이프 즉시 0.1초 만에 지급됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 전자서명 날인 확인 블록 */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" /> 신한 SOL Sign 전자서명 완료
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{signTime}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">점주 전자직인</div>
                        <div className="font-bold text-white">{gig.storeName}</div>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        날인완료 [직인]
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">근로자 전자서명</div>
                        <div className="font-bold text-white">조이수 (SOL Sign)</div>
                      </div>
                      <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                        서명완료 (DID)
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* 🏦 2. 신한 에스크로 실시간 예치 원장 (Escrow Vault View) */
              <div className="space-y-4">
                {/* 에스크로 금고 인증서 카드 */}
                <div className="bg-gradient-to-br from-[#0c1e33] via-slate-950 to-[#071322] border-2 border-emerald-500/40 rounded-3xl p-5 relative overflow-hidden shadow-2xl space-y-4">
                  {/* 배경 워터마크 */}
                  <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 pointer-events-none select-none">
                    <span className="text-[90px] font-black text-emerald-500/5">
                      ESCROW
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20">
                        <Landmark className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            신한은행 BaaS 에스크로
                          </span>
                          <span className="text-[9.5px] font-mono text-slate-400">
                            제2026-SH-ES-0822호
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-white mt-0.5">
                          스마트 계약 실시간 원장 예치 증명서
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-md animate-pulse">
                        <Lock className="w-3 h-3 text-slate-950" /> 100% 락업 완료
                      </span>
                    </div>
                  </div>

                  {/* 예치 금액 대형 디스플레이 */}
                  <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1 relative">
                    <p className="text-[11px] text-slate-400 font-bold">
                      점주 사전 출금 ➔ 신한은행 안전 에스크로 락업 금액
                    </p>
                    <div className="text-3xl font-black text-emerald-400 tracking-tight">
                      ₩{gig.pay.toLocaleString()}원
                    </div>
                    <p className="text-[10.5px] text-emerald-300 font-medium">
                      ✓ 임금 체불 0% 보증 · 퇴근 스와이프 즉시 0.1초 입금 대기
                    </p>
                  </div>

                  {/* 에스크로 스마트 계약 파이프라인 단계 */}
                  <div className="space-y-2 text-xs">
                    <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-blue-400" />
                      실시간 에스크로 처리 단계 (BaaS Pipeline)
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-[10.5px] text-center">
                      <div className="bg-slate-900/90 border border-blue-500/40 rounded-xl p-2.5 space-y-1">
                        <div className="w-5 h-5 mx-auto rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px]">
                          1
                        </div>
                        <div className="font-bold text-white">점주 공고 확정</div>
                        <div className="text-[9.5px] text-slate-400">₩{gig.pay.toLocaleString()} 선입금 완료</div>
                        <span className="inline-block text-[8.5px] text-emerald-400 font-bold">✓ 완료</span>
                      </div>

                      <div className="bg-emerald-950/40 border-2 border-emerald-500 rounded-xl p-2.5 space-y-1 shadow-md shadow-emerald-500/20">
                        <div className="w-5 h-5 mx-auto rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
                          2
                        </div>
                        <div className="font-black text-emerald-300">신한 에스크로 락업</div>
                        <div className="text-[9.5px] text-slate-300">신한은행 원장 보관</div>
                        <span className="inline-block text-[8.5px] text-emerald-300 font-black animate-pulse">● 현재 단계</span>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-1 opacity-70">
                        <div className="w-5 h-5 mx-auto rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                          3
                        </div>
                        <div className="font-bold text-slate-300">퇴근 0.1초 해제</div>
                        <div className="text-[9.5px] text-slate-400">워커 계좌 즉시 입금</div>
                        <span className="inline-block text-[8.5px] text-slate-500">대기 중</span>
                      </div>
                    </div>
                  </div>

                  {/* 에스크로 상세 사양 테이블 */}
                  <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">에스크로 계약 ID:</span>
                      <span className="font-mono font-bold text-white">{contractId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">발행/예치 사업장:</span>
                      <span className="font-bold text-blue-300">{gig.storeName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">수취 예정 근로자:</span>
                      <span className="font-bold text-orange-300">조이수 (D-GCS 980점)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">신한 BaaS Tx Hash:</span>
                      <span className="font-mono text-[10.5px] text-emerald-400">{escrowTxId}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">노쇼 발생 시 환불:</span>
                      <span className="font-bold text-amber-300">점주 계좌 100% 즉시 자동 반환</span>
                    </div>
                  </div>

                  {/* 안전 보증 뱃지 */}
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-2.5 text-xs">
                    <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-[11px] text-blue-200 leading-snug">
                      <strong>신한은행 예금자보호 및 무과실 에스크로 보증:</strong> 고용노동부 및 금융감독원 가이드라인을 100% 준수하여 분쟁 및 체불 위험이 없습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 하단 액션 버튼 바 */}
          <div className="p-4 bg-slate-900/95 border-t border-slate-800 shrink-0 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPdf}
                className="flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                {copiedPdf ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">전자계약서 사본 교부됨</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>전자계약서 PDF 사본 받기</span>
                  </>
                )}
              </button>

              <button
                onClick={handleFinalConfirm}
                className="flex-1 py-2.5 px-3 rounded-2xl font-black text-xs bg-gradient-to-r from-[#FB521C] via-orange-500 to-amber-500 hover:brightness-110 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>체결 확인 및 출근 준비 완료</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Lock className="w-3 h-3 text-amber-300" /> 신한은행 에스크로 ₩{gig.pay.toLocaleString()} 락업 보증
              </span>
              <span>•</span>
              <span>점주 종이 날인 0초 생략</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
