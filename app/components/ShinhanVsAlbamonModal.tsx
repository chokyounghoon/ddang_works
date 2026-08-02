'use client';

// app/components/ShinhanVsAlbamonModal.tsx
// 혁신 비교보기 — 모바일 전용 바텀시트 모달 (Framer Motion spring)

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Building2, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShinhanVsAlbamonModal({ isOpen, onClose }: ModalProps) {
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
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* 바텀 시트 본체 */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 w-full flex flex-col bg-gradient-to-b from-[#111827] to-[#0A1128] rounded-t-[28px] border-t border-x border-slate-700/50 shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
            style={{ maxHeight: 'calc(100dvh - 56px)' }}   // 상단 여백 56px 확보
          >
            {/* 드래그 핸들 */}
            <div className="shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-600 rounded-full" />
            </div>

            {/* ── 고정 헤더 ── */}
            <div className="shrink-0 px-4 pt-2 pb-3.5 border-b border-slate-800/80">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white uppercase tracking-wider">
                      Trojan Horse Strategy
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      평생 100% 무료 선언
                    </span>
                  </div>
                  <h3 className="text-[15px] font-black text-white leading-snug">
                    왜 사장님들은 알바몬을 버리고{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                      '땡겨요 웍스'
                    </span>
                    로 전향하는가?
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── 스크롤 가능 본문 ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3">

              {/* 1. 알바몬 3가지 한계 */}
              <div className="bg-red-950/40 border border-red-500/25 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <h4 className="font-black text-xs text-red-300">
                    1. 알바몬 '공짜'의 3가지 거짓말과 한계
                  </h4>
                </div>

                {[
                  {
                    emoji: '🚨',
                    title: '"공짜 공고는 5분 만에 10페이지 뒤로 밀린다" (실질적 유료)',
                    body: '오늘 점심 알바가 급한데 무료 공고는 아무도 안 봅니다. 결국 사장님들은 3만~5만 원짜리 상단 노출 유료 광고를 결제할 수밖에 없습니다.',
                  },
                  {
                    emoji: '🚨',
                    title: '"행정 처리와 노쇼 비용은 온전히 사장님 몫이다" (숨은 비용)',
                    body: '알바몬은 단순 게시판일 뿐입니다. 근로계약서, 산재 신고, 노쇼로 인한 손실은 사장님이 혼자 떠안아야 합니다.',
                  },
                  {
                    emoji: '🚨',
                    title: '"1시간짜리 초단기 알바는 아예 불가능하다" (구조적 한계)',
                    body: '1~2시간 인력 구인에 드는 행정 비용이 알바비보다 커서 초단기 호출이 구조적으로 불가능합니다.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-slate-900/90 p-3 rounded-xl border border-red-900/40 space-y-1">
                    <p className="font-black text-red-300 text-[11px]">{item.emoji} {item.title}</p>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>

              {/* 2. 신한금융 파괴적 덤핑 아키텍처 */}
              <div className="bg-blue-950/40 border border-blue-500/25 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <h4 className="font-black text-xs text-blue-300">
                    2. 신한금융만 가능한 '진짜 0원' 수익 모델
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[9px] font-black text-red-400 uppercase tracking-wider block">기존 알바몬 수익 모델</span>
                    <p className="font-bold text-white">HR 공고비 & 유료 광고료 징수</p>
                    <p className="text-[10px] text-slate-400 leading-normal">공고료를 받지 않으면 파산하는 전통적 징수 플랫폼 구조</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/80 to-indigo-900/80 p-3 rounded-xl border border-blue-400/35 space-y-1">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider block">신한 땡겨요 WORKS 수익 모델</span>
                    <p className="font-bold text-emerald-300">구인·매칭·행정 평생 100% 무료</p>
                    <p className="text-[10px] text-blue-100 leading-normal">0.1초 정산, CASA 예치, 카드 결제, 대출, 마이크로 연금으로 금융 백엔드 수익 창출!</p>
                  </div>
                </div>
              </div>

              {/* 3. 전향 3가지 이유 */}
              <div className="bg-emerald-950/40 border border-emerald-500/25 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h4 className="font-black text-xs text-emerald-300">
                    3. 사장님이 전향하는 3가지 결정적 이유
                  </h4>
                </div>

                {[
                  {
                    num: 1,
                    title: '완벽한 \'0원\' (상단 노출 광고비조차 없음)',
                    body: '돈질 경쟁 없이 AI가 위치·시간·평점 기반으로 10분 내 무료 자동 매칭해 드립니다.',
                  },
                  {
                    num: 2,
                    title: '"버튼 한 번 → 계약서·산재·정산 끝" (행정 0원)',
                    body: '출근 스와이프 한 번으로 전자계약·0.1초 정산·마이크로 상해보험이 백엔드에서 100% 자동 처리됩니다.',
                  },
                  {
                    num: 3,
                    title: '"알바몬에 없는 1시간 초단기 급구 가능"',
                    body: '"오늘 12시~1시 설거지(시급 1.6만원)"도 광고비 0원이라 부담 없이 초단기 호출 가능합니다.',
                  },
                ].map((item) => (
                  <div key={item.num} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-[10px] shrink-0 mt-0.5">
                      {item.num}
                    </div>
                    <div>
                      <h5 className="font-black text-white text-[11px]">{item.title}</h5>
                      <p className="text-[10.5px] text-slate-400 mt-0.5 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 여백 (버튼에 가려지지 않도록) */}
              <div className="h-2" />
            </div>

            {/* ── 고정 하단 버튼 ── */}
            <div className="shrink-0 px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-slate-800/60 bg-[#0A1128]/95 backdrop-blur-md">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white font-black text-sm shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>땡겨요 WORKS 0.1초 AI 매칭 체험하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
