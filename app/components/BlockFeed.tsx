'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { currentBlockNumber, simulateTxHash, shortenAddr } from '../lib/web3';
import { generateMockTransaction, BlockTransaction } from '../lib/contracts';

interface Block {
  number: number;
  hash: string;
  txCount: number;
  gasUsed: number;
  timestamp: number;
  transactions: BlockTransaction[];
  validator: string;
}

const VALIDATORS = ['신한은행', '신한카드', '신한투자증권', '신한라이프', '땡겨요'];
const TX_TYPES: BlockTransaction['type'][] = [
  'ESCROW_DEPOSIT', 'SETTLEMENT', 'SBT_MINT', 'TRANSFER', 'STAKE'
];

function randomValidator() {
  return VALIDATORS[Math.floor(Math.random() * VALIDATORS.length)];
}

function generateBlock(number: number): Block {
  const txCount = Math.floor(Math.random() * 8) + 1;
  const txTypes = Array.from({ length: txCount }, () =>
    TX_TYPES[Math.floor(Math.random() * TX_TYPES.length)]
  );
  const transactions = txTypes.map(type => generateMockTransaction(type));
  return {
    number,
    hash: simulateTxHash(),
    txCount,
    gasUsed: transactions.reduce((sum, tx) => sum + tx.gasUsed, 0),
    timestamp: Date.now(),
    transactions,
    validator: randomValidator(),
  };
}

const TX_TYPE_LABEL: Record<BlockTransaction['type'], { label: string; color: string }> = {
  ESCROW_DEPOSIT: { label: '에스크로 예치', color: 'text-blue-400' },
  SETTLEMENT:     { label: '정산 완료',     color: 'text-emerald-400' },
  SBT_MINT:       { label: 'SBT 발급',      color: 'text-purple-400' },
  TRANSFER:       { label: 'SOLC 전송',     color: 'text-amber-400' },
  STAKE:          { label: '스테이킹',      color: 'text-indigo-400' },
};

export default function BlockFeed({ compact = false }: { compact?: boolean }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pendingTxs, setPendingTxs] = useState<BlockTransaction[]>([]);
  const [latestBlock, setLatestBlock] = useState(currentBlockNumber());
  const initialized = useRef(false);

  // 초기 블록 3개 생성
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const start = currentBlockNumber();
    setLatestBlock(start);
    const initial = Array.from({ length: 3 }, (_, i) => generateBlock(start - (2 - i)));
    setBlocks(initial.reverse());

    // 펜딩 트랜잭션 추가
    const pending = Array.from({ length: 3 }, () => {
      const tx = generateMockTransaction(TX_TYPES[Math.floor(Math.random() * TX_TYPES.length)]);
      return { ...tx, status: 'pending' as const };
    });
    setPendingTxs(pending);
  }, []);

  // 3초마다 새 블록 생성
  useEffect(() => {
    const interval = setInterval(() => {
      const newBlockNum = currentBlockNumber();
      setLatestBlock(newBlockNum);

      // 펜딩 → 컨펌
      setPendingTxs(prev => {
        const confirmed = prev.map(tx => ({ ...tx, status: 'confirmed' as const }));
        setTimeout(() => setPendingTxs([]), 1200);
        return confirmed;
      });

      const newBlock = generateBlock(newBlockNum);
      setBlocks(prev => [newBlock, ...prev].slice(0, compact ? 3 : 5));

      // 새 펜딩 트랜잭션
      setTimeout(() => {
        const pending = Array.from({ length: Math.ceil(Math.random() * 4) }, () => {
          const tx = generateMockTransaction(TX_TYPES[Math.floor(Math.random() * TX_TYPES.length)]);
          return { ...tx, status: 'pending' as const };
        });
        setPendingTxs(pending);
      }, 1500);
    }, 3000);
    return () => clearInterval(interval);
  }, [compact]);

  if (compact) {
    return (
      <div className="bg-[#0a0e1a] rounded-2xl p-3 space-y-1.5 border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">신한 PoA 블록 스트림</span>
          <span className="text-[9px] font-black text-emerald-400 animate-pulse">● LIVE</span>
        </div>
        {blocks.slice(0, 3).map(block => (
          <div key={block.number} className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-mono">#{block.number.toLocaleString()}</span>
            <span className="text-slate-500">{block.validator}</span>
            <span className="text-emerald-400">{block.txCount} txs</span>
            <span className="text-slate-600 font-mono">{block.hash.slice(0, 8)}…</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#0a0e1a] rounded-3xl overflow-hidden border border-slate-700/60">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-black text-slate-300 tracking-wider">SHINHAN PoA MAINNET</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500">Latest Block</span>
          <span className="text-[11px] font-black text-emerald-400 font-mono">#{latestBlock.toLocaleString()}</span>
        </div>
      </div>

      {/* Mempool 펜딩 트랜잭션 */}
      {pendingTxs.length > 0 && (
        <div className="px-4 py-2 bg-amber-950/30 border-b border-amber-900/30">
          <p className="text-[9px] font-black text-amber-500 tracking-widest mb-1">⏳ MEMPOOL PENDING</p>
          <div className="space-y-1">
            <AnimatePresence>
              {pendingTxs.map((tx, i) => (
                <motion.div
                  key={`${tx.hash}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2"
                >
                  <span className={`text-[9px] font-bold ${TX_TYPE_LABEL[tx.type].color}`}>
                    {TX_TYPE_LABEL[tx.type].label}
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono">{tx.hash.slice(0, 10)}…</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black ml-auto ${
                    tx.status === 'pending' ? 'bg-amber-900/60 text-amber-400' : 'bg-emerald-900/60 text-emerald-400'
                  }`}>
                    {tx.status === 'pending' ? 'PENDING' : 'CONFIRMED'}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 블록 리스트 */}
      <div className="divide-y divide-slate-800/60">
        <AnimatePresence initial={false}>
          {blocks.map((block, idx) => (
            <motion.div
              key={block.number}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className={`px-4 py-3 ${idx === 0 ? 'bg-emerald-950/20' : ''}`}
            >
              {/* 블록 헤더 행 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-5 rounded-full ${idx === 0 ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <div>
                    <span className="text-[11px] font-black text-slate-200 font-mono">
                      #{block.number.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-500 ml-2">{block.validator} 검증</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 font-mono">{block.hash.slice(0, 14)}…</p>
                  <p className="text-[9px] text-slate-600">Gas: {block.gasUsed.toLocaleString()}</p>
                </div>
              </div>

              {/* 트랜잭션 목록 */}
              <div className="space-y-1 pl-3.5">
                {block.transactions.slice(0, 4).map((tx, j) => (
                  <div key={j} className="flex items-center gap-2 text-[9px]">
                    <span className={`font-bold ${TX_TYPE_LABEL[tx.type].color} min-w-[64px]`}>
                      {TX_TYPE_LABEL[tx.type].label}
                    </span>
                    <span className="text-slate-600 font-mono">{tx.hash.slice(0, 10)}…</span>
                    <span className="text-slate-500 ml-auto">{tx.value}</span>
                    <span className="bg-emerald-900/50 text-emerald-400 px-1 rounded text-[8px] font-black">✓</span>
                  </div>
                ))}
                {block.txCount > 4 && (
                  <p className="text-[9px] text-slate-600 pl-0">+{block.txCount - 4} 더보기…</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
