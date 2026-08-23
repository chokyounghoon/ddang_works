'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Coins,
  CreditCard,
  Building2,
  FileText,
  HeartHandshake,
  ArrowRight,
  ChevronRight,
  UserCheck,
  Star,
  Smartphone,
  Navigation,
  RefreshCw,
  Award,
  DollarSign,
  Fingerprint,
  Baby,
  Package,
  Dog,
  Wrench,
  Car,
  ShieldAlert,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ShinhanAntiFraudModal from './ShinhanAntiFraudModal';
import GigPostEditModal from './GigPostEditModal';
import ApplicantLiveGpsModal from './ApplicantLiveGpsModal';
import { useGigStore } from '../../store/useGigStore';
import { useAppPush } from './AppPushToast';

type P2PPhase = 1 | 2 | 3 | 4 | 5;

interface P2PRequest {
  id: string;
  category: string;
  categoryIcon: any;
  title: string;
  location: string;
  distance: string;
  estimatedHours: number;
  aiSuggestedPay: number;
  description: string;
  matchedWorker?: {
    name: string;
    age: number;
    gender: string;
    avatar: string;
    dgcsScore: number;
    badge: string;
    identityVerified: boolean;
    cleanRecord: boolean;
    healthCert: boolean;
    reviewCount: number;
    rating: number;
  };
  escrowLocked: boolean;
  contractSigned: boolean;
  insuranceActive: boolean;
  checkedIn: boolean;
  checkedOut: boolean;
  settled: boolean;
}

export default function P2PGigScreen() {
  const [currentPhase, setCurrentPhase] = useState<P2PPhase>(1);
  const [selectedCategory, setSelectedCategory] = useState('아이돌봄');
  const [promptText, setPromptText] = useState('오늘 오후 3시부터 2시간 동안 초등학생 하원 및 실내 놀이 돌봄 부탁해');
  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [isEscrowLocking, setIsEscrowLocking] = useState(false);
  const [isSwipeCheckingIn, setIsSwipeCheckingIn] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showAntiFraudModal, setShowAntiFraudModal] = useState(false);
  const [showGigEditModal, setShowGigEditModal] = useState(false);
  const [editingGig, setEditingGig] = useState<any | null>(null);
  const [showLiveGpsModal, setShowLiveGpsModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [isTipSending, setIsTipSending] = useState(false);
  const [tipSent, setTipSent] = useState(false);

  const { p2pGigs, deleteP2PGig, addP2PGig } = useGigStore();
  const { triggerPush } = useAppPush();

  const categories = [
    { id: '아이돌봄', label: '🧸 아이 돌봄', icon: Baby, basePay: 30000, hours: 2 },
    { id: '짐나르기', label: '📦 짐 나르기', icon: Package, basePay: 35000, hours: 1.5 },
    { id: '반려동물', label: '🐕 반려동물 산책', icon: Dog, basePay: 22000, hours: 1 },
    { id: '가구조립', label: '🛋️ 가구 조립/설치', icon: Wrench, basePay: 40000, hours: 2 },
    { id: '동행심부름', label: '🚗 병원/동행 심부름', icon: Car, basePay: 28000, hours: 2 },
  ];

  const currentCategoryData = categories.find(c => c.id === selectedCategory) || categories[0];

  // 실시간 P2P 의뢰 데이터 상태
  const [p2pData, setP2pData] = useState<P2PRequest>({
    id: 'p2p-7729',
    category: '아이돌봄',
    categoryIcon: Baby,
    title: '초등 2학년 방과후 하원 및 도서관 놀이 동행',
    location: '서울 강남구 역삼동 래미안아파트',
    distance: '350m (반경 2km 이내)',
    estimatedHours: 2,
    aiSuggestedPay: 30000,
    description: '아이 하원 지도 및 단지 내 도서관 2시간 동행 돌봄',
    matchedWorker: {
      name: '김서연',
      age: 23,
      gender: '여성',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      dgcsScore: 985,
      badge: 'Platinum Care Pro',
      identityVerified: true,
      cleanRecord: true,
      healthCert: true,
      reviewCount: 42,
      rating: 5.0
    },
    escrowLocked: false,
    contractSigned: false,
    insuranceActive: false,
    checkedIn: false,
    checkedOut: false,
    settled: false,
  });

  // 타이머 작동
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Phase 1: 에스크로 선결제 핸들러
  const handleLockEscrow = async () => {
    setIsEscrowLocking(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsEscrowLocking(false);
    setP2pData(prev => ({ ...prev, escrowLocked: true }));

    // 🔥 워커 AI 매칭 피드 및 지도에 즉시 실시간 등록 (의뢰인이 점주 역할 수행)
    const newP2PGig = {
      id: `p2p-${Date.now()}`,
      storeName: `역삼동 래미안 (이웃 의뢰)`,
      category: '돌봄',
      district: '강남구 역삼동',
      distanceM: 350,
      role: `🧸 ${promptText || '초등 2학년 방과후 하원 및 실내 놀이 돌봄'}`,
      hours: p2pData.estimatedHours,
      startTime: '15:00',
      endTime: '17:00',
      pay: p2pData.aiSuggestedPay,
      hourlyRate: Math.round(p2pData.aiSuggestedPay / p2pData.estimatedHours),
      aiScore: 99,
      urgency: true,
      applied: false,
      isP2P: true,
      escrowLocked: true,
    };
    addP2PGig(newP2PGig);

    triggerPush({
      title: '📢 [워커 피드 즉시 노출] 우리동네 이웃 의뢰 도착',
      body: `역삼동 래미안 이웃 의뢰(${p2pData.estimatedHours}시간 ₩${p2pData.aiSuggestedPay.toLocaleString()}원)가 워커 AI 매칭 피드 1순위로 즉시 노출되었습니다! (신한 에스크로 예치완료)`,
      type: 'confirm',
      actionText: '워커 탭 확인',
    });

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setCurrentPhase(2);
  };

  // Phase 2: 최종 매칭 확정 핸들러
  const handleConfirmMatch = async () => {
    setP2pData(prev => ({ ...prev, contractSigned: true, insuranceActive: true }));
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setCurrentPhase(3);
  };

  // Phase 3 ➔ Phase 4 진행
  const handleProceedToExecution = () => {
    setCurrentPhase(4);
  };

  // Phase 4: 출근 스와이프
  const handleCheckInSwipe = async () => {
    setIsSwipeCheckingIn(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSwipeCheckingIn(false);
    setP2pData(prev => ({ ...prev, checkedIn: true }));
    setIsTimerRunning(true);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
  };

  // Phase 4: 퇴근 스와이프
  const handleCheckOutSwipe = async () => {
    setIsTimerRunning(false);
    setP2pData(prev => ({ ...prev, checkedOut: true }));
    setCurrentPhase(5);
  };

  // Phase 5: 0.1초 에스크로 즉시 정산 승인
  const handleReleaseSettlement = async () => {
    setIsSettling(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSettling(false);
    setP2pData(prev => ({ ...prev, settled: true }));
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3 pb-8 font-sans text-slate-900">
      {/* 🌟 P2P 모드 최상단 브랜드 캡슐 헤더 */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-4 text-white border border-indigo-500/30 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-[#FB521C] to-indigo-600 text-white shadow-xs">
              <HeartHandshake className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-white">우리동네 일상 P2P 안심 긱</h3>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  신한 에스크로 100% 보증
                </span>
              </div>
              <p className="text-[10px] text-indigo-300 mt-0.5">
                먹튀·사고·노쇼 제로 — 5단계 End-to-End 완전 자동화 시스템
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-200 border border-slate-700">
            Phase {currentPhase}/5
          </span>
        </div>

        {/* 5단계 파이프라인 진행 바 */}
        <div className="grid grid-cols-5 gap-1 mt-3 pt-2.5 border-t border-slate-800/80 text-[9.5px] font-bold text-center">
          {[
            { p: 1, label: '1.선결제' },
            { p: 2, label: '2.신원검증' },
            { p: 3, label: '3.계약·보험' },
            { p: 4, label: '4.현장수행' },
            { p: 5, label: '5.즉시정산' },
          ].map(step => (
            <button
              key={step.p}
              onClick={() => setCurrentPhase(step.p as P2PPhase)}
              className={`py-1.5 px-0.5 rounded-xl border transition-all ${
                currentPhase === step.p
                  ? 'bg-gradient-to-r from-[#FB521C] to-indigo-600 text-white border-white/40 shadow-xs'
                  : currentPhase > step.p
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🛡️ [신한EZ 4중 보안] 고의 자해·보험 사기 원천 차단 FDS 시스템 상시 가동 배너 */}
      <button
        onClick={() => setShowAntiFraudModal(true)}
        className="w-full bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/40 rounded-2xl p-3 text-white flex items-center justify-between hover:brightness-110 active:scale-[0.99] transition-all shadow-xs text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-black text-xs shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                신한 FDS 24/7
              </span>
              <span className="text-[10px] text-slate-400">고의 자해 · 허위 청구 리스크 0%</span>
            </div>
            <p className="text-xs font-black text-white truncate mt-0.5">
              어떻게 보험 사기와 도덕적 해이를 원천 차단하나요?
            </p>
          </div>
        </div>
        <span className="text-[10.5px] font-bold text-rose-300 bg-white/10 px-2 py-1 rounded-lg border border-rose-400/30 shrink-0 ml-2">
          4대 안전장치 보기 &gt;
        </span>
      </button>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 🎯 Phase 1. 의뢰 등록 및 에스크로 선결제 (Request & Escrow) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentPhase === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* 의뢰 카테고리 칩 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider font-mono">
                Phase 1 · P2P Request & Escrow
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                먹튀 위험 0% 에스크로
              </span>
            </div>

            <h4 className="text-sm font-black text-slate-900">
              어떤 일상 도움이 필요하신가요?
            </h4>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setP2pData(prev => ({
                      ...prev,
                      category: cat.id,
                      aiSuggestedPay: cat.basePay,
                      estimatedHours: cat.hours,
                    }));
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* AI 비서 도담이와의 대화형 입력창 & 퀵 시나리오 칩 */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FB521C]" />
                  <span>AI 도담이에게 편하게 요청 사항을 적어주세요</span>
                </span>
                <span className="text-[10px] text-[#FB521C] font-bold">자연어 자동 분석</span>
              </div>
              <textarea
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#FB521C] rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden transition-colors"
                placeholder="예: 오늘 오후 3시부터 2시간 동안 초등학생 하원 및 실내 놀이 돌봄 부탁해"
              />

              {/* 원클릭 인기 퀵 시나리오 칩 */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { label: '🧸 하원·놀이 돌봄 2h', text: '초등학생 방과후 하원 및 실내 놀이 돌봄 부탁해', pay: 30000, h: 2, cat: '아이돌봄' },
                  { label: '📦 원룸 짐나르기 1.5h', text: '차량에 박스 5개 및 소형 매트리스 싣는 것 도와줘', pay: 35000, h: 1.5, cat: '짐나르기' },
                  { label: '🛋️ 이케아 서랍장 2h', text: '이케아 6단 서랍장 전동드릴 조립 부탁드려요', pay: 40000, h: 2, cat: '가구조립' },
                  { label: '🐕 강아지 산책 1h', text: '중형견(골든리트리버) 1시간 단지 내 산책 및 배변 유도', pay: 22000, h: 1, cat: '반려동물' },
                  { label: '🚗 병원 동행 2h', text: '어르신 안과 진료 동행 및 약국 처방전 수령', pay: 28000, h: 2, cat: '동행심부름' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPromptText(preset.text);
                      setSelectedCategory(preset.cat);
                      setP2pData(prev => ({
                        ...prev,
                        category: preset.cat,
                        estimatedHours: preset.h,
                        aiSuggestedPay: preset.pay,
                        title: preset.text,
                      }));
                    }}
                    className="py-1 px-2.5 rounded-xl bg-orange-50/80 hover:bg-orange-100 border border-orange-200 text-[#FB521C] font-bold text-[10.5px] whitespace-nowrap active:scale-95 transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI 실시간 스마트 견적 & 난이도 안전 진단 박스 */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-orange-50/40 border border-indigo-100 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FB521C] animate-ping" />
                  <span className="text-xs font-black text-slate-900">
                    AI 실시간 시장 시세 & 작업 안전도 자동 진단
                  </span>
                </div>
                <span className="text-[9.5px] font-black text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200 shadow-2xs">
                  역삼동 최근 30일 시세 기준
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-medium">예상 시간 / 보수</span>
                  <span className="text-xs font-black text-[#FB521C]">
                    {p2pData.estimatedHours}h · ₩{p2pData.aiSuggestedPay.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-medium">작업 난이도</span>
                  <span className="text-xs font-black text-indigo-700">안전 보통 (Level 2)</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-medium">권장 헬퍼 평판</span>
                  <span className="text-xs font-black text-emerald-600">D-GCS 900+</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[10.5px]">
                <span className="text-slate-600 font-medium">
                  🛡️ <strong>신한EZ 5,000만원 이웃케어 보험</strong> (대인/대물 배상책임 100% 보장)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  자동 적용 (무료)
                </span>
              </div>
            </div>

            {/* 워커 모집 자격 요건 직접 설정 / 수정 버튼 */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditingGig(null);
                  setShowGigEditModal(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-black text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                <span>⚙️ 워커 모집 조건(신용점수/우대조건/시급) 직접 설정하기</span>
              </button>
            </div>

            {/* 신한카드 / 신한은행 에스크로 선예치 결제 버튼 */}
            <button
              onClick={handleLockEscrow}
              disabled={isEscrowLocking || p2pData.escrowLocked}
              className="w-full py-3.5 bg-gradient-to-r from-[#FB521C] to-indigo-600 hover:from-orange-600 hover:to-indigo-500 text-white rounded-2xl font-black text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isEscrowLocking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>신한은행 에스크로 계좌에 선예치 잠금 중...</span>
                </>
              ) : p2pData.escrowLocked ? (
                <>
                  <Lock className="w-4 h-4 text-emerald-300" />
                  <span>✓ ₩{p2pData.aiSuggestedPay.toLocaleString()}원 에스크로 잠금 완료</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>신한 에스크로 ₩{p2pData.aiSuggestedPay.toLocaleString()}원 선예치 및 등록</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              * 매칭이 완료되고 워커가 안전하게 퇴근을 승인하기 전까지 대금은 신한은행에 안전하게 묶여 있습니다.
            </p>
          </div>

          {/* 📋 내가 등록한 이웃 의뢰 목록 & 수정 관리 카드 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    내 P2P 의뢰 관리
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">
                    {p2pGigs.length}건 진행 중
                  </span>
                </div>
                <h4 className="font-black text-sm text-slate-900 mt-0.5">
                  등록된 이웃 의뢰 & 워커 모집 조건
                </h4>
              </div>

              <button
                onClick={() => {
                  setEditingGig(null);
                  setShowGigEditModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-black text-[11px] shadow-xs hover:bg-purple-700 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3 h-3" />
                <span>새 의뢰 등록</span>
              </button>
            </div>

            <div className="space-y-2">
              {p2pGigs.map((g) => (
                <div
                  key={g.id}
                  className="p-3 rounded-2xl border border-purple-100 bg-purple-50/40 space-y-2 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-200 text-purple-900">
                          {g.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {g.startTime} ~ {g.endTime} ({g.hours}h)
                        </span>
                      </div>
                      <h5 className="font-black text-xs text-slate-900">{g.role}</h5>
                      <p className="text-[10.5px] text-slate-500 line-clamp-1">{g.description || '이웃 일상 긱'}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-purple-700 font-mono">
                        ₩{g.pay.toLocaleString()}원
                      </div>
                      <div className="text-[9px] text-slate-400 font-bold">
                        시급 ₩{g.hourlyRate.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 자격 조건 요약 */}
                  <div className="flex flex-wrap items-center gap-1 text-[9px] pt-1 border-t border-purple-100">
                    <span className="font-bold text-purple-900">요구 조건:</span>
                    <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-black">
                      D-GCS {g.minDgcsScore || 950}점+
                    </span>
                    {g.cleanRecordRequired && (
                      <span className="bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded font-black">
                        신원/무사고
                      </span>
                    )}
                    {g.preferredConditions?.map((pref, i) => (
                      <span key={i} className="bg-white text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded font-medium">
                        {pref}
                      </span>
                    ))}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center justify-end gap-1.5 pt-0.5">
                    <button
                      onClick={() => {
                        setEditingGig(g);
                        setShowGigEditModal(true);
                      }}
                      className="px-2 py-0.8 rounded-lg bg-white border border-slate-200 text-slate-700 font-black text-[10px] hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-purple-600" />
                      <span>조건 수정</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${g.role}" 의뢰를 삭제하시겠습니까?`)) {
                          deleteP2PGig(g.id);
                        }
                      }}
                      className="px-2 py-0.8 rounded-lg bg-white border border-rose-200 text-rose-600 font-black text-[10px] hover:bg-rose-50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 🛡️ Phase 2. AI 스마트 매칭 및 신원·자격 검증 (Verification) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentPhase === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4.5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[9.5px] font-black text-indigo-600 uppercase tracking-wider font-mono">
                  Phase 2 · Matching & Multi-Credential OCR
                </span>
                <h4 className="font-black text-sm text-slate-900 mt-0.5">
                  반경 2km 이내 최적 워커가 지원했습니다
                </h4>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                1순위 매칭
              </span>
            </div>

            {/* 지원자 프로필 및 3대 신원/자격 검증 배지 카드 */}
            {p2pData.matchedWorker && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={p2pData.matchedWorker.avatar}
                      alt={p2pData.matchedWorker.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-400/60 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-black text-sm text-white">{p2pData.matchedWorker.name}</h5>
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {p2pData.matchedWorker.gender} · {p2pData.matchedWorker.age}세
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{p2pData.matchedWorker.rating.toFixed(1)}</span>
                        <span className="text-slate-400">({p2pData.matchedWorker.reviewCount}회 완료)</span>
                        <span className="text-slate-400">· 매장까지 350m</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block font-mono">D-GCS 평판</span>
                    <span className="text-sm font-black text-amber-400 font-mono">
                      {p2pData.matchedWorker.dgcsScore}점
                    </span>
                  </div>
                </div>

                {/* 3대 AI 멀티 인증 크로스체크 전광판 */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs pt-1 border-t border-slate-800">
                  <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/80">
                    <span className="text-[9px] text-slate-400 block">신한 본인인증</span>
                    <p className="text-[10.5px] font-black text-blue-300 mt-0.5 flex items-center justify-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      <span>신원 확인</span>
                    </p>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/80">
                    <span className="text-[9px] text-slate-400 block">성범죄/범죄이력</span>
                    <p className="text-[10.5px] font-black text-emerald-300 mt-0.5 flex items-center justify-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>클린 인증</span>
                    </p>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700/80">
                    <span className="text-[9px] text-slate-400 block">SBT 평판</span>
                    <p className="text-[10.5px] font-black text-amber-300 mt-0.5 flex items-center justify-center gap-0.5">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Top Pro</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/40 rounded-xl p-2.5 text-[11px] text-slate-300 border border-slate-700/50 leading-relaxed">
                  💬 <strong>워커 한마디:</strong> "유아교육 전공 대학생으로 돌봄 경험이 풍부합니다. 정해진 시간 동안 성실히 돌보겠습니다."
                </div>

                {/* 🗺️ 지원자 출근 전 실시간 위치 & 이동 관제 */}
                <div className="bg-slate-800/90 rounded-xl p-2.5 border border-indigo-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <p className="text-[11px] font-black text-white">현재 위치: 역삼역 4번 출구 도보 이동 중</p>
                      <p className="text-[9.5px] text-slate-300">약 350m 거리 · 4분 후 도착 예정 (정시 도착 예상)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLiveGpsModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    <MapPin className="w-3 h-3 text-amber-300" />
                    <span>실시간 지도 보기</span>
                  </button>
                </div>
              </div>
            )}

            {/* 최종 매칭 확정 버튼 */}
            <div className="pt-1">
              <button
                onClick={handleConfirmMatch}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>김서연 워커 [최종 매칭 확정 및 전자계약]</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 📜 Phase 3. 0초 전자계약 체결 및 신한EZ손보 자동 개시 (Contract & Insurance) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentPhase === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4.5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[9.5px] font-black text-emerald-600 uppercase tracking-wider font-mono">
                  Phase 3 · Smart Contract & Shinhan EZ Insurance
                </span>
                <h4 className="font-black text-sm text-slate-900 mt-0.5">
                  전자계약서 서명 & 보험 가입이 완료되었습니다
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                법적 구속력 확보
              </span>
            </div>

            {/* 표준 전자계약서 미리보기 카드 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  P2P 단기 일상 용역 표준 전자계약서
                </span>
                <span className="text-[9.5px] font-mono text-emerald-600 font-bold bg-emerald-100/60 px-1.5 py-0.5 rounded">
                  전자문서법 제4조 준수
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80">
                <p>· <strong>의뢰인:</strong> 신한 인증 본인 (의뢰 완료)</p>
                <p>· <strong>수행자:</strong> 김서연 (D-GCS 985점 SBT 서명)</p>
                <p>· <strong>업무 내용:</strong> 초등학생 하원 및 실내 놀이 돌봄 (2시간)</p>
                <p>· <strong>약정 보수:</strong> ₩30,000원 (신한은행 에스크로 예치 연동)</p>
              </div>
            </div>

            {/* 신한EZ손해보험 5,000만원 무상 보험 증권 카드 */}
            <div className="bg-cyan-950/90 text-white rounded-2xl p-3.5 space-y-2 border border-cyan-500/40">
              <div className="flex items-center justify-between">
                <span className="font-black text-cyan-300 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  신한EZ 생활밀착형 마이크로 배상/상해보험
                </span>
                <span className="text-[9.5px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-400/30">
                  실시간 보장 개시
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                <div className="bg-slate-900/60 p-2 rounded-xl border border-cyan-500/20">
                  <span className="text-slate-400 block text-[9.5px]">일상 대물 배상책임</span>
                  <p className="font-black text-cyan-300 text-xs mt-0.5">최대 5,000만원 한도</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl border border-cyan-500/20">
                  <span className="text-slate-400 block text-[9.5px]">상해 비급여 치료비</span>
                  <p className="font-black text-cyan-300 text-xs mt-0.5">최대 1,000만원 한도</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                * 업무 수행 중 발생하는 모든 안전사고와 파손 손해를 전액 보장하여 의뢰인-워커 간 분쟁을 원천 차단합니다.
              </p>

              {/* 🛡️ 고의 자해·보험 사기 원천 차단 4대 장치 안내 카드 */}
              <div 
                onClick={() => setShowAntiFraudModal(true)}
                className="bg-rose-950/60 border border-rose-500/30 rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-rose-950/90 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <p className="text-[10.5px] font-black text-rose-300">신한 4대 Anti-Fraud 방어 시스템</p>
                    <p className="text-[9.5px] text-slate-400">50m GPS 락 · 실명 락인 · AI FDS · 소액 실비 보장</p>
                  </div>
                </div>
                <span className="text-[9.5px] font-bold text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-400/30 shrink-0">
                  상세보기 &gt;
                </span>
              </div>
            </div>

            {/* 다음 수행 단계로 이동 */}
            <button
              onClick={handleProceedToExecution}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Phase 4 현장 수행 & GPS 출퇴근 스와이프로 이동</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 📍 Phase 4. 현장 수행 및 GPS·생체 인증 스와이프 (Execution) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentPhase === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4.5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[9.5px] font-black text-orange-600 uppercase tracking-wider font-mono">
                  Phase 4 · GPS 50m & Biometric Swipe
                </span>
                <h4 className="font-black text-sm text-slate-900 mt-0.5">
                  현장 도착 검증 및 실시간 업무 수행
                </h4>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {p2pData.checkedIn && !p2pData.checkedOut ? '근무 진행중' : p2pData.checkedOut ? '근무 완료' : '출근 대기'}
              </span>
            </div>

            {/* GPS 반경 50m 안심 레이더 카드 */}
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  현장 GPS 50m 반경 검증
                </span>
                <span className="text-emerald-400 font-mono font-black">
                  ✓ 현장 반경 15m 내 위치 확인됨
                </span>
              </div>

              {/* 실시간 타이머 디스플레이 */}
              <div className="bg-slate-950 p-4 rounded-xl text-center space-y-1 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  실시간 긱 타이머 (신한 타임스탬프)
                </span>
                <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                  {formatTimer(timerSeconds)}
                </div>
                <p className="text-[10px] text-slate-400">
                  {p2pData.checkedIn ? '🟢 업무 수행 및 보험 정상 가동 중' : '⚪ 출근 스와이프를 완료해 주세요'}
                </p>
              </div>
            </div>

            {/* 출근 / 퇴근 스와이프 인터랙션 버튼 */}
            {!p2pData.checkedIn ? (
              <button
                onClick={handleCheckInSwipe}
                disabled={isSwipeCheckingIn}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSwipeCheckingIn ? (
                  <>
                    <Fingerprint className="w-4 h-4 animate-pulse" />
                    <span>Face ID & 생체 인증 출근 처리 중...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" />
                    <span>[출근 스와이프] 생체인증 및 업무 시작하기</span>
                  </>
                )}
              </button>
            ) : !p2pData.checkedOut ? (
              <button
                onClick={handleCheckOutSwipe}
                className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl font-black text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>[퇴근 스와이프] 업무 종료 및 정산 요청</span>
              </button>
            ) : (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl text-center text-xs font-bold border border-emerald-200">
                ✓ 퇴근 스와이프가 완료되었습니다. Phase 5 정산 단계로 이동합니다.
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 💰 Phase 5. 0.1초 즉시 정산 및 SBT 평판 반영 (Settlement) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentPhase === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4.5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[9.5px] font-black text-indigo-600 uppercase tracking-wider font-mono">
                  Phase 5 · 0.1s Instant Settlement & SBT Reputation
                </span>
                <h4 className="font-black text-sm text-slate-900 mt-0.5">
                  에스크로 해제 및 0.1초 즉시 입금
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                수수료 ₩0 전액 입금
              </span>
            </div>

            {/* 정산 명세 카드 */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs text-slate-400 font-medium">정산 대상 계좌</span>
                <span className="text-xs font-mono font-bold text-blue-300">
                  신한 110-482-****** (김서연)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">최종 입금액 (PG 수수료 ₩0 면제)</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    ₩{p2pData.aiSuggestedPay.toLocaleString()}원
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9.5px] text-slate-400 block font-mono">국세청 일용직 소득</span>
                  <span className="text-xs font-bold text-indigo-300">비과세 세금 0원 판정</span>
                </div>
              </div>

              {/* 신한DS BATCH 세무 리포트 자동 생성 안내 */}
              <div className="bg-slate-950 p-2.5 rounded-xl text-[10.5px] text-slate-300 border border-slate-800 space-y-1">
                <p className="font-bold text-slate-200 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  신한DS Gov-Tech 국세청 일용근로소득 EDI BATCH 자동 신고 완료
                </p>
                <p className="text-[9.5px] text-slate-400">
                  1일 15만원 비과세 한도 자동 적용 ➔ 세무서 방문 없이 100% 적법 처리되었습니다.
                </p>
              </div>
            </div>

            {/* 에스크로 잠금 해제 & 0.1초 입금 버튼 */}
            {!p2pData.settled ? (
              <button
                onClick={handleReleaseSettlement}
                disabled={isSettling}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSettling ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>신한은행 0.1초 즉시 입금 전송 중...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>[에스크로 해제] ₩{p2pData.aiSuggestedPay.toLocaleString()}원 0.1초 즉시 입금 승인</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl text-center text-xs font-bold border border-emerald-200">
                🎉 0.1초 만에 김서연 워커 계좌로 ₩{p2pData.aiSuggestedPay.toLocaleString()}원이 입금 완료되었습니다!
              </div>
            )}

            {/* 💖 이웃 감사 팁(Tip) 원터치 신한 BaaS 즉시 송금 */}
            {p2pData.settled && (
              <div className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 border border-orange-200 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>💖</span>
                    <span>이웃 헬퍼에게 감사 팁 보내기</span>
                  </span>
                  <span className="text-[9.5px] font-bold text-[#FB521C] bg-white px-2 py-0.5 rounded-full border border-orange-200">
                    신한 0원 수수료
                  </span>
                </div>

                {!tipSent ? (
                  <div className="space-y-2">
                    <p className="text-[10.5px] text-slate-600">
                      오늘 정성껏 도움을 주신 <strong>김서연</strong> 헬퍼님께 따뜻한 감사의 마음을 전해보세요.
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1000, 2000, 3000, 5000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setSelectedTip(amount)}
                          className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            selectedTip === amount
                              ? 'bg-[#FB521C] text-white shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300'
                          }`}
                        >
                          +₩{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    {selectedTip && (
                      <button
                        type="button"
                        onClick={async () => {
                          setIsTipSending(true);
                          await new Promise(r => setTimeout(r, 800));
                          setIsTipSending(false);
                          setTipSent(true);
                          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                          triggerPush({
                            title: '💖 [이웃 감사 팁 송금 완료]',
                            body: `김서연 헬퍼님께 감사 팁 ₩${selectedTip.toLocaleString()}원이 신한 BaaS로 즉시 전달되었습니다.`,
                            type: 'confirm',
                          });
                        }}
                        disabled={isTipSending}
                        className="w-full py-2.5 bg-gradient-to-r from-[#FB521C] to-orange-500 hover:brightness-105 active:scale-98 text-white rounded-xl text-xs font-black shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {isTipSending ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>신한 BaaS 팁 송금 처리 중...</span>
                          </>
                        ) : (
                          <>
                            <span>감사 팁 ₩{selectedTip.toLocaleString()}원 0.1초 즉시 보내기</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-center text-xs font-bold border border-emerald-200">
                    ✓ 김서연 헬퍼님께 감사 팁 ₩{selectedTip?.toLocaleString()}원이 성공적으로 전달되었습니다!
                  </div>
                )}
              </div>
            )}

            {/* 양방향 SBT 평판 상호 평가 폼 */}
            {p2pData.settled && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    양방향 SBT(Soul-Bound Token) 평판 적립
                  </span>
                  <span className="text-[9.5px] font-bold text-indigo-600">블록체인 영구 박제</span>
                </div>

                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-2xl transition-transform active:scale-90"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {!reviewSubmitted ? (
                  <button
                    onClick={() => {
                      setReviewSubmitted(true);
                      confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-colors"
                  >
                    평판 점수 +5점 적립 및 긱 종료
                  </button>
                ) : (
                  <div className="text-center text-xs font-bold text-emerald-700">
                    ✓ 양방향 SBT 평판이 블록체인에 영구 기록되었습니다!
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 🛡️ 신한EZ 4중 보험사기·도덕적해이 방어 시스템 상세 팝업 모달 */}
      <ShinhanAntiFraudModal
        isOpen={showAntiFraudModal}
        onClose={() => setShowAntiFraudModal(false)}
      />

      {/* ⚙️ 개인 의뢰 워커 모집 요건 설정 & 공고 등록/수정 모달 */}
      <GigPostEditModal
        isOpen={showGigEditModal}
        onClose={() => setShowGigEditModal(false)}
        mode="p2p"
        initialGig={editingGig}
      />

      {/* 🗺️ 이웃 지원자 출근 전 실시간 GPS 관제 지도 모달 */}
      <ApplicantLiveGpsModal
        isOpen={showLiveGpsModal}
        onClose={() => setShowLiveGpsModal(false)}
        applicantName="김서연"
        storeName="우리동네 의뢰지 (역삼동 래미안)"
        applicantRole="초등 2학년 방과후 하원 및 도서관 동행 (15:00~17:00)"
        targetStartTime="15:00"
        storeLat={37.4990}
        storeLng={127.0350}
        initialWorkerLat={37.4950}
        initialWorkerLng={127.0300}
      />
    </div>
  );
}
