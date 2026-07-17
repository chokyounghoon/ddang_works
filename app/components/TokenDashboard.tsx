'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, BarChart3, Lock, ArrowUpRight } from 'lucide-react';
import { SOLC_KRW_RATE } from '../lib/web3';
import { SOLC_TOKENOMICS as T } from '../lib/contracts';


interface TokenDashboardProps {
  userBalance: number;
  address: string | null;
}

function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '' }: {
  value: number; decimals?: number; prefix?: string; suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = display;
    const end = value;
    const dur = 800;
    const startTime = Date.now();
    const frame = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(start + (end - start) * eased);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value]);
  return <>{prefix}{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

const DISTRIBUTION = [
  { label: '워커 리워드', pct: 55, color: '#6366f1', detail: '55,000,000 SOLC' },
  { label: '에코시스템',  pct: 25, color: '#06b6d4', detail: '25,000,000 SOLC' },
  { label: '재단 보유',   pct: 20, color: '#8b5cf6', detail: '20,000,000 SOLC' },
];

function DonutChart({ data }: { data: typeof DISTRIBUTION }) {
  const size = 120;
  const r = 46;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const segments = data.map(d => {
    const len = (d.pct / 100) * circumference;
    const seg = { ...d, dashArray: `${len} ${circumference - len}`, dashOffset: -offset };
    offset += len;
    return seg;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
      {segments.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth="20"
          strokeDasharray={s.dashArray}
          strokeDashoffset={s.dashOffset}
          strokeLinecap="butt"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dasharray 1s ease' }}
        />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="900">SOLC</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">100M</text>
    </svg>
  );
}

export default function TokenDashboard({ userBalance, address }: TokenDashboardProps) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [staked, setStaked] = useState(0);
  const [isStaking, setIsStaking] = useState(false);
  const [stakedAt, setStakedAt] = useState<Date | null>(null);

  const userKRW = userBalance * SOLC_KRW_RATE;
  const stakedEarnings = staked * (T.stakingApy / 100) * (1 / 365);

  const handleStake = async () => {
    const amt = parseFloat(stakeAmount);
    if (!amt || amt > userBalance) return;
    setIsStaking(true);
    await new Promise(r => setTimeout(r, 1000));
    setStaked(s => s + amt);
    setStakedAt(new Date());
    setStakeAmount('');
    setIsStaking(false);
  };

  return (
    <div className="space-y-4">
      {/* 내 지갑 요약 */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 rounded-2xl p-4 border border-indigo-700/30">
        <p className="text-[9px] font-black text-indigo-400 tracking-widest uppercase mb-3">내 SOLC 지갑</p>
        <div className="flex items-end gap-2 mb-1">
          <span className="text-3xl font-black text-white">
            <AnimatedNumber value={userBalance} decimals={2} />
          </span>
          <span className="text-indigo-400 font-bold mb-1">SOLC</span>
          <span className={`ml-auto text-xs font-black flex items-center gap-0.5 ${T.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {T.priceChange24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {T.priceChange24h >= 0 ? '+' : ''}{T.priceChange24h}%
          </span>
        </div>
        <p className="text-sm text-slate-400">≈ ₩<AnimatedNumber value={userKRW} /></p>
        {address && (
          <p className="text-[9px] text-slate-600 font-mono mt-2">{address.slice(0, 20)}…</p>
        )}
      </div>

      {/* 시장 지표 */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '가격', value: `₩${T.priceKRW.toLocaleString()}`, sub: 'per SOLC' },
          { label: '시가총액', value: `₩${(T.marketCapKRW / 1_000_000).toFixed(0)}M`, sub: 'Market Cap' },
          { label: '24h 거래량', value: `₩${(T.volume24hKRW / 1_000_000).toFixed(0)}M`, sub: 'Volume' },
          { label: '유통 공급량', value: `${(T.circulating / 1_000_000).toFixed(1)}M`, sub: `${((T.circulating / T.totalSupply) * 100).toFixed(1)}% of Total` },
        ].map(item => (
          <div key={item.label} className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-2.5">
            <p className="text-[9px] text-slate-500">{item.label}</p>
            <p className="text-sm font-black text-slate-200">{item.value}</p>
            <p className="text-[8px] text-slate-600">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* 토큰 분배 */}
      <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-4">
        <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-3">토큰 분배 (Total 100M SOLC)</p>
        <div className="flex items-center gap-4">
          <DonutChart data={DISTRIBUTION} />
          <div className="flex-1 space-y-2">
            {DISTRIBUTION.map(d => (
              <div key={d.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-300">{d.label}</span>
                    <span className="text-[10px] font-black text-slate-200">{d.pct}%</span>
                  </div>
                  <p className="text-[8px] text-slate-600">{d.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 스테이킹 패널 */}
      <div className="bg-gradient-to-br from-violet-950/40 to-slate-950 border border-violet-700/30 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-violet-400 tracking-widest uppercase">SOLC 스테이킹</p>
            <p className="text-xs text-slate-300 font-bold">연 APY {T.stakingApy}%</p>
          </div>
          <div className="bg-violet-500/20 border border-violet-500/40 rounded-xl px-3 py-1.5 text-right">
            <p className="text-[9px] text-violet-400">스테이킹 중</p>
            <p className="text-sm font-black text-violet-300">{staked.toFixed(2)} SOLC</p>
          </div>
        </div>

        {staked > 0 && (
          <div className="bg-emerald-950/30 border border-emerald-700/30 rounded-xl p-2.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">오늘 예상 수익</span>
              <span className="text-emerald-400 font-black">+{stakedEarnings.toFixed(4)} SOLC</span>
            </div>
            {stakedAt && (
              <p className="text-[8px] text-slate-600 mt-0.5">
                스테이킹 시작: {stakedAt.toLocaleTimeString('ko-KR')}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="number"
            value={stakeAmount}
            onChange={e => setStakeAmount(e.target.value)}
            placeholder="수량 입력"
            className="flex-1 bg-slate-800/60 border border-slate-600/40 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/60"
          />
          <button
            onClick={handleStake}
            disabled={isStaking || !stakeAmount}
            className="px-4 py-2 bg-violet-600 disabled:opacity-40 text-white font-black text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1"
          >
            {isStaking ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <><Lock className="w-3.5 h-3.5" /> 스테이킹</>
            )}
          </button>
        </div>
        <p className="text-[8px] text-slate-600 text-center">
          스테이킹 트랜잭션은 신한 PoA 체인에 기록됩니다
        </p>
      </div>

      {/* Burn 통계 */}
      <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-3 flex items-center gap-3">
        <Zap className="w-8 h-8 text-orange-400 flex-shrink-0" />
        <div>
          <p className="text-[10px] font-black text-orange-400">소각(Burn) 현황</p>
          <p className="text-sm font-black text-slate-200">{T.burned.toLocaleString()} SOLC</p>
          <p className="text-[9px] text-slate-500">총 발행량의 {((T.burned / T.totalSupply) * 100).toFixed(4)}% 소각</p>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-600 ml-auto" />
      </div>
    </div>
  );
}
