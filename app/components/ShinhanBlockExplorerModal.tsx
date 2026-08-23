'use client';

// app/components/ShinhanBlockExplorerModal.tsx
// 신한DS PoA 분산원장 블록체인 온체인 익스플로러 (Shinhan Consortium Mainnet Explorer)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Cpu, CheckCircle2, Copy, Check, ExternalLink, Search,
  ShieldCheck, Layers, ArrowRight, Activity, Clock, Box,
  FileCode, Database, Landmark, CreditCard, TrendingUp, Store
} from 'lucide-react';
import { useAppPush } from './AppPushToast';

interface ShinhanBlockExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTxHash?: string;
}

export default function ShinhanBlockExplorerModal({
  isOpen,
  onClose,
  initialTxHash = '0x3a91f8c7b41e829d554a908123ef6691c781a5330e2f',
}: ShinhanBlockExplorerModalProps) {
  const { triggerPush } = useAppPush();
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialTxHash);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'consensus'>('overview');

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const txDetails = {
    hash: initialTxHash,
    status: 'Success (0.1s 즉시 완결)',
    blockNumber: 18429812,
    blockConfirmations: '142 Blocks Confirmed',
    timestamp: new Date().toLocaleTimeString('ko-KR') + ' (방금 전)',
    from: '0x8b327F8549C...4829 (CU 강남파이낸스점 에스크로)',
    to: '0xS-BRIDGE...0001 (신한DS BaaS 스마트 컨트랙트)',
    interactedWith: 'ShinhanSettlementV3 (0x77c9...aa12)',
    value: '₩16,000원 (16.0 SOLC)',
    transactionFee: '₩0원 (신한DS Gov-Tech 인프라 100% 무상 후원)',
    gasUsed: '84,210 Gas (Limit: 120,000)',
    method: 'instantSettle(bytes32 gigId, address worker, uint256 pay)',
    zkProof: 'zk-SNARK Groth16 (근무 GPS 및 생체 출퇴근 영지식 검증 완료)',
    merkleRoot: '0x88f1a9420b9c3e...d82a',
  };

  const decodedEvents = [
    {
      name: 'SettlementDistributed',
      contract: 'ShinhanSettlementV3',
      params: [
        { name: 'gigId', type: 'bytes32', value: '0xcu_gn_20260823_1h_001' },
        { name: 'worker', type: 'address', value: '0x71C4B...38A9 (조이수)' },
        { name: 'grossPay', type: 'uint256', value: '16,000 KRW' },
        { name: 'workerFee', type: 'uint256', value: '0 KRW (면제)' },
        { name: 'netPay', type: 'uint256', value: '16,000 KRW' },
      ],
    },
    {
      name: 'DGCSReputationUpdated',
      contract: 'ShinhanSBTRegistry',
      params: [
        { name: 'tokenId', type: 'uint256', value: '#8421' },
        { name: 'previousScore', type: 'uint16', value: '970' },
        { name: 'newScore', type: 'uint16', value: '980 (+10p 노쇼0건/정시출퇴근)' },
        { name: 'grade', type: 'string', value: '신한인증 1등급 (최우수)' },
      ],
    },
    {
      name: 'EZInsuranceActivated',
      contract: 'ShinhanEZMicroCover',
      params: [
        { name: 'policyId', type: 'string', value: 'EZ-2026-GIG-0823-CU' },
        { name: 'coverageAmount', type: 'uint256', value: '10,000,000 KRW' },
        { name: 'premiumPaid', type: 'uint256', value: '200 KRW (점주 수수료 지원)' },
      ],
    },
    {
      name: 'LifePensionAccumulated',
      contract: 'ShinhanLifeMicroPension',
      params: [
        { name: 'pensionFund', type: 'uint256', value: '160 KRW (일당 1% 자동적립)' },
        { name: 'totalBalance', type: 'uint256', value: '12,560 KRW' },
      ],
    },
  ];

  const validatorNodes = [
    { name: '신한은행 메인 검증 노드 #1', ip: '10.120.44.1', state: 'Active (100%)', icon: Landmark, color: '#0046FF' },
    { name: '신한카드 결제 검증 노드 #2', ip: '10.120.44.2', state: 'Active (100%)', icon: CreditCard, color: '#EC4899' },
    { name: '신한투자증권 MTS 노드 #3', ip: '10.120.44.3', state: 'Active (100%)', icon: TrendingUp, color: '#8B5CF6' },
    { name: '신한DS 코어 합의 노드 #4', ip: '10.120.44.4', state: 'Leader (0.1s)', icon: Cpu, color: '#0F172A' },
    { name: '땡겨요 플랫폼 오라클 #5', ip: '10.120.44.5', state: 'Active (100%)', icon: Store, color: '#FB521C' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0b0f19] rounded-3xl shadow-2xl border border-indigo-500/30 max-w-2xl w-full overflow-hidden text-white flex flex-col max-h-[92vh]"
        >
          {/* 1. 모달 헤더 (Etherscan & Shinhan PoA 스타일) */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-black text-indigo-300 shadow-inner">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                    ShinhanDS PoA Mainnet
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Block #18,429,812
                  </span>
                </div>
                <h3 className="font-black text-sm mt-0.5 text-white tracking-tight">
                  신한 분산원장 블록체인 익스플로러 (On-Chain Scan)
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. 상단 온체인 검색창 & 탭 스위처 */}
          <div className="bg-slate-950 p-3 border-b border-slate-800/80 space-y-2 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tx Hash, Block, Account, Contract 주소 검색..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 pl-9 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                트랜잭션 개요
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'events'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>이벤트 로그 (4)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </button>
              <button
                onClick={() => setActiveTab('consensus')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'consensus'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                PoA 검증 노드 (5)
              </button>
            </div>
          </div>

          {/* 3. 모달 바디 */}
          <div className="p-4.5 overflow-y-auto space-y-4 text-xs flex-1 font-mono">
            {activeTab === 'overview' && (
              <div className="space-y-3">
                {/* 상태 요약 배너 */}
                <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{txDetails.status}</h4>
                      <p className="text-[10px] text-slate-400">{txDetails.blockConfirmations}</p>
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Finalized in 0.1s
                  </span>
                </div>

                {/* 트랜잭션 메타데이터 테이블 */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-[11px]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-800/80 gap-1">
                    <span className="text-slate-400">Transaction Hash:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-indigo-300 font-bold break-all">{txDetails.hash}</span>
                      <button
                        onClick={() => handleCopy(txDetails.hash, 'hash')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copied === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Block / Timestamp:</span>
                    <span className="text-slate-200">
                      Block #{txDetails.blockNumber.toLocaleString()} · {txDetails.timestamp}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Method Invoked:</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                      {txDetails.method}
                    </span>
                  </div>

                  <div className="flex flex-col py-1 border-b border-slate-800/80 gap-0.5">
                    <span className="text-slate-400">From (점주 에스크로):</span>
                    <span className="text-slate-200">{txDetails.from}</span>
                  </div>

                  <div className="flex flex-col py-1 border-b border-slate-800/80 gap-0.5">
                    <span className="text-slate-400">To (S-BRIDGE 스마트 컨트랙트):</span>
                    <span className="text-indigo-300 font-bold">{txDetails.to}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Value (지급 알바비):</span>
                    <span className="text-white font-black text-sm">{txDetails.value}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Gas Fee (신한 후원):</span>
                    <span className="text-emerald-400 font-bold">{txDetails.transactionFee}</span>
                  </div>
                </div>

                {/* ZK-Proof 영지식 증명 블록 */}
                <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>영지식 증명 (ZK-SNARKs Groth16) 검증</span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-sans">
                    알바생의 개인정보 및 실시간 GPS 동선은 블록체인에 노출되지 않고 오직 <strong>근태 성실성 참(True/False)</strong> 여부만 암호학적으로 검증되어 온체인에 영구 박제되었습니다.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-3">
                <div className="text-[10.5px] text-slate-400 font-sans">
                  💡 트랜잭션 실행 중 발생한 <strong>4대 신한 금융 스마트 컨트랙트 실시간 이벤트 로그</strong>입니다.
                </div>

                <div className="space-y-2.5">
                  {decodedEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2 hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-indigo-300 text-xs">{evt.name}</span>
                        </div>
                        <span className="text-[9.5px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {evt.contract}
                        </span>
                      </div>

                      <div className="space-y-1 pl-2">
                        {evt.params.map((p, pIdx) => (
                          <div key={pIdx} className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">{p.name} ({p.type}):</span>
                            <span className="text-slate-200 font-bold">{p.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'consensus' && (
              <div className="space-y-3">
                <div className="text-[10.5px] text-slate-400 font-sans">
                  신한금융그룹 5대 합의 검증 노드가 0.1초 만에 PoA(권한증명) 합의를 완료하여 트랜잭션 완결성을 보증합니다.
                </div>

                <div className="space-y-2">
                  {validatorNodes.map((node, idx) => {
                    const NodeIcon = node.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                            style={{ backgroundColor: node.color }}
                          >
                            <NodeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-white">{node.name}</h5>
                            <span className="text-[9.5px] text-slate-500 font-mono">Node IP: {node.ip}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          {node.state}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. 모달 하단 버튼 */}
          <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-slate-500 font-mono">
              Network: Shinhan-DS-PoA-ChainId: 88102
            </span>
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
