'use client';

// app/components/LiveMatchingBoard.tsx
// Instawork-Level Global #1 Gig Work Marketplace UI — 0.1s Instant Pay & Escrow

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Users, Eye, Zap, CheckCircle2,
  Flame, Search, Store, RefreshCw, Star, ShieldCheck, Sparkles, ChevronRight,
  TrendingUp, Award, DollarSign, ShieldAlert, Check
} from 'lucide-react';
import { useAppPush } from './AppPushToast';

type GigStatus = 'open' | 'matching' | 'full' | 'closed';

interface LiveGig {
  id: string;
  storeName: string;
  category: string;
  district: string;
  distanceM: number;
  role: string;
  hours: number;
  pay: number;
  hourlyRate: number;
  totalSlots: number;
  filledSlots: number;
  applicants: number;
  viewers: number;
  postedAt: Date;
  status: GigStatus;
  urgency: boolean;
  rating: number;
  escrowLocked: boolean;
  aiScore: number;
  shiftTime: string;
  partnerTier: '신한 Gold 파트너' | '신한 VIP 파트너' | '신한 인증 가맹점';
}

const GIGS_SEED: Omit<LiveGig, 'postedAt' | 'viewers' | 'applicants'>[] = [
  {
    id: 'g1', storeName: '스타벅스 강남2호점', category: '카페', district: '강남구',
    distanceM: 480, role: '홀 서빙 & 음료 조리', hours: 4, pay: 54000, hourlyRate: 13500, totalSlots: 2,
    filledSlots: 0, status: 'open', urgency: true, rating: 4.9, escrowLocked: true, aiScore: 98,
    shiftTime: '18:00 - 22:00', partnerTier: '신한 Gold 파트너'
  },
  {
    id: 'g2', storeName: '하남돼지집 부평역점', category: '서빙', district: '인천 부평구',
    distanceM: 320, role: '야간 메인 서빙 & 피크 타임 지원', hours: 4, pay: 58000, hourlyRate: 14500, totalSlots: 3,
    filledSlots: 1, status: 'open', urgency: true, rating: 4.8, escrowLocked: true, aiScore: 95,
    shiftTime: '19:00 - 23:00', partnerTier: '신한 VIP 파트너'
  },
  {
    id: 'g3', storeName: 'CU 강남파이낸스점', category: '편의점', district: '강남구',
    distanceM: 150, role: '1시간 물류 하역 초단기 알바', hours: 1, pay: 16000, hourlyRate: 16000, totalSlots: 1,
    filledSlots: 0, status: 'open', urgency: true, rating: 4.9, escrowLocked: true, aiScore: 99,
    shiftTime: '14:00 - 15:00', partnerTier: '신한 Gold 파트너'
  },
  {
    id: 'g4', storeName: '컴포즈커피 역삼역점', category: '카페', district: '강남구',
    distanceM: 220, role: '점심 2시간 음료 조리 & 픽업 지원', hours: 2, pay: 30000, hourlyRate: 15000, totalSlots: 2,
    filledSlots: 0, status: 'open', urgency: true, rating: 4.8, escrowLocked: true, aiScore: 97,
    shiftTime: '12:00 - 14:00', partnerTier: '신한 인증 가맹점'
  },
  {
    id: 'g5', storeName: '맥도날드 서초점', category: '패스트푸드', district: '서초구',
    distanceM: 1200, role: '캐셔 및 주방 보조', hours: 6, pay: 75000, hourlyRate: 12500, totalSlots: 3,
    filledSlots: 2, status: 'matching', urgency: false, rating: 4.4, escrowLocked: true, aiScore: 88,
    shiftTime: '16:00 - 22:00', partnerTier: '신한 인증 가맹점'
  },
  {
    id: 'g6', storeName: '이마트 역삼점', category: '마트', district: '강남구',
    distanceM: 900, role: '매장 진열 & 물류 관리', hours: 5, pay: 65000, hourlyRate: 13000, totalSlots: 2,
    filledSlots: 0, status: 'open', urgency: false, rating: 4.6, escrowLocked: true, aiScore: 81,
    shiftTime: '10:00 - 15:00', partnerTier: '신한 Gold 파트너'
  },
  {
    id: 'g7', storeName: '투썸플레이스 홍대입구역점', category: '카페', district: '마포구',
    distanceM: 650, role: '주말 오더 & 마감 지원', hours: 4, pay: 52000, hourlyRate: 13000, totalSlots: 2,
    filledSlots: 1, status: 'matching', urgency: true, rating: 4.7, escrowLocked: true, aiScore: 92,
    shiftTime: '18:00 - 22:00', partnerTier: '신한 VIP 파트너'
  },
  {
    id: 'g8', storeName: 'GS25 대치중앙점', category: '편의점', district: '강남구',
    distanceM: 280, role: '야간 편의점 단기 알바', hours: 8, pay: 104000, hourlyRate: 13000, totalSlots: 1,
    filledSlots: 0, status: 'open', urgency: true, rating: 4.5, escrowLocked: true, aiScore: 91,
    shiftTime: '23:00 - 07:00', partnerTier: '신한 인증 가맹점'
  },
  {
    id: 'g9', storeName: '세븐일레븐 테헤란점', category: '편의점', district: '강남구',
    distanceM: 380, role: '1시간 매장 세팅 긴급 보조', hours: 1, pay: 15000, hourlyRate: 15000, totalSlots: 1,
    filledSlots: 0, status: 'open', urgency: true, rating: 4.6, escrowLocked: true, aiScore: 89,
    shiftTime: '17:00 - 18:00', partnerTier: '신한 Gold 파트너'
  },
];

function makeGigs(): LiveGig[] {
  const now = Date.now();
  return GIGS_SEED.map((g, i) => ({
    ...g,
    urgency: g.hours === 1 || g.hours === 2 || g.hours === 4 || g.urgency,
    postedAt: new Date(now - (i * 3 + 1) * 60 * 1000),
    viewers: Math.floor(Math.random() * 28) + 12,
    applicants: g.filledSlots + Math.floor(Math.random() * 3),
  }));
}

function elapsed(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return `${sec}초 전`;
  if (sec < 3600) return `${Math.floor(sec / 60)}분 전`;
  return `${Math.floor(sec / 3600)}시간 전`;
}

const CATEGORIES = [
  { id: '전체', label: '전체 시프트' },
  { id: '서빙', label: '🍽️ 홀/서빙' },
  { id: '카페', label: '☕ 카페/바리스타' },
  { id: '편의점', label: '🏪 편의점' },
  { id: '패스트푸드', label: '🍔 패스트푸드' },
  { id: '마트', label: '📦 물류/마트' },
];

const LIVE_NOTIFICATIONS = [
  '⚡ 3초 전 이지성님 [하남돼지집 부평역점] ₩58,000 0.1초 즉시 정산 완료!',
  '🔒 신한은행 에스크로 스마트 계약 ₩54,000 원장 예치 확정',
  '🛡️ 신한EZ손해보험 비급여 상해 보장 출근 스와이프 개시',
  '📈 1천원 미만 잔돈 신한투자증권 KODEX ETF 자동 매수 완료',
];

type SortOption = 'ai' | 'wage_desc' | 'wage_asc' | 'dist_asc' | 'dist_desc' | 'pay_desc';
type HourFilter = 'all' | '1h' | '2h' | '4h' | '5h_plus';

const HOUR_FILTERS: { id: HourFilter; label: string }[] = [
  { id: 'all', label: '전체시간' },
  { id: '1h', label: '⚡ 1시간 (초단기)' },
  { id: '2h', label: '⏱️ 2시간' },
  { id: '4h', label: '4시간' },
  { id: '5h_plus', label: '5시간 이상' },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'ai', label: '✨ AI 맞춤 추천순' },
  { id: 'wage_desc', label: '💰 시급 높은순' },
  { id: 'wage_asc', label: '💵 시급 낮은순' },
  { id: 'dist_asc', label: '📍 거리 가까운순' },
  { id: 'dist_desc', label: '🧭 거리 먼순' },
  { id: 'pay_desc', label: '💵 총수령액 높은순' },
];

// ── Instawork 퀄리티 시프트 카드 컴포넌트 ──
function InstaworkShiftCard({ gig, index, onApply }: { gig: LiveGig; index: number; onApply: (id: string) => void }) {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { triggerPush } = useAppPush();

  const handleApply = async () => {
    if (applied || gig.status === 'full') return;
    setIsApplying(true);
    await new Promise(r => setTimeout(r, 800));
    setApplied(true);
    setIsApplying(false);
    onApply(gig.id);

    triggerPush({
      title: `[지원 접수] ${gig.storeName}`,
      body: `이지성님의 ${gig.role} 시프트 지원서가 정상 접수되었습니다. (신한 에스크로 락업 대기)`,
      type: 'apply',
      actionText: '지원 상태 보기',
    });

    setTimeout(() => {
      triggerPush({
        title: `[점주 알림 수신] ${gig.storeName}`,
        body: `이지성 지원자(D-GCS 980점 Gold Pro)의 맞춤 시프트 지원서가 점주 앱으로 전송되었습니다.`,
        type: 'confirm',
        actionText: '점주 탭 바로가기',
      });
    }, 2000);
  };

  const remaining = gig.totalSlots - gig.filledSlots;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 220 }}
      className={`
        relative rounded-3xl p-5 border transition-all duration-300 overflow-hidden text-left shadow-xl
        ${gig.urgency
          ? 'bg-gradient-to-br from-[#0B0F19] via-[#111C38] to-[#0A1128] border-orange-500/40 ring-1 ring-orange-500/30'
          : 'bg-[#0F172A] border-slate-800 hover:border-blue-500/40'}
      `}
    >
      {/* 배경 글로우 회오리 */}
      <div
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: gig.urgency ? '#f97316' : '#3b82f6' }}
      />

      {/* 1. 상단 트러스트 뱃지 바 */}
      <div className="flex items-center justify-between mb-3.5 relative z-10 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(gig.hours === 1 || gig.hours === 2 || gig.hours === 4 || gig.urgency) && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-md shadow-orange-500/30 animate-pulse">
              <Flame className="w-3 h-3 fill-white" /> 🔥 긴급 ({gig.hours}시간 시프트)
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            ⚡ 0.1초 즉시 매칭
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            ⚡ Instant Pay (0.1초 정산)
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            🔒 신한 에스크로 예치
          </span>
        </div>

        {/* Instawork AI 추천 점수 */}
        <div className="flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full px-2.5 py-0.5 shrink-0">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span className="text-xs font-black text-indigo-300">{gig.aiScore}점 Match</span>
        </div>
      </div>

      {/* 2. 매장 정보 & 총 급여 뷰 (Instawork 헤더 카드) */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-black text-blue-400 text-sm">
              {gig.storeName[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-white tracking-tight">{gig.storeName}</h3>
                <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" /> {gig.rating}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-mono">{gig.partnerTier}</p>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-200 pt-1 flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-blue-400" />
            <span>{gig.role}</span>
          </p>
        </div>

        {/* 금액 하이라이트 박스 (Instawork Style Earnings Box) */}
        <div className="text-right flex-shrink-0 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/40 rounded-2xl p-2.5 shadow-md">
          <p className="text-xl font-black text-emerald-400 leading-none">
            ₩{gig.pay.toLocaleString()}
          </p>
          <p className="text-[10.5px] font-black text-emerald-300/90 mt-1">
            시급 ₩{gig.hourlyRate.toLocaleString()}
          </p>
          <span className="text-[9px] font-bold text-slate-400 block mt-0.5">({gig.hours}시간 시프트)</span>
        </div>
      </div>

      {/* 3. 근무 핵심 그리드 (Instawork Shift Details) */}
      <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-800/80 mb-3.5 text-center text-xs">
        <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-bold">
            <MapPin className="w-3 h-3 text-indigo-400" /> 위치/거리
          </p>
          <p className="font-black text-slate-200 mt-0.5">{gig.distanceM}m <span className="text-[10px] text-slate-400 font-normal">({gig.district})</span></p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-bold">
            <Clock className="w-3 h-3 text-amber-400" /> 시프트 시간
          </p>
          <p className="font-black text-amber-300 mt-0.5">{gig.shiftTime}</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-bold">
            <Users className="w-3 h-3 text-emerald-400" /> 모집 현황
          </p>
          <p className="font-black text-emerald-400 mt-0.5">{gig.filledSlots}/{gig.totalSlots}명 <span className="text-[10px] text-emerald-300 font-normal">({remaining}자리)</span></p>
        </div>
      </div>

      {/* 4. AI 맞춤 적합도 매칭 프로그레스 바 */}
      <div className="bg-slate-900/80 rounded-2xl p-2.5 border border-slate-800 mb-3 space-y-1.5">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Award className="w-3 h-3 text-indigo-400" /> AI 맞춤 매칭 적합도 (D-GCS 980점)
          </span>
          <span className="font-black text-indigo-300">{gig.aiScore}% Match</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${gig.aiScore}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] text-slate-400 pt-0.5">
          <span>🛡️ 신한EZ손보 상해보장 100% 무상</span>
          <span>🔒 0.1초 에스크로 즉시 정산</span>
        </div>
      </div>

      {/* 5. 실시간 동시 시청자 수 & 등록 시간 */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <strong className="text-slate-200">{gig.viewers}명</strong>의 지원자가 보고 있습니다
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          {elapsed(gig.postedAt)} 등록
        </span>
      </div>

      {/* 6. 지원 버튼 */}
      {applied ? (
        <div className="w-full py-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-black text-emerald-300">✓ 지원 완료 · 0.1초 신한 에스크로 결제 대기</span>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleApply}
          disabled={isApplying || gig.status === 'full'}
          className={`
            w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95
            ${gig.status === 'full'
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : gig.urgency
                ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white shadow-orange-500/30 hover:brightness-110'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/30 hover:brightness-110'}
          `}
        >
          {isApplying ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saga 0.1초 시프트 매칭 승인 중...
            </span>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>⚡ 0.1초 시프트 즉시 지원 & Instant Pay 예약</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}

// ── 메인 컴포넌트 ──
export default function LiveMatchingBoard() {
  const [gigs, setGigs] = useState<LiveGig[]>(() => makeGigs());
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedHours, setSelectedHours] = useState<HourFilter>('all');
  const [sortMode, setSortMode] = useState<SortOption>('ai');
  const [searchText, setSearchText] = useState('');
  const [onlineCount, setOnlineCount] = useState(58);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationIdx, setNotificationIdx] = useState(0);

  // 4초마다 롤링 알림 변경
  useEffect(() => {
    const t = setInterval(() => {
      setNotificationIdx(i => (i + 1) % LIVE_NOTIFICATIONS.length);
      setOnlineCount(c => Math.max(40, c + Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setGigs(makeGigs());
    setIsRefreshing(false);
  }, []);

  const handleApply = useCallback((id: string) => {
    setGigs(prev => prev.map(g =>
      g.id === id ? { ...g, applicants: g.applicants + 1, filledSlots: Math.min(g.totalSlots, g.filledSlots + 1) } : g
    ));
  }, []);

  // 필터링 및 정렬 처리
  const filtered = gigs
    .filter(g => {
      const matchCat = selectedCategory === '전체' || g.category === selectedCategory;
      const matchSearch = !searchText || g.storeName.includes(searchText) || g.role.includes(searchText);

      let matchHour = true;
      if (selectedHours === '1h') matchHour = g.hours === 1;
      else if (selectedHours === '2h') matchHour = g.hours === 2;
      else if (selectedHours === '4h') matchHour = g.hours === 4;
      else if (selectedHours === '5h_plus') matchHour = g.hours >= 5;

      return matchCat && matchSearch && matchHour;
    })
    .sort((a, b) => {
      if (sortMode === 'wage_desc') return b.hourlyRate - a.hourlyRate;
      if (sortMode === 'wage_asc') return a.hourlyRate - b.hourlyRate;
      if (sortMode === 'dist_asc') return a.distanceM - b.distanceM;
      if (sortMode === 'dist_desc') return b.distanceM - a.distanceM;
      if (sortMode === 'pay_desc') return b.pay - a.pay;
      return b.aiScore - a.aiScore;
    });

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Instawork 스타일 프리미엄 대시보드 헤더 */}
      <div className="bg-gradient-to-br from-[#090D16] via-[#10182D] to-[#080D1A] rounded-3xl p-5 border border-blue-500/30 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <span className="text-[9.5px] font-black text-emerald-400 tracking-widest uppercase block">Shinhan 7-Core Global Marketplace</span>
              <h2 className="text-base font-black text-white">실시간 0.1초 긱 시프트 센터</h2>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/90 hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-700 active:scale-95 transition-all shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        {/* 3대 핵심 긱 시프트 전광판 */}
        <div className="grid grid-cols-3 gap-2 text-center py-3 bg-slate-900/70 rounded-2xl border border-slate-800/80 mb-3 shadow-inner">
          <div>
            <p className="text-2xl font-black text-white">{gigs.filter(g => g.status === 'open').length}건</p>
            <p className="text-[10.5px] font-bold text-slate-400 mt-0.5">매칭 즉시가능</p>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-400">{gigs.filter(g => g.urgency).length}건</p>
            <p className="text-[10.5px] font-bold text-amber-300/90 mt-0.5">오늘 긴급 시프트</p>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-400">{onlineCount}명</p>
            <p className="text-[10.5px] font-bold text-emerald-300/90 mt-0.5">동시 접속 Pro</p>
          </div>
        </div>

        {/* 실시간 마키 롤링 티커 */}
        <div className="bg-blue-950/60 border border-blue-500/30 rounded-xl px-3.5 py-2 flex items-center gap-2.5 mb-3">
          <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
          <AnimatePresence mode="wait">
            <motion.p
              key={notificationIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[11px] font-bold text-blue-200 truncate"
            >
              {LIVE_NOTIFICATIONS[notificationIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 트러스트 메트릭스 바 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800/80">
          <span className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shadow-xs">
            ⭐ 99.8% 긱 시프트 매칭 성공률
          </span>
          <span className="bg-blue-500/15 border border-blue-500/40 text-blue-300 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shadow-xs">
            ⚡ 0.1s Instant Pay (0.1초 정산)
          </span>
          <span className="bg-indigo-500/15 border border-indigo-500/40 text-indigo-200 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shadow-xs">
            🛡️ D-GCS 성실도 980점
          </span>
        </div>
      </div>

      {/* 2. 검색창 */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="매장명·직종 검색 (예: 스타벅스, 서빙, 부평, 카페)..."
          className="w-full bg-[#0F172A] border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
        />
      </div>

      {/* 3. 카테고리 태그 칩 & 근무시간 필터 칩 */}
      <div className="space-y-2.5">
        {/* 카테고리 필터 */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 font-black'
                  : 'bg-[#0F172A] border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 근무시간 범위 필터 칩 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 bg-slate-900/70 p-2.5 rounded-2xl border border-slate-800">
          <span className="text-[10.5px] font-black text-slate-400 flex items-center gap-1 pl-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> 근무시간:
          </span>
          {HOUR_FILTERS.map(hf => (
            <button
              key={hf.id}
              onClick={() => setSelectedHours(hf.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                selectedHours === hf.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {hf.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 시프트 목록 & 정렬 컨트롤 바 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
          <span>총 <strong className="text-white font-black">{filtered.length}개</strong>의 추천 시프트</span>
          
          {/* 정렬 드롭다운 */}
          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value as SortOption)}
            className="bg-slate-900 border border-slate-700 text-amber-300 text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-amber-400 transition-all cursor-pointer shadow-sm"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-[#0F172A] rounded-3xl border border-slate-800 text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-xs font-bold text-slate-300">선택하신 조건에 맞는 시프트 공고가 없습니다</p>
              <button
                onClick={() => {
                  setSelectedCategory('전체');
                  setSelectedHours('all');
                  setSearchText('');
                  setSortMode('ai');
                }}
                className="mt-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-xl hover:bg-blue-600/30 transition-all"
              >
                필터 조건 초기화
              </button>
            </div>
          ) : (
            filtered.map((gig, i) => (
              <InstaworkShiftCard key={gig.id} gig={gig} index={i} onApply={handleApply} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
