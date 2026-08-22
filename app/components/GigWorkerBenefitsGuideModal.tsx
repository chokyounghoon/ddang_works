'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight,
  HelpCircle,
  Smartphone
} from 'lucide-react';

interface GigWorkerBenefitsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToJobs?: () => void;
}

export default function GigWorkerBenefitsGuideModal({
  isOpen,
  onClose,
  onNavigateToJobs,
}: GigWorkerBenefitsGuideModalProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const processSteps = [
    {
      step: '01',
      title: 'AI 초단기 매칭 & 원스톱 온보딩',
      subtitle: '서류 제출 없는 1초 계약',
      badge: '시작 단계',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      icon: Smartphone,
      summary: '내 위치와 선호 시간대에 꼭 맞는 1~4시간 초단기 일자리를 AI가 0.1초 만에 매칭하고, 보건증과 계약서를 모바일로 한 번에 끝냅니다.',
      benefits: [
        {
          title: '보건증·신분증 AI OCR 자동 검증',
          desc: '사진 1장으로 보건증 유효기간 자동 판독 및 위·변조 방지 블록체인 등록',
          highlight: '재발급 번거로움 0%'
        },
        {
          title: '전자 표준 근로계약서 1초 서명',
          desc: '법정 시급·주휴수당·휴게시간이 자동 산정된 스마트 전자계약으로 권익 100% 보호',
          highlight: '노동법 완벽 준수'
        },
        {
          title: 'GPS 100m 정밀 안심 출근 체크',
          desc: '도착 즉시 블루투스/GPS 비콘으로 출근 확정 ➔ 실시간 급여 카운트 시작',
          highlight: '출퇴근 분쟁 제로'
        }
      ]
    },
    {
      step: '02',
      title: '근무 중 100% 무상 안전 & 보험 보장',
      subtitle: '신한EZ손해보험 무상 지원',
      badge: '근무 단계',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      icon: ShieldCheck,
      summary: '일하는 동안 발생하는 모든 사고와 손해배상을 신한EZ손해보험이 전액 무상으로 지켜드립니다. (점주 수수료 100% 부담)',
      benefits: [
        {
          title: '초단기 마이크로 상해보험 자동 가입',
          desc: '근무 시작과 동시에 상해 비급여 치료비 최대 1,000만원 한도 무상 보장',
          highlight: '본인 부담금 0원'
        },
        {
          title: '사업장 대물 배상책임 5,000만원',
          desc: '서빙·조리 중 기물 파손, 음식물 사고 등 점주-워커 간 배상책임 완전 보장',
          highlight: '워커 과실 분쟁 방지'
        },
        {
          title: 'AI 실시간 영수증 OCR 1초 간편 청구',
          desc: '병원비 영수증 사진 촬영 시 AI가 즉시 심사하여 신한은행 계좌로 당일 입금',
          highlight: '서류 심사 당일 완료'
        }
      ]
    },
    {
      step: '03',
      title: '퇴근 즉시 0.1초 정산 & 세무 자동화',
      subtitle: '신한은행 CASA + 국세청 BATCH',
      badge: '정산 단계',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      icon: Zap,
      summary: '퇴근 버튼을 누르는 즉시 신한은행 모계좌로 0.1초 만에 급여가 꽂히며, 복잡한 세금과 4대보험 신고는 신한DS가 전액 무료로 대행합니다.',
      benefits: [
        {
          title: 'PG 수수료 ₩0 전액 면제 0.1초 즉시 입금',
          desc: '타 플랫폼의 3~5일 정산 대기와 3.3% PG 출금 수수료 없이 일한 돈 100% 즉시 수령',
          highlight: '수수료 0원 즉시 입금'
        },
        {
          title: '1일 15만원 비과세 원천징수 세금 0원',
          desc: '국세청 일용근로소득 비과세 한도 자동 적용 ➔ 세금 차감 없이 실수령액 극대화',
          highlight: '합법적 세금 0원'
        },
        {
          title: '신한DS Gov-Tech 4대보험 EDI BATCH',
          desc: '월 15시간 미만 초단기 예외 기준을 준수하여 불필요한 4대보험 강제 공제 원천 차단',
          highlight: '행정 신고 전액 무료'
        }
      ]
    },
    {
      step: '04',
      title: '원신한 금융 유니버스 자산 성장',
      subtitle: '대안신용 & 우대금리 & ETF 투자',
      badge: '금융 혜택',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      icon: TrendingUp,
      summary: '땡겨요 웍스에서 성실히 일할수록 D-GCS 신용 점수가 쌓여 신한 금융 7대 계열사에서 최고의 대출, 카드, 투자 혜택을 누립니다.',
      benefits: [
        {
          title: 'D-GCS 신용 평판 ➔ 은행 우대금리 -1.2%p',
          desc: '지각/결근 없는 성실 근무 내역이 블록체인 SBT로 영구 박제되어 대출 금리 파격 인하',
          highlight: '신용점수 보너스'
        },
        {
          title: '신한투자증권 점주 지원금 매칭 ETF 스윕',
          desc: '근무 1건당 점주 지원금(₩425) + 잔돈을 미국 배당 다우존스/S&P500 ETF로 자동 매칭 투자',
          highlight: '일하면서 자동 재테크'
        },
        {
          title: '신한카드 씬파일러 신용한도 +250만원',
          desc: '금융 거래 이력이 부족해도 웍스 근태 데이터로 대안신용(ACS 875점) 인정 및 한도 상향',
          highlight: '상생 캐시백 2%'
        }
      ]
    }
  ];

  const faqs = [
    {
      q: '급여를 받을 때 중개 수수료나 PG 수수료가 차감되나요?',
      a: '아닙니다! 땡겨요 웍스는 신한은행 BaaS 모계좌 직통 결제 시스템(S-BRIDGE)을 사용하여 워커에게 일체의 수수료를 받지 않습니다. 일한 금액 100%가 0.1초 만에 전액 입금됩니다.'
    },
    {
      q: '일하다가 다치거나 가게 물건을 깨뜨리면 어떻게 되나요?',
      a: '근무 확정 즉시 신한EZ손해보험의 마이크로 상해보험 및 5,000만원 대물 배상책임 보험에 100% 무상 자동 가입됩니다. 사고 발생 시 앱에서 영수증 사진 한 장으로 1초 접수하여 당일 치료비를 보상받으실 수 있습니다.'
    },
    {
      q: 'D-GCS 평판 점수는 어디에 활용되나요?',
      a: '성실 근무 시 상승하는 D-GCS 점수는 조작 불가능한 블록체인 소울바운드 토큰(SBT)으로 기록됩니다. 이 점수를 통해 신한은행 신용대출 시 최대 1.2%p 우대금리 쿠폰을 발급받고 신한카드 대안신용 한도를 즉시 상향받으실 수 있습니다.'
    },
    {
      q: '단기 알바를 여러 번 해도 세금 신고가 복잡하지 않나요?',
      a: '전혀 복잡하지 않습니다. 신한DS의 Gov-Tech 엔진이 국세청 홈택스 일용근로소득 지급명세서와 4대보험 EDI BATCH를 자동으로 신고해 주어 세무 지식이 없어도 완벽하게 적법 처리됩니다.'
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
        {/* 모달 상단 헤더 */}
        <div className="relative p-5 pb-4 border-b border-slate-800 bg-gradient-to-b from-slate-800/80 to-slate-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-[#FB521C] to-orange-400 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 font-mono">
              Worker Exclusive Guide
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white mt-1">
            땡겨요 WORKS <span className="text-[#FB521C]">긱워커 안심 혜택 프로세스</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            AI 매칭부터 0.1초 입금, 무상 보험, 신한 금융 자산화까지 4단계 풀케어
          </p>

          {/* 프로세스 4단계 탭 스위처 */}
          <div className="grid grid-cols-4 gap-1.5 mt-4">
            {processSteps.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`flex flex-col items-center py-2 px-1 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-orange-500/20 border-orange-400/80 text-white shadow-xs'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`text-[10px] font-black font-mono ${isActive ? 'text-orange-400' : 'text-slate-500'}`}>
                    STEP {s.step}
                  </span>
                  <span className="text-[11px] font-bold mt-0.5 truncate w-full text-center px-1">
                    {idx === 0 ? '매칭·계약' : idx === 1 ? '무상보험' : idx === 2 ? '즉시정산' : '금융성장'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* 현재 선택된 단계의 상세 카드 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* 스텝 헤더 & 개요 */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${processSteps[activeStep].badgeColor}`}>
                    STEP {processSteps[activeStep].step} · {processSteps[activeStep].badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {processSteps[activeStep].subtitle}
                  </span>
                </div>
                <h4 className="text-base font-black text-white">
                  {processSteps[activeStep].title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {processSteps[activeStep].summary}
                </p>
              </div>

              {/* 3대 핵심 혜택 리스트 */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                  제공되는 3대 핵심 안심 혜택
                </p>
                {processSteps[activeStep].benefits.map((b, bIdx) => (
                  <div
                    key={bIdx}
                    className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 rounded-2xl p-3.5 space-y-1.5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-black text-xs text-slate-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        {b.title}
                      </h5>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-400/30">
                        {b.highlight}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-300 leading-normal pl-3">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 타 플랫폼 대비 차별점 비교 요약 배너 */}
          <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                👑 땡겨요 WORKS vs 기존 알바 플랫폼
              </span>
              <span className="text-[9.5px] font-bold text-slate-400">비교 요약</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">기존 플랫폼</span>
                <p className="text-slate-300 text-[11px]">❌ 3~5일 후 급여 입금</p>
                <p className="text-slate-300 text-[11px]">❌ 3.3% PG 출금 수수료</p>
                <p className="text-slate-300 text-[11px]">❌ 근무 중 사고 본인 책임</p>
              </div>

              <div className="bg-orange-950/30 rounded-xl p-3 border border-orange-500/30 space-y-1">
                <span className="text-[10px] text-orange-400 font-bold">땡겨요 WORKS</span>
                <p className="text-emerald-400 font-bold text-[11px]">✓ 0.1초 즉시 입금</p>
                <p className="text-emerald-400 font-bold text-[11px]">✓ 수수료 ₩0 전액 면제</p>
                <p className="text-emerald-400 font-bold text-[11px]">✓ 신한EZ 보험 100% 무상</p>
              </div>
            </div>
          </div>

          {/* 자주 묻는 질문 (FAQ) 아코디언 */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              자주 묻는 질문 (FAQ)
            </p>

            <div className="space-y-2">
              {faqs.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;
                return (
                  <div
                    key={fIdx}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-orange-400 font-black">Q.</span>
                        {faq.q}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-3.5 pb-3.5 text-[11.5px] text-slate-300 border-t border-slate-700/40 pt-2.5 leading-relaxed"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 모달 하단 고정 액션 버튼 */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold transition-colors"
          >
            닫기
          </button>
          <button
            onClick={() => {
              onClose();
              if (onNavigateToJobs) onNavigateToJobs();
            }}
            className="flex-2 py-3 bg-gradient-to-r from-[#FB521C] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <span>지금 안심 일자리 찾기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
