'use client';

// app/components/ShinhanSolTransferModal.tsx
// 신한 SOL뱅크 실시간 가상 계좌이체 & 공인 전자 이체확인증 (Official Certificate of Fund Transfer)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Landmark, CheckCircle2, Download, Copy, Share2, Check,
  ShieldCheck, ArrowRight, Eye, EyeOff, Building2, Sparkles,
  FileText, Clock, Receipt, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

export interface TransferData {
  txId?: string;
  senderName: string;
  senderBank: string;
  senderAccount: string;
  receiverName: string;
  receiverBank: string;
  receiverAccount: string;
  amount: number;
  fee: number;
  txHash?: string;
  storeName?: string;
  jobTitle?: string;
  timestamp?: string;
}

interface ShinhanSolTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: TransferData;
  onOpenExplorer?: (txHash: string) => void;
}

export default function ShinhanSolTransferModal({
  isOpen,
  onClose,
  data = {
    txId: 'SHB-2026-0823-9941',
    senderName: '땡겨요 WORKS 에스크로(점주 예치금)',
    senderBank: '신한은행',
    senderAccount: '100-928-381920',
    receiverName: '조이수 (워커 본인)',
    receiverBank: '신한은행 (주거래 모계좌)',
    receiverAccount: '110-482-881923',
    amount: 16000,
    fee: 0,
    txHash: '0x3a91f8c7b41e829d554a908123ef6691c781a5330e2f',
    storeName: 'CU 강남파이낸스점',
    jobTitle: '1시간 물류 하역 초단기 알바',
    timestamp: new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  },
  onOpenExplorer,
}: ShinhanSolTransferModalProps) {
  const { triggerPush } = useAppPush();
  const [copied, setCopied] = useState(false);
  const [showFullAccount, setShowFullAccount] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeView, setActiveView] = useState<'receipt' | 'sol_screen'>('receipt');

  if (!isOpen) return null;

  const handleCopyHash = () => {
    if (data.txHash) {
      navigator.clipboard?.writeText(data.txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      } catch {}
      triggerPush({
        title: '📥 [신한은행 공인 이체확인증 발급]',
        body: '신한 SOL뱅크 공인 전자 이체확인서(PDF)가 신한 슈퍼SOL 문서함에 안전하게 저장되었습니다.',
        type: 'confirm',
      });
    }, 1200);
  };

  const handleShare = () => {
    triggerPush({
      title: '📤 [이체 확인증 공유]',
      body: '카카오톡 및 문자로 신한은행 공인 전자 이체확인증 링크가 생성되었습니다.',
      type: 'confirm',
    });
  };

  const maskAccount = (acc: string) => {
    if (showFullAccount) return acc;
    if (acc.length <= 8) return acc;
    return acc.slice(0, 4) + '-***-' + acc.slice(-4);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        >
          {/* 1. 모달 헤더 (땡겨요 X 신한 블루 시그니처 듀얼 그라데이션) */}
          <div className="p-4.5 bg-gradient-to-r from-[#FB521C] via-[#FF6B3D] to-[#0046FF] text-white flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white text-lg shadow-inner border border-white/30">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30 tracking-tight">
                    땡겨요 WORKS X 신한 SOL뱅크
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-200">
                    0.1초 즉시정산 완결
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base mt-0.5 text-white tracking-tight">
                  공인 전자 이체확인증 & 입금증
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

          {/* 2. 뷰 전환 탭 (공인 확인증 서식 vs SOL 뱅킹 송금 화면) */}
          <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex gap-1 shrink-0">
            <button
              onClick={() => setActiveView('receipt')}
              className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                activeView === 'receipt'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>공인 전자 이체확인증</span>
            </button>
            <button
              onClick={() => setActiveView('sol_screen')}
              className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                activeView === 'sol_screen'
                  ? 'bg-white text-[#0046FF] shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>SOL 뱅킹 입금 내역</span>
            </button>
          </div>

          {/* 3. 모달 바디 */}
          <div className="p-4.5 overflow-y-auto space-y-4 text-xs flex-1">
            {activeView === 'receipt' ? (
              /* ══════════════════════════════════════════════════════════════
                 A. 공인 전자 이체확인증 (한국은행·신한은행 표준 공식 서식)
                 ══════════════════════════════════════════════════════════════ */
              <div className="bg-[#FAFBFD] border-2 border-blue-200 rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden">
                {/* 배경 워터마크 마크 */}
                <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.04] pointer-events-none">
                  <Landmark className="w-64 h-64 text-[#0046FF]" />
                </div>

                {/* 확인증 타이틀 & 로고 */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-[#0046FF] tracking-tight">SHINHAN BANK</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">인터넷뱅킹 공인</span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-1 tracking-tight">
                      계좌(즉시)이체 확인증
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[9.5px] text-slate-400 font-mono block">발급번호</span>
                    <span className="text-[10.5px] font-black text-slate-700 font-mono">{data.txId}</span>
                  </div>
                </div>

                {/* 이체 금액 대형 강조 */}
                <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs text-center space-y-1">
                  <span className="text-[10.5px] text-slate-500 font-bold">이체 완료 금액 (0.1초 입금)</span>
                  <div className="text-2xl font-black text-[#0046FF] tracking-tight">
                    ₩{data.amount.toLocaleString()}원
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>정상 이체 처리 완료 (이체 수수료 ₩0원 전액 면제)</span>
                  </div>
                </div>

                {/* 계좌 및 거래 상세 테이블 */}
                <div className="space-y-2 bg-white rounded-2xl p-3.5 border border-slate-200/80">
                  <div className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100">
                    <span className="text-slate-500">출금계좌 (에스크로)</span>
                    <span className="font-bold text-slate-800 text-right">
                      {data.senderBank} {maskAccount(data.senderAccount)}
                      <span className="block text-[9.5px] text-slate-400 font-normal">{data.senderName}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100">
                    <span className="text-slate-500">입금계좌 (수취인)</span>
                    <div className="text-right">
                      <span className="font-black text-[#0046FF]">
                        {data.receiverBank} {maskAccount(data.receiverAccount)}
                      </span>
                      <span className="block text-[9.5px] text-slate-500 font-bold">{data.receiverName}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100">
                    <span className="text-slate-500">근무처 및 대상 긱</span>
                    <span className="font-bold text-slate-800 text-right">
                      {data.storeName}
                      <span className="block text-[9.5px] text-slate-400 font-normal">{data.jobTitle}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100">
                    <span className="text-slate-500">이체 처리일시</span>
                    <span className="font-mono text-slate-700">{data.timestamp}</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] py-1">
                    <span className="text-slate-500">이체 방식 / 경로</span>
                    <span className="font-bold text-indigo-700">
                      신한 BaaS S-BRIDGE 0.1s 즉시망
                    </span>
                  </div>
                </div>

                {/* 계좌 마스킹 토글 & 직인 영역 */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setShowFullAccount(!showFullAccount)}
                    className="flex items-center gap-1.5 text-[10.5px] text-slate-500 hover:text-blue-600 font-bold"
                  >
                    {showFullAccount ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showFullAccount ? '계좌번호 마스킹' : '전체 계좌번호 표시'}</span>
                  </button>

                  {/* 신한은행장 직인 시뮬레이션 */}
                  <div className="flex items-center gap-2">
                    <div className="text-right text-[9.5px] text-slate-500 font-medium">
                      <span>주식회사 신한은행</span>
                      <span className="block font-bold text-slate-700">디지털영업부장</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center text-red-600 font-black text-[9px] rotate-[-8deg] shadow-xs select-none bg-red-50/50">
                      신한은행<br />직인
                    </div>
                  </div>
                </div>

                {/* 신한DS 분산원장 블록체인 해시 바이트 */}
                {data.txHash && (
                  <div className="bg-[#0b0f19] text-white p-3 rounded-2xl border border-slate-800 text-[10px] space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-mono">신한DS PoA 분산원장 트랜잭션:</span>
                      <button
                        onClick={handleCopyHash}
                        className="text-indigo-300 hover:text-white flex items-center gap-1 font-mono"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? '복사완료' : 'Hash 복사'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-indigo-300 break-all text-[9.5px] leading-tight">
                      {data.txHash}
                    </p>
                    {onOpenExplorer && (
                      <button
                        onClick={() => onOpenExplorer(data.txHash!)}
                        className="w-full mt-1 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 rounded-xl text-indigo-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>신한 온체인 블록 익스플로러에서 검증하기</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* ══════════════════════════════════════════════════════════════
                 B. SOL 뱅킹 모바일 입금 확인 화면 (Shinhan SOL App Look & Feel)
                 ══════════════════════════════════════════════════════════════ */
              <div className="bg-[#F2F5FA] rounded-3xl p-5 space-y-4 border border-blue-100">
                {/* SOL 앱 상단 알림 바 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#0046FF] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      SOL
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">신한 SOL뱅크 알림</span>
                      <h5 className="font-black text-xs text-slate-900">
                        [입금 ₩{data.amount.toLocaleString()}원] {data.storeName}
                      </h5>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-xs">
                      <span>입금 금액</span>
                      <span className="text-[#0046FF] font-black">+₩{data.amount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500">
                      <span>입금 후 잔액</span>
                      <span className="font-black text-slate-900">₩1,842,500원</span>
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500">
                      <span>입금 계좌</span>
                      <span>신한 110-482-****** (조이수)</span>
                    </div>
                  </div>
                </div>

                {/* 원신한 금융 우대 혜택 뱃지 */}
                <div className="space-y-2">
                  <h6 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>이번 즉시정산으로 자동 적용된 신한은행 혜택</span>
                  </h6>

                  <div className="space-y-1.5">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-bold">급여이체 실적 100% 인정</span>
                      <span className="text-blue-600 font-black">적금 금리 +0.5%p</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-bold">체류 잔액 일복리 파킹</span>
                      <span className="text-emerald-600 font-black">연 2.8% 매일 이자</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700 font-bold">이체·ATM 출금 수수료</span>
                      <span className="text-indigo-600 font-black">무제한 면제</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. 모달 하단 액션 버튼 */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#0046FF] to-[#0038CC] text-white font-black text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 hover:brightness-105"
            >
              {downloading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{downloading ? '확인서 생성 중...' : '공인 이체확인증 PDF 다운로드'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="확인증 공유하기"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="py-3 px-4 rounded-2xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
