'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  Building2, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  PieChart, 
  HeartHandshake, 
  Landmark, 
  FileText,
  BadgePercent
} from 'lucide-react';

interface MerchantFeeSynergyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MerchantFeeSynergyNoticeModal({
  isOpen,
  onClose,
}: MerchantFeeSynergyNoticeModalProps) {
  if (!isOpen) return null;

  const breakdowns = [
    {
      percent: '2.0%',
      title: '신한EZ손해보험 무상 상해·배상책임 보험료',
      affiliate: '🛡️ 신한EZ손해보험',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300',
      desc: '워커가 근무 시작하는 순간 상해 비급여 치료비 최대 1,000만원과 업장 내 대물 손해배상 5,000만원 한도를 100% 무상으로 보장합니다. (워커 자부담 0원)',
      badge: '100% 무상 지원'
    },
    {
      percent: '1.5%',
      title: '신한투자증권 미국 배당 ETF 잔돈 매칭 투자금',
      affiliate: '📈 신한투자증권',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-950/40 border-purple-500/30 text-purple-300',
      desc: '워커가 시급 끝전(예: 400원)을 저축할 때마다 점주 수수료에서 건당 ₩425를 매칭 지원하여 SOL 미국배당다우존스 ETF를 자동 소수점 매수합니다.',
      badge: '잔돈 자동 재테크'
    },
    {
      percent: '1.0%',
      title: '신한라이프 1% 마이크로 연금 펀드 자동 적립',
      affiliate: '🌱 신한라이프',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
      desc: '퇴직금과 국민연금 사각지대에 놓인 초단기 긱워커를 위해 근무 건마다 1% 마이크로 연금 계좌에 보너스 펀드가 자동 적립됩니다.',
      badge: '노후 자산 보너스'
    },
    {
      percent: '0.5%',
      title: '신한DS Gov-Tech 세무·노무 행정 BATCH 자동 대행',
      affiliate: '⚙️ 신한DS (Gov-Tech)',
      color: 'from-blue-500 to-slate-500',
      bgColor: 'bg-blue-950/40 border-blue-500/30 text-blue-300',
      desc: '국세청 홈택스 1일 15만원 비과세 자동 판정(원천징수 세금 0원)과 근로복지공단 4대보험 EDI BATCH 신고 비용을 전액 무료 대행합니다.',
      badge: '세금 0원 합법 판정'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden text-white"
      >
        {/* 상단 헤더 */}
        <div className="relative p-5 pb-4 border-b border-slate-800 bg-gradient-to-b from-slate-800/90 to-slate-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs">
              <BadgePercent className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 font-mono">
              Notice · One-Shinhan Synergy
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white mt-1">
            점주 부담 <span className="text-amber-400">수수료 5%</span>의 진실
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            플랫폼 이익으로 사라지지 않고, <strong>신한 7대 금융사 인프라</strong>를 통해 <strong>긱워커에게 100% 환원</strong>되는 상생 금융 메커니즘
          </p>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {/* 5% 수수료 분배 파이 요약 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-amber-400" />
                점주 지불 5% 수수료 ➔ 100% 환원 포트폴리오
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                워커 수수료 ₩0
              </span>
            </div>

            {/* 수치 게이지 바 */}
            <div className="h-3 rounded-full bg-slate-800 flex overflow-hidden p-0.5 gap-0.5 border border-slate-700">
              <div className="bg-cyan-400 h-full rounded-l-full w-[40%]" title="신한EZ 보험 (2.0%)" />
              <div className="bg-purple-500 h-full w-[30%]" title="신한투자증권 ETF (1.5%)" />
              <div className="bg-emerald-400 h-full w-[20%]" title="신한라이프 연금 (1.0%)" />
              <div className="bg-blue-400 h-full rounded-r-full w-[10%]" title="신한DS 행정대행 (0.5%)" />
            </div>

            <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
              <span className="text-cyan-300">보험 2.0%</span>
              <span className="text-purple-300">ETF 1.5%</span>
              <span className="text-emerald-300">연금 1.0%</span>
              <span className="text-blue-300">행정 0.5%</span>
            </div>
          </div>

          {/* 4대 금융 환원 상세 카드 리스트 */}
          <div className="space-y-3">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              세부 금융사별 시너지 환원 명세
            </p>

            {breakdowns.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${item.bgColor}`}>
                      {item.percent}
                    </span>
                    <span className="font-bold text-xs text-white">
                      {item.affiliate}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {item.badge}
                  </span>
                </div>

                <h5 className="font-bold text-xs text-slate-200">
                  {item.title}
                </h5>
                <p className="text-[11.5px] text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* + 신한은행 & 신한카드 추가 금융 시너지 */}
          <div className="bg-gradient-to-br from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-3.5 space-y-2.5">
            <span className="text-xs font-black text-blue-300 flex items-center gap-1.5">
              🏦 신한은행 & 💳 신한카드 연계 금융 시너지
            </span>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span><strong>신한은행 CASA 모계좌:</strong> 3.3% PG 출금 수수료 전액 면제 (₩0) 및 퇴근 즉시 0.1초 입금</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span><strong>신한카드 대안신용(ACS 875점):</strong> 근태 성실도 빅데이터로 금융 씬파일러 신용한도 +250만원 즉시 상향</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span><strong>D-GCS 평판 SBT:</strong> 성실 근무 기록으로 신한은행 대출 우대금리 -1.2%p 쿠폰 상시 제공</span>
              </p>
            </div>
          </div>
        </div>

        {/* 모달 하단 버튼 */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
          >
            확인했습니다
          </button>
        </div>
      </motion.div>
    </div>
  );
}
