'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Sparkles, CreditCard, Landmark, Cpu, User,
  Store, DollarSign, CheckCircle2, ArrowUpRight, MapPin,
  Clock, CloudRain, Zap, ChevronRight, TrendingUp,
  Banknote, Trophy, Flame, BarChart3, Lock, Unlock,
  AlertCircle, ChevronDown, Copy, LogOut, ExternalLink,
  Coins, Activity, Layers,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useWallet } from './hooks/useWallet';
import { simulateTxHash } from './lib/web3';
import confetti from 'canvas-confetti';

const RevenueDashboard = dynamic(() => import('./components/RevenueDashboard'), { ssr: false });
const AIAgentScreen    = dynamic(() => import('./components/AIAgentScreen'),    { ssr: false });
const DGCSScreen       = dynamic(() => import('./components/DGCSScreen'),       { ssr: false });
const GigMapView       = dynamic(() => import('./components/GigMapView'),       { ssr: false });
const BlockFeed        = dynamic(() => import('./components/BlockFeed'),        { ssr: false });
const SBTViewer        = dynamic(() => import('./components/SBTViewer'),        { ssr: false });
const TokenDashboard   = dynamic(() => import('./components/TokenDashboard'),   { ssr: false });
const LiveMatchingBoard = dynamic(() => import('./components/LiveMatchingBoard'), { ssr: false });

// ─── 공통 서브 컴포넌트 ──────────────────────────────────────────────────────

const TrustBadge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border ${color}`}>
    <ShieldCheck className="w-3 h-3" /> {label}
  </span>
);

const GaugeBar = ({ label, value, max, color, suffix = '' }: {
  label: string; value: number; max: number; color: string; suffix?: string;
}) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="text-xs font-black text-slate-800">{value}{suffix}</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  </div>
);

// ─── TAB 1: AI 매칭 ─────────────────────────────────────────────────────────

function AgentTab() {
  const [messages, setMessages] = useState<{role: 'assistant'|'user', text: string}[]>([
    { role: 'assistant', text: '이지성님, 안녕하세요! 원하시는 알바 조건(지역, 직종, 시간 등)을 편하게 말씀해 주시면 딱 맞는 긱(Gig)을 즉시 찾아드릴게요. (예: "부평지역 서빙 알바 있어?")' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedGig, setRecommendedGig] = useState<any>(null);
  const [initialCenter, setInitialCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);

  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    
    const userText = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputText('');
    setIsTyping(true);
    setIsApplied(false); // reset apply state for new search

    // 1.5초 로딩 시뮬레이션
    await new Promise(r => setTimeout(r, 1500));

    let aiResponse = '';
    let gig = null;

    if (userText.includes('부평') || userText.includes('서빙')) {
      aiResponse = '네, 부평지역에 딱 맞는 서빙 알바를 찾았습니다! 오늘 18시부터 근무 가능하며, 급구라 시급도 높습니다. 아래 지도에서 공고를 확인해 보세요.';
      gig = { title: '하남돼지집 부평역점', wage: 14500, time: '18:00–22:00 (4h)', surge: true, loc: '부평역 5번 출구 도보 3분', tag: '우대 시급 적용' };
      setInitialCenter({ lat: 37.4407168, lng: 126.746624 });
    } else {
      aiResponse = '요청하신 조건에 맞는 최고의 알바를 찾았습니다! 현재 아이패드 프로 목표 달성을 위해 수익률이 가장 높은 스케줄을 추천해 드립니다.';
      gig = { title: '스타벅스 강남2호점', wage: 12500, time: '14:00–18:00 (4h)', surge: false, loc: '강남역 2번 출구 도보 11분', tag: '목표 달성 추천' };
      setInitialCenter({ lat: 37.4979, lng: 127.0276 });
    }

    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    setRecommendedGig(gig);
    setIsTyping(false);
  };

  const handleApply = async () => {
    setIsApplying(true);
    // 에스크로 연동 시뮬레이션
    await new Promise(r => setTimeout(r, 1200));
    setIsApplying(false);
    setIsApplied(true);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* 대화형 AI 매칭 비서 */}
      <div className="bg-[#0F172A] p-4 rounded-3xl shadow-xl flex flex-col h-[320px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#0052FF] opacity-15 rounded-full blur-3xl pointer-events-none" />
        
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-4 shrink-0">
          <div className="bg-blue-500/20 p-2 rounded-xl">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-[12px] font-black text-white tracking-wider">땡겨요 웍스 AI 매칭 비서</span>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 text-slate-400 p-3 rounded-2xl rounded-tl-sm text-xs flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-150" />
                </span>
                AI가 딱 맞는 알바를 찾는 중...
              </div>
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <form onSubmit={handleSend} className="mt-3 shrink-0 relative">
          <input 
            type="text" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="부평지역 서빙 알바 찾아줘..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 text-white w-9 rounded-full flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* 지도 영역 */}
      <div className="h-[480px] rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative">
        <GigMapView initialCenter={initialCenter} />
      </div>
    </div>
  );
}


// ─── TAB 2: 점주 대시보드 ────────────────────────────────────────────────────

function EmployerTab({ matched, setMatched }: { matched: boolean; setMatched: React.Dispatch<React.SetStateAction<boolean>> }) {

  return (
    <div className="space-y-4 pb-6">
      {/* 점주 헤더 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">S</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Employer Dashboard</p>
          <h3 className="font-black text-base text-slate-900">스타벅스 강남2호점</h3>
          <p className="text-xs text-slate-400">AI 예측 정확도 99.2%</p>
        </div>
      </div>

      {/* 노쇼 예측 카드 */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-sm p-5 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl tracking-wider">
          Punctual Score 98%
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center font-black text-xl text-slate-700 border-2 border-slate-200">이</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-black text-base text-slate-900">이지성</h4>
              <TrustBadge label="Gold 등급" color="text-amber-700 bg-amber-50 border-amber-200" />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />매장까지 800m · 에스크로 잠금 확인
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <GaugeBar label="노쇼 리스크" value={2}   max={100}  color="bg-emerald-500" suffix="%" />
          <GaugeBar label="ACS 신용점수" value={637} max={1000} color="bg-blue-500" />
          <GaugeBar label="출근 정시율"  value={98}  max={100}  color="bg-indigo-500" suffix="%" />
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 leading-relaxed">
          ✨ <strong>AI 인텔리전스:</strong> 최근 3개월 노쇼 0.02%. 에스크로 보증금 잠금 + 리스크 ≤2% → 매칭 확정 권장.
        </div>
      </div>

      {/* 에스크로 노쇼 차단 패널 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div>
          <p className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase mb-1">킬러 기능 · 에스크로 차단</p>
          <h4 className="font-black text-base text-slate-900">계정 정지가 아닌 '돈'으로 묶는다</h4>
          <p className="text-xs text-slate-400 mt-0.5">금융사 독점 노쇼 원천 차단 시스템</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { Icon: Store,             label: '점주 예치',   sub: '₩52,500', c: 'text-slate-700',   bg: 'bg-slate-50',   b: 'border-slate-200', ok: true },
            { Icon: matched ? Unlock : Lock, label: matched ? '해제' : '에스크로 잠금', sub: matched ? '✓' : '즉시', c: matched ? 'text-emerald-600' : 'text-blue-600', bg: matched ? 'bg-emerald-50' : 'bg-blue-50', b: matched ? 'border-emerald-200' : 'border-blue-200', ok: matched },
            { Icon: User,              label: '알바생 수령', sub: matched ? '₩50,000' : '대기', c: matched ? 'text-emerald-600' : 'text-slate-400', bg: 'bg-slate-50', b: 'border-slate-200', ok: matched },
          ].map(({ Icon, label, sub, c, bg, b, ok }) => (
            <div key={label} className={`${bg} rounded-2xl p-3 border ${b}`}>
              <Icon className={`w-6 h-6 mx-auto mb-1.5 ${c}`} />
              <p className={`font-black text-[10px] ${c}`}>{label}</p>
              <p className="text-slate-400 text-[9px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {!matched ? (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                매칭 확정 즉시 <strong>₩52,500</strong>이 신한은행 에스크로에 예치됩니다.
                <br />
                (알바비 원금 ₩50,000 + <strong>5% 시너지 수수료 ₩2,500</strong>)
              </p>
            </div>
            <div className="text-[10px] text-slate-500 bg-white/60 p-2.5 rounded-xl border border-blue-100/40 leading-normal space-y-1">
              <p className="font-bold text-slate-700">💡 5% 시너지 수수료 용도:</p>
              <ul className="list-disc pl-3 space-y-0.5">
                <li>신한라이프 초단기 상해보험료 지원 (₩300)</li>
                <li>신한DS BaaS API 이용 게이트웨이 수수료 (₩200)</li>
                <li>신한투자증권 끝전 소액 ETF 매칭 적립금 (₩850)</li>
                <li>신한은행 예치금 관리 및 이체 연계 (₩1,150)</li>
              </ul>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <p className="text-xs text-emerald-700 font-bold">퇴근 완료 → 에스크로 해제: 알바생 ₩50,000 송금 & 5% 수수료 집행</p>
          </motion.div>
        )}

        <button
          onClick={() => setMatched(m => !m)}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-[0.98] ${
            matched ? 'bg-slate-100 text-slate-500' : 'bg-[#0052FF] text-white shadow-[0_4px_24px_rgba(0,82,255,0.25)]'
          }`}
        >
          {matched ? '초기화 (다시 보기)' : '매칭 확정 → 에스크로 잠금 실행'}
        </button>
      </div>
    </div>
  );
}

// ─── PoA 합의 시뮬레이터 ──────────────────────────────────────────────────

function TerminalLine({ text, trigger, delay }: { text: string; trigger: boolean; delay: number }) {
  const [visibleText, setVisibleText] = useState('');
  
  useEffect(() => {
    if (!trigger) {
      setVisibleText('');
      return;
    }
    
    const timer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setVisibleText(text.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 15); // Fast typing speed
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [trigger, text, delay]);

  if (!visibleText) return null;

  return (
    <div className="text-emerald-400 font-mono font-bold tracking-tight">
      {visibleText}
      {visibleText.length === text.length && visibleText === text[text.length-1] && (
        <span className="animate-pulse">_</span>
      )}
    </div>
  );
}

function PoAConsensusRadar({ step }: { step: number }) {
  const [consensusActive, setConsensusActive] = useState(false);
  const [consensusDone, setConsensusDone] = useState(false);

  useEffect(() => {
    if (step >= 2) {
      setConsensusActive(true);
      // Nodes turn green after particles hit (approx 0.6s)
      const t = setTimeout(() => {
        setConsensusDone(true);
      }, 700);
      return () => clearTimeout(t);
    } else {
      setConsensusActive(false);
      setConsensusDone(false);
    }
  }, [step]);

  const nodes = [
    { name: '신한은행', icon: Landmark, cx: 150, cy: 50 },
    { name: '신한카드', icon: CreditCard, cx: 245, cy: 119 },
    { name: '신한투자증권', icon: TrendingUp, cx: 209, cy: 231 },
    { name: '신한라이프', icon: ShieldCheck, cx: 91, cy: 231 },
    { name: '땡겨요', icon: Store, cx: 55, cy: 119 },
  ];

  const terminalLines = [
    "> 합의 알고리즘: PoA (Proof of Authority) - 신한 컨소시엄",
    "> Block Time: 0.1s (초고속 즉시 완결성)",
    "> Network Gas Fee: ₩0 (신한DS 메인넷 무상 처리)",
    "> Status: 스마트 컨트랙트 실행 및 원장 기록 확정",
  ];

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      {/* Title */}
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Shinhan Consortium Mainnet</p>
        <h3 className="text-lg font-black text-white">신한 PoA 컨소시엄 합의 중</h3>
        <p className="text-xs text-slate-400">S-BRIDGE 스마트 정산 원장 기록 블록체인 검증</p>
      </div>

      {/* Pentagon Radar SVG */}
      <div className="relative w-[300px] h-[300px] bg-slate-950/40 rounded-full border border-indigo-500/10 flex items-center justify-center overflow-hidden">
        {/* Background Radar Rings */}
        <div className="absolute inset-4 border border-indigo-500/5 rounded-full animate-pulse" />
        <div className="absolute inset-16 border border-indigo-500/5 rounded-full" />
        <div className="absolute inset-28 border border-indigo-500/5 rounded-full" />

        <svg className="w-full h-full absolute inset-0 z-10 pointer-events-none">
          {/* Connection Lines from center (150, 150) */}
          {nodes.map((node, i) => {
            const isTargetGreen = consensusDone;
            return (
              <g key={i}>
                {/* Connecting Line */}
                <motion.line
                  x1={150}
                  y1={150}
                  x2={node.cx}
                  y2={node.cy}
                  stroke={isTargetGreen ? "#10b981" : "#4f46e5"}
                  strokeWidth={1.5}
                  strokeOpacity={isTargetGreen ? 0.8 : 0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                
                {/* Flying Particle */}
                {!isTargetGreen && consensusActive && (
                  <motion.circle
                    cx={150}
                    cy={150}
                    r={3.5}
                    fill="#38bdf8"
                    initial={{ cx: 150, cy: 150 }}
                    animate={{ cx: node.cx, cy: node.cy }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: 0.2
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* S-BRIDGE Center Node */}
          <div 
            className="absolute top-[126px] left-[126px] w-12 h-12 bg-indigo-950/80 border-2 border-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] cursor-default pointer-events-auto"
            title="S-BRIDGE (신한DS)"
          >
            <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>

          {/* Pentagon Nodes */}
          {nodes.map((node, i) => {
            const Icon = node.icon;
            const isGreen = consensusDone;
            return (
              <div
                key={i}
                style={{ 
                  left: node.cx - 20, 
                  top: node.cy - 20, 
                }}
                className={`absolute w-10 h-10 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 pointer-events-auto cursor-default ${
                  isGreen 
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] text-emerald-400' 
                    : 'bg-slate-900/80 border-indigo-500/30 text-indigo-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[7px] font-black absolute -bottom-4 text-slate-400 whitespace-nowrap">
                  {node.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Receipt Window */}
      <div className="w-full bg-[#05070c] border border-slate-800 rounded-2xl p-4 font-mono text-[9px] text-left leading-relaxed space-y-1 shadow-inner h-[90px] relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex gap-1.5 mb-2 pb-1.5 border-b border-slate-900">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <span className="text-[8px] text-slate-600 ml-1">Shinhan PoA Consortium Mainnet Terminal</span>
        </div>

        {/* Lines */}
        <div className="space-y-1">
          {terminalLines.map((line, idx) => (
            <TerminalLine 
              key={idx} 
              text={line} 
              trigger={step >= 2} 
              delay={idx * 0.4} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB 3: 1초 정산 ─────────────────────────────────────────────────────────

function CheckoutTab({ walletConnected, walletAddress, solcBalance, setSolcBalance }: { walletConnected: boolean; walletAddress: string; solcBalance: number; setSolcBalance: any }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState<number>(0);
  const [hashingText, setHashingText] = useState<string>('');

  useEffect(() => {
    let interval: any;
    if (checkoutStep === 3) {
      interval = setInterval(() => {
        setHashingText('0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''));
      }, 60);
    }
    return () => clearInterval(interval);
  }, [checkoutStep]);

  const doCheckout = async () => {
    setLoading(true);
    setResult(null);
    setCheckoutStep(1); // Step 1: S-BRIDGE Oracle 노드 검증
    
    // Animate Web3 Flow
    await new Promise(r => setTimeout(r, 1200));
    setCheckoutStep(2); // Step 2: Smart Contract 호출 및 서명

    await new Promise(r => setTimeout(r, 1200));
    setCheckoutStep(3); // Step 3: 토크노믹스 분배

    await new Promise(r => setTimeout(r, 1500));
    
    const mockResult = {
      success: true,
      txId: `TX-SH-${Math.floor(Math.random()*9000)+1000}`,
      txHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      blockNumber: 12409823,
      timestamp: new Date().toISOString(),
      financialImpact: {
        grossPay: 50000,
        netDeposit: 49850,
        breakdown: {
          bank: {
            title: '신한은행',
            color: '#0052FF',
            value: '₩49,850 즉시 이체 완료',
            revenuePerTx: 1500,
            metrics: { pgFeeSaved: 1500, cacSaved: 15000, rpProfit: 0.15 },
            description: 'PG 수수료 ₩1,500 절감 (3% → 0%)',
          },
          card: {
            title: '신한카드',
            color: '#EC4899',
            value: 'ACS +5점 업데이트',
            revenuePerTx: 2.7,
            metrics: { acsDataValue: 2.7, creditUp: 5, loanLimit: 500000 },
            description: '대안신용 데이터 ₩2.7/건 수익화',
          },
          life: {
            title: '신한라이프',
            color: '#10B981',
            value: '상해보험료 ₩302 직납 완료',
            revenuePerTx: 302,
            metrics: { premium: 302, ratePerHour: 75, commissionSaved: 0 },
            description: '설계사 수수료 0원, 전액 직납 수익',
          },
          invest: {
            title: '신한투자증권',
            color: '#F59E0B',
            value: '끝전 ₩850 ETF 자동 매수 완료',
            revenuePerTx: 3,
            metrics: { sweepAmount: 850, aumIncrease: 850, managementFee: 0.2 },
            description: 'AUM ₩850 증가, 운용보수 0.3%',
          },
          ds: {
            title: '신한DS',
            color: '#8B5CF6',
            value: 'S-BRIDGE API 호출 완료',
            revenuePerTx: 200,
            metrics: { baasFee: 200, gasFeeSaved: 10 },
            description: '원장 처리 API 사용료 ₩200',
          }
        }
      }
    };
    setResult(mockResult);
    setCheckoutStep(4);
    setSolcBalance((prev: number) => prev + 48.85); // Add SOLC coins
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setLoading(false);
  };

  const subIcons = [
    <Landmark key="bank"   className="w-5 h-5 text-blue-600" />,
    <CreditCard key="card"  className="w-5 h-5 text-red-500" />,
    <ShieldCheck key="life"  className="w-5 h-5 text-emerald-600" />,
    <TrendingUp key="inv"   className="w-5 h-5 text-amber-600" />,
    <Cpu key="ds"    className="w-5 h-5 text-indigo-600" />,
  ];

  return (
    <div className="space-y-4 pb-6">
      {checkoutStep > 0 && checkoutStep < 4 ? (
        <div className="fixed inset-0 z-50 bg-[#070b15]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <PoAConsensusRadar step={checkoutStep} />
        </div>
      ) : !result ? (
        <>
          {/* 정산 미리보기 카드 */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#0052FF]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase">킬러 기능 · S-BRIDGE Web3 정산</p>
                <h3 className="font-black text-lg text-slate-900">오늘의 긱 워크 완료</h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-black text-emerald-700">수수료 0원 · 오라클 노드 자동 검증</span>
            </div>

            {/* 정산 내역 */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Escrow Funded (점주 예치: ₩52,500)</p>
              
              {/* 급여 영역 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>급여 원금 (4h × ₩12,500)</span>
                  <span className="font-semibold text-slate-800">₩50,000</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>점주 납부 5% 시너지 수수료</span>
                  <span className="font-bold text-indigo-600">₩2,500</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-700">워커 실수령 (즉시 이체)</span>
                  <span className="text-emerald-600 font-black text-base">₩50,000</span>
                </div>
              </div>

              {/* One Shinhan 무상 혜택 영역 */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 space-y-1.5">
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2">🎁 One Shinhan 무상 혜택 (점주 수수료로 지원)</p>
                <div className="flex justify-between items-center text-[11px] text-slate-600">
                  <span>신한라이프 초단기 상해보험</span>
                  <span className="font-bold text-emerald-600">무료 혜택 (₩300 상당)</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-600">
                  <span>신한투자증권 끝전 ETF 적립</span>
                  <span className="font-bold text-emerald-600">무료 혜택 (₩850 상당)</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-600">
                  <span>인스타페이 즉시정산 수수료</span>
                  <span className="font-bold text-emerald-600">₩0 (전액 면제)</span>
                </div>
              </div>
            </div>

            <button
              onClick={doCheckout}
              disabled={loading}
              className="w-full bg-[#0052FF] disabled:opacity-60 text-white font-black py-5 rounded-2xl text-base transition-all active:scale-[0.98] shadow-[0_6px_30px_rgba(0,82,255,0.3)]"
            >
              오늘의 긱 완료하고 1초 만에 땡겨받기
            </button>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Web3 영수증 카드 */}
          <div className="bg-[#0b0f19] border border-indigo-500/30 text-white p-6 rounded-3xl space-y-4 shadow-[0_0_20px_rgba(99,102,241,0.25)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600/10 text-indigo-400 text-[10px] font-mono px-4 py-1.5 rounded-bl-2xl tracking-wider border-l border-b border-indigo-500/20">
              Receipt # {result.txId}
            </div>
            
            <div className="text-center pt-4 pb-2">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-indigo-500/30">
                <Cpu className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
              <h3 className="font-mono text-sm tracking-widest text-indigo-400 uppercase">Smart Contract Executed</h3>
              <p className="text-3xl font-black mt-2 font-mono text-white tracking-tight">
                ₩{result.financialImpact?.netDeposit?.toLocaleString() ?? '50,000'}
              </p>
              <p className="text-slate-400 text-xs mt-1">S-BRIDGE Multi-Chain Protocol</p>
            </div>

            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">스마트 컨트랙트 실행 결과</span>
                <span className="text-xs text-indigo-200 font-semibold leading-relaxed">
                  신한은행 계좌(90%) 및 신한투자증권 지갑(10%)으로 자산 스윕(Sweep) 완료
                </span>
              </div>
            </div>

            {/* Web3 영수증 메타데이터 */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-950 text-[10px] font-mono space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Block Number:</span>
                <span className="text-indigo-300 font-bold">{result.blockNumber}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Transaction Hash:</span>
                <span className="text-indigo-400/90 break-all select-all">{result.txHash}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Oracle Signature:</span>
                <span className="text-slate-400 break-all select-all">{result.oracleSignature}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-900">
                <span className="text-slate-500">Gas Used:</span>
                <span className="text-emerald-400">21,000 Gwei</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase px-1">One Shinhan 교차수익 리포트</p>

          {Object.values(result.financialImpact.breakdown).map((item: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                  {subIcons[idx]}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h5 className="font-black text-sm text-slate-900">{item.title}</h5>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-[180px] leading-tight">
                    {item.description ?? item.value}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-slate-800 block">{item.value}</span>
                {item.revenuePerTx != null && (
                  <span className="text-[10px] text-emerald-600 font-bold">+₩{Number(item.revenuePerTx).toLocaleString()}</span>
                )}
              </div>
            </motion.div>
          ))}

          <button
            onClick={() => {
              setResult(null);
              setCheckoutStep(0);
            }}
            className="w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
          >
            다시 시작하기
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── TAB 6: 마이페이지 ────────────────────────────────────────────────────────

function MyPageScreen({ 
  walletConnected, 
  walletAddress, 
  solcBalance, 
  currentTier,
  matched
}: { 
  walletConnected: boolean; 
  walletAddress: string; 
  solcBalance: number; 
  currentTier: any;
  matched: boolean;
}) {
  const [role, setRole] = useState<'worker' | 'employer'>('worker');

  return (
    <div className="space-y-5 pb-8 px-4">
      {/* 롤 스위처 */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setRole('worker')}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${
            role === 'worker' 
          ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          지원자(워커) 마이페이지
        </button>
        <button
          onClick={() => setRole('employer')}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${
            role === 'employer' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          점주 마이페이지
        </button>
      </div>

      {role === 'worker' ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* 프로필 카드 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
                지성
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg">이지성</h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    씬 파일러
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {walletConnected ? walletAddress : '지갑을 연결해 주세요'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80">
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">신용 뱃지 (SBT)</p>
                <p className="text-xs font-black text-indigo-300 mt-1">D-GCS 990점</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">지갑 자산 (SOLC)</p>
                <p className="text-xs font-black text-emerald-400 mt-1">🪙 {solcBalance.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">노쇼 방지 예치금</p>
                <p className={`text-xs font-black mt-1 ${matched ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}>
                  {matched ? '₩10,000 [잠금]' : '₩0 [대기]'}
                </p>
              </div>
            </div>
          </div>

          {/* 에스크로 잠금 활성화 알림 카드 */}
          {matched && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 text-amber-200 space-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h5 className="text-xs font-black text-amber-300">신한 에스크로 스마트 계약 잠금 완료 (워커)</h5>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                당일 취소(노쇼) 방지를 위해 고객님의 신한 주거래 계좌에서 <strong>₩10,000</strong> 예치금이 정상 락업되었습니다. 
                정상 출근 시 즉시 잠금 해제되며 반환됩니다.
              </p>
            </motion.div>
          )}

          {/* 수혜 내역 누적 대시보드 */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-900/60 p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Ecosystem Synergy
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h4 className="font-black text-lg text-slate-100 mt-1">One Shinhan 금융 시너지 팩</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">단 한 번의 알바 정산으로 4개 그룹사 혜택이 동시 활성화됩니다.</p>
            </div>

            {/* 시너지 플로우 다이어그램 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 relative">
              <p className="text-[9px] font-mono text-indigo-400 tracking-wider uppercase font-bold">S-BRIDGE Real-time Synergy Router</p>
              
              <div className="flex items-center justify-between w-full text-center relative z-10 px-2">
                <div className="w-16 bg-blue-900/40 border border-blue-500/30 rounded-xl p-2 flex flex-col items-center">
                  <span className="text-[14px]">⚡</span>
                  <span className="text-[8px] font-black text-slate-350 mt-1">땡겨요 웍스</span>
                </div>
                
                {/* Router Line */}
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 mx-2 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full animate-ping" />
                </div>

                <div className="w-20 bg-indigo-900/40 border border-indigo-500/30 rounded-xl p-2 flex flex-col items-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <span className="text-[14px]">⚙️</span>
                  <span className="text-[8px] font-black text-indigo-300 mt-1">S-BRIDGE</span>
                </div>
              </div>

              {/* 하향 화살표 및 분기 선 */}
              <div className="text-[10px] text-slate-500">▼ 4개사 즉시 교차 분배 및 락인 연계</div>

              {/* 4개사 시너지 그리드 */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <div className="bg-slate-900/60 border border-blue-950 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1 text-blue-400">
                    <Landmark className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase">신한은행</span>
                  </div>
                  <p className="text-[11px] font-black text-slate-200">₩12,400 세이브</p>
                  <p className="text-[8px] text-slate-400 leading-tight">급여 이체 유입으로 주거래 CASA 예적금 락인 확보</p>
                </div>

                <div className="bg-slate-900/60 border border-amber-950 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase">신한카드</span>
                  </div>
                  <p className="text-[11px] font-black text-slate-200">+₩{currentTier.limit}만 한도</p>
                  <p className="text-[8px] text-slate-400 leading-tight">출근율 기반 대안 신용한도 확보 및 소액 여신 상품 연계</p>
                </div>

                <div className="bg-slate-900/60 border border-emerald-950 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase">신한라이프</span>
                  </div>
                  <p className="text-[11px] font-black text-slate-200">18시간 무료 상해</p>
                  <p className="text-[8px] text-slate-400 leading-tight">근무 즉시 초단기 상해보험 무료 가입을 통한 신규 고객 유치</p>
                </div>

                <div className="bg-slate-900/60 border border-indigo-950 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1 text-indigo-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase">신한투자증권</span>
                  </div>
                  <p className="text-[11px] font-black text-slate-200">₩3,400 ETF 잔액</p>
                  <p className="text-[8px] text-slate-400 leading-tight">정산금 1천원 미만 끝전의 자동 투자 연계로 리테일 AUM 유치</p>
                </div>
              </div>
            </div>
          </div>

          {/* 최근 정산 내역 */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
            <h4 className="font-black text-base text-slate-900">최근 Web3 정산 히스토리</h4>
            <div className="space-y-3">
              {[
                { shop: '하남돼지집 부평역점', date: '오늘 18:00', amount: '₩50,000', status: 'CLAIMED', solc: '+50.00 SOLC' },
                { shop: '스타벅스 강남2호점', date: '7월 16일', amount: '₩50,000', status: 'SUCCESS', solc: '+50.00 SOLC' },
              ].map((h, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-850">{h.shop}</p>
                    <p className="text-[10px] text-slate-400">{h.date} · S-BRIDGE Claimed</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="font-black text-slate-800">{h.amount}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">{h.solc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* 가맹점 프로필 카드 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900 rounded-3xl p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
                ☕
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-lg">스타벅스 강남2호점</h3>
                <p className="text-xs text-indigo-300 font-bold">
                  AI 예측 신용 등급: AAA
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-indigo-900/60">
              <div>
                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">급여 에스크로</p>
                <p className={`text-xs font-black mt-1 ${matched ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-slate-400'}`}>
                  {matched ? '₩52,500 [잠금]' : '₩0 [대기]'}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">AI 근태정합 평가율</p>
                <p className="text-xs font-black text-slate-350 mt-1">99.2%</p>
              </div>
              <div>
                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">가맹점 등급</p>
                <p className="text-xs font-black text-white mt-1">VIP 등급</p>
              </div>
            </div>
          </div>

          {/* 에스크로 잠금 활성화 알림 카드 (점주) */}
          {matched && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-5 text-emerald-200 space-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h5 className="text-xs font-black text-emerald-300">신한 에스크로 스마트 계약 잠금 완료 (점주)</h5>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                안정적인 근무 보장을 위해 점주님의 신한 가맹점 결제 계좌에서 <strong>₩52,500</strong> (급여 원금 ₩50,000 + 5% 수수료 ₩2,500) 예치금이 정상 락업되었습니다. 
                근무 완료 시 워커에게 즉시 자동 1초 송금 처리됩니다.
              </p>
            </motion.div>
          )}

          {/* 운영 요약 대시보드 */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
            <div>
              <p className="text-[10px] font-black text-indigo-600 tracking-widest uppercase mb-1">Employer Financials</p>
              <h4 className="font-black text-base text-slate-900">가맹점 통합 코스트 리포트</h4>
              <p className="text-xs text-slate-400 mt-0.5">S-BRIDGE 스마트 정산을 통한 지출 및 절감액</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
                <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">총 급여 정산액</h5>
                <p className="text-sm font-black text-slate-800">₩2,450,000</p>
                <span className="text-[9px] text-slate-400">1초 정산 누적 지급</span>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-1">
                <h5 className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">PG 수수료 절감액</h5>
                <p className="text-sm font-black text-indigo-600">₩73,500 Saved</p>
                <span className="text-[9px] text-indigo-400">경쟁사 수수료 3% 전액 면제</span>
              </div>
            </div>
          </div>

          {/* 노쇼 예방 보고서 */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
            <h4 className="font-black text-base text-slate-900">노쇼 예방 및 패널티 집행 보고</h4>
            <div className="space-y-3">
              {[
                { label: '에스크로 락업 실행 건수', value: '3회' },
                { label: '당일 취소로 인한 점주 보상 집행액', value: '₩150,000' },
                { label: 'AI 매칭에 의한 고신용 인력 출근율', value: '98.8%' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                  <span className="text-slate-500 font-semibold">{r.label}</span>
                  <span className="font-black text-slate-800">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

type Tab = 'agent' | 'employer' | 'checkout' | 'revenue' | 'aiscreen' | 'dgcs' | 'web3' | 'live';

const tabs: Array<{ id: Tab; Icon: any; label: string }> = [
  { id: 'agent',    Icon: Sparkles,   label: 'AI 매칭' },
  { id: 'live',     Icon: Zap,        label: '실시간' },
  { id: 'employer', Icon: Store,      label: '점주' },
  { id: 'checkout', Icon: DollarSign, label: '정산' },
  { id: 'revenue',  Icon: BarChart3,  label: '수익' },
  { id: 'aiscreen', Icon: Cpu,        label: 'AI 엔진' },
  { id: 'dgcs',     Icon: User,       label: '마이페이지' },
  { id: 'web3',     Icon: Layers,     label: 'Web3' },
];

export default function ShinhanDDangApp() {
  const [activeTab, setActiveTab] = useState<Tab>('agent');
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);
  const [tier, setTier] = useState<0 | 1 | 2>(1);
  const [matched, setMatched] = useState(false);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  // ── Web3 지갑 훅 (Option C: 신한 슈퍼SOL 딥링크 전용)
  const wallet = useWallet();
  const walletConnected = wallet.isConnected;
  const walletAddress   = wallet.address ?? '';
  const solcBalance     = wallet.solcBalance;
  const setSolcBalance  = (_: number) => {}; // useWallet 내부 관리

  const tiers = [
    { name: 'Silver',   rate: 70,  limit: 30,  color: 'text-slate-600', bg: 'bg-slate-100',   border: 'border-slate-300' },
    { name: 'Gold',     rate: 85,  limit: 70,  color: 'text-amber-600', bg: 'bg-amber-50',    border: 'border-amber-300' },
    { name: 'Platinum', rate: 95,  limit: 150, color: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-300' },
  ];
  const current = tiers[tier];

  const triggerWalletConnect = () => {
    // Option C: 신한 슈퍼SOL 딥링크 연결
    wallet.connect();
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans antialiased flex flex-col max-w-lg mx-auto relative">
      <style>{`
        @keyframes hologram {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-hologram {
          background-size: 200% auto;
          animation: hologram 3s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 99px;
        }
      `}</style>

      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase">One Shinhan Ecosystem</p>
              <h1 className="font-black text-xl text-[#0F172A] leading-tight">땡겨요 웍스</h1>
            </div>
            
            {/* Dynamic Credit Summary Badge */}
            <button 
              onClick={() => setShowCreditDropdown(!showCreditDropdown)}
              className={`border text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 active:scale-95 transition-all ${current.bg} ${current.color} ${current.border}`}
            >
              <Trophy className="w-3 h-3" /> {current.name} +₩{current.limit}만
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* 실시간 블록 높이 배지 */}
            {walletConnected && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-400">#{wallet.blockNumber.toLocaleString()}</span>
              </div>
            )}
            {wallet.isConnecting ? (
              <button disabled className="bg-blue-50 text-[#0052FF] text-[11px] font-black px-3 py-1.5 rounded-full border border-blue-200 flex items-center gap-1.5">
                <span className="animate-spin w-3 h-3 border-2 border-blue-600/30 border-t-[#0052FF] rounded-full" />
                슈퍼SOL 앱 연결 중...
              </button>
            ) : !walletConnected ? (
              <button 
                onClick={triggerWalletConnect}
                className="bg-[#0052FF] hover:bg-blue-700 active:scale-95 text-white text-[11px] font-black px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-[0_2px_8px_rgba(0,82,255,0.2)] transition-all"
              >
                신한 슈퍼SOL 연결
              </button>
            ) : (
              <button 
                onClick={() => {
                  setShowWalletDropdown(!showWalletDropdown);
                  setShowCreditDropdown(false);
                }}
                className="flex flex-col items-end gap-0.5 text-right active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                    {wallet.shortAddress}
                  </span>
                  <span className="relative overflow-hidden inline-flex items-center text-[9px] font-black px-2 py-0.5 rounded-full animate-hologram bg-[linear-gradient(120deg,#6366f1,#a855f7,#ec4899,#3b82f6,#6366f1)] text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                    D-GCS 990점 (신한인증 1등급)
                  </span>
                </div>
                <span className="text-[10px] font-black text-indigo-600 flex items-center gap-0.5">
                  🪙 {solcBalance.toFixed(2)} SOLC <ChevronDown className="w-3 h-3 text-indigo-400" />
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Web3 Wallet Dropdown Popover Card */}
      <AnimatePresence>
        {showWalletDropdown && (
          <>
            <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" onClick={() => setShowWalletDropdown(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-4 right-4 z-50 bg-[#0b0f19] border border-indigo-500/30 text-white rounded-3xl p-5 shadow-[0_10px_40px_rgba(99,102,241,0.25)] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">신한 Chain 메인넷 연결됨</h4>
                    <p className="text-[9px] font-mono text-slate-500">Connected to Shinhan PoA Consortium</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    wallet.disconnect();
                    setShowWalletDropdown(false);
                  }}
                  className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                  title="지갑 연결 해제"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Wallet Address with copy */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">내 지갑 주소</p>
                  <p className="text-xs font-mono text-slate-300 font-bold mt-0.5">{walletAddress}</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    alert('지갑 주소가 복사되었습니다.');
                  }}
                  className="p-1.5 hover:bg-slate-850 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors"
                  title="주소 복사"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Asset List */}
              <div className="space-y-2">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">보유 자산 목록</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
                    <span className="text-[9px] text-slate-500">신한 솔 코인 (SOLC)</span>
                    <p className="text-sm font-black text-indigo-400 mt-1">🪙 {solcBalance.toFixed(2)} SOLC</p>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
                    <span className="text-[9px] text-slate-500">신용한도 뱃지 (SBT)</span>
                    <p className="text-sm font-black text-amber-400 mt-1">Grade 1 (SBT)</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    alert('신한 쏠 코인(SOLC) 송금 기능은 시뮬레이션 상태입니다.');
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xs font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-1"
                >
                  송금하기 <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Credit Popover Card */}
      <AnimatePresence>
        {showCreditDropdown && (
          <>
            <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" onClick={() => setShowCreditDropdown(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-4 right-4 z-50 bg-white rounded-3xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase mb-1">Dynamic Credit</p>
                  <h4 className="font-black text-base text-slate-900">출근율 → 금융 한도 직결</h4>
                  <p className="text-xs text-slate-400 mt-0.5">배지 달성 즉시 신한카드 한도 증액 (사용자 정보)</p>
                </div>
                <Trophy className={`w-9 h-9 ${current.color}`} />
              </div>

              <div className="flex gap-2">
                {tiers.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => setTier(i as 0|1|2)}
                    className={`flex-1 py-2.5 rounded-xl text-[11px] font-black border transition-all ${
                      tier === i ? `${t.bg} ${t.color} ${t.border}` : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}
                  >{t.name}</button>
                ))}
              </div>

              <GaugeBar
                label="출근율"
                value={current.rate}
                max={100}
                color={tier === 0 ? 'bg-slate-400' : tier === 1 ? 'bg-amber-400' : 'bg-indigo-500'}
                suffix="%"
              />

              <div className={`flex items-center justify-between ${current.bg} ${current.border} border rounded-2xl p-4`}>
                <div className="flex items-center gap-3">
                  <Banknote className={`w-5 h-5 ${current.color}`} />
                  <div>
                    <p className={`text-xs font-black ${current.color}`}>{current.name} 달성 보상</p>
                    <p className="text-[10px] text-slate-500">신한카드 마이너스 통장 즉시 개설</p>
                  </div>
                </div>
                <span className={`text-lg font-black ${current.color}`}>+₩{current.limit}만</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mock Wallet Auth Popup Modal */}
      <AnimatePresence>
        {showWalletPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b0f19] border border-indigo-500/30 text-white rounded-3xl p-6 w-full max-w-sm shadow-[0_0_50px_rgba(99,102,241,0.3)] space-y-5"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/40 rounded-xl flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">신한 슈퍼SOL Web3 지갑</h4>
                  <p className="text-[10px] text-slate-500">Shinhan Chain Mainnet</p>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-4">
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-xs space-y-2">
                  <p className="text-slate-400">요청 사이트:</p>
                  <p className="font-mono text-indigo-300 font-bold">https://alba-super-sol.pages.dev</p>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-xs space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">연결할 계정:</span>
                    <span className="font-mono text-slate-200">0xSol98F...3A9f</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">보유 자산 (SOLC):</span>
                    <span className="font-bold text-emerald-400">524.30 SOLC</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed text-center px-2">
                  지갑을 연결하면 해당 사이트에서 귀하의 주소, 잔액 조회 및 스마트 컨트랙트 승인 서명 요청을 보낼 수 있습니다.
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowWalletPopup(false)}
                  className="flex-1 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-850 transition-colors"
                >
                  거절
                </button>
                <button 
                  onClick={() => { setShowWalletPopup(false); wallet.connect(); }}
                  className="flex-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xs font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-[0_4px_12px_rgba(99,102,241,0.3)]"
                >
                  서명 및 연결 승인
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'live' && (
            <motion.div key="live" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <LiveMatchingBoard />
            </motion.div>
          )}

          {activeTab === 'agent' && (
            <motion.div key="agent" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <AgentTab />
            </motion.div>
          )}

          {activeTab === 'employer' && (
            <motion.div key="employer" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <EmployerTab matched={matched} setMatched={setMatched} />
            </motion.div>
          )}
          {activeTab === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <CheckoutTab 
                walletConnected={walletConnected} 
                walletAddress={walletAddress} 
                solcBalance={solcBalance}
                setSolcBalance={setSolcBalance}
              />
            </motion.div>
          )}
          {activeTab === 'revenue' && (
            <motion.div key="revenue" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="pb-6">
              <RevenueDashboard />
            </motion.div>
          )}
          {activeTab === 'aiscreen' && (
            <motion.div key="aiscreen" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="pb-6">
              <AIAgentScreen />
            </motion.div>
          )}
          {activeTab === 'dgcs' && (
            <motion.div key="dgcs" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="-mx-4 pb-6">
              <MyPageScreen 
                walletConnected={walletConnected} 
                walletAddress={walletAddress} 
                solcBalance={solcBalance} 
                currentTier={current} 
                matched={matched}
              />
            </motion.div>
          )}

          {activeTab === 'web3' && (
            <motion.div key="web3" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="pb-8 space-y-6">
              {/* Web3 탭 헤더 */}
              <div className="bg-gradient-to-br from-[#0a0e1a] to-[#111827] rounded-3xl p-5 border border-slate-700/50">
                <p className="text-[9px] font-black text-indigo-400 tracking-widest uppercase mb-1">신한 PoA 컨소시엄 메인넷</p>
                <h2 className="text-xl font-black text-white">Web3 대시보드</h2>
                <p className="text-xs text-slate-400 mt-1">실시간 블록체인 · SBT · SOLC 토크노믹스</p>
                {walletConnected && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-mono">Block #{wallet.blockNumber.toLocaleString()} · 3s PoA</span>
                  </div>
                )}
              </div>

              {/* 지갑 미연결 시 안내 */}
              {!walletConnected && (
                <div className="bg-gradient-to-br from-indigo-950 to-slate-950 border border-indigo-700/40 rounded-3xl p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto">
                    <Layers className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">신한 슈퍼SOL 지갑 연결</h3>
                    <p className="text-sm text-slate-400 mt-1">Web3 기능을 이용하려면 지갑을 연결하세요</p>
                  </div>
                  <button
                    onClick={() => wallet.connect()}
                    disabled={wallet.isConnecting}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.3)] active:scale-95 transition-all disabled:opacity-60 text-sm"
                  >
                    {wallet.isConnecting ? '연결 중...' : '🔗 신한 슈퍼SOL 앱으로 연결'}
                  </button>
                  <p className="text-[9px] text-slate-600">신한 슈퍼SOL 앱이 없으면 앱스토어에서 다운로드하세요</p>
                </div>
              )}

              {/* 지갑 연결 후 Web3 콘텐츠 */}
              {walletConnected && (
                <>
                  {/* 실시간 블록 피드 */}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">실시간 블록 스트림</p>
                    <BlockFeed />
                  </div>

                  {/* SBT NFT 뷰어 */}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">내 SBT (Soul-Bound Token)</p>
                    <div className="bg-[#0a0e1a] rounded-3xl p-4 border border-slate-700/50">
                      <SBTViewer address={walletAddress} score={990} workerName="이지성" />
                    </div>
                  </div>

                  {/* SOLC 토크노믹스 */}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">SOLC 토크노믹스</p>
                    <TokenDashboard userBalance={solcBalance} address={walletAddress} />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 하단 고정 내비 */}
      <nav className="sticky bottom-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {tabs.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all active:scale-90 ${
                activeTab === id ? 'text-[#0052FF]' : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${activeTab === id ? 'bg-blue-50' : ''}`}>
                <Icon className={`w-5 h-5 ${activeTab === id ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] font-black tracking-tight ${activeTab === id ? 'text-[#0052FF]' : 'text-slate-400'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
