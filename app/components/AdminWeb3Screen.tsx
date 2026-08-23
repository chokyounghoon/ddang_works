'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Cpu, Layers, ShieldCheck, Sparkles } from 'lucide-react';

const TokenDashboard = dynamic(() => import('./TokenDashboard'), { ssr: false });
const BlockFeed = dynamic(() => import('./BlockFeed'), { ssr: false });
const SBTViewer = dynamic(() => import('./SBTViewer'), { ssr: false });

export default function AdminWeb3Screen() {
  return (
    <div className="space-y-4 font-sans pb-6">
      {/* 최상단 Web3 통제 헤더 */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-4.5 rounded-3xl text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-black">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm text-white">신한DS 메인넷 Web3 온체인 원장 총괄</h4>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PoA BLOCKCHAIN
              </span>
            </div>
            <p className="text-xs text-slate-300">SOLC 토큰 잔액, D-GCS SBT 온체인 평판 증명서, PoA 블록 생성 피드</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/30">
          Block #18.4M
        </span>
      </div>

      {/* SOLC 토큰 통계 대시보드 */}
      <TokenDashboard userBalance={48.85} address="0x71C8a9dF2309110a" />

      {/* SBT 온체인 영구 신용/보건증 뷰어 */}
      <SBTViewer address="0x71C8a9dF2309110a" score={990} workerName="조이수" />

      {/* 실시간 PoA 블록 생성 피드 */}
      <BlockFeed />
    </div>
  );
}
