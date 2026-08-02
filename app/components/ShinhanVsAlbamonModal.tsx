'use client';

// app/components/ShinhanVsAlbamonModal.tsx
// 혁신 비교보기 — 고질적 알바/점주/플랫폼 문제 적나라 비교 & 땡겨요 웍스 혁신 분석

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Building2, CheckCircle2, Zap, ArrowRight, UserCheck, ShieldAlert, Sparkles, Flame, Coins, Clock, Scale } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShinhanVsAlbamonModal({ isOpen, onClose }: ModalProps) {
  const [activeCategory, setActiveCategory] = useState<'employer' | 'worker' | 'platform'>('employer');

  // 열려 있는 동안 body 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">

          {/* 딤드 배경 */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          {/* 바텀 시트 본체 */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 w-full flex flex-col bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#030712] rounded-t-[32px] border-t border-x border-slate-700/60 shadow-[0_-20px_70px_rgba(0,0,0,0.8)] text-white"
            style={{ maxHeight: 'calc(100dvh - 48px)' }}
          >
            {/* 드래그 핸들 */}
            <div className="shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
            </div>

            {/* ── 고정 헤더 ── */}
            <div className="shrink-0 px-5 pt-2 pb-4 border-b border-slate-800/80">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-[9.5px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-white" /> 고질적 문제 대폭파
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 신한 100% 무료 혁신
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white leading-snug">
                    기존 알바앱의 <span className="text-red-400 underline decoration-red-500/50 decoration-wavy">적나라한 현실</span> VS{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 font-extrabold">
                      땡겨요 웍스
                    </span>
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 대상별 탭 서브 네비게이션 */}
              <div className="grid grid-cols-3 gap-1.5 mt-3.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setActiveCategory('employer')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 ${
                    activeCategory === 'employer'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>🏪 점주의 피눈물</span>
                </button>
                <button
                  onClick={() => setActiveCategory('worker')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 ${
                    activeCategory === 'worker'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>👷 알바의 잔혹사</span>
                </button>
                <button
                  onClick={() => setActiveCategory('platform')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 ${
                    activeCategory === 'platform'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>⚖️ 기존앱의 폭리</span>
                </button>
              </div>
            </div>

            {/* ── 스크롤 가능 본문 ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">

              {/* 1. 점주 카테고리 */}
              {activeCategory === 'employer' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-3.5 space-y-3">
                    <div className="flex items-center gap-2 border-b border-red-900/50 pb-2">
                      <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                      <h4 className="font-black text-xs text-red-300">
                        기존 알바몬·알바천국 사용 시 점주가 겪는 3대 폐단
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-red-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-red-400 text-xs">💸 1. 무한 과금 유도 & 공고 사기</span>
                          <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">월 평균 15만원 지출</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          "무료 공고"는 올리자마자 10초 만에 5페이지 뒤로 밀려 지원자가 0명입니다. 결국 상단 노출 옵션(3만~10만원)을 매번 추가 결제해야만 인력을 구할 수 있습니다.
                        </p>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-red-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-red-400 text-xs">👻 2. 노쇼 & 무단결근 무방비</span>
                          <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">피해 손실 100% 점주 몫</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          당장 피크타임 1시간 전 약속하고 당일 무단 취소나 당일 잠수를 타도 알바앱은 어떤 제재나 손해배상 보상을 해주지 않고 나몰라라 합니다.
                        </p>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-red-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-red-400 text-xs">📄 3. 머리 아픈 노무·행정 복잡성</span>
                          <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">과태료 위험 항시 노출</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          근로계약서 미작성 과태료(최대 500만원), 4대보험 및 초단기 알바 주휴수당 계산 착오 등 1시간 알바 구하려다 세무·노무 폭탄을 맞습니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 땡겨요 웍스의 혁신 솔루션 */}
                  <div className="bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-500/40 rounded-2xl p-4 space-y-3 shadow-lg">
                    <div className="flex items-center gap-2 border-b border-blue-800/60 pb-2.5">
                      <Zap className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                      <h4 className="font-black text-xs text-blue-200">
                        ✨ 땡겨요 웍스 점주 전용 혁신 차별점
                      </h4>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-blue-500/30">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 font-bold text-[10px] shrink-0 mt-0.5">1</div>
                        <div>
                          <p className="font-black text-emerald-300 text-[11.5px]">상단 노출비·광고비·수수료 평생 0원</p>
                          <p className="text-[10.5px] text-slate-300 mt-0.5">신한금융 인프라로 백엔드 수익을 내므로 점주에게 1원도 과금하지 않는 100% 무료 구인 플랫폼입니다.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-blue-500/30">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 font-bold text-[10px] shrink-0 mt-0.5">2</div>
                        <div>
                          <p className="font-black text-emerald-300 text-[11.5px]">D-GCS 신용 평가로 노쇼률 0% 도전</p>
                          <p className="text-[10.5px] text-slate-300 mt-0.5">출근율, 평점, 신한 금융 신용도가 검증된 성실한 워커만 AI가 10분 내 핏팅해 매칭합니다.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-blue-500/30">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 font-bold text-[10px] shrink-0 mt-0.5">3</div>
                        <div>
                          <p className="font-black text-emerald-300 text-[11.5px]">원클릭 전자계약 & 자동 노무 패키지</p>
                          <p className="text-[10.5px] text-slate-300 mt-0.5">알바생 채용 즉시 전자근로계약서 발급부터 산재보험 원클릭 자동 가입까지 백엔드가 다 해줍니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 알바/구직자 카테고리 */}
              {activeCategory === 'worker' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-3.5 space-y-3">
                    <div className="flex items-center gap-2 border-b border-red-900/50 pb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <h4 className="font-black text-xs text-red-300">
                        알바생들이 눈물 짓는 기존 구직 시장의 3대 문제
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-red-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-red-400 text-xs">⏳ 1. 급여 정산까지 최장 1달 대기</span>
                          <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">당일 정산 불가능</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          오늘 당장 급전이 필요한데, 익월 10일이나 15일에 정산되어 급한 생활비나 등록금 마련에 목이 탑니다.
                        </p>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-red-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-red-400 text-xs">💔 2. 임금 체불 & 꺾기(조기 퇴근) Risk</span>
                          <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">근로자 보호장치 0</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          일하고도 돈을 못 받거나 사장님의 일방적인 조기 퇴근 통보로 약속된 알바비를 깎이는 피해가 빈번합니다.
                        </p>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-red-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-red-400 text-xs">🗑️ 3. 알바 이력이 신용점수에 0% 반영</span>
                          <span className="text-[9.5px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">경력 인정 불가</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          몇 년 동안 알바를 열심히 해도 금융권에서는 '무직자'로 분류되어 대출이나 신용카드 발급에 불이익을 받습니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 땡겨요 웍스 알바 우대 솔루션 */}
                  <div className="bg-gradient-to-br from-emerald-950/60 to-teal-950/60 border border-emerald-500/40 rounded-2xl p-4 space-y-3 shadow-lg">
                    <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-2.5">
                      <Coins className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                      <h4 className="font-black text-xs text-emerald-200">
                        💎 땡겨요 웍스 알바생 전용 혜택
                      </h4>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-emerald-500/30">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-[10px] shrink-0 mt-0.5">1</div>
                        <div>
                          <p className="font-black text-emerald-300 text-[11.5px]">퇴근 스와이프 즉시 '0.1초 무료 정산'</p>
                          <p className="text-[10.5px] text-slate-300 mt-0.5">일이 끝나자마자 수수료 0원으로 신한 슈퍼SOL 계좌로 즉시 주휴수당 포함 정산금이 입금됩니다.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-emerald-500/30">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-[10px] shrink-0 mt-0.5">2</div>
                        <div>
                          <p className="font-black text-emerald-300 text-[11.5px]">알바 성실 근무 = 신한 금융 신용점수 UP!</p>
                          <p className="text-[10.5px] text-slate-300 mt-0.5">성실 출근 실적이 D-GCS 점수로 누적되어 신한은행 대출 우대금리 및 마이크로 적금 혜택으로 직결됩니다.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-emerald-500/30">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-[10px] shrink-0 mt-0.5">3</div>
                        <div>
                          <p className="font-black text-emerald-300 text-[11.5px]">초단기 1~2시간 꿀알바 AI 자동 추천</p>
                          <p className="text-[10.5px] text-slate-300 mt-0.5">공강 시간이나 주말 자투리 시간에 내 동선에 딱 맞는 1~2시간 초단기 긱을 AI가 알아서 매칭해 줍니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. 기존 플랫폼 문제 카테고리 */}
              {activeCategory === 'platform' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                    <h4 className="font-black text-xs text-amber-300 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-amber-400" />
                      기존 알바앱(게시판형) vs 땡겨요 웍스(금융 연계형) 구조 비교
                    </h4>

                    <div className="grid grid-cols-1 gap-2.5 text-xs">
                      {/* 기존 플랫폼 */}
                      <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-red-400 text-[11px]">🔴 기존 알바앱 (알바몬/알바천국)</span>
                          <span className="text-[9px] bg-red-900/50 text-red-200 px-1.5 py-0.5 rounded">광고비 징수 BM</span>
                        </div>
                        <ul className="text-[10.5px] text-slate-300 space-y-1 list-disc list-inside">
                          <li>구조: 단순히 공고를 게시하고 광고비를 받는 <b>'게시판 모델'</b></li>
                          <li>수익원: 점주의 핏빛 유료 상단 노출 광고비 (건당 3만~10만원)</li>
                          <li>매칭 방식: 키워드 검색 (AI 매칭 0%, 노쇼 방지 0%)</li>
                          <li>정산 및 행정: 개입 불가 (약자 보호 및 금융 서비스 무관)</li>
                        </ul>
                      </div>

                      {/* 땡겨요 웍스 */}
                      <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 border border-blue-400/50 p-3.5 rounded-xl space-y-1.5 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-emerald-300 text-xs">🔵 신한 땡겨요 웍스 (DDANG WORKS)</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">백엔드 금융 BM</span>
                        </div>
                        <ul className="text-[10.5px] text-blue-100 space-y-1 list-disc list-inside font-medium">
                          <li>구조: 신한 금융 생태계와 결합된 <b>'AI 정밀 긱 매칭 & 즉시 정산'</b></li>
                          <li>수익원: 점주·알바 수수료 0원! (CASA 예치금, 신한카드/대출, 마이크로 연금 수익)</li>
                          <li>매칭 방식: 위치·동선·D-GCS 신용점수 기반 <b>10분 AI 자동 핏팅</b></li>
                          <li>정산 및 행정: <b>0.1초 즉시 정산 + 전자계약 + 산재보험 자동 가입</b></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h5 className="font-black text-white text-xs">"신한금융이 만들었기에 가능한 트로이 목마 혁신"</h5>
                      <p className="text-[10.5px] text-slate-300 mt-0.5 leading-tight">
                        플랫폼 수수료로 돈을 버는 시대는 끝났습니다. 소상공인과 알바생 모두가 승리하는 상생 생태계입니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 하단 여백 (버튼에 가려지지 않도록) */}
              <div className="h-2" />
            </div>

            {/* ── 고정 하단 버튼 ── */}
            <div className="shrink-0 px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-slate-800/80 bg-[#060B16]/95 backdrop-blur-md">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white font-black text-sm shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>땡겨요 WORKS 0.1초 AI 매칭 직접 경험하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
