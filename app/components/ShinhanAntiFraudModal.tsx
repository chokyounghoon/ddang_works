'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Clock,
  UserX,
  Cpu,
  Scale,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowUpRight,
  Lock,
  Eye,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ShinhanAntiFraudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShinhanAntiFraudModal({ isOpen, onClose }: ShinhanAntiFraudModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white font-sans flex flex-col max-h-[90vh]"
        >
          {/* 모달 상단 헤더 */}
          <div className="p-4.5 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-black shadow-xs">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">신한EZ 4중 보험 사기·도덕적 해이 방어 시스템</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                    FDS 실시간 가동
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  고의 자해 · 허위 사고 · 담합 청구를 금융권 인프라로 100% 원천 차단
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 모달 본문 (스크롤 가능) */}
          <div className="p-4.5 overflow-y-auto space-y-3.5 text-xs">
            {/* 핵심 요약 배너 */}
            <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-3 text-rose-200 text-[11px] leading-relaxed">
              💡 <strong>금융권의 사활을 건 방어 설계:</strong> 땡겨요 WORKS는 신한금융의 실명 인증, 시공간 GPS 타임스탬프 락인, AI FDS(이상거래탐지), 마이크로 보장 구조를 통해 <strong>"보험 사기로 얻을 수 있는 금전적 실익을 0원으로 만들고 처벌 리스크를 극대화"</strong>하여 범죄 동기를 원천 분쇄합니다.
            </div>

            {/* 4대 안전장치 카드 리스트 */}
            <div className="space-y-2.5">
              {/* 1. 시공간 제약 */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <Clock className="w-4 h-4" />
                    </span>
                    <h4 className="font-black text-xs text-white">
                      1. 좁디좁은 '시간 및 공간 제약 (Time-Space Window)'
                    </h4>
                  </div>
                  <span className="text-[9.5px] font-mono text-emerald-400 font-bold">50m GPS 락</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  신한EZ 마이크로 보험은 <strong>[출근 스와이프 + 현장 반경 50m GPS 인증]</strong> 순간부터 <strong>[퇴근 스와이프]</strong>까지의 정확한 업무 시간 동안만 효력이 발생합니다. 업무 외 시간의 부상이나 의도적 자해는 데이터로 100% 원천 배제됩니다.
                </p>
              </div>

              {/* 2. 신원 락인 */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                      <UserX className="w-4 h-4" />
                    </span>
                    <h4 className="font-black text-xs text-white">
                      2. 디지털 신원 락인 & '익명성 제로 (Zero-Anonymity)'
                    </h4>
                  </div>
                  <span className="text-[9.5px] font-mono text-purple-300 font-bold">실명 에스크로</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  가짜 계정 생성이 불가능한 <strong>신한 인증서 및 본인 명의 휴대폰·실명 계좌</strong>로만 참여 가능합니다. 고의 사고 적발 시 <strong>주민등록번호 및 금융 계좌 단위로 블랙리스트 등재</strong>되어 전 금융권 거래와 플랫폼 이용이 영구 박탈됩니다.
                </p>
              </div>

              {/* 3. AI FDS */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                      <Cpu className="w-4 h-4" />
                    </span>
                    <h4 className="font-black text-xs text-white">
                      3. 금융권 연계 AI FDS (이상금융거래 탐지 시스템)
                    </h4>
                  </div>
                  <span className="text-[9.5px] font-mono text-amber-300 font-bold">신한 FDS 24/7</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  신한카드·신한라이프의 FDS 알고리즘이 마이크로 보험에 실시간 적용됩니다. <strong>잦은 소액 청구, 특정 의뢰인-워커 간 담합/반복 사고 주장 패턴</strong>이 포착되면 AI가 즉시 계정을 동결하고 금융감독원 및 수사기관 연계 수사에 착수합니다.
                </p>
              </div>

              {/* 4. 소액 보장 & 자기부담금 */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                      <Scale className="w-4 h-4" />
                    </span>
                    <h4 className="font-black text-xs text-white">
                      4. 소액 보장 구조 & 자기부담금 (Risk vs Reward 불균형)
                    </h4>
                  </div>
                  <span className="text-[9.5px] font-mono text-emerald-300 font-bold">수익 실익 0원</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  수억 원을 타내는 생명보험이 아닌, <strong>실제 병원 영수증 기반의 실비 마이크로 치료비 및 자기부담금</strong> 구조입니다. 고의 자해로 얻는 금전적 이익(수만 원) 대비 전과자 낙인과 금융 거래 정지라는 거대한 대가를 치르게 하여 범죄 동기 자체를 소멸시킵니다.
                </p>
              </div>
            </div>

            {/* 🎤 심사위원 발표 방어 가이드 */}
            <div className="bg-gradient-to-r from-blue-950 to-slate-950 border border-blue-500/40 rounded-2xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                PoC 심사역 질의응답 (Q&A) 방어 가이드
              </span>
              <p className="text-[11px] text-slate-200 font-medium">
                Q. <em>"보험 사기나 고의 자해 같은 악용 사례는 어떻게 막습니까?"</em>
              </p>
              <p className="text-[10.5px] text-blue-200 font-bold bg-blue-900/40 p-2 rounded-xl border border-blue-500/20">
                A. "신한EZ손보는 [출퇴근 50m GPS 타임스탬프 락인], [신한 실명 신원 락인], [신한카드 FDS 이상거래 AI 탐지], [실비 영수증 마이크로 보장]의 4중 안전망을 통해 사기 실익을 0원으로 만들고 금융 정지 페널티를 극대화하여 도덕적 해이를 원천 차단합니다."
              </p>
            </div>
          </div>

          {/* 하단 닫기 버튼 */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-center shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
            >
              확인 및 닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
