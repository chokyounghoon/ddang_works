'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Users, Eye, Zap, CheckCircle2,
  Flame, AlertCircle, ChevronRight, Search, SlidersHorizontal,
  Store, ArrowUpRight, RefreshCw, Star,
} from 'lucide-react';

// ─── 타입 ──────────────────────────────────────────────────────────────────

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
  totalSlots: number;
  filledSlots: number;
  applicants: number;
  viewers: number;
  postedAt: Date;
  status: GigStatus;
  urgency: boolean;   // 긴급 공고
  rating: number;     // 매장 평점
  escrowLocked: boolean;
  aiScore: number;    // AI 추천 점수 (0~100)
}

// ─── 시뮬레이션 데이터 ─────────────────────────────────────────────────────

const GIGS_SEED: Omit<LiveGig, 'postedAt' | 'viewers' | 'applicants'>[] = [
  {
    id: 'g1', storeName: '스타벅스 강남2호점', category: '카페', district: '강남구',
    distanceM: 480, role: '홀 서빙', hours: 4, pay: 50000, totalSlots: 2,
    filledSlots: 0, status: 'open', urgency: true, rating: 4.8, escrowLocked: true, aiScore: 97,
  },
  {
    id: 'g2', storeName: '맥도날드 서초점', category: '패스트푸드', district: '서초구',
    distanceM: 1200, role: '캐셔·주방 보조', hours: 6, pay: 75000, totalSlots: 3,
    filledSlots: 2, status: 'matching', urgency: false, rating: 4.3, escrowLocked: true, aiScore: 82,
  },
  {
    id: 'g3', storeName: '이마트 역삼점', category: '마트', district: '강남구',
    distanceM: 900, role: '매장 진열 관리', hours: 5, pay: 62000, totalSlots: 1,
    filledSlots: 0, status: 'open', urgency: false, rating: 4.6, escrowLocked: true, aiScore: 75,
  },
  {
    id: 'g4', storeName: '파리바게트 삼성점', category: '베이커리', district: '강남구',
    distanceM: 650, role: '판매·포장 보조', hours: 4, pay: 48000, totalSlots: 2,
    filledSlots: 2, status: 'full', urgency: false, rating: 4.1, escrowLocked: false, aiScore: 61,
  },
  {
    id: 'g5', storeName: '롯데리아 신논현점', category: '패스트푸드', district: '서초구',
    distanceM: 1800, role: '홀 청소·서빙', hours: 3, pay: 37500, totalSlots: 2,
    filledSlots: 1, status: 'matching', urgency: true, rating: 3.9, escrowLocked: true, aiScore: 69,
  },
  {
    id: 'g6', storeName: 'GS25 대치점', category: '편의점', district: '강남구',
    distanceM: 320, role: '야간 편의점 알바', hours: 8, pay: 96000, totalSlots: 1,
    filledSlots: 0, status: 'open', urgency: true, rating: 4.5, escrowLocked: true, aiScore: 91,
  },
];

function makeGigs(): LiveGig[] {
  const now = Date.now();
  return GIGS_SEED.map((g, i) => ({
    ...g,
    postedAt: new Date(now - (i * 4 + 2) * 60 * 1000), // 순서대로 2~26분 전
    viewers: Math.floor(Math.random() * 18) + 3,
    applicants: g.filledSlots + Math.floor(Math.random() * 4),
  }));
}

// ─── 헬퍼 ──────────────────────────────────────────────────────────────────

function elapsed(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60)  return `${sec}초 전`;
  if (sec < 3600) return `${Math.floor(sec / 60)}분 전`;
  return `${Math.floor(sec / 3600)}시간 전`;
}

const STATUS_CONFIG: Record<GigStatus, { label: string; dot: string; badge: string }> = {
  open:     { label: '매칭 가능',  dot: 'bg-emerald-400',  badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  matching: { label: '매칭 중',    dot: 'bg-amber-400',    badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  full:     { label: '자리 없음',  dot: 'bg-slate-300',    badge: 'bg-slate-50 text-slate-500 border-slate-200' },
  closed:   { label: '마감',       dot: 'bg-red-400',      badge: 'bg-red-50 text-red-600 border-red-200' },
};

const CATEGORIES = ['전체', '카페', '패스트푸드', '마트', '베이커리', '편의점'];

// ─── Gig 카드 ───────────────────────────────────────────────────────────────

function GigCard({ gig, index, onApply }: { gig: LiveGig; index: number; onApply: (id: string) => void }) {
  const [now, setNow] = useState(new Date());
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const s = STATUS_CONFIG[gig.status];
  const remaining = gig.totalSlots - gig.filledSlots;
  const canApply = gig.status === 'open' || gig.status === 'matching';

  const handleApply = async () => {
    if (applied || !canApply) return;
    setIsApplying(true);
    await new Promise(r => setTimeout(r, 900));
    setApplied(true);
    setIsApplying(false);
    onApply(gig.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`bg-white rounded-3xl border shadow-sm overflow-hidden ${
        gig.urgency ? 'border-orange-200' : 'border-slate-100'
      }`}
    >
      {/* 긴급 배너 */}
      {gig.urgency && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 flex items-center gap-1.5">
          <Flame className="w-3 h-3 text-white" />
          <span className="text-[10px] font-black text-white tracking-widest">긴급 공고 · 오늘만</span>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {/* 상태 배지 */}
              <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border ${s.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${gig.status === 'open' ? 'animate-pulse' : ''}`} />
                {s.label}
              </span>
              {gig.escrowLocked && (
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
                  🔒 에스크로
                </span>
              )}
            </div>
            <h3 className="font-black text-sm text-slate-900 truncate">{gig.storeName}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Store className="w-3 h-3" />{gig.category} · {gig.role}
            </p>
          </div>

          {/* AI 추천 점수 */}
          <div className="flex-shrink-0 text-center">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border-2 ${
              gig.aiScore >= 90 ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : gig.aiScore >= 70 ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              {gig.aiScore}
            </div>
            <p className="text-[8px] text-slate-400 mt-0.5">AI매칭</p>
          </div>
        </div>

        {/* 정보 그리드 */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 rounded-xl p-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
            <p className="text-[10px] font-black text-slate-700">{gig.distanceM}m</p>
            <p className="text-[8px] text-slate-400">{gig.district}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
            <p className="text-[10px] font-black text-slate-700">{gig.hours}시간</p>
            <p className="text-[8px] text-slate-400">근무 시간</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2">
            <p className="text-[10px] font-black text-emerald-700">₩{gig.pay.toLocaleString()}</p>
            <p className="text-[8px] text-emerald-500">실수령액</p>
          </div>
        </div>

        {/* 실시간 현황 바 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500">매칭 현황</span>
            <span className="font-black text-slate-700">
              {gig.filledSlots}/{gig.totalSlots} 자리
              {remaining > 0 && <span className="text-emerald-600"> · {remaining}자리 남음</span>}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(gig.filledSlots / gig.totalSlots) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.06 + 0.2 }}
              className={`h-full rounded-full ${
                gig.status === 'full' ? 'bg-slate-400'
                : gig.filledSlots / gig.totalSlots >= 0.5 ? 'bg-amber-400'
                : 'bg-emerald-400'
              }`}
            />
          </div>
        </div>

        {/* 실시간 지표 */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {gig.viewers + Math.floor((Date.now() - gig.postedAt.getTime()) / 60000) % 3}명 보는 중
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {gig.applicants}명 신청
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            {elapsed(gig.postedAt)}
          </span>
        </div>

        {/* 지원 버튼 */}
        {applied ? (
          <div className="w-full py-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-black text-emerald-700">지원 완료 · AI 매칭 중</span>
          </div>
        ) : (
          <button
            onClick={handleApply}
            disabled={!canApply || isApplying}
            className={`w-full py-3 rounded-2xl font-black text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              !canApply
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : gig.urgency
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)]'
                  : 'bg-[#0052FF] text-white shadow-[0_4px_20px_rgba(0,82,255,0.25)]'
            }`}
          >
            {isApplying ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> AI 매칭 요청 중...</>
            ) : !canApply ? (
              <>{gig.status === 'full' ? '자리 없음' : '마감됨'}</>
            ) : (
              <><Zap className="w-4 h-4" /> 즉시 지원하기 <ChevronRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────

export default function LiveMatchingBoard() {
  const [gigs, setGigs] = useState<LiveGig[]>(() => makeGigs());
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchText, setSearchText] = useState('');
  const [onlineCount, setOnlineCount] = useState(47);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalApplied, setTotalApplied] = useState(0);

  // 10초마다 뷰어수 실시간 증감
  useEffect(() => {
    const t = setInterval(() => {
      setOnlineCount(c => Math.max(30, c + Math.floor(Math.random() * 5) - 2));
      setGigs(prev => prev.map(g => ({
        ...g,
        viewers: Math.max(1, g.viewers + Math.floor(Math.random() * 3) - 1),
      })));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 700));
    setGigs(makeGigs());
    setLastRefresh(new Date());
    setIsRefreshing(false);
  }, []);

  const handleApply = useCallback((id: string) => {
    setTotalApplied(c => c + 1);
    setGigs(prev => prev.map(g =>
      g.id === id ? { ...g, applicants: g.applicants + 1 } : g
    ));
  }, []);

  const filtered = gigs.filter(g => {
    const matchCat = selectedCategory === '전체' || g.category === selectedCategory;
    const matchSearch = !searchText || g.storeName.includes(searchText) || g.role.includes(searchText);
    return matchCat && matchSearch;
  });

  const openCount = gigs.filter(g => g.status === 'open').length;
  const matchingCount = gigs.filter(g => g.status === 'matching').length;

  return (
    <div className="space-y-4 pb-8">
      {/* 실시간 헤더 */}
      <div className="bg-gradient-to-br from-[#0052FF] to-indigo-700 rounded-3xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase">실시간 구인 매칭</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-[10px] text-blue-200 active:scale-95"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl font-black">{openCount}</p>
            <p className="text-[10px] text-blue-200">매칭 가능</p>
          </div>
          <div>
            <p className="text-2xl font-black">{matchingCount}</p>
            <p className="text-[10px] text-blue-200">매칭 진행 중</p>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-300">{onlineCount}</p>
            <p className="text-[10px] text-blue-200">지금 접속 중</p>
          </div>
        </div>

        <p className="text-[9px] text-blue-200 mt-2 text-right">
          마지막 업데이트: {lastRefresh.toLocaleTimeString('ko-KR')}
        </p>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="매장명·직종 검색"
          className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#0052FF]/40 focus:ring-2 focus:ring-[#0052FF]/10 shadow-sm"
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${
              selectedCategory === cat
                ? 'bg-[#0052FF] text-white shadow-[0_2px_8px_rgba(0,82,255,0.25)]'
                : 'bg-white border border-slate-200 text-slate-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 지원 현황 배너 */}
      {totalApplied > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <p className="text-sm font-black text-emerald-700">{totalApplied}건 지원 완료 · AI 매칭 진행 중</p>
        </motion.div>
      )}

      {/* 정렬 레이블 */}
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>총 {filtered.length}개 공고</span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> AI 추천순
        </span>
      </div>

      {/* 긱 카드 목록 */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-slate-400"
          >
            <Search className="w-10 h-10 mx-auto mb-2 text-slate-200" />
            <p className="text-sm font-bold">검색 결과가 없습니다</p>
          </motion.div>
        ) : (
          filtered
            .sort((a, b) => b.aiScore - a.aiScore)
            .map((gig, i) => (
              <GigCard key={gig.id} gig={gig} index={i} onApply={handleApply} />
            ))
        )}
      </AnimatePresence>
    </div>
  );
}
