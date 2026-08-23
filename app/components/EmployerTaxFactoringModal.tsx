'use client';

// app/components/EmployerTaxFactoringModal.tsx
// 점주 전용: 신한카드 일일 단기 신용한도(선정산 팩토링) & 국세청/공단 세무 B2B 대시보드

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CreditCard, Landmark, Receipt, Download, CheckCircle2,
  AlertCircle, Sparkles, Building2, TrendingUp, ShieldCheck,
  Scale, FileText, Check, DollarSign, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface EmployerTaxFactoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
}

export default function EmployerTaxFactoringModal({
  isOpen,
  onClose,
  storeName = '스타벅스 강남2호점',
}: EmployerTaxFactoringModalProps) {
  const { triggerPush } = useAppPush();
  const [activeTab, setActiveTab] = useState<'factoring' | 'tax_calc' | 'edi_batch'>('factoring');
  const [factoringAmount, setFactoringAmount] = useState<number>(500000);
  const [factoringExecuted, setFactoringExecuted] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  if (!isOpen) return null;

  const unsettledSales = 1840000; // 배달앱/카드사 3일 뒤 입금 예정 매출
  const availableCreditLimit = 1200000; // 신한카드 부여 가능 한도

  const handleExecuteFactoring = () => {
    setFactoringExecuted(true);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}

    triggerPush({
      title: '💳 [신한카드 일일 단기 신용한도 개설 완료]',
      body: `미정산 매출 ₩${unsettledSales.toLocaleString()}원을 담보로 알바비 결제용 신용한도 ₩${factoringAmount.toLocaleString()}원이 0.1초 만에 즉시 열렸습니다.`,
      type: 'confirm',
    });
  };

  const handleDownloadBatch = (reportType: string) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      } catch {}

      triggerPush({
        title: `📥 [${reportType} 표준 서식 다운로드]`,
        body: `국세청/근로복지공단 제출용 표준 전산 양식(XLSX/PDF)이 보관함에 저장되었습니다.`,
        type: 'confirm',
      });
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        >
          {/* 1. 모달 헤더 (땡겨요 사장님 테마: 땡겨요 오렌지-레드 X 신한카드 핑크) */}
          <div className="p-4.5 bg-gradient-to-r from-[#FB521C] via-[#FF4D80] to-slate-900 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white text-lg shadow-inner border border-white/30">
                💳
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30 tracking-tight">
                    땡겨요 사장님 X 신한카드
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-200">
                    {storeName} 전용
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base mt-0.5 text-white tracking-tight">
                  신한카드 일일 신용한도 & 세무 B2B 허브
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

          {/* 2. 상단 서브 탭 스위처 */}
          <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('factoring')}
              className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'factoring'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-pink-600" />
              <span>신한카드 일일 신용한도</span>
            </button>
            <button
              onClick={() => setActiveTab('tax_calc')}
              className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'tax_calc'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>노무/세무 법적 산출기</span>
            </button>
            <button
              onClick={() => setActiveTab('edi_batch')}
              className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'edi_batch'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              <span>국세청·공단 BATCH</span>
            </button>
          </div>

          {/* 3. 모달 바디 */}
          <div className="p-4.5 overflow-y-auto space-y-4 text-xs flex-1">
            {activeTab === 'factoring' && (
              <div className="space-y-3.5">
                {/* 점주 캐시플로우 현황 카드 */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-4.5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[11px] font-bold text-slate-300">
                      오늘 발생한 배달앱 · 카드사 미정산 매출
                    </span>
                    <span className="text-[10px] font-mono bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-400/30">
                      3일 뒤 입금 예정
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white">
                      ₩{unsettledSales.toLocaleString()}원
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">신한카드 즉시 한도</span>
                      <span className="text-xs font-bold text-pink-300">
                        최대 ₩{availableCreditLimit.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/10">
                    💡 <strong>신한카드 선정산 팩토링</strong>: 3일 뒤 입금될 확실한 매출 데이터를 담보로, 오늘 당장 필요한 알바비와 식자재 대금을 <strong>연 0% 무이자 당일 신용공여</strong>로 열어드립니다.
                  </p>
                </div>

                {/* 한도 설정 슬라이더 */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                    <span>오늘 열어둘 알바비 단기 신용한도</span>
                    <span className="text-pink-600 font-black text-sm">
                      ₩{factoringAmount.toLocaleString()}원
                    </span>
                  </div>

                  <input
                    type="range"
                    min="100000"
                    max={availableCreditLimit}
                    step="50000"
                    value={factoringAmount}
                    onChange={(e) => setFactoringAmount(Number(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>10만원</span>
                    <span>50만원 (알바 3명 인건비)</span>
                    <span>120만원 (최대)</span>
                  </div>
                </div>

                {/* 팩토링 실행 버튼 */}
                <button
                  onClick={handleExecuteFactoring}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:brightness-105 active:scale-98 text-white font-black rounded-2xl text-xs shadow-md shadow-pink-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {factoringExecuted ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
                  <span>
                    {factoringExecuted
                      ? '일일 신용한도 ₩500,000원 개설 완료 (즉시 사용 가능)'
                      : '신한카드 0.1초 일일 신용한도 열기 (알바비 즉시 지급용)'}
                  </span>
                </button>
              </div>
            )}

            {activeTab === 'tax_calc' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span>근로기준법 및 4대보험 자동 면책 판정표</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">
                    땡겨요 WORKS의 1~3시간 초단기 긱 워크는 노동법 및 세법상 <strong>주휴수당 0원 · 소득세 0원 · 4대보험 점주 세무사 기장료 0원</strong> 기준을 100% 준수합니다.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2 text-[11px]">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">2026년 법정 최저시급</span>
                    <span className="font-bold text-slate-800">10,030원 / 시간</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">약정 지급 시급</span>
                    <span className="font-black text-indigo-700">16,000원 (적법 준수)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">주휴수당 발생 여부</span>
                    <span className="font-black text-emerald-600">주 15시간 미만으로 미발생 (₩0원)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">일용근로소득 비과세 한도</span>
                    <span className="font-bold text-slate-800">1일 150,000원 (소득세 0원 면제)</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">산재보험료 부담</span>
                    <span className="font-bold text-blue-600">신한 5% 상생 수수료 내 100% 흡수</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edi_batch' && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-600">
                  신한DS Gov-Tech 게이트웨이가 국세청 홈택스 및 근로복지공단 제출용 표준 전산 파일(EDI)을 매월 15일 일괄 자동 생성합니다.
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">국세청 간이지급명세서 (일용근로소득)</h5>
                      <p className="text-[10px] text-slate-500">8월 근무자 14명 총 ₩584,000원 전산 양식</p>
                    </div>
                    <button
                      onClick={() => handleDownloadBatch('국세청 간이지급명세서')}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>XLSX</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">근로복지공단 고용산재 근로내용확인서</h5>
                      <p className="text-[10px] text-slate-500">산재보험 일괄 취득·상실 EDI 표준 파일</p>
                    </div>
                    <button
                      onClick={() => handleDownloadBatch('근로복지공단 근로내용확인서')}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. 모달 푸터 */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-slate-500">
              * 점주 세무사 기장료 및 노무 분쟁 리스크 0원 보증
            </span>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
