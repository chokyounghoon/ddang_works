'use client';

// app/components/OneShinhanSynergyDetailModal.tsx
// 마이페이지 연계: [One-Shinhan 7대 금융 계열사 시너지 혜택 종합 명세 및 인터랙티브 시뮬레이터 연동]

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Landmark, CreditCard, TrendingUp, ShieldCheck, HeartHandshake,
  Building2, Cpu, CheckCircle2, ChevronRight, Download, Sparkles,
  ArrowUpRight, Award, Lock, FileText, Check, DollarSign, Wallet,
  ArrowRight, Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

export interface AffiliateSynergy {
  id: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  bgLight: string;
  borderLight: string;
  badge: string;
  accumulatedValue: number;
  highlightText: string;
  subsidyOrigin: string;
  benefitDetails: { label: string; value: string; desc: string }[];
  contractTxHash?: string;
  policyNo?: string;
  actionButtonText?: string;
}

export const SHINHAN_7_AFFILIATES: AffiliateSynergy[] = [
  {
    id: 'bank',
    name: '신한은행',
    category: '주거래 모계좌 & CASA 저원가성 예금',
    icon: Landmark,
    color: '#0046FF',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    badge: '0.1초 즉시정산 모계좌',
    accumulatedValue: 124500,
    highlightText: 'CASA 모계좌 0.1초 즉시 입금 + 급여이체 우대금리 3.2% 적용',
    subsidyOrigin: '신한은행 BaaS 코어 뱅킹 API 무상 지원 (PG 수수료 3.3% 전액 면제)',
    policyNo: 'SHB-2026-CASA-084291',
    contractTxHash: '0x3a91...e829 (신한 BaaS 메인넷)',
    actionButtonText: '⚡ 신한 SOL 공인 이체확인증 확인',
    benefitDetails: [
      { label: '0.1초 즉시 입금', value: '수수료 ₩0원 (전액 면제)', desc: '퇴근 도장 날인 즉시 신한 모계좌(110-482-******)로 실시간 입금' },
      { label: '급여이체 우대금리', value: '연 3.20% (최고 우대)', desc: '긱워크 정산 실적을 정규 급여이체로 100% 인정하여 적금/청약 금리 우대' },
      { label: '체류 잔액 수익화', value: '일복리 파킹통장', desc: '정산된 일당이 머무는 동안 연 2.8% 일복리 이자 매일 지급' },
    ]
  },
  {
    id: 'invest',
    name: '신한투자증권',
    category: '알바비 끝전 & 점주 지원금 ETF 스윕',
    icon: TrendingUp,
    color: '#8B5CF6',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
    badge: '소수점 ETF + STO 투자',
    accumulatedValue: 48500,
    highlightText: '점주 지불 5% 수수료 중 ₩425 지원 + 자투리 잔돈 ₩400 자동 매칭 투자',
    subsidyOrigin: '점주 5% 시너지 수수료 풀 (50%) + 워커 알바비 1,000원 미만 잔돈 스윕',
    policyNo: 'SHI-2026-ETF-SOL99',
    contractTxHash: '0x8f22...c714 (신한 SOL증권 MTS 연동)',
    actionButtonText: '📈 잔돈 복리 시뮬레이터 & ETF 매수',
    benefitDetails: [
      { label: '자동 적립 상품', value: 'SOL 미국배당다우존스 ETF', desc: '월배당 우량 ETF 소수점 실시간 자동 매수로 시드머니 형성 (+4.8% 수익)' },
      { label: '점주 매칭 지원금', value: '매 긱당 ₩425 무상 적립', desc: '워커가 일할 때마다 점주 지불 수수료에서 투자 지원금을 매칭 적립' },
      { label: '부동산 STO 토큰', value: '강남 프라임 오피스 15주', desc: '신한 STO 블록체인 인프라 기반 분기별 임대수익 배당금 수령' },
    ]
  },
  {
    id: 'ez',
    name: '신한EZ손해보험',
    category: '초단기 마이크로 상해 & 배상책임 보험',
    icon: ShieldCheck,
    color: '#06B6D4',
    bgLight: 'bg-cyan-50',
    borderLight: 'border-cyan-200',
    badge: '출근 즉시 0.1초 가동',
    accumulatedValue: 84000,
    highlightText: '출근 스와이프 즉시 0.1초 만에 비급여 치료비 1,000만원 & 대물 배상 5,000만원 보장',
    subsidyOrigin: '점주 납부 5% 시너지 수수료에서 100% 무상 가입 (워커 부담 0원)',
    policyNo: 'EZ-2026-GIG-0822-CU98',
    contractTxHash: '0x4d19...aa31 (신한EZ 손보 스마트 증권)',
    actionButtonText: '🩹 원클릭 AI 즉시 보상금 청구하기',
    benefitDetails: [
      { label: '비급여 상해 치료비', value: '최대 1,000만 원 (100% 실손)', desc: 'MRI, 도수치료, 비급여 주사 등 자기부담금 0원으로 전액 보상' },
      { label: '현장 대물 배상책임', value: '최대 5,000만 원', desc: '식기/와인 파손, POS 침수 등 알바 중 기물 파손 점주 및 워커 100% 면책' },
      { label: '1초 간편 사고접수', value: '24시간 원스톱 케어', desc: '앱에서 사진 한 장으로 청구 접수 즉시 신한EZ 전담 보상팀 배정' },
    ]
  },
  {
    id: 'card',
    name: '신한카드',
    category: '대안신용평가(ACS) & 캐시백 혜택',
    icon: CreditCard,
    color: '#EC4899',
    bgLight: 'bg-pink-50',
    borderLight: 'border-pink-200',
    badge: '대안신용 875점 (상위 2%)',
    accumulatedValue: 35000,
    highlightText: '노쇼 0건 · 출근율 100% 데이터 기반 대안신용(ACS) 부여 & 단기 대출 한도 +250만원',
    subsidyOrigin: '신한카드 빅데이터 플랫폼 & 가맹점 결제망 수수료 시너지',
    policyNo: 'SHC-2026-ACS-GOLD98',
    contractTxHash: '0x7b88...19f0 (신한카드 ACS 엔진)',
    actionButtonText: '💳 대안신용(ACS) 한도 조회하기',
    benefitDetails: [
      { label: '대안신용점수(ACS)', value: '875점 (씬파일러 최고등급)', desc: '금융 이력이 부족한 2030 청년에게 근태 성실성 기반 신용 등급 상향' },
      { label: '우대 신용한도 부여', value: '+₩2,500,000원 즉시 증액', desc: '신한 p-Credit 연계 비상금 체크카드 후불 결제 및 긴급 생활비 한도' },
      { label: '가맹점 2.0% 캐시백', value: '땡겨요 가맹점 상생 결제', desc: '알바 근무 매장 및 땡겨요 가맹점 결제 시 상생 캐시백 자동 적립' },
    ]
  },
  {
    id: 'life',
    name: '신한라이프',
    category: '1% 마이크로 연금 & 헬스케어 DB',
    icon: HeartHandshake,
    color: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    badge: '1% 자동 연금 적립',
    accumulatedValue: 26200,
    highlightText: '알바비의 1%를 신한라이프 마이크로 연금에 자동 적립하여 2030 청년 노후 자산 형성',
    subsidyOrigin: '신한라이프 인프라 매칭 보조금 & GPS 동선 헬스케어 생체 DB 리워드',
    policyNo: 'SHL-2026-PENSION-0481',
    contractTxHash: '0x99a1...ff45 (신한라이프 연금 원장)',
    actionButtonText: '🌿 마이크로 연금 적립 내역 확인',
    benefitDetails: [
      { label: '누적 연금 적립액', value: '₩12,400원 (매 긱 1% 누적)', desc: '소액이라도 일할 때마다 자동으로 굴러가는 복리 마이크로 연금 펀드' },
      { label: 'GPS 헬스케어 리워드', value: '18시간 상해보장 무상', desc: '출퇴근 및 물류/서빙 동선 걸음 수 연동 헬스케어 포인트 추가 적립' },
      { label: '2030 전용 안심 보장', value: '응급실 내원비 지원', desc: '현장 근무 중 응급실 내원 시 1회당 10만원 정액 치료비 지원' },
    ]
  },
  {
    id: 'savingsCapital',
    name: '신한저축은행 & 신한캐피탈',
    category: '포용금융 Cascade & 서빙로봇 B2B 리스',
    icon: Building2,
    color: '#F97316',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
    badge: 'Cascade 중금리 대출 스탠바이',
    accumulatedValue: 18000,
    highlightText: '1금융권 대출 탈락 시 0.1초 만에 저축은행 중금리 대출로 자동 연결 (고금리 사채 방지)',
    subsidyOrigin: '신한금융 통합 심사 엔진 & 신한캐피탈 가맹점 서빙/물류 로봇 리스',
    policyNo: 'SHS-2026-CASCADE-77',
    contractTxHash: '0x2211...90cc (신한 Cascade 엔진)',
    actionButtonText: '🏛️ Cascade 포용대출 심사기 실행',
    benefitDetails: [
      { label: 'Cascade 자동 심사', value: '연 8.5% 중금리 스탠바이', desc: '은행 심사 미달 시 불법 사금융 대신 신한저축은행 안심 대출로 0.1초 전환' },
      { label: '서빙로봇 B2B 캐피탈', value: '점주 월 렌탈료 15% 감면', desc: '신한캐피탈 서빙로봇 도입 매장에 땡겨요 웍스 알바생 매칭 시 추가 할인' },
      { label: '성실 상환 우대', value: '금리 연 1.5%p 자동 인하', desc: '노쇼 없이 10회 이상 긱 완수 시 저축은행 대출 금리 자동 인하' },
    ]
  },
  {
    id: 'ds',
    name: '신한DS (Gov-Tech)',
    category: '블록체인 메인넷 & 세무/행정 자동 대행',
    icon: Cpu,
    color: '#0F172A',
    bgLight: 'bg-slate-100',
    borderLight: 'border-slate-300',
    badge: '국세청 · 근로복지공단 BATCH',
    accumulatedValue: 12000,
    highlightText: '국세청 홈택스 일용근로소득 비과세 판정 & 근로복지공단 4대보험 월간 BATCH 100% 자동 대행',
    subsidyOrigin: '신한DS 클라우드 & Gov-Tech 표준 EDI/REST API 서버',
    policyNo: 'SDS-2026-GOV-EDI-88',
    contractTxHash: '0x00ff...dd12 (신한 PoA 메인넷)',
    actionButtonText: '⛓️ 온체인 분산원장 익스플로러 탐색',
    benefitDetails: [
      { label: '국세청 지급명세서', value: '월간 BATCH 자동 전송', desc: '1일 15만원 비과세 자동 판정 ➔ 워커 소득세 0원 원천징수 면제' },
      { label: '근로복지공단 EDI', value: '매월 15일 일괄 자동 신고', desc: '주 15시간 미만 초단기 예외 처리 준수로 점주 세무사 기장료 0원' },
      { label: 'SBT 블록체인 박제', value: '근태 평판 영구 위변조 방지', desc: 'D-GCS 980점 평판 원장을 신한 컨소시엄 메인넷에 영구 기록' },
    ]
  }
];

interface OneShinhanSynergyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAffiliateId?: string;
  onOpenSolTransfer?: () => void;
  onOpenInvestSimulator?: () => void;
  onOpenClaimModal?: () => void;
  onOpenLoanCascade?: () => void;
  onOpenExplorer?: (txHash?: string) => void;
}

export default function OneShinhanSynergyDetailModal({
  isOpen,
  onClose,
  initialAffiliateId = 'bank',
  onOpenSolTransfer,
  onOpenInvestSimulator,
  onOpenClaimModal,
  onOpenLoanCascade,
  onOpenExplorer,
}: OneShinhanSynergyDetailModalProps) {
  const { triggerPush } = useAppPush();
  const [selectedId, setSelectedId] = useState<string>(initialAffiliateId);

  const selectedAffiliate =
    SHINHAN_7_AFFILIATES.find((a) => a.id === selectedId) || SHINHAN_7_AFFILIATES[0];
  const Icon = selectedAffiliate.icon;

  const totalBenefitValue = SHINHAN_7_AFFILIATES.reduce(
    (acc, cur) => acc + cur.accumulatedValue,
    0
  );

  if (!isOpen) return null;

  const handleActionClick = () => {
    onClose();
    if (selectedId === 'bank' && onOpenSolTransfer) {
      onOpenSolTransfer();
    } else if (selectedId === 'invest' && onOpenInvestSimulator) {
      onOpenInvestSimulator();
    } else if (selectedId === 'ez' && onOpenClaimModal) {
      onOpenClaimModal();
    } else if (selectedId === 'savingsCapital' && onOpenLoanCascade) {
      onOpenLoanCascade();
    } else if (selectedId === 'ds' && onOpenExplorer) {
      onOpenExplorer(selectedAffiliate.contractTxHash);
    } else {
      triggerPush({
        title: `✨ [${selectedAffiliate.name} 시너지 연동]`,
        body: `${selectedAffiliate.name}의 ${selectedAffiliate.highlightText} 혜택이 적용 중입니다.`,
        type: 'confirm',
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        >
          {/* 1. 모달 헤더 */}
          <div className="p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg shadow-inner">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                    One-Shinhan 7대 금융 연계
                  </span>
                  <span className="text-[10px] font-bold text-blue-200">
                    총 수혜액 ₩{totalBenefitValue.toLocaleString()}원 상당
                  </span>
                </div>
                <h3 className="font-black text-base mt-0.5">
                  신한금융그룹 계열사별 시너지 혜택 종합 명세서
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. 상단 7대 계열사 횡스크롤 탭 선택기 */}
          <div className="bg-slate-100 p-2 border-b border-slate-200 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
            {SHINHAN_7_AFFILIATES.map((aff) => {
              const AffIcon = aff.icon;
              const isSelected = aff.id === selectedId;
              return (
                <button
                  key={aff.id}
                  onClick={() => setSelectedId(aff.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                >
                  <AffIcon className="w-3.5 h-3.5" style={{ color: aff.color }} />
                  <span>{aff.name}</span>
                </button>
              );
            })}
          </div>

          {/* 3. 계열사 상세 내용 바디 */}
          <div className="p-4.5 overflow-y-auto space-y-4 text-xs flex-1">
            {/* 계열사 헤더 카드 */}
            <div
              className={`p-4 rounded-2xl border ${selectedAffiliate.bgLight} ${selectedAffiliate.borderLight} space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm"
                    style={{ backgroundColor: selectedAffiliate.color }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-slate-900">{selectedAffiliate.name}</h4>
                    <p className="text-[11px] text-slate-600 font-medium">{selectedAffiliate.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-bold">누적 수혜 가치</span>
                  <span className="text-base font-black text-indigo-700">
                    ₩{selectedAffiliate.accumulatedValue.toLocaleString()}원
                  </span>
                </div>
              </div>

              <p className="text-[11.5px] text-slate-800 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-slate-200">
                💡 <strong>{selectedAffiliate.highlightText}</strong>
              </p>

              <div className="text-[10.5px] text-slate-500 flex items-center justify-between pt-1">
                <span>재원 출처: {selectedAffiliate.subsidyOrigin}</span>
                <span className="font-mono text-slate-400">{selectedAffiliate.policyNo}</span>
              </div>
            </div>

            {/* 계열사별 원클릭 시뮬레이터 바로가기 배너 */}
            {selectedAffiliate.actionButtonText && (
              <button
                onClick={handleActionClick}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white font-bold flex items-center justify-between transition-all active:scale-98 shadow-sm group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black">{selectedAffiliate.actionButtonText}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-indigo-300 group-hover:translate-x-0.5 transition-transform">
                  <span>실행하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            )}

            {/* 3대 핵심 혜택 상세 리스트 */}
            <div className="space-y-2">
              <h5 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedAffiliate.name} 전용 3대 시너지 혜택 상세</span>
              </h5>

              <div className="space-y-2">
                {selectedAffiliate.benefitDetails.map((b, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex justify-between items-center text-[11.5px]">
                      <span className="font-black text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {b.label}
                      </span>
                      <span className="font-black text-indigo-600">{b.value}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-600 pl-5">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 블록체인 원장 & 스마트 컨트랙트 메타데이터 */}
            <div className="bg-[#0b0f19] text-white p-3.5 rounded-2xl border border-slate-800 text-[10.5px] font-mono space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span>증권 / 인증 식별번호:</span>
                <span className="text-emerald-400 font-bold">{selectedAffiliate.policyNo}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>신한DS PoA 분산원장 Tx:</span>
                <span className="text-indigo-300 font-bold">{selectedAffiliate.contractTxHash}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-slate-400">
                <span>워커 본인 부담금:</span>
                <span className="text-emerald-400 font-black">₩0원 (100% 무상 수혜)</span>
              </div>
            </div>
          </div>

          {/* 4. 모달 하단 푸터 버튼 */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                triggerPush({
                  title: `📥 [${selectedAffiliate.name} 금융 혜택 증명서 발급]`,
                  body: `${selectedAffiliate.name} 시너지 혜택 수혜 확인서(PDF)가 신한 슈퍼SOL 보관함으로 전송되었습니다.`,
                  type: 'confirm',
                });
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 hover:brightness-105"
            >
              <Download className="w-4 h-4" />
              <span>{selectedAffiliate.name} 금융 혜택 확인서 PDF 받기</span>
            </button>
            <button
              onClick={onClose}
              className="py-3.5 px-4 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
