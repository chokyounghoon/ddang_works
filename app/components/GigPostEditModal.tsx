'use client';

// app/components/GigPostEditModal.tsx
// 점주 및 개인 의뢰인이 모집할 워커 요건과 공고를 등록/수정하는 모달

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Plus, Edit3, Trash2, CheckCircle2, ShieldCheck, Award,
  Clock, DollarSign, MapPin, Sparkles, AlertCircle, FileCheck,
  Check, UserCheck, Flame, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGigStore, GigItem } from '../../store/useGigStore';
import { useAppPush } from './AppPushToast';

interface GigPostEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'employer' | 'p2p';
  initialGig?: GigItem | null;
}

const PREFERRED_PRESETS = [
  '인근 1km 거주자',
  '동일 직종 6개월+ 유경험자',
  '비흡연자',
  '즉시 출근 가능자',
  '친절한 고객응대 마인드',
  '운전면허 소지자',
  '반려동물 알러지 없음',
];

export default function GigPostEditModal({
  isOpen,
  onClose,
  mode,
  initialGig,
}: GigPostEditModalProps) {
  const { addEmployerGig, updateEmployerGig, addP2PGig, updateP2PGig } = useGigStore();
  const { triggerPush } = useAppPush();

  // 폼 상태
  const [storeName, setStoreName] = useState(
    initialGig?.storeName || (mode === 'employer' ? '스타벅스 강남2호점' : '역삼 래미안 (이웃 의뢰인)')
  );
  const [category, setCategory] = useState(initialGig?.category || (mode === 'employer' ? '카페' : '돌봄'));
  const [role, setRole] = useState(initialGig?.role || '');
  const [description, setDescription] = useState(initialGig?.description || '');
  const [startTime, setStartTime] = useState(initialGig?.startTime || '14:00');
  const [endTime, setEndTime] = useState(initialGig?.endTime || '17:00');
  const [hours, setHours] = useState<number>(initialGig?.hours || 3);
  const [hourlyRate, setHourlyRate] = useState<number>(initialGig?.hourlyRate || 14000);
  const [urgency, setUrgency] = useState<boolean>(initialGig?.urgency ?? true);
  
  // 워커 자격 요건
  const [minDgcsScore, setMinDgcsScore] = useState<number>(initialGig?.minDgcsScore || 920);
  const [healthCertRequired, setHealthCertRequired] = useState<boolean>(
    initialGig?.healthCertRequired ?? (mode === 'employer')
  );
  const [cleanRecordRequired, setCleanRecordRequired] = useState<boolean>(
    initialGig?.cleanRecordRequired ?? true
  );
  const [selectedPresets, setSelectedPresets] = useState<string[]>(
    initialGig?.preferredConditions || ['인근 1km 거주자', '비흡연자']
  );

  useEffect(() => {
    if (initialGig) {
      setStoreName(initialGig.storeName);
      setCategory(initialGig.category);
      setRole(initialGig.role);
      setDescription(initialGig.description || '');
      setStartTime(initialGig.startTime);
      setEndTime(initialGig.endTime);
      setHours(initialGig.hours);
      setHourlyRate(initialGig.hourlyRate);
      setUrgency(initialGig.urgency);
      setMinDgcsScore(initialGig.minDgcsScore || 900);
      setHealthCertRequired(initialGig.healthCertRequired ?? false);
      setCleanRecordRequired(initialGig.cleanRecordRequired ?? true);
      setSelectedPresets(initialGig.preferredConditions || ['인근 1km 거주자']);
    } else {
      setStoreName(mode === 'employer' ? '스타벅스 강남2호점' : '역삼 래미안 (이웃 의뢰인)');
      setCategory(mode === 'employer' ? '카페' : '돌봄');
      setRole(mode === 'employer' ? '오후 피크타임 바리스타 및 홀 서빙 지원' : '초등 방과후 하원 지도 및 단지 내 도서관 놀이 동행');
      setDescription(
        mode === 'employer'
          ? '에스프레소 음료 조리 및 픽업대 정리, 고객 응대 지원'
          : '오후 3시 하원 픽업 후 2시간 동안 안전하게 동행 지도해 주실 분'
      );
      setStartTime('14:00');
      setEndTime('17:00');
      setHours(3);
      setHourlyRate(mode === 'employer' ? 14000 : 15000);
      setUrgency(true);
      setMinDgcsScore(920);
      setHealthCertRequired(mode === 'employer');
      setCleanRecordRequired(true);
      setSelectedPresets(['인근 1km 거주자', '비흡연자']);
    }
  }, [initialGig, mode, isOpen]);

  // 시간 변경 시 근무 시간 자동 계산
  const handleTimeChange = (newStart: string, newEnd: string) => {
    setStartTime(newStart);
    setEndTime(newEnd);
    try {
      const [sh, sm] = newStart.split(':').map(Number);
      const [eh, em] = newEnd.split(':').map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60;
      const h = Math.max(1, Math.round(diff / 60));
      setHours(h);
    } catch {}
  };

  const calculatedTotalPay = hourlyRate * hours;

  // 우대 프리셋 토글
  const togglePreset = (preset: string) => {
    if (selectedPresets.includes(preset)) {
      setSelectedPresets(selectedPresets.filter(p => p !== preset));
    } else {
      setSelectedPresets([...selectedPresets, preset]);
    }
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      alert('모집 공고 제목/역할을 입력해주세요.');
      return;
    }

    const gigPayload: GigItem = {
      id: initialGig ? initialGig.id : `${mode === 'employer' ? 'emp' : 'p2p'}-${Date.now()}`,
      storeName,
      category,
      district: '강남구 역삼동',
      distanceM: mode === 'employer' ? 480 : 350,
      role,
      hours,
      startTime,
      endTime,
      pay: calculatedTotalPay,
      hourlyRate,
      aiScore: 98,
      urgency,
      applied: false,
      isP2P: mode === 'p2p',
      escrowLocked: mode === 'p2p',
      description,
      minDgcsScore,
      healthCertRequired,
      cleanRecordRequired,
      preferredConditions: selectedPresets,
    };

    if (mode === 'employer') {
      if (initialGig) {
        updateEmployerGig(gigPayload);
        triggerPush({
          title: '✏️ [점주 공고 수정 완료]',
          body: `"${role}" 공고 조건이 워커 AI 매칭 피드에 실시간 갱신되었습니다.`,
          type: 'confirm',
        });
      } else {
        addEmployerGig(gigPayload);
        triggerPush({
          title: '📢 [새 점주 시프트 등록 완료]',
          body: `"${role}" (₩${calculatedTotalPay.toLocaleString()}원) 시프트가 워커 AI 매칭 피드에 즉시 노출되었습니다!`,
          type: 'confirm',
          actionText: '워커 탭 확인',
        });
      }
    } else {
      if (initialGig) {
        updateP2PGig(gigPayload);
        triggerPush({
          title: '✏️ [개인 의뢰 조건 수정 완료]',
          body: `"${role}" 이웃 의뢰가 워커 피드에 실시간 갱신되었습니다.`,
          type: 'confirm',
        });
      } else {
        addP2PGig(gigPayload);
        triggerPush({
          title: '🚨 [우리동네 이웃 의뢰 등록 완료]',
          body: `"${role}" (${hours}시간 ₩${calculatedTotalPay.toLocaleString()}원) 의뢰가 신한 에스크로 예치와 함께 워커 1순위로 노출되었습니다!`,
          type: 'confirm',
          actionText: '워커 탭 확인',
        });
      }
    }

    confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        >
          {/* 헤더 */}
          <div className={`p-4 text-white flex items-center justify-between shrink-0 border-b ${
            mode === 'employer'
              ? 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-blue-900/50'
              : 'bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border-purple-900/50'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-base shadow-sm ${
                mode === 'employer'
                  ? 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white'
                  : 'bg-gradient-to-tr from-purple-500 to-amber-400 text-slate-950'
              }`}>
                {initialGig ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full text-white ${
                    mode === 'employer' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {mode === 'employer' ? '🏬 점주 사업장 구인' : '🏡 이웃 개인 의뢰 (P2P)'}
                  </span>
                  <span className="text-[10.5px] font-mono text-slate-300 font-bold">
                    {initialGig ? '공고 조건 수정' : '신규 워커 모집 등록'}
                  </span>
                </div>
                <h3 className="font-black text-base text-white mt-0.5">
                  {initialGig ? '모집 요강 및 워커 요건 수정' : '모집할 워커 조건 & 시프트 등록'}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 스크롤 가능한 폼 영역 */}
          <form onSubmit={handleSubmit} className="p-4.5 overflow-y-auto space-y-4 text-xs">
            {/* 1. 기본 정보 (가게명 / 직종) */}
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-800 text-xs flex items-center gap-1">
                  🏢 {mode === 'employer' ? '사업장 정보' : '의뢰인 정보'}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">위치: 서울 강남구 역삼동</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-600 mb-1 block">
                    {mode === 'employer' ? '가맹점 상호명' : '의뢰인 호칭'}
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#FB521C]"
                    placeholder="예: 스타벅스 강남2호점"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-600 mb-1 block">
                    업종 / 카테고리
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#FB521C]"
                  >
                    <option value="카페">☕ 카페 / 음료</option>
                    <option value="서빙">🍽️ 홀 / 서빙</option>
                    <option value="편의점">🏪 편의점 / 판매</option>
                    <option value="돌봄">🧸 돌봄 / 심부름</option>
                    <option value="패스트푸드">🍔 패스트푸드</option>
                    <option value="마트">📦 마트 / 물류</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-600 mb-1 block">
                  공고 제목 및 담당 역할
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#FB521C]"
                  placeholder="예: 오후 피크타임 홀 서빙 & 주문 픽업 보조"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-600 mb-1 block">
                  상세 업무 내용 및 요청 사항
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#FB521C] resize-none"
                  placeholder="워커가 수행할 구체적인 업무와 복장, 준비사항을 적어주세요."
                />
              </div>
            </div>

            {/* 2. 근무 일시 & 급여 설정 */}
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="font-black text-slate-800 text-xs block">
                ⏰ 근무 시간 및 정산 급여
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1 block">시작 시간</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => handleTimeChange(e.target.value, endTime)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1 block">종료 시간</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => handleTimeChange(startTime, e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1 block">총 근무시간</label>
                  <div className="w-full py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl font-black text-indigo-700 text-center">
                    {hours}시간
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10.5px] font-bold text-slate-600">약정 시급 (원)</label>
                    <button
                      type="button"
                      onClick={() => setHourlyRate(mode === 'employer' ? 14500 : 15000)}
                      className="text-[9px] text-[#0046FF] font-bold hover:underline"
                    >
                      AI 추천 시급 적용
                    </button>
                  </div>
                  <input
                    type="number"
                    step="500"
                    min="10030"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-600 mb-1 block">
                    총 정산 지급액 ({hours}h)
                  </label>
                  <div className="w-full py-2 px-3 bg-emerald-50 border border-emerald-300 rounded-xl font-black text-emerald-700 text-base text-right font-mono">
                    ₩{calculatedTotalPay.toLocaleString()}원
                  </div>
                </div>
              </div>

              {/* 긴급 대타 플래그 */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <Flame className={`w-4 h-4 ${urgency ? 'text-rose-500' : 'text-slate-400'}`} />
                  <span className="font-bold text-slate-800 text-[11px]">
                    긴급 대타 (1시간 내 즉시 모집)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={urgency}
                  onChange={(e) => setUrgency(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* 3. 🎯 모집할 워커 자격 요건 (Worker Qualifications) */}
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  모집할 워커 자격 요건 (필수/우대)
                </span>
                <span className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  신한 7-Core 자동 필터링
                </span>
              </div>

              {/* 최소 D-GCS 점수 선택 */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    최소 D-GCS 신용 평판 요구 점수
                  </span>
                  <span className="font-black text-amber-600 font-mono">
                    {minDgcsScore}점 이상 ({minDgcsScore >= 950 ? 'Top Pro 🏆' : minDgcsScore >= 900 ? 'Gold 🥇' : 'Silver 🥈'})
                  </span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="980"
                  step="10"
                  value={minDgcsScore}
                  onChange={(e) => setMinDgcsScore(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>800점 (일반)</span>
                  <span>900점 (우수 Gold)</span>
                  <span>980점 (최상위 Platinum)</span>
                </div>
              </div>

              {/* 필수 서류/인증 토글 */}
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => setHealthCertRequired(!healthCertRequired)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    healthCertRequired
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-black text-[11px]">보건증 필수</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    healthCertRequired ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {healthCertRequired ? 'ON' : 'OFF'}
                  </span>
                </div>

                <div
                  onClick={() => setCleanRecordRequired(!cleanRecordRequired)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    cleanRecordRequired
                      ? 'bg-blue-50 border-blue-300 text-blue-950'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-black text-[11px]">신원/무사고 검증</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    cleanRecordRequired ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cleanRecordRequired ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>

              {/* 우대 조건 태그 칩 */}
              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-slate-700 text-[10.5px] block">
                  우대 조건 태그 선택 (다중 선택 가능)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PREFERRED_PRESETS.map((preset) => {
                    const isSelected = selectedPresets.includes(preset);
                    return (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => togglePreset(preset)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-amber-400" />}
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 하단 금융 보증 안내 */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center gap-2 text-slate-700">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <p className="text-[10.5px] leading-snug">
                {mode === 'employer'
                  ? '공고 등록 시 신한은행 0.1초 즉시정산 보증 및 5% 상생 환원 보험이 워커에게 자동 부여됩니다.'
                  : '공고 등록 시 신한 에스크로 계좌에 대금이 안전하게 선예치되며, 신한EZ 5천만 상해보험이 무상 제공됩니다.'}
              </p>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3 rounded-2xl text-white font-black text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'employer'
                    ? 'bg-gradient-to-r from-[#0046FF] to-blue-700 hover:brightness-110'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {initialGig
                    ? `${mode === 'employer' ? '점주 공고 조건 수정 완료' : '개인 의뢰 조건 수정 완료'}`
                    : `${mode === 'employer' ? '신규 점주 시프트 등록 (워커 피드 즉시 노출)' : '신규 개인 의뢰 등록 (에스크로 연동)'}`}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
