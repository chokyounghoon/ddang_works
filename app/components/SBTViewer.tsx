'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { simulateIPFS } from '../lib/web3';
import { buildSBTMetadata } from '../lib/contracts';
import { ShieldCheck, Lock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface SBTViewerProps {
  address: string;
  score: number;
  workerName: string;
}

const GRADE_CONFIG: Record<string, { bg: string; border: string; glow: string; badge: string; nftBg: string }> = {
  '신한인증 1등급': {
    bg: 'from-violet-950 via-indigo-950 to-slate-950',
    border: 'border-violet-500/50',
    glow: 'shadow-[0_0_40px_rgba(139,92,246,0.3)]',
    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    nftBg: '#1e1b4b',
  },
  '신한인증 2등급': {
    bg: 'from-amber-950 via-orange-950 to-slate-950',
    border: 'border-amber-500/50',
    glow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)]',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    nftBg: '#1c1500',
  },
  '신한인증 3등급': {
    bg: 'from-slate-900 via-slate-950 to-slate-950',
    border: 'border-slate-500/50',
    glow: 'shadow-[0_0_30px_rgba(148,163,184,0.15)]',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    nftBg: '#0f172a',
  },
};

function NFTCard({ sbt, config, flipped, onClick }: {
  sbt: ReturnType<typeof buildSBTMetadata>;
  config: typeof GRADE_CONFIG[string];
  flipped: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative w-full aspect-[3/4] max-w-[220px] mx-auto cursor-pointer" onClick={onClick}
      style={{ perspective: '1000px' }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}
      >
        {/* 앞면 */}
        <div
          style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
          className={`rounded-2xl bg-gradient-to-b ${config.bg} border ${config.border} ${config.glow} p-4 flex flex-col`}
        >
          {/* NFT 헤더 */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[8px] font-black text-slate-400 tracking-widest">ERC-5192 · SBT</span>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span className="text-[8px] text-slate-400">NON-TRANSFER</span>
            </div>
          </div>

          {/* 점수 표시 */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="relative">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                  strokeDasharray={`${(sbt.score / 1000) * 263.9} 263.9`}
                  strokeLinecap="round" strokeDashoffset="65.97"
                  style={{ transition: 'stroke-dasharray 1.5s ease' }}
                />
                <text x="50" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">{sbt.score}</text>
                <text x="50" y="60" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">D-GCS</text>
              </svg>
            </div>
            <span className={`text-[9px] font-black px-2 py-1 rounded-full border ${config.badge}`}>
              {sbt.grade}
            </span>
          </div>

          {/* 하단 정보 */}
          <div className="mt-2 space-y-1">
            <p className="text-[8px] text-slate-500 font-mono truncate">{sbt.owner.slice(0, 16)}…</p>
            <p className="text-[8px] text-slate-500 font-mono">Token #{sbt.tokenId}</p>
          </div>

          {/* 탭 힌트 */}
          <p className="text-[7px] text-slate-600 text-center mt-2">탭하여 메타데이터 보기</p>
        </div>

        {/* 뒷면 — JSON 메타데이터 */}
        <div
          style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}
          className="rounded-2xl bg-[#0a0e1a] border border-slate-700/60 p-3 overflow-auto"
        >
          <p className="text-[8px] font-black text-emerald-400 tracking-widest mb-2">JSON METADATA</p>
          <pre className="text-[7.5px] text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
{JSON.stringify({
  name: sbt.name,
  description: 'Shinhan D-GCS Soul-Bound Token',
  image: `ipfs://${sbt.ipfsUri.split('//')[1]}`,
  attributes: sbt.traits,
  external_url: 'https://scan.shinhan-chain.io',
  locked: true,
}, null, 2)}
          </pre>
        </div>
      </motion.div>
    </div>
  );
}

export default function SBTViewer({ address, score, workerName }: SBTViewerProps) {
  const [flipped, setFlipped] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const ipfsCid = simulateIPFS({ address, score, workerName });
  const sbt = buildSBTMetadata(address, score, ipfsCid);
  const config = GRADE_CONFIG[sbt.grade] ?? GRADE_CONFIG['신한인증 3등급'];

  const onChainEvents = [
    { event: 'Locked',   block: 18_426_881, args: `tokenId=${sbt.tokenId}` },
    { event: 'Minted',   block: 18_426_879, args: `to=${sbt.owner.slice(0, 12)}…` },
    { event: 'ScoreSet', block: 18_426_877, args: `score=${score}` },
  ];

  return (
    <div className="space-y-4">
      {/* NFT 카드 */}
      <div className="flex flex-col items-center">
        <NFTCard sbt={sbt} config={config} flipped={flipped} onClick={() => setFlipped(f => !f)} />
      </div>

      {/* IPFS 메타데이터 URI */}
      <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-700/50 space-y-2">
        <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">On-Chain 데이터</p>
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-2">
          <span className="text-[9px] text-purple-400 font-mono break-all">ipfs://{ipfsCid}</span>
          <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px]">
          <div>
            <p className="text-slate-500">컨트랙트</p>
            <p className="text-slate-300 font-mono">0xSBT…0001</p>
          </div>
          <div>
            <p className="text-slate-500">표준</p>
            <p className="text-slate-300">ERC-5192</p>
          </div>
          <div>
            <p className="text-slate-500">Token ID</p>
            <p className="text-slate-300 font-mono">#{sbt.tokenId}</p>
          </div>
          <div>
            <p className="text-slate-500">체인</p>
            <p className="text-slate-300">Shinhan PoA</p>
          </div>
        </div>
      </div>

      {/* 온체인 이벤트 로그 */}
      <button
        onClick={() => setShowEvents(v => !v)}
        className="w-full flex items-center justify-between bg-slate-900/60 border border-slate-700/40 rounded-xl px-3 py-2"
      >
        <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">온체인 이벤트 로그</span>
        {showEvents ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
      </button>
      <AnimatePresence>
        {showEvents && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0a0e1a] rounded-2xl p-3 space-y-2 border border-slate-700/50">
              {onChainEvents.map(ev => (
                <div key={ev.event} className="flex items-start gap-2 text-[9px]">
                  <span className="text-emerald-400 font-bold min-w-[56px]">{ev.event}</span>
                  <span className="text-slate-500 font-mono">Block #{ev.block.toLocaleString()}</span>
                  <span className="text-slate-600 font-mono ml-auto">{ev.args}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ZK-Proof 배지 */}
      <div className="bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-700/30 rounded-2xl p-3 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-violet-400 flex-shrink-0" />
        <div>
          <p className="text-[10px] font-black text-violet-300">영지식 증명 (ZK-Proof)</p>
          <p className="text-[9px] text-slate-400">근무 경력 증명 완료 — 실제 내용은 비공개</p>
          <p className="text-[8px] text-violet-500 mt-0.5 font-mono">zk-SNARK verified · Groth16</p>
        </div>
      </div>
    </div>
  );
}
