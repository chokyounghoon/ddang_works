'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Sparkles, CreditCard, Landmark, Cpu, User,
  Store, DollarSign, CheckCircle2, ArrowUpRight, MapPin,
  Clock, CloudRain, Zap, ChevronRight, TrendingUp,
  Banknote, Trophy, Flame, BarChart3, Lock, Unlock,
  AlertCircle, ChevronDown, Copy, LogOut, ExternalLink,
  Coins, Activity, Layers, FileText, Scale, ShieldAlert, Receipt, Building2,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useWallet } from './hooks/useWallet';
import { simulateTxHash } from './lib/web3';
import confetti from 'canvas-confetti';

const RevenueDashboard  = dynamic(() => import('./components/RevenueDashboard'),  { ssr: false });
const AIAgentScreen     = dynamic(() => import('./components/AIAgentScreen'),     { ssr: false });
const DGCSScreen        = dynamic(() => import('./components/DGCSScreen'),        { ssr: false });
const GigMapView        = dynamic(() => import('./components/GigMapView'),        { ssr: false });
const BlockFeed         = dynamic(() => import('./components/BlockFeed'),         { ssr: false });
const SBTViewer         = dynamic(() => import('./components/SBTViewer'),         { ssr: false });
const TokenDashboard    = dynamic(() => import('./components/TokenDashboard'),    { ssr: false });
const LiveMatchingBoard = dynamic(() => import('./components/LiveMatchingBoard'), { ssr: false });
const EmployerMyPage    = dynamic(() => import('./components/EmployerMyPage'),    { ssr: false });
const AdminDashboard    = dynamic(() => import('./components/AdminDashboard'),    { ssr: false });
const ShinhanVsAlbamonModal = dynamic(() => import('./components/ShinhanVsAlbamonModal'), { ssr: false });
import { AppPushProvider, useAppPush } from './components/AppPushToast';

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
    { role: 'assistant', text: '조이수님, 안녕하세요! 땡겨요 웍스 AI 매칭 비서 도담이예요. 원하시는 위치나 업종을 편하게 말씀해 주세요! 🎯 (예: "부평지역 서빙 알바 찾아줘")' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [initialCenter, setInitialCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // AI 매칭 탭 전용 근무시간/카테고리 범위 필터 및 정렬 상태
  const [selectedHours, setSelectedHours] = useState<'all' | '1h' | '2h' | '4h' | '5h_plus'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sortMode, setSortMode] = useState<'ai' | 'wage_desc' | 'wage_asc' | 'dist_asc' | 'dist_desc' | 'pay_desc'>('ai');
  const { triggerPush } = useAppPush();

  // 실시간 롤링 티커 상태
  const [notificationIdx, setNotificationIdx] = useState(0);
  const LIVE_NOTIFICATIONS = [
    '⚡ 3초 전 조이수님 [하남돼지집 부평역점] ₩58,000 0.1초 즉시 정산 완료!',
    '🔒 신한은행 에스크로 스마트 계약 ₩54,000 원장 예치 확정',
    '🛡️ 신한EZ손해보험 비급여 상해 보장 출근 스와이프 개시',
    '📈 1천원 미만 잔돈 신한투자증권 KODEX ETF 자동 매수 완료',
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setNotificationIdx(i => (i + 1) % LIVE_NOTIFICATIONS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const [matchedGigsState, setMatchedGigsState] = useState([
    { id: 'ag1', storeName: 'CU 강남파이낸스점',    category: '편의점', district: '강남구',       distanceM: 150, role: '1시간 물류 하역 초단기 알바',    hours: 1, startTime: '12:00', endTime: '13:00', pay: 16000, hourlyRate: 16000, aiScore: 99, urgency: true,  applied: false },
    { id: 'ag2', storeName: '컴포즈커피 역삼역점',  category: '카페',  district: '강남구',       distanceM: 220, role: '점심 2시간 음료 조리 픽업',        hours: 2, startTime: '11:30', endTime: '13:30', pay: 30000, hourlyRate: 15000, aiScore: 97, urgency: true,  applied: false },
    { id: 'ag3', storeName: '스타벅스 강남2호점',   category: '카페',  district: '강남구',       distanceM: 480, role: '홀 서빙 & 음료 조리',              hours: 4, startTime: '14:00', endTime: '18:00', pay: 54000, hourlyRate: 13500, aiScore: 98, urgency: true,  applied: false },
    { id: 'ag4', storeName: '하남돼지집 부평역점',  category: '서빙',  district: '인천 부평구',  distanceM: 320, role: '야간 메인 서빙',                   hours: 4, startTime: '18:00', endTime: '22:00', pay: 58000, hourlyRate: 14500, aiScore: 95, urgency: true,  applied: false },
    { id: 'ag5', storeName: '세븐일레븐 테헤란점',  category: '편의점', district: '강남구',      distanceM: 380, role: '1시간 매장 세팅 긴급 보조',        hours: 1, startTime: '09:00', endTime: '10:00', pay: 15000, hourlyRate: 15000, aiScore: 89, urgency: false, applied: false },
    { id: 'ag6', storeName: '이마트 역삼점',        category: '마트',  district: '강남구',       distanceM: 900, role: '매장 진열 & 물류 관리',             hours: 5, startTime: '10:00', endTime: '15:00', pay: 65000, hourlyRate: 13000, aiScore: 81, urgency: false, applied: false },
  ]);


  // 땡겨요 웍스 VS 알바몬 파괴적 혁신 비교 모달 팝업 상태
  const [showAlbamonModal, setShowAlbamonModal] = useState(true);
  // 지도 핀 선택 상태 (선택된 긱 ID → 해당 업체만 목록에 표시, null → 전체)
  const [mapSelectedGigId, setMapSelectedGigId] = useState<string | null>(null);
  // 지도 gig ID → storeName 매핑 (지도 핀과 목록 카드 연결)
  const GIG_MAP: Record<string, string> = {
    'g1': '컴포즈커피 역삼역점',
    'g2': '스타벅스 강남2호점',
    'g3': 'CU 강남파이낸스점',
    'g4': '세븐일레븐 테헤란점',
    'g5': '이마트 역삼점',
  };

  // 새 메시지가 추가되면 채팅 내역을 아래로 자동 스크롤
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessageText = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg = textToSend.trim();
    const updatedMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          userContext: { workerName: '조이수', currentTier: 'Gold' },
        }),
      });

      if (res.ok) {
        const data: any = await res.json();
        if (data.reply) {
          setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
        }
        if (data.gig?.coords) {
          setInitialCenter(data.gig.coords);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'AI 응답 수신 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: '네트워크 연결 상태를 확인 후 다시 시도해 주세요.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendMessageText(inputText);
  };

  const handleAgentApply = (gigId: string, storeName: string, role: string) => {
    setMatchedGigsState(prev => prev.map(g => g.id === gigId ? { ...g, applied: true } : g));
    triggerPush({
      title: `[지원 접수] ${storeName}`,
      body: `조이수님의 ${role} 지원서가 AI 매칭 비서를 통해 정상 접수되었습니다. (신한 에스크로 원장 예치 대기)`,
      type: 'apply',
      actionText: '지원 상태 보기',
    });

    setTimeout(() => {
      triggerPush({
        title: `[점주 수신 알림] ${storeName}`,
        body: `조이수 지원자(D-GCS 980점 Gold)의 AI 맞춤 지원서가 점주 앱으로 전송되었습니다.`,
        type: 'confirm',
        actionText: '점주 탭 바로가기',
      });
    }, 2000);
  };

  // 근무시간 & 카테고리 필터 및 정렬 처리 + 지도 핀 선택 필터
  const filteredAgentGigs = matchedGigsState
    .filter(g => {
      // 지도 핀 선택 시: 해당 업체 이름 매핑으로 단일 필터
      if (mapSelectedGigId) {
        const targetStore = GIG_MAP[mapSelectedGigId];
        return targetStore ? g.storeName === targetStore : true;
      }
      const matchCat = selectedCategory === '전체' || g.category === selectedCategory;
      let matchHour = true;
      if (selectedHours === '1h') matchHour = g.hours === 1;
      else if (selectedHours === '2h') matchHour = g.hours === 2;
      else if (selectedHours === '4h') matchHour = g.hours === 4;
      else if (selectedHours === '5h_plus') matchHour = g.hours >= 5;
      return matchCat && matchHour;
    })
    .sort((a, b) => {
      if (sortMode === 'wage_desc') return b.hourlyRate - a.hourlyRate;
      if (sortMode === 'wage_asc') return a.hourlyRate - b.hourlyRate;
      if (sortMode === 'dist_asc') return a.distanceM - b.distanceM;
      if (sortMode === 'dist_desc') return b.distanceM - a.distanceM;
      if (sortMode === 'pay_desc') return b.pay - a.pay;
      return b.aiScore - a.aiScore;
    });

  // 지도 핀이 선택된 업체명
  const mapSelectedStoreName = mapSelectedGigId ? GIG_MAP[mapSelectedGigId] : null;

  return (
    <div className="space-y-3 pb-6">
      {/* 💡 땡겨요 웍스 파괴적 덤핑 전략 안내 바 & 팝업 열기 버튼 */}
      <button
        onClick={() => setShowAlbamonModal(true)}
        className="w-full bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-slate-900 border border-blue-400/40 rounded-2xl p-3 text-white flex items-center justify-between shadow-xl hover:brightness-110 active:scale-95 transition-all text-left group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-black text-amber-300 text-sm group-hover:scale-110 transition-transform shrink-0">
            💡
          </div>
          <div>
            <span className="text-[9.5px] font-black text-emerald-400 uppercase tracking-widest block">Trojan Horse Strategy</span>
            <h4 className="font-black text-xs text-white">왜 사장님들은 알바몬을 버리고 땡겨요 웍스로 올까?</h4>
          </div>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shrink-0 flex items-center gap-1">
          혁신 비교 보기 <ArrowUpRight className="w-3 h-3" />
        </span>
      </button>

      {/* 땡겨요 웍스 VS 알바몬 파괴적 혁신 비교 팝업 모달 */}
      <ShinhanVsAlbamonModal isOpen={showAlbamonModal} onClose={() => setShowAlbamonModal(false)} />
      {/* 대화형 AI 매칭 비서 */}
      <div className="bg-[#0F172A] p-3.5 rounded-3xl shadow-xl flex flex-col h-[210px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0052FF] opacity-15 rounded-full blur-2xl pointer-events-none" />
        
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500/20 p-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-[11px] font-black text-white tracking-wider">땡겨요 웍스 AI 매칭 비서 도담이</span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
            REAL AI LIVE
          </span>
        </div>

        {/* 채팅 영역 */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] p-2.5 rounded-xl text-xs leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-xs' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-xs'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700/80 text-slate-300 p-2.5 rounded-xl rounded-tl-xs text-[11px] flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-150" />
                </span>
                AI 도담이가 실시간 긱 데이터 분석 중...
              </div>
            </div>
          )}
        </div>

        {/* 입력 및 퀵 추천 영역 */}
        <div className="mt-2 shrink-0 space-y-1.5">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="질문이나 원하는 조건을 입력하세요 (예: 강남 카페 알바)..."
              className="w-full bg-slate-800/90 border border-slate-700/80 text-white text-xs rounded-full py-2 pl-3.5 pr-10 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="absolute right-1 top-1 bottom-1 bg-blue-600 text-white w-7 h-7 my-auto rounded-full flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>

          {/* 퀵 질문 칩 */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            {[
              '📍 부평역 서빙 알바',
              '☕ 강남역 카페 긱',
              '🛵 우천 배달 할증',
              '💳 0.1초 퇴근 정산',
            ].map(chip => (
              <button
                key={chip}
                onClick={() => sendMessageText(chip)}
                disabled={isTyping}
                className="text-[9px] px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-blue-600/30 whitespace-nowrap active:scale-95 transition-all disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 🔥 실시간 핫스팟 롤링 현황판 (컴팩트 칩) */}
      <div className="bg-gradient-to-r from-[#090D16] via-[#10182D] to-[#080D1A] border border-blue-500/30 rounded-2xl p-2.5 text-white space-y-2 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-xs font-black text-amber-300">
              🔥 내 주변 1km 실시간 긴급 7건 가동 중 <span className="text-[10px] text-slate-400 font-normal">| 58명 접속</span>
            </span>
          </div>
          <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            0.1초 즉시정산
          </span>
        </div>

        {/* 실시간 롤링 마키 티커 */}
        <div className="bg-blue-950/60 border border-blue-500/20 rounded-xl px-2.5 py-1.5 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
          <AnimatePresence mode="wait">
            <motion.p
              key={notificationIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-[10.5px] font-bold text-blue-200 truncate"
            >
              {LIVE_NOTIFICATIONS[notificationIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. 카카오 지도 영역 (LBS 기반 위치 시프트) */}
      <div className="h-[320px] sm:h-[350px] rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative">
        <GigMapView
          initialCenter={initialCenter}
          onGigSelect={(id) => {
            setMapSelectedGigId(id);
            // 지도 선택 시 카테고리·시간 필터 해제하여 해당 업체 카드가 확실히 노출되도록
            if (id) {
              setSelectedCategory('전체');
              setSelectedHours('all');
            }
          }}
        />
      </div>

      {/* 지도 핀 선택 활성 배너 (선택 시만 노출) */}
      {mapSelectedGigId && mapSelectedStoreName && (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <div>
              <p className="text-[9.5px] font-bold text-indigo-200 uppercase tracking-widest">지도 핀 선택 중</p>
              <p className="text-xs font-black">{mapSelectedStoreName} 상세 정보</p>
            </div>
          </div>
          <button
            onClick={() => setMapSelectedGigId(null)}
            className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all border border-white/30 shrink-0 flex items-center gap-1"
          >
            ✕ 전체 목록 보기
          </button>
        </div>
      )}

      {/* 5. 직종 카테고리 칩 필터 */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: '전체', label: '전체 시프트' },
          { id: '서빙', label: '🍽️ 홀/서빙' },
          { id: '카페', label: '☕ 카페' },
          { id: '편의점', label: '🏪 편의점' },
          { id: '패스트푸드', label: '🍔 패스트푸드' },
          { id: '마트', label: '📦 마트' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 6. AI 매칭 추천 긱: 근무시간 범위 필터 & 정렬 컨트롤 바 */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <span className="text-[9.5px] font-black text-indigo-600 tracking-widest uppercase">AI Smart Matcher</span>
            <h4 className="font-black text-sm text-slate-900">도담이 추천 긱 목록</h4>
          </div>

          {/* 정렬 드롭다운 */}
          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value as any)}
            className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10.5px] font-black rounded-xl px-2 py-1 outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="ai">✨ AI 추천순</option>
            <option value="wage_desc">💰 시급 높은순</option>
            <option value="wage_asc">💵 시급 낮은순</option>
            <option value="dist_asc">📍 거리 가까운순</option>
            <option value="dist_desc">🧭 거리 먼순</option>
            <option value="pay_desc">💵 총급여 높은순</option>
          </select>
        </div>

        {/* 근무시간 범위 필터 칩 (1시간, 2시간, 4시간...) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">시간선택:</span>
          {[
            { id: 'all', label: '전체시간' },
            { id: '1h', label: '⚡ 1시간 (초단기)' },
            { id: '2h', label: '⏱️ 2시간' },
            { id: '4h', label: '4시간' },
            { id: '5h_plus', label: '5시간 이상' },
          ].map(hf => (
            <button
              key={hf.id}
              onClick={() => setSelectedHours(hf.id as any)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-xl text-[10.5px] font-bold transition-all active:scale-95 ${
                selectedHours === hf.id
                  ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {hf.label}
            </button>
          ))}
        </div>

        {/* 필터링 및 정렬된 긱 카드리스트 (Instawork 수준 고도화 UX) */}
        <div className="space-y-3 pt-1">
          {filteredAgentGigs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-200">
              선택하신 조건에 해당하는 긱 공고가 없습니다.
            </div>
          ) : (
            filteredAgentGigs.map(g => (
              <div 
                key={g.id} 
                className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A1128] border border-slate-800 rounded-3xl p-4 text-white space-y-3 shadow-xl hover:border-indigo-500/50 transition-all text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* 헤더 & 금액 */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h5 className="font-black text-sm text-white truncate">{g.storeName}</h5>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {g.category}
                      </span>
                      {(g.hours === 1 || g.hours === 2 || g.hours === 4 || g.urgency) && (
                        <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
                          🔥 긴급 ({g.hours}시간)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium truncate">{g.role}</p>
                    {/* 근무 시간대 표시 */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg tracking-wide">
                        🕐 {g.startTime} – {g.endTime}
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-semibold">({g.hours}시간)</span>
                    </div>
                  </div>

                  {/* 금액 하이라이트 박스 */}
                  <div className="text-right shrink-0 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-2 shadow-md">
                    <p className="text-lg font-black text-emerald-400 leading-none">
                      ₩{g.pay.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-emerald-300 mt-1">
                      시급 ₩{g.hourlyRate.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 상세 근무 조건 그리드 */}
                <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-slate-800 text-center text-[10.5px]">
                  <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800">
                    <p className="text-[9.5px] text-slate-400 font-bold">📍 위치</p>
                    <p className="font-black text-slate-200 mt-0.5">{g.distanceM}m <span className="text-[9px] text-slate-400 font-normal">({g.district})</span></p>
                  </div>
                  <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800">
                    <p className="text-[9.5px] text-slate-400 font-bold">⏱️ 근무 시간대</p>
                    <p className="font-black text-amber-300 mt-0.5 text-[10px]">{g.startTime} – {g.endTime}</p>
                    <p className="text-[9px] text-slate-400 font-normal">{g.hours}시간 시프트</p>
                  </div>
                  <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800">
                    <p className="text-[9.5px] text-slate-400 font-bold">✨ AI 추천</p>
                    <p className="font-black text-indigo-300 mt-0.5">{g.aiScore}점 Match</p>
                  </div>
                </div>

                {/* AI 맞춤 적합도 프로그레스 바 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9.5px]">
                    <span className="text-slate-400 font-bold">AI 맞춤 매칭 적합도</span>
                    <span className="font-black text-indigo-300">{g.aiScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full" 
                      style={{ width: `${g.aiScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 pt-0.5">
                    <span>🛡️ 신한EZ 상해보장 100% 무상</span>
                    <span>🔒 0.1초 에스크로 정산</span>
                  </div>
                </div>

                {/* 지원 버튼 */}
                <button
                  onClick={() => handleAgentApply(g.id, g.storeName, g.role)}
                  disabled={g.applied}
                  className={`w-full py-3 rounded-2xl font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 active:scale-95 ${
                    g.applied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white shadow-blue-500/20 hover:brightness-110'
                  }`}
                >
                  {g.applied ? (
                    <span>✓ 지원 완료 · 0.1초 신한 에스크로 결제 대기</span>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>⚡ 0.1초 시프트 즉시 지원 & Instant Pay 예약</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


// ─── TAB 2: 점주 대시보드 ────────────────────────────────────────────────────

function EmployerTab({ matched, setMatched }: { matched: boolean; setMatched: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [activeLegalTab, setActiveLegalTab] = useState<'contract' | 'insurance' | 'tax' | 'ezCoverage'>('contract');
  const { triggerPush } = useAppPush();

  return (
    <div className="space-y-4 pb-8">
      {/* 1. 점주 헤더 & 신한금융 지원 혜택 */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl border border-slate-800 shadow-xl p-4 text-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
              S
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Shinhan Certified Store</p>
              <h3 className="font-black text-base text-white">스타벅스 강남2호점</h3>
              <p className="text-[11px] text-slate-400">AI 노쇼 예측 정확도 99.8% · 신한 7-Core 자동 검증</p>
            </div>
          </div>
        </div>

        {/* 신한카드 & 캐피탈 점주 전용 금융 혜택 배지 */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-pink-300 font-bold">신한카드 일일 신용한도</p>
              <p className="text-xs font-black text-white">₩1,500,000 보유</p>
            </div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-orange-300 font-bold">신한캐피탈 B2B 리스</p>
              <p className="text-xs font-black text-white">서빙로봇 승인 완료</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 지원자 분석 및 노쇼 리스크 AI 평가 */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-md p-5 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-3.5 py-1 rounded-bl-2xl tracking-wider">
          AI 추천 1위 · 노쇼 리스크 2%
        </div>

        <div className="flex items-center gap-4 pt-1">
          <div className="w-13 h-13 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md">
            이
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <h4 className="font-black text-base text-slate-900">조이수 알바생</h4>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                👨 남성 · 24세 (2002년생)
              </span>
              <TrustBadge label="Gold 980점" color="text-amber-700 bg-amber-50 border-amber-200" />
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />매장까지 800m (28분 전 반경 진입)
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <GaugeBar label="AI 노쇼 리스크" value={2} max={100} color="bg-emerald-500" suffix="%" />
          <GaugeBar label="D-GCS 성실도" value={980} max={1000} color="bg-indigo-600" />
          <GaugeBar label="최근 3개월 출근 정시율" value={99.8} max={100} color="bg-blue-600" suffix="%" />
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-xs text-emerald-800 leading-relaxed font-medium">
          ✨ <strong>AI 리포트:</strong> 최근 1년간 지각·노쇼 0건 (SBT 영구 박제 검증 완료). 신한은행 에스크로 예치 연동 상태이므로 매칭 즉시 확정을 강력 권장합니다.
        </div>

        {/* 점주 전용 AI 엔진: 노쇼 확률 예측 시뮬레이터 */}
        <div className="bg-[#0b0f19] rounded-2xl border border-amber-500/30 p-4 space-y-2.5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔮</span>
              <div>
                <h5 className="font-black text-xs text-white">AI 노쇼 확률 예측 실시간 추론 엔진</h5>
                <p className="text-[9px] text-slate-400 font-mono">POST /api/v1/ai/employer/predict (gpt-4o-mini)</p>
              </div>
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              점주 전용 AI
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1 text-xs">
            <div className="flex justify-between items-center text-slate-300 text-[10px]">
              <span>지원자: 조이수 (거리 800m)</span>
              <span className="text-amber-400 font-bold">비 날씨 감지</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed pt-1 border-t border-slate-800">
              <strong className="text-amber-300">LLM 추론 결과 (1,820ms):</strong> 노쇼 확률 45% (MEDIUM) — 비 날씨 조건 감안. 출근 1시간 전 에스크로 보증금 알림톡 연동 및 출근 스와이프 확인을 권장합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 5% 수수료 ₩2,500 계열사 정밀 분배 및 법적 투명성 명세 카드 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase">Fee Transparency & Legal Disclosure</span>
            <span className="text-xs font-mono font-bold text-slate-500">총 결제액 ₩52,500</span>
          </div>
          <h4 className="font-black text-base text-slate-900 mt-0.5">5% 시너지 수수료 (₩2,500) 상세 분배 & 법적 보장 약관</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            점주 부담금 ₩52,500 = 알바비 원금 ₩50,000 (100% 알바생 이체) + 5% 시너지 수수료 ₩2,500 (VAT ₩227원 포함)
          </p>
        </div>

        {/* 수수료 계열사 정밀 분배 내역 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { icon: '🏦', name: '신한은행', fee: '₩1,150 (46%)', desc: '0.1초 원체인 실시간 이체망 서비스 + CASA 예치 원장 관리료 (PG수수료 ₩1,500 절감)' },
            { icon: '🛡️', name: '신한EZ손보', fee: '₩300 (12%)', desc: '초단기 마이크로 상해/배상책임 보험료 전액 대납 (알바생 사고 시 점주 배상책임 100% 방어)' },
            { icon: '💳', name: '신한카드', fee: '₩0 (무상)', desc: '점주 일일 단기 신용한도 ₩1,500,000 무상 부여 & ACS 가맹점 신용점수 +5점 상승' },
            { icon: '🌿', name: '신한라이프', fee: '₩0 (무상)', desc: '알바생 1% 마이크로연금 (알바비 차감 적립) + 점주 맞춤형 단기 근로자 노무 컨설팅' },
            { icon: '📈', name: '신한투자증권', fee: '₩850 (34%)', desc: '알바비 끝전 자투리 소수점 ETF 적립금 지원 (2030 알바생 노쇼율 0% 락인 유도)' },
            { icon: '🧾', name: '기타 운영비', fee: '₩200 (8%)', desc: '4대보험 BATCH 국세청/공단 API 자동 제출 & 7-Core 무중단 인프라 서버 유지비' },
          ].map(item => (
            <div key={item.name} className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col justify-between space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-800 text-[11px]">{item.icon} {item.name}</span>
                <span className="font-black text-blue-600 text-[11px]">{item.fee}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ⚖️ 점주 법적 분쟁 방지 필수 3대 투명성 고지 정책 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-indigo-400" /> 법적 3대 투명성 보장 약관 (점주 보호)
            </span>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              100% 분쟁 제로
            </span>
          </div>

          <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">1.</span>
              <p>
                <strong className="text-white">숨겨진 추가 비용 0원 보장 (Zero Hidden Fees):</strong> 본 5% 시너지 수수료 ₩2,500 이외에 월 정기 가입비, 가맹점 등록비, 중도 해지 위약금 등 어떠한 기습 비용도 청구되지 않습니다.
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">2.</span>
              <p>
                <strong className="text-white">부가세(VAT) 포함 & 세금계산서 100% 자동 발행:</strong> 수수료 ₩2,500에는 부가가치세(VAT ₩227원)가 전액 포함되어 있으며, 국세청 홈택스로 사업자 세금계산서가 자동 발행되어 전액 경비 처리가 가능합니다.
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">3.</span>
              <p>
                <strong className="text-white">알바생 노쇼/당일 취소 시 100% 즉시 자동 환불:</strong> 알바생 무단 결근(노쇼) 발생 시 예치된 ₩52,500(급여+수수료) 전액이 위약금 0원으로 점주 신한 계좌로 0.1초 자동 환불됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 📈 신한투자증권 수수료 적립·투자 현황 (점주 5% 수수료 중 ₩850 운용 명세) */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#162035] to-[#0A1128] border border-blue-500/30 rounded-2xl p-4 text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500/20 p-1.5 rounded-lg border border-blue-500/30">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <span className="text-[9.5px] font-black text-blue-400 uppercase tracking-wider block">Shinhan Securities Investment Allocation</span>
                <h5 className="font-black text-xs text-white">점주 지불 5% 수수료 중 신한투자증권 (₩850) 실시간 투자·적립 내역</h5>
              </div>
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
              34% 매칭 투자
            </span>
          </div>

          {/* 50:50 분배 구조 비주얼 카드 */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* 1. 알바생 매칭 적립 (50% = ₩425) */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">🙋 지원자(알바생) 몫</span>
                <span className="text-xs font-black text-emerald-400">₩425 (50%)</span>
              </div>
              <p className="text-[11px] font-black text-white">KODEX 미국S&P500 소수점 ETF</p>
              <p className="text-[9.5px] text-slate-400 leading-tight">
                알바생의 0.1초 정산 계좌로 자동 매수 적립되어 노쇼율 0.0% 강력 유인 효과 제공
              </p>
            </div>

            {/* 2. 점주 파트너십 적립금 (50% = ₩425) */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">🏪 점주 파트너십 몫</span>
                <span className="text-xs font-black text-indigo-400">₩425 (50%)</span>
              </div>
              <p className="text-[11px] font-black text-white">가맹점 B2B 대출 감면 펀드</p>
              <p className="text-[9.5px] text-slate-400 leading-tight">
                누적 ₩42,500 적립 중 → 신한카드/캐피탈 대출 이자 연 0.5% 감면 리베이트 자동 적용
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ⚖️ 4대보험 & 노무/세금 100% 자동 대행 아키텍처 대시보드 (핵심 반박 해법) */}
      <div className="bg-[#0b0f19] rounded-3xl border border-indigo-500/30 p-5 space-y-4 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">
              Legal & Compliance Architecture
            </span>
          </div>
          <h4 className="font-black text-base text-white">4대보험 · 근로계약 · 세금 100% 자동화 해법</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            "1시간 알바인데 4대보험을 어떻게 0.1초 만에 처리하는가?" 행정·법적 메커니즘
          </p>
        </div>

        {/* 탭 내비게이션 */}
        <div className="grid grid-cols-4 gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 text-[10px] font-bold text-center">
          {[
            { id: 'contract', label: '1. 전자계약', icon: FileText },
            { id: 'insurance', label: '2. 4대보험', icon: ShieldCheck },
            { id: 'tax', label: '3. 원천징수', icon: Receipt },
            { id: 'ezCoverage', label: '4. EZ상해보험', icon: ShieldAlert },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeLegalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveLegalTab(tab.id as any)}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  isActive ? 'bg-indigo-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 탭별 상세 설명 콘텐츠 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
          {activeLegalTab === 'contract' && (
            <div className="space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 text-indigo-400 font-black text-sm">
                <FileText className="w-4 h-4" /> 1. 전자근로계약서: [출근 스와이프] = 0초 서명 체결
              </div>
              <p className="text-slate-300">
                <strong>[법적 근거]</strong> 근로기준법 제17조 및 전자문서법에 따라 전자근로계약서는 완전한 법적 효력을 가집니다.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-400 space-y-1 text-[11px]">
                <p className="text-indigo-300 font-bold">⚙️ 기술적 자동화 프로세스:</p>
                <ul className="list-disc pl-3 space-y-0.5">
                  <li>점주 공고 설정값(시급·시간·직무)이 표준계약서 템플릿에 자동 입력됨</li>
                  <li>알바생 매장 도착 후 <strong>[출근 스와이프]</strong> 시 신한인증서 API 연동 전자서명 자동 완료</li>
                  <li>완성된 계약서 PDF는 Cloudflare R2에 암호화 보관 & 카카오 알림톡 자동 교부 (점주 종이 도장 0초)</li>
                </ul>
              </div>
            </div>
          )}

          {activeLegalTab === 'insurance' && (
            <div className="space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <ShieldCheck className="w-4 h-4" /> 2. 4대보험: '실시간 가입'이 아닌 '월간 BATCH API 일괄 신고'
              </div>
              <p className="text-slate-300">
                매시간 4대보험을 각각 신고하는 것은 행정상 불가능합니다. 노동법상 초단기/일용근로자 예외 및 일괄 신고 제도를 활용합니다.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-400 space-y-1.5 text-[11px]">
                <div>
                  <strong className="text-emerald-300">• 국민연금 & 건강보험 (법적 면제):</strong>
                  <br />월 근로시간 15시간 미만(초단기) 및 월 8일 미만 근로자는 법적으로 가입 대상에서 제외됩니다 (점주/알바 부담금 0원).
                </div>
                <div>
                  <strong className="text-emerald-300">• 고용보험 & 산재보험 (월간 BATCH 자동 신고):</strong>
                  <br />1시간을 일해도 산재/고용보험은 적용됩니다. 단, 매번 신고하지 않고 '일용근로자 근로내용확인신고'를 통해 익월 15일까지 일괄 제출합니다.
                </div>
                <div>
                  <strong className="text-emerald-300">• 자동화 BATCH 연동 엔진:</strong>
                  <br />매월 1일 자동화 API 게이트웨이가 근로복지공단 EDI API와 연동되어 근로내용확인신고서를 일괄 자동 제출합니다 (점주 복지공단/세무사 방문 0건!).
                </div>
              </div>
            </div>
          )}

          {activeLegalTab === 'tax' && (
            <div className="space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <Receipt className="w-4 h-4" /> 3. 세금(원천징수) 처리: '일용근로소득 비과세' 자동 계산
              </div>
              <p className="text-slate-300">
                <strong>[법적 규정]</strong> 일용근로자의 경우 하루 15만 원까지 소득공제(비과세) 적용을 받아 원천징수 세금이 '0원'입니다.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-400 space-y-1 text-[11px]">
                <p className="text-amber-300 font-bold">⚙️ 실시간 판별 엔진:</p>
                <ul className="list-disc pl-3 space-y-0.5">
                  <li>알바생 1시간 일하고 ₩15,000 정산 시, 신한은행 엔진이 비과세 한도(15만원 이하)임을 즉시 판별</li>
                  <li>세금 공제 없이 ₩15,000 전액을 0.1초 만에 계좌 이체</li>
                  <li>분기별 일용근로소득 지급명세서 제출 데이터만 국세청 홈택스 API로 자동 제출</li>
                </ul>
              </div>
            </div>
          )}

          {activeLegalTab === 'ezCoverage' && (
            <div className="space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 text-pink-400 font-black text-sm">
                <ShieldAlert className="w-4 h-4" /> 4. 공단 신고 전 보장 공백 방어: '신한EZ손보 초단기 마이크로 보험'
              </div>
              <p className="text-slate-300">
                근로복지공단 산재보험은 '월간 사후 신고' 방식이라, 당일 발생한 사고나 '비급여(도수치료, MRI 등)' 영역은 보장 공백이 생깁니다.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-400 space-y-1 text-[11px]">
                <p className="text-pink-300 font-bold">🛡️ 초단기 0.1초 자동 보장:</p>
                <ul className="list-disc pl-3 space-y-0.5">
                  <li>알바생이 [출근 스와이프]를 긁는 즉시 신한EZ손해보험 '초단기 마이크로 상해보험' 효력이 0.1초 만에 개시됨</li>
                  <li>알바생 의료 파산 방지 + 점주 향한 악성 합의금 협박(블랙컨슈머) 완벽 방어</li>
                  <li>영업사원 한 명 쓰지 않고 전국 단위 단기 상해보험료 ₩300 흡수</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. 매칭 확정 & 에스크로 실행 버튼 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-5 space-y-3">
        {!matched ? (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              매칭 확정 시 점주 가맹점 계좌에서 <strong>₩52,500</strong>이 신한은행 에스크로에 예치되며, 알바생 출근 서명이 즉시 전송됩니다.
            </p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-xs text-emerald-800 font-bold">퇴근 완료 → 에스크로 해제: 알바생 ₩50,000 송금 & 5% 수수료 집행 완료!</p>
          </motion.div>
        )}

        <button
          onClick={() => {
            const nextMatched = !matched;
            setMatched(nextMatched);
            if (nextMatched) {
              confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
              triggerPush({
                title: '🎉 [매칭 확정 완료] 스타벅스 강남2호점',
                body: '조이수 알바생의 출근 매칭이 최종 확정되었습니다! 신한은행 에스크로 ₩52,500 원장 예치 완료',
                type: 'confirm',
                actionText: '정산 탭 확인',
              });

              setTimeout(() => {
                triggerPush({
                  title: '🔔 [출근 및 근로계약 알림] 조이수 알바생',
                  body: '오늘 18:00 근무를 위해 스타벅스 강남2호점으로 이동해 주세요. (신한인증서 0초 전자근로계약 자동 서명 대기)',
                  type: 'escrow',
                });
              }, 1800);
            }
          }}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-[0.98] shadow-lg ${
            matched
              ? 'bg-slate-100 text-slate-600 border border-slate-200'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/30'
          }`}
        >
          {matched ? '🔄 매칭 상태 초기화 (다시 체험하기)' : '▶ 매칭 확정 → 0.1초 에스크로 & 4대보험 BATCH 자동 등록'}
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
  
  // 퇴근 도장 날인 상태 (기본 true, 시뮬레이션용 토글 지원)
  const [clockOutStamped, setClockOutStamped] = useState<boolean>(true);

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
    if (!clockOutStamped) return;

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
        netDeposit: 50000,
        breakdown: {
          bank: {
            title: '신한은행',
            color: '#0052FF',
            value: 'CASA 모계좌 ₩50,000 즉시 이체 완료 (SBT 박제)',
            revenuePerTx: 150,
            metrics: { pgFeeSaved: 1500, cacSaved: 15000, rpProfit: 0.15 },
            description: '0.1초 정산 모계좌 연동 CASA 락인 + 근태 우대금리 대출',
          },
          ezInsurance: {
            title: '신한EZ손해보험',
            color: '#06B6D4',
            value: '마이크로 상해/배상책임 ₩150 자동 개시',
            revenuePerTx: 150,
            metrics: { premium: 150, riskCovered: 100 },
            description: '구인 시 100~200원 마이크로 보험료 결제 + 출근 스와이프 즉시 보장',
          },
          card: {
            title: '신한카드',
            color: '#EC4899',
            value: '점주 일일한도 부여 + ACS +5점',
            revenuePerTx: 200,
            metrics: { acsDataValue: 2.7, creditUp: 5, loanLimit: 1500000 },
            description: '실시간 매출 담보 점주 일일 단기 신용한도 부여로 결제망 종속',
          },
          life: {
            title: '신한라이프',
            color: '#10B981',
            value: '1% 마이크로연금 ₩302 적립 + GPS 생체DB',
            revenuePerTx: 302,
            metrics: { premium: 302, ratePerHour: 75, pension: 500 },
            description: '알바비 1% 자동 연금 적립 + GPS 동선 헬스케어 2030 생체 DB 선점',
          },
          invest: {
            title: '신한투자증권',
            color: '#F59E0B',
            value: '끝전 ₩850 우량 ETF/STO 소수점 자동 매수',
            revenuePerTx: 850,
            metrics: { sweepAmount: 850, aumIncrease: 850, managementFee: 0.3 },
            description: '1,000원 미만 자투리 잔돈 소수점 ETF 자동 매수 MTS 편입',
          },
          savingsCapital: {
            title: '신한저축은행&캐피탈',
            color: '#F97316',
            value: '중금리 Cascade 연동 + 로봇 B2B 리스 승인',
            revenuePerTx: 400,
            metrics: { cascadeRate: 12.5, robotLeaseValue: 12000000 },
            description: '은행 탈락자 0.1초 중금리 대출 Cascade + 서빙로봇 B2B 캐피탈 리스',
          }
        }
      }
    };
    setResult(mockResult);
    setCheckoutStep(4);
    setSolcBalance((prev: number) => prev + 48.85);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setLoading(false);
  };

  return (
    <div className="space-y-4 pb-6">
      {checkoutStep > 0 && checkoutStep < 4 ? (
        <div className="fixed inset-0 z-50 bg-[#070b15]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <PoAConsensusRadar step={checkoutStep} />
        </div>
      ) : !result ? (
        <>
          {/* 1. 출퇴근 기록 & 퇴근 도장 검증 패널 */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
                  ☕
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">스타벅스 강남2호점</h3>
                  <p className="text-xs text-slate-400">당일 급구 알바 (4시간 근무)</p>
                </div>
              </div>
              <button
                onClick={() => setClockOutStamped(prev => !prev)}
                className={`text-[11px] font-black px-3 py-1.5 rounded-full border active:scale-95 transition-all ${
                  clockOutStamped
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 animate-bounce'
                }`}
              >
                {clockOutStamped ? '✓ 퇴근 도장 날인 완료' : '⚡ 퇴근 도장 찍기'}
              </button>
            </div>

            {/* 출퇴근 기록 타임스탬프 & GPS 위치 로그 */}
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commute Timestamp Logs</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-500" /> 출근 완료
                  </span>
                  <p className="font-black text-slate-900 text-sm">18:00:02</p>
                  <p className="text-[9px] text-slate-400">매장 GPS 12m 검증 승인</p>
                </div>

                <div className={`border rounded-2xl p-3 space-y-1 ${
                  clockOutStamped ? 'bg-emerald-50/60 border-emerald-200/60' : 'bg-red-50/60 border-red-200/60'
                }`}>
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${
                    clockOutStamped ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    <CheckCircle2 className={`w-3 h-3 ${clockOutStamped ? 'text-emerald-500' : 'text-red-400'}`} />
                    {clockOutStamped ? '퇴근 도장 승인' : '퇴근 도장 미확인'}
                  </span>
                  <p className={`font-black text-sm ${clockOutStamped ? 'text-slate-900' : 'text-red-500'}`}>
                    {clockOutStamped ? '22:00:04' : '미확인 (도장 필요)'}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    {clockOutStamped ? '매장 GPS 15m 검증 (총 4.0h)' : '퇴근 버튼을 눌러주세요'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. ⚖️ 정산 처리 가능 여부 진단 패널 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Settlement Eligibility Status</span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  clockOutStamped
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border-red-500/40'
                }`}>
                  {clockOutStamped ? '🟢 정산 승인 가능' : '🔴 정산 처리 불가'}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-slate-300">
                  <span>1. 출퇴근 기록 정합성 (18:00 ~ 22:00)</span>
                  <span className="text-emerald-400 font-bold">✓ PASS (4.0h)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>2. 알바 완수 퇴근 도장 확인</span>
                  <span className={clockOutStamped ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold animate-pulse'}>
                    {clockOutStamped ? '✓ PASSED (도장 승인)' : '❌ FAIL (도장 필요)'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>3. 점주 에스크로 원장 예치금 (₩52,500)</span>
                  <span className="text-emerald-400 font-bold">✓ PASS (신한은행)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>4. 신한EZ손보 초단기 상해보험 보장</span>
                  <span className="text-emerald-400 font-bold">✓ PASS (0.1초 개시)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 정산 금액 & One Shinhan 무상 혜택 내역 */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Escrow Funded (점주 예치: ₩52,500)</p>
              
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

              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 space-y-1.5">
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2">🎁 One Shinhan 무상 혜택 (점주 수수료 지원)</p>
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

            {/* 정산 실행 버튼 (퇴근 도장 확인 조건부) */}
            <button
              onClick={doCheckout}
              disabled={loading || !clockOutStamped}
              className={`w-full py-5 rounded-2xl font-black text-base transition-all active:scale-[0.98] shadow-lg ${
                !clockOutStamped
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/30'
              }`}
            >
              {loading ? (
                'S-BRIDGE 0.1초 정산 처리 중...'
              ) : !clockOutStamped ? (
                '❌ 퇴근 도장을 먼저 찍어주세요 (정산 불가)'
              ) : (
                '⚡ 오늘의 긱 완료하고 1초 만에 땡겨받기'
              )}
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
                ₩{result?.financialImpact?.netDeposit?.toLocaleString() ?? '50,000'}
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
                <span className="text-indigo-300 font-bold">{result?.blockNumber ?? '18492019'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Transaction Hash:</span>
                <span className="text-indigo-400/90 break-all select-all">{result?.txHash ?? '0x8f3a...91b2'}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-900">
                <span className="text-slate-500">Gas Used:</span>
                <span className="text-emerald-400">21,000 Gwei</span>
              </div>
            </div>
          </div>

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
      {/* 1. 롤 스위처 */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-md">
        <button
          onClick={() => setRole('worker')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            role === 'worker' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🙋 지원자(알바생) 마이페이지
        </button>
        <button
          onClick={() => setRole('employer')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            role === 'employer' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏪 점주 마이페이지
        </button>
      </div>

      {role === 'worker' ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* 프로필 카드 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A1128] border border-slate-800 rounded-3xl p-5 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-15 h-15 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/30">
                지성
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-black text-lg text-white">조이수</h3>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    👨 남성 · 24세 (2002년생)
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    신한 씬파일러 1등급
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {walletConnected ? walletAddress : '0x71C...4e89 (S-BRIDGE 연동 완료)'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-800/80 text-center">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[9px] text-slate-400 font-bold uppercase">SBT 신용뱃지</p>
                <p className="text-xs font-black text-indigo-400 mt-0.5">D-GCS 980점</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[9px] text-slate-400 font-bold uppercase">지갑 토큰 자산</p>
                <p className="text-xs font-black text-emerald-400 mt-0.5">🪙 {solcBalance.toFixed(1)} SOLC</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[9px] text-slate-400 font-bold uppercase">노쇼 방지 에스크로</p>
                <p className={`text-xs font-black mt-0.5 ${matched ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
                  {matched ? '₩10,000 [잠금]' : '₩0 [해제대기]'}
                </p>
              </div>
            </div>
          </div>

          {/* 1. 🏦 신한은행 주거래 모계좌 & 에스크로 현황 카드 */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 text-sm">
                  🏦
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">신한은행 주거래 모계좌 현황</h4>
                  <p className="text-[10px] text-slate-400">110-482-****** (CASA 저원가성 예금 연동)</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                우대금리 3.2% 적용
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold">현재 은행 입출금 잔액</p>
                <p className="text-base font-black text-slate-900 mt-0.5">₩3,450,000</p>
                <p className="text-[9px] text-emerald-600 mt-1">✓ 0.1초 즉시정산 모계좌 입금 완료</p>
              </div>
              <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-200/60">
                <p className="text-[10px] text-amber-700 font-bold">노쇼 방지 에스크로 락업</p>
                <p className="text-base font-black text-amber-800 mt-0.5">
                  {matched ? '₩10,000' : '₩0'}
                </p>
                <p className="text-[9px] text-amber-700 mt-1">
                  {matched ? '🔒 스마트계약 원장 예치 중' : '✓ 출근 시 0.1초 즉시 해제'}
                </p>
              </div>
            </div>

            {matched && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-200 space-y-1">
                <p className="font-bold text-amber-300 text-[11px] flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> 신한은행 에스크로 락업 상태 안내
                </p>
                <p className="text-[10px] text-slate-300 leading-normal">
                  오늘 스타벅스 강남2호점 매칭 건으로 <strong>₩10,000</strong>이 에스크로에 예치되었습니다. 매장에 도착하여 앱으로 [출근 스와이프]를 수행하면 0.1초 만에 락업이 해제되며 정상 반환됩니다.
                </p>
              </div>
            )}
          </div>

          {/* 2. 📈 신한투자증권 잔돈 & 점주 시너지 수수료 지원 자동 투자 현황 */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center font-black text-purple-600 text-sm">
                  📈
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">신한투자증권 자동 투자 포트폴리오</h4>
                  <p className="text-[10px] text-slate-500 font-medium">점주 지불 수수료 지원금(₩425) + 알바비 잔돈(₩400) 매칭 투자</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                수익률 +4.8%
              </span>
            </div>

            <div className="bg-purple-950/40 border border-purple-500/20 rounded-2xl p-3 text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] text-purple-300 font-bold">누적 신한투자증권 ETF 자산</p>
                <p className="text-lg font-black text-white mt-0.5">₩48,500 <span className="text-xs text-emerald-400 font-bold font-mono">(+₩2,230)</span></p>
              </div>
              <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-[11px] rounded-xl shadow-md transition-all active:scale-95">
                포트폴리오 변경
              </button>
            </div>

            {/* 재원 구성안 안내 칩 */}
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-2 font-medium">
                <span className="text-purple-700 font-bold block">🏪 점주 지불 수수료 지원</span>
                <span className="text-slate-700 font-black">매 긱당 ₩425 (50%)</span>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-2 font-medium">
                <span className="text-blue-700 font-bold block">💸 알바비 잔돈 스윕</span>
                <span className="text-slate-700 font-black">매 긱당 ₩400 (자투리)</span>
              </div>
            </div>

            {/* 투자 종목 세부 리스트 */}
            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇺🇸</span>
                  <div>
                    <p className="font-bold text-slate-800">KODEX 미국S&P500 (소수점)</p>
                    <p className="text-[9px] text-slate-400">끝전 400원 매일 자동 매수</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">₩32,100</p>
                  <p className="text-[9px] text-emerald-600 font-bold">+5.2%</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏢</span>
                  <div>
                    <p className="font-bold text-slate-800">신한 STO 강남 타워 조각투자</p>
                    <p className="text-[9px] text-slate-400">부동산 블록체인 토큰증권 15주</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">₩16,400</p>
                  <p className="text-[9px] text-emerald-600 font-bold">+4.0%</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 💳 신한카드 대안신용(ACS) & 🌿 신한라이프 마이크로 연금 */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* 신한카드 ACS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-blue-600">
                <CreditCard className="w-4 h-4" />
                <span className="font-black text-xs text-slate-900">신한카드 ACS</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">대안신용점수 평가</p>
                <p className="text-sm font-black text-blue-600 mt-0.5">875점 <span className="text-[9px] text-slate-500 font-normal">(상위 2%)</span></p>
              </div>
              <div className="bg-blue-50 p-2 rounded-xl border border-blue-100 text-[10px] text-blue-800">
                💳 우대 대출 한도: <strong>+₩2,500,000</strong> 증액 완료
              </div>
            </div>

            {/* 신한라이프 연금 */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-black text-xs text-slate-900">신한라이프 연금</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">1% 자동 적립 연금</p>
                <p className="text-sm font-black text-emerald-600 mt-0.5">₩12,400 <span className="text-[9px] text-slate-500 font-normal">적립</span></p>
              </div>
              <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 text-[10px] text-emerald-800">
                ☂️ 18시간 초단기 상해보험 <strong>무상 100% 보장</strong>
              </div>
            </div>
          </div>

          {/* 4. 📋 지원자 긱워크 일한 내역 & 종합 수익·투자 정산 리포트 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Work History & Investment Ledger</span>
                <h4 className="font-black text-base text-slate-900 mt-0.5">내가 지금까지 일한 내역 & 수익·투자 리포트</h4>
                <p className="text-xs text-slate-500 mt-0.5">총 24건의 긱워크 완료 · 지각/노쇼 0건 · D-GCS 980점 달성</p>
              </div>
              <span className="text-[10.5px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                총 24회 완수
              </span>
            </div>

            {/* 수익 & 투자 종합 요약 3대 전광판 */}
            <div className="grid grid-cols-3 gap-2 text-center bg-gradient-to-br from-slate-900 to-[#0F172A] p-3.5 rounded-2xl text-white shadow-inner">
              <div className="border-r border-slate-800 pr-1">
                <p className="text-[10px] text-slate-400 font-bold">총 긱워크 수입</p>
                <p className="text-sm font-black text-white mt-0.5">₩1,420,000</p>
                <p className="text-[9px] text-emerald-400 mt-0.5">0.1초 입금 완료</p>
              </div>
              <div className="border-r border-slate-800 px-1">
                <p className="text-[10px] text-purple-300 font-bold">총 증권/연금 투자</p>
                <p className="text-sm font-black text-purple-300 mt-0.5">₩128,500</p>
                <p className="text-[9px] text-purple-200 mt-0.5">ETF+연금 적립</p>
              </div>
              <div className="pl-1">
                <p className="text-[10px] text-amber-300 font-bold">점주 수수료 지원</p>
                <p className="text-sm font-black text-amber-400 mt-0.5">₩10,200</p>
                <p className="text-[9px] text-amber-300 mt-0.5">5% 시너지 매칭</p>
              </div>
            </div>

            {/* 지금까지 일한 긱워크 카드 상세 리스트 */}
            <div className="space-y-3 pt-1">
              <h5 className="text-xs font-black text-slate-800 flex items-center justify-between">
                <span>최근 완료된 근무 목록 (3건 상세)</span>
                <span className="text-[10px] font-bold text-slate-400">신한DS 메인넷 검증 영수증 연동</span>
              </h5>

              {[
                {
                  id: 'h1',
                  storeName: '스타벅스 강남2호점',
                  category: '카페',
                  date: '2026-08-01 (토)',
                  time: '18:00 - 22:00 (4시간)',
                  pay: 54000,
                  hourlyRate: 13500,
                  investEtf: 825,
                  investPension: 540,
                  employerMatch: 425,
                  receiptNo: '0x8f3a...91b2 (Receipt #18492)',
                  review: '⭐ 5.0 점주: "정시 출근 및 음료 조리 숙련도가 매우 뛰어납니다!"'
                },
                {
                  id: 'h2',
                  storeName: '하남돼지집 부평역점',
                  category: '서빙',
                  date: '2026-07-29 (수)',
                  time: '19:00 - 23:00 (4시간)',
                  pay: 58000,
                  hourlyRate: 14500,
                  investEtf: 825,
                  investPension: 580,
                  employerMatch: 425,
                  receiptNo: '0x7e2b...44a1 (Receipt #18410)',
                  review: '⭐ 5.0 점주: "야간 피크 타임 홀 서빙을 완벽히 소화하셨습니다."'
                },
                {
                  id: 'h3',
                  storeName: 'CU 강남파이낸스점',
                  category: '편의점',
                  date: '2026-07-26 (일)',
                  time: '14:00 - 15:00 (1시간 초단기)',
                  pay: 16000,
                  hourlyRate: 16000,
                  investEtf: 425,
                  investPension: 160,
                  employerMatch: 425,
                  receiptNo: '0x5c1a...88f3 (Receipt #18388)',
                  review: '⭐ 5.0 점주: "1시간 긴급 물류 하역 완벽 처리 최고입니다."'
                },
              ].map(item => (
                <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                  {/* 헤더: 매장명 & 수령 급여 */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h6 className="font-black text-sm text-slate-900">{item.storeName}</h6>
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-0.5">{item.date} · <span className="font-semibold text-slate-700">{item.time}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-emerald-600">₩{item.pay.toLocaleString()}</p>
                      <p className="text-[9.5px] font-bold text-slate-400">시급 ₩{item.hourlyRate.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* 자동 투자 적립 명세 (신한투자증권 + 신한라이프 연금) */}
                  <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        📈 신한투자증권 소수점 ETF 적립:
                      </span>
                      <span className="font-black text-purple-700">
                        +₩{item.investEtf.toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">(점주 지원 ₩{item.employerMatch} 포함)</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        🌿 신한라이프 마이크로 연금 적립:
                      </span>
                      <span className="font-black text-emerald-700">
                        +₩{item.investPension.toLocaleString()} (1% 차감 적립)
                      </span>
                    </div>
                  </div>

                  {/* 점주 리뷰 및 메인넷 영수증 */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span className="text-amber-800 font-medium truncate max-w-[70%]">{item.review}</span>
                    <span className="font-mono text-indigo-600 font-bold truncate shrink-0">{item.receiptNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. ⚙️ 신한저축은행/캐피탈 & 신한DS 데이터 연동 보고서 */}
          <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-5 space-y-3 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-blue-400 tracking-wider uppercase">S-BRIDGE Affiliate Integration</span>
              <span className="text-[10px] font-bold text-slate-400">신한DS 메인넷 검증</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">🏦 신한저축은행/캐피탈 Cascade 연동</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">1금융권 이탈 방지 0.1초 중금리 대출 스탠바이</p>
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-full">
                  스탠바이
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">⚙️ 신한DS SBT 근태 영구 증명서</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">최근 1년간 지각/노쇼 0건 블록체인 박제</p>
                </div>
                <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded-full">
                  100% 영구인증
                </span>
              </div>
            </div>
          </div>

          {/* 5. 🤖 지원자 전용 AI 엔진: ① 알바 목표 매칭 & ③ 신용 패턴 분석 */}
          <div className="bg-[#0b0f19] rounded-3xl border border-indigo-500/30 p-5 space-y-3 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="font-black text-sm text-white">지원자 전용 AI 금융 비서 & 신용 평가 엔진</h4>
                  <p className="text-[10px] text-slate-400">Vercel AI SDK + gpt-4o-mini 추론 연동</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                알바생 전용 AI
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* ① 목표 매칭 AI */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-1">
                <div className="flex justify-between items-center text-indigo-300 font-bold text-[11px]">
                  <span>🎯 ① AI 긱 코칭 (목표: 아이패드 M4)</span>
                  <span className="text-emerald-400 font-mono text-[10px]">1,450ms</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "아이패드 M4까지 ₩187,500 남았어요! 하루 2시간 주말 긱 알바로 14일 만에 달성이 가능해요 💪"
                </p>
              </div>

              {/* ③ 신용 평가 AI */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-1">
                <div className="flex justify-between items-center text-emerald-300 font-bold text-[11px]">
                  <span>📊 ③ AI 신용 패턴 분석</span>
                  <span className="text-emerald-400 font-mono text-[10px]">1,210ms</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "연속 3회 조기 출근 + 4.9점 고평점 유지 패턴 감지 → D-GCS +10점, 신한카드 ₩500,000 한도 증액 자격 획득!"
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* 점주 마이페이지 탭 */
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
                  AI 예측 신용 등급: AAA (신한 7대 계열사 통합 검증)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-indigo-900/60 text-center">
              <div>
                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">신한 가맹점 계좌 잔액</p>
                <p className="text-xs font-black text-emerald-400 mt-1">₩18,500,000</p>
              </div>
              <div>
                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">급여 에스크로</p>
                <p className={`text-xs font-black mt-1 ${matched ? 'text-amber-400 font-extrabold animate-pulse' : 'text-slate-400'}`}>
                  {matched ? '₩52,500 [잠금]' : '₩0 [대기]'}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">신한카드 단기한도</p>
                <p className="text-xs font-black text-white mt-1">₩1,500,000</p>
              </div>
            </div>
          </div>

          {/* 에스크로 잠금 알림 */}
          {matched && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-5 text-emerald-200 space-y-2 relative overflow-hidden"
            >
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
              <h4 className="font-black text-base text-slate-900">가맹점 통합 코스트 & 세무 절감 리포트</h4>
              <p className="text-xs text-slate-400 mt-0.5">S-BRIDGE 스마트 정산을 통한 지출 및 절감액</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
                <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">총 급여 정산액</h5>
                <p className="text-sm font-black text-slate-800">₩2,450,000</p>
                <span className="text-[9px] text-slate-400">1초 정산 누적 지급</span>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-1">
                <h5 className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">세무대행비 절감액</h5>
                <p className="text-sm font-black text-indigo-600">₩142,000 Saved</p>
                <span className="text-[9px] text-indigo-400">4대보험 BATCH 자동 신고</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

type Tab = 'agent' | 'checkout' | 'dgcs' | 'mypage' | 'employer' | 'employer_finance' | 'employer_applicants' | 'admin';
type UserRole = 'worker' | 'employer';

const workerTabs: Array<{ id: Tab; Icon: any; label: string }> = [
  { id: 'agent',    Icon: Sparkles,    label: 'AI 매칭' },
  { id: 'checkout', Icon: DollarSign,  label: '정산/지갑' },
  { id: 'dgcs',     Icon: ShieldCheck, label: '안전/보험' },
  { id: 'mypage',   Icon: User,        label: '마이페이지' },
];

const employerTabs: Array<{ id: Tab; Icon: any; label: string }> = [
  { id: 'employer',            Icon: Store,       label: 'AI 구인/지도' },
  { id: 'employer_finance',    Icon: CreditCard,  label: '인건비/카드' },
  { id: 'employer_applicants', Icon: FileText,    label: '지원자 관리' },
  { id: 'admin',               Icon: Activity,    label: '관리자/마이' },
];

export default function ShinhanDDangApp() {
  const [userRole, setUserRole] = useState<UserRole>('worker');
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

  const currentTabs = userRole === 'worker' ? workerTabs : employerTabs;

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
    <AppPushProvider>
      <div className="min-h-screen bg-[#03030d] font-sans antialiased flex flex-col items-center justify-center sm:py-6 md:py-8 relative overflow-x-hidden">
      {/* 데스크톱 관람용 배경 어두운 앰비언트 글로우 */}
      <div className="hidden sm:block absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-[#03030d] to-black pointer-events-none" />

      {/* 모바일 디바이스 프레임 (데스크톱: 430px 마이크로 쉘, 모바일: 100% 풀스크린) */}
      <div className="w-full sm:max-w-[430px] min-h-screen sm:min-h-[850px] sm:max-h-[900px] bg-[#F4F6FA] text-slate-900 sm:rounded-[44px] sm:border-[8px] sm:border-slate-800/80 shadow-[0_0_60px_rgba(0,82,255,0.25)] flex flex-col relative overflow-hidden transition-all duration-300">
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

        {/* 상단 헤더 & 역할 모드 스위처 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-3.5 py-2 gap-1">
          {/* 로고 및 역할 스위처 */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="whitespace-nowrap">
              <p className="text-[8px] font-black text-[#0052FF] tracking-widest uppercase leading-none">Shinhan WORKS</p>
              <h1 className="font-black text-sm text-[#0F172A] leading-tight whitespace-nowrap">땡겨요 웍스</h1>
            </div>
            
            {/* 동적 역할 모드 스위처 캡슐 버튼 */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 shrink-0 ml-0.5">
              <button
                onClick={() => {
                  setUserRole('worker');
                  setActiveTab('agent');
                }}
                className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all ${
                  userRole === 'worker'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                👷 워커
              </button>
              <button
                onClick={() => {
                  setUserRole('employer');
                  setActiveTab('employer');
                }}
                className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all ${
                  userRole === 'employer'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🏪 점주
              </button>
            </div>
          </div>

          {/* 우측 지갑 & D-GCS 정보 영역 */}
          <div className="flex items-center gap-1 shrink-0 overflow-hidden">
            {wallet.isConnecting ? (
              <button disabled className="bg-blue-50 text-[#0052FF] text-[9.5px] font-black px-2 py-1 rounded-full border border-blue-200 flex items-center gap-1 whitespace-nowrap">
                <span className="animate-spin w-2.5 h-2.5 border-2 border-blue-600/30 border-t-[#0052FF] rounded-full" />
                연결 중...
              </button>
            ) : !walletConnected ? (
              <button 
                onClick={triggerWalletConnect}
                className="bg-[#0052FF] hover:bg-blue-700 active:scale-95 text-white text-[9.5px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap"
              >
                신한 슈퍼SOL
              </button>
            ) : (
              <button 
                onClick={() => {
                  setShowWalletDropdown(!showWalletDropdown);
                  setShowCreditDropdown(false);
                }}
                className="flex items-center gap-1 active:scale-95 transition-transform text-right shrink-0"
              >
                <span className="relative overflow-hidden inline-flex items-center text-[9px] font-black px-1.5 py-0.5 rounded-full animate-hologram bg-[linear-gradient(120deg,#6366f1,#a855f7,#ec4899,#3b82f6,#6366f1)] text-white shadow-sm whitespace-nowrap">
                  D-GCS 990점
                </span>
                <span className="text-[9.5px] font-black text-indigo-600 flex items-center gap-0.5 whitespace-nowrap bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                  🪙 {solcBalance.toFixed(1)} SOLC
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

      {/* 메인 콘텐츠 영역 (동적 탭 렌더링) */}
      <main className="flex-1 overflow-y-auto px-3.5 pt-3 pb-2">
        <AnimatePresence mode="wait">
          {activeTab === 'agent' && (
            <motion.div key="agent" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <AgentTab />
            </motion.div>
          )}

          {(activeTab === 'employer' || activeTab === 'employer_applicants') && (
            <motion.div key="employer" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <EmployerTab matched={matched} setMatched={setMatched} />
            </motion.div>
          )}

          {activeTab === 'employer_finance' && (
            <motion.div key="employer_finance" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="-mx-3.5 -mt-3">
              <EmployerMyPage />
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

          {activeTab === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="pb-6">
              <AdminDashboard />
            </motion.div>
          )}

          {activeTab === 'dgcs' && (
            <motion.div key="dgcs" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="-mx-4 pb-6">
              <DGCSScreen />
            </motion.div>
          )}

          {activeTab === 'mypage' && (
            <motion.div key="mypage" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
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
        </AnimatePresence>
      </main>

      {/* 역할 기반 슬림 4개 탭 동적 하단 내비게이션 바 */}
      <nav className="sticky bottom-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {currentTabs.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all active:scale-90 ${
                activeTab === id
                  ? 'text-[#0052FF]'
                  : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                activeTab === id
                  ? 'bg-blue-50'
                  : ''
              }`}>
                <Icon className={`w-5 h-5 ${activeTab === id ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] font-black tracking-tight ${
                activeTab === id
                  ? 'text-[#0052FF]'
                  : 'text-slate-400'
              }`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>

        {/* 모바일 하단 홈 인디케이터 바 (데스크톱 관람용) */}
        <div className="hidden sm:block py-1 bg-white border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto" />
        </div>
      </div>
    </div>
    </AppPushProvider>
  );
}
