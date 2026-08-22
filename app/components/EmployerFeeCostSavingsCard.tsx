'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingDown, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Zap, 
  BadgePercent, 
  Gift, 
  Building2, 
  ChevronRight, 
  HelpCircle,
  Coins,
  Receipt
} from 'lucide-react';

export default function EmployerFeeCostSavingsCard({
  onOpenComparisonModal,
}: {
  onOpenComparisonModal?: () => void;
}) {
  const [isShinhanMerchant, setIsShinhanMerchant] = useState(true);
  const [freeCouponsRemaining, setFreeCouponsRemaining] = useState(5);

  const currentFeeRate = isShinhanMerchant ? 2.5 : 5.0;
  // 2시간 알바 (시급 16,000원 x 2시간 = 32,000원) 기준 점주 수수료
  const sampleSalary = 32000;
  const sampleFee = Math.round(sampleSalary * (currentFeeRate / 100));

  return (
    <div className="space-y-3 font-sans">
      {/* 1. 신한 가맹점 우대 수수료 50% 감면 & 무료 쿠폰 바 */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 rounded-3xl p-4 text-white space-y-3 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
              <BadgePercent className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-white">신한 주거래 가맹점 수수료 50% 우대</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  적용중
                </span>
              </div>
              <p className="text-[10px] text-blue-300">신한 결제계좌 및 땡겨요 가맹점 특별 감면</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 line-through mr-1">5.0%</span>
            <span className="text-base font-black text-amber-400 font-mono">{currentFeeRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* 땡겨요 배달 입점 매장 무료 쿠폰 & 스위처 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[10.5px]">
              <Gift className="w-3.5 h-3.5" />
              <span>땡겨요 수수료 ₩0 무료권</span>
            </div>
            <p className="text-xs font-black text-white">잔여 {freeCouponsRemaining}/5회권 보유</p>
            <span className="text-[9px] text-slate-400">이번 달 5건 완전 무료 매칭</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 space-y-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-300 font-bold">신한 가맹점 우대</span>
              <button
                onClick={() => setIsShinhanMerchant(!isShinhanMerchant)}
                className={`text-[9px] font-black px-2 py-0.5 rounded-full transition-colors ${
                  isShinhanMerchant
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {isShinhanMerchant ? '50% 할인 On' : '기본 5%'}
              </button>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold">
              {isShinhanMerchant ? '✓ 건당 2.5% 즉시 적용' : '신한 계좌 연결 시 2.5%'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 💰 알바몬 대비 이번 달 사장님 비용 절감 리포트 (ROI 계산기) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4.5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <span className="text-[9.5px] font-black text-indigo-600 uppercase tracking-wider font-mono">
              Employer Cost Reduction Report
            </span>
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
              <span>기존 알바몬·세무사 대비 비용 절감액</span>
            </h4>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block leading-tight">이번 달 누적 절감액</span>
            <span className="text-base font-black text-indigo-600 font-mono">₩248,000 Saved</span>
          </div>
        </div>

        {/* 3대 핵심 절감 항목 그리드 */}
        <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 space-y-0.5">
            <span className="text-[9.5px] text-slate-500 font-bold block">공고 선결제비</span>
            <p className="text-xs font-black text-slate-900 font-mono">₩150,000</p>
            <span className="text-[8.5px] text-emerald-600 font-bold">100% 절감 (₩0)</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 space-y-0.5">
            <span className="text-[9.5px] text-slate-500 font-bold block">세무·4대보험 EDI</span>
            <p className="text-xs font-black text-slate-900 font-mono">₩60,000</p>
            <span className="text-[8.5px] text-emerald-600 font-bold">신한DS 무료대행</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 space-y-0.5">
            <span className="text-[9.5px] text-slate-500 font-bold block">5,000만 배상보험</span>
            <p className="text-xs font-black text-slate-900 font-mono">₩28,000</p>
            <span className="text-[8.5px] text-emerald-600 font-bold">신한EZ 무상포함</span>
          </div>
        </div>

        {/* 3. 알바 1건(2시간 32,000원) 채용 시 실부담 체감 시뮬레이션 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              2시간 알바(32,000원) 채용 시 점주 실부담
            </span>
            <span className="text-xs font-black text-amber-400 font-mono">
              단 {sampleFee.toLocaleString()}원 ({currentFeeRate}%)
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            기존 방식(광고비+세무비) 환산 시 건당 <strong>25,000원~40,000원</strong> 지출되던 비용이, 땡겨요 웍스에서는 <strong>커피 한 잔보다 싼 {sampleFee.toLocaleString()}원</strong>으로 <strong>[구인 + 세무신고 + 5,000만원 배상보험 + 노쇼 방지]</strong>가 올인원 해결됩니다.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-blue-400">
            <span>D-GCS 980점 검증 알바생으로 노쇼 리스크 0%</span>
            {onOpenComparisonModal && (
              <button
                onClick={onOpenComparisonModal}
                className="font-bold underline text-amber-300 hover:text-white flex items-center gap-0.5"
              >
                1:1 비교표 보기 <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
