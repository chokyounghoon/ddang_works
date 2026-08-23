'use client';

// app/components/ShinhanInvestSimulatorModal.tsx
// 신한투자증권 & 신한자산운용 잔돈 소수점 복리 투자 & 포트폴리오 시뮬레이터

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, TrendingUp, Sparkles, DollarSign, PieChart, CheckCircle2,
  ArrowRight, Landmark, Sliders, ShieldCheck, Download, RefreshCw, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface ShinhanInvestSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerName?: string;
}

export default function ShinhanInvestSimulatorModal({
  isOpen,
  onClose,
  workerName = '조이수',
}: ShinhanInvestSimulatorModalProps) {
  const { triggerPush } = useAppPush();
  const [gigsPerWeek, setGigsPerWeek] = useState<number>(3); // 주당 긱 횟수 (1~6회)
  const [spareChange, setSpareChange] = useState<number>(600); // 1회당 잔돈 스윕 (원)
  const [employerMatching, setEmployerMatching] = useState<number>(425); // 점주 상생 매칭금 (원)
  const [periodYears, setPeriodYears] = useState<number>(3); // 0.5, 1, 3, 5년
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(8.5); // 연평균 수익률 (%)

  // 포트폴리오 비중
  const [solSchdWeight, setSolSchdWeight] = useState<number>(50); // SOL 미국배당다우존스
  const [nasdaqWeight, setNasdaqWeight] = useState<number>(30); // TIGER 미국나스닥100
  const [stoWeight, setStoWeight] = useState<number>(20); // 강남 오피스 STO

  const [simulatedOrderDone, setSimulatedOrderDone] = useState(false);

  if (!isOpen) return null;

  // 복리 계산 로직
  // 1회당 총 투자금 = 잔돈 + 점주매칭
  const perGigInvestment = spareChange + employerMatching; // 약 1,025원
  const monthlyGigs = gigsPerWeek * 4.33; // 월간 긱 횟수
  const monthlyDeposit = Math.round(monthlyGigs * perGigInvestment); // 월간 납입금
  const totalMonths = Math.round(periodYears * 12);

  // 미래가치(FV) 월복리 계산
  const monthlyRate = annualReturnRate / 100 / 12;
  const totalPrincipal = monthlyDeposit * totalMonths; // 순수 원금

  let futureValue = 0;
  if (monthlyRate > 0) {
    futureValue = Math.round(monthlyDeposit * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate));
  } else {
    futureValue = totalPrincipal;
  }
  const totalProfit = Math.max(0, futureValue - totalPrincipal);
  const profitPercentage = totalPrincipal > 0 ? ((totalProfit / totalPrincipal) * 100).toFixed(1) : '0.0';

  const handleExecuteAutoInvest = () => {
    setSimulatedOrderDone(true);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
    triggerPush({
      title: '📈 [신한투자증권 소수점 자동 매수 등록]',
      body: `${workerName}님의 긱 퇴근 시 잔돈 ₩${spareChange}원 + 점주 지원금 ₩${employerMatching}원이 SOL 미국배당다우존스 외 2종에 자동 매수됩니다.`,
      type: 'confirm',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-purple-100 max-w-xl w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        >
          {/* 1. 모달 헤더 (땡겨요 오렌지-레드 X 신한투자증권 듀얼 테마) */}
          <div className="p-4.5 bg-gradient-to-r from-[#FB521C] via-[#FF6B3D] to-indigo-700 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white text-lg shadow-inner border border-white/30">
                📈
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30 tracking-tight">
                    땡겨요 X 신한투자증권
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-200">
                    점주 5% 상생 매칭 지원
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base mt-0.5 text-white tracking-tight">
                  알바비 잔돈 소수점 복리 투자 시뮬레이터
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. 모달 바디 (계산기 & 시뮬레이터) */}
          <div className="p-4.5 overflow-y-auto space-y-4 text-xs flex-1">
            {/* 상단 시뮬레이션 핵심 결과 카드 */}
            <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-lg border border-purple-500/30 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-2.5">
                <span className="text-[11px] font-bold text-purple-300">
                  {periodYears}년 뒤 예상 자산 형성 금액 (복리 효과)
                </span>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/30">
                  연 수익률 {annualReturnRate}% 가정
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-white tracking-tight">
                    ₩{futureValue.toLocaleString()}원
                  </span>
                  <span className="text-xs text-emerald-400 font-bold ml-2">
                    (+{profitPercentage}% 복리 이자)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">원금 적립액</span>
                  <span className="text-xs font-bold text-slate-200">
                    ₩{totalPrincipal.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[10.5px]">
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                  <span className="text-slate-400 block">워커 잔돈 적립</span>
                  <span className="font-bold text-purple-200">
                    월 ₩{(Math.round(monthlyGigs * spareChange)).toLocaleString()}원
                  </span>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                  <span className="text-slate-400 block">점주 상생 매칭 지원금</span>
                  <span className="font-bold text-emerald-300">
                    +월 ₩{(Math.round(monthlyGigs * employerMatching)).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 시뮬레이션 슬라이더 컨트롤러 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3.5">
              <h4 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-600" />
                <span>나의 근무 및 적립 조건 설정</span>
              </h4>

              {/* 주당 근무 횟수 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>주간 긱 근무 횟수</span>
                  <span className="text-purple-600 font-black">주 {gigsPerWeek}회 근무</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={gigsPerWeek}
                  onChange={(e) => setGigsPerWeek(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* 1회당 잔돈 스윕 금액 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>일당 1,000원 미만 잔돈 스윕</span>
                  <span className="text-purple-600 font-black">회당 ₩{spareChange}원</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="900"
                  step="100"
                  value={spareChange}
                  onChange={(e) => setSpareChange(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* 투자 기간 선택 */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-slate-700 block">투자 시뮬레이션 기간</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: '6개월', value: 0.5 },
                    { label: '1년', value: 1 },
                    { label: '3년', value: 3 },
                    { label: '5년', value: 5 },
                  ].map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPeriodYears(p.value)}
                      className={`py-2 rounded-xl text-xs font-black transition-all ${
                        periodYears === p.value
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 신한 자동 투자 포트폴리오 비중 구성 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-indigo-600" />
                  <span>신한투자증권 자동 매수 포트폴리오</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-bold">소수점 실시간 매수</span>
              </div>

              <div className="space-y-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇺🇸</span>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">SOL 미국배당다우존스 (SCHD)</h5>
                      <p className="text-[10px] text-slate-500">매월 말일 배당금 계좌 자동 입금 (+4.8%)</p>
                    </div>
                  </div>
                  <span className="font-black text-purple-700 text-xs bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                    비중 {solSchdWeight}%
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🚀</span>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">TIGER 미국나스닥100</h5>
                      <p className="text-[10px] text-slate-500">엔비디아·애플 등 초고성장 빅테크 (+12.4%)</p>
                    </div>
                  </div>
                  <span className="font-black text-indigo-700 text-xs bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
                    비중 {nasdaqWeight}%
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏢</span>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">신한 STO 강남 오피스 조각투자</h5>
                      <p className="text-[10px] text-slate-500">블록체인 분기 임대료 배당 수령 (+6.2%)</p>
                    </div>
                  </div>
                  <span className="font-black text-blue-700 text-xs bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                    비중 {stoWeight}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 모달 하단 액션 버튼 */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 shrink-0">
            <button
              onClick={handleExecuteAutoInvest}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#FB521C] via-purple-600 to-indigo-600 text-white font-black text-xs shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 hover:brightness-105 cursor-pointer"
            >
              {simulatedOrderDone ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
              <span>{simulatedOrderDone ? '신한 소수점 자동 투자 설정 완료!' : '퇴근 시 알바비 잔돈 자동 투자 땡겨보기 ⚡'}</span>
            </button>

            <button
              onClick={onClose}
              className="py-3.5 px-4 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
