'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Sparkles, CreditCard, Landmark, Cpu, User,
  Store, DollarSign, CheckCircle2, ArrowUpRight, MapPin,
  Clock, CloudRain, Zap, ChevronRight, TrendingUp,
  Banknote, Trophy, Flame, BarChart3, Lock, Unlock,
  AlertCircle, ChevronDown, Copy, LogOut, ExternalLink,
  Coins, Activity, Layers, FileText, Scale, ShieldAlert, Receipt, Building2, Camera, X, Check, RefreshCw,
  MessageSquare, Users, UserCheck, Star, Navigation, Award, Search, SlidersHorizontal, Info, PieChart,
  Bell,
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
const AlbamonChatScreen = dynamic(() => import('./components/AlbamonChatScreen'), { ssr: false });
const AlbamonCommunityScreen = dynamic(() => import('./components/AlbamonCommunityScreen'), { ssr: false });
const InstantContractModal = dynamic(() => import('./components/InstantContractModal'), { ssr: false });
const CheckoutScreen = dynamic(() => import('./components/CheckoutScreen'), { ssr: false });
const HealthCertModal = dynamic(() => import('./components/HealthCertModal'), { ssr: false });
const GpsCheckInModal = dynamic(() => import('./components/GpsCheckInModal'), { ssr: false });
const OneShinhanSynergyDetailModal = dynamic(() => import('./components/OneShinhanSynergyDetailModal'), { ssr: false });
const WorkerProfileDetailModal = dynamic(() => import('./components/WorkerProfileDetailModal'), { ssr: false });
const LiveNotificationModal = dynamic(() => import('./components/LiveNotificationModal'), { ssr: false });
import { AppPushProvider, useAppPush } from './components/AppPushToast';
import { useGigStore } from '../store/useGigStore';
import { parseIntentAndExecuteTools } from './lib/dodamAgent';

// ─── 신한투자증권 연계 포트폴리오 데이터 ───────────────────────────────────

export interface PortfolioProduct {
  id: string;
  name: string;
  badge: string;
  yield: string;
  yieldNum: number;
  category: ('ALL' | 'POPULAR' | 'US' | 'DIVIDEND' | 'STO' | 'KR' | 'BOND')[];
  desc: string;
  icon: string;
  color: string;
  borderColor: string;
  investors: string;
  investorCount: number;
  risk: string;
  dividendPeriod?: string;
  provider: string;
  tags: string[];
}

export const PORTFOLIO_PRODUCTS: PortfolioProduct[] = [
  {
    id: 'sol-us-div',
    name: 'SOL 미국배당다우존스',
    badge: '🔥 인기 1위 · 월배당',
    yield: '+4.8%',
    yieldNum: 4.8,
    category: ['ALL', 'POPULAR', 'US', 'DIVIDEND'],
    desc: '매달 주휴수당처럼 통장에 현금 자동 적립되는 대표 월배당 미국 ETF (SCHD 동일 추종)',
    icon: '🇺🇸',
    color: 'from-emerald-600/20 to-teal-600/20',
    borderColor: 'border-emerald-500/40',
    investors: '24,510명 선택',
    investorCount: 24510,
    risk: '보통위험 (3등급)',
    dividendPeriod: '매월 말일 배당입금',
    provider: '신한자산운용 · 신한투자증권 연계',
    tags: ['월배당', '미국주식', 'SCHD', '인기1위', '안정복리']
  },
  {
    id: 'tiger-nasdaq100',
    name: 'TIGER 미국나스닥100',
    badge: '🚀 수익률 상위 · 빅테크',
    yield: '+12.4%',
    yieldNum: 12.4,
    category: ['ALL', 'POPULAR', 'US'],
    desc: '엔비디아·애플·마이크로소프트 등 초고성장 IT 핵심 100개 기업 집중 소수점 매수',
    icon: '💻',
    color: 'from-purple-600/20 to-pink-600/20',
    borderColor: 'border-purple-500/40',
    investors: '19,820명 선택',
    investorCount: 19820,
    risk: '다소높은위험 (2등급)',
    provider: '미래에셋자산운용 · 신한투자증권 연계',
    tags: ['나스닥', '엔비디아', '빅테크', '고성장', '미국IT']
  },
  {
    id: 'kodex-sp500',
    name: 'KODEX 미국S&P500',
    badge: '⭐ 국민 ETF · 베스트셀러',
    yield: '+7.2%',
    yieldNum: 7.2,
    category: ['ALL', 'POPULAR', 'US'],
    desc: '미국 500개 우량 기업에 자동 분산 투자! 알바생 적립식 선호도 1위 포트폴리오',
    icon: '🗽',
    color: 'from-blue-600/20 to-indigo-600/20',
    borderColor: 'border-blue-500/40',
    investors: '31,200명 선택',
    investorCount: 31200,
    risk: '보통위험 (3등급)',
    provider: '삼성자산운용 · 신한투자증권 연계',
    tags: ['S&P500', '미국우량주', '국민ETF', '분산투자']
  },
  {
    id: 'shinhan-sto-gangnam',
    name: '신한 STO 강남 타워 조각투자',
    badge: '🏢 1등 토큰증권 · 빌딩지분',
    yield: '+6.5%',
    yieldNum: 6.5,
    category: ['ALL', 'POPULAR', 'STO', 'DIVIDEND'],
    desc: '신한투자증권 STO 메인넷 검증 강남 GBD 랜드마크 빌딩 월세 수익 분배 조각투자',
    icon: '🏢',
    color: 'from-amber-600/20 to-yellow-600/20',
    borderColor: 'border-amber-500/40',
    investors: '15,400명 선택',
    investorCount: 15400,
    risk: '중위험 (3등급)',
    dividendPeriod: '매월 15일 임대 배당',
    provider: '신한투자증권 STO 메인넷',
    tags: ['부동산', 'GBD빌딩', '토큰증권', '임대수익', 'STO']
  },
  {
    id: 'kodex-ai-power',
    name: 'KODEX AI전력핵심설비',
    badge: '⚡ AI 슈퍼사이클 · 최다인기',
    yield: '+16.2%',
    yieldNum: 16.2,
    category: ['ALL', 'POPULAR', 'KR'],
    desc: 'AI 데이터센터 전력 소비 폭발! 글로벌 변압기·전력망 핵심 대장주 집중 포트폴리오',
    icon: '🔌',
    color: 'from-cyan-600/20 to-blue-600/20',
    borderColor: 'border-cyan-500/40',
    investors: '16,700명 선택',
    investorCount: 16700,
    risk: '높은위험 (2등급)',
    provider: '삼성자산운용 · 신한투자증권 연계',
    tags: ['AI전력', '데이터센터', '변압기', '수익률1위']
  },
  {
    id: 'ace-bigtech10',
    name: 'ACE 미국빅테크TOP10 INDXX',
    badge: '🤖 빅테크 10 · 독점성장',
    yield: '+14.1%',
    yieldNum: 14.1,
    category: ['ALL', 'US'],
    desc: '테슬라·알파벳·애플 등 미국 빅테크 Top 10 시가총액 거물 기업만 쏙쏙 골라 담은 ETF',
    icon: '🤖',
    color: 'from-indigo-600/20 to-purple-600/20',
    borderColor: 'border-indigo-500/40',
    investors: '11,300명 선택',
    investorCount: 11300,
    risk: '높은위험 (2등급)',
    provider: '한국투자신탁운용 · 신한투자증권 연계',
    tags: ['빅테크', 'TOP10', '테슬라', '알파벳', '미국IT']
  },
  {
    id: 'sol-us-bond-30y',
    name: 'SOL 미국30년국채혼합',
    badge: '🛡️ 안정지향 · 월배당 이중보장',
    yield: '+3.8%',
    yieldNum: 3.8,
    category: ['ALL', 'BOND', 'DIVIDEND'],
    desc: '미국 초장기 국채 이자 수익과 금리 인하에 따른 채권 가격 상승 2중 혜택 안전 자산',
    icon: '🏛️',
    color: 'from-slate-700/20 to-slate-800/20',
    borderColor: 'border-slate-500/40',
    investors: '8,900명 선택',
    investorCount: 8900,
    risk: '저위험 (4등급)',
    dividendPeriod: '매월 초 배당입금',
    provider: '신한자산운용 · 신한투자증권 연계',
    tags: ['미국국채', '안전자산', '월배당', '금리인하']
  },
  {
    id: 'kodex-semicon',
    name: 'KODEX 반도체',
    badge: '🇰🇷 K-반도체 대장주',
    yield: '+9.8%',
    yieldNum: 9.8,
    category: ['ALL', 'KR'],
    desc: '삼성전자, SK하이닉스 및 K-반도체 파운드리·메모리 글로벌 생태계 대표 투자',
    icon: '📟',
    color: 'from-orange-600/20 to-amber-600/20',
    borderColor: 'border-orange-500/40',
    investors: '14,100명 선택',
    investorCount: 14100,
    risk: '다소높은위험 (2등급)',
    provider: '삼성자산운용 · 신한투자증권 연계',
    tags: ['삼성전자', 'SK하이닉스', '반도체', 'K-테크']
  },
  {
    id: 'shinhan-kpop-music',
    name: '신한 K-컬처 음원 저작권 STO',
    badge: '🎧 문화 토큰증권 · 음원배당',
    yield: '+8.2%',
    yieldNum: 8.2,
    category: ['ALL', 'STO', 'DIVIDEND'],
    desc: '글로벌 K-POP 히트 음원 스트리밍 저작권료 분기별 자동 배당 토큰증권 포트폴리오',
    icon: '🎧',
    color: 'from-rose-600/20 to-pink-600/20',
    borderColor: 'border-rose-500/40',
    investors: '9,800명 선택',
    investorCount: 9800,
    risk: '중위험 (3등급)',
    dividendPeriod: '분기별 저작권료 분배',
    provider: '신한투자증권 STO 메인넷',
    tags: ['음원저작권', 'K-POP', '토큰증권', '문화펀드']
  },
  {
    id: 'shinhan-gold-sto',
    name: '신한 금(Gold) 현물 토큰증권',
    badge: '🥇 인플레 방어 · 실물1:1',
    yield: '+5.1%',
    yieldNum: 5.1,
    category: ['ALL', 'STO', 'BOND'],
    desc: '신한투자증권 금고 보관 실물 금 현물과 1:1 보증 토큰으로 안전하게 지키는 자산',
    icon: '🪙',
    color: 'from-yellow-600/20 to-amber-600/20',
    borderColor: 'border-yellow-500/40',
    investors: '10,400명 선택',
    investorCount: 10400,
    risk: '저위험 (4등급)',
    provider: '신한투자증권 STO 메인넷',
    tags: ['실물금', '인플레이션방어', '안전자산', 'STO']
  },
  {
    id: 'kodex-200',
    name: 'KODEX 200',
    badge: '📊 코스피 대형주 · 안정성',
    yield: '+3.2%',
    yieldNum: 3.2,
    category: ['ALL', 'KR', 'BOND'],
    desc: '국내 코스피 200 지수를 추종하는 대표적이고 가장 완만하고 안전한 국내 ETF',
    icon: '📊',
    color: 'from-blue-700/20 to-slate-800/20',
    borderColor: 'border-blue-600/40',
    investors: '12,100명 선택',
    investorCount: 12100,
    risk: '보통위험 (3등급)',
    provider: '삼성자산운용 · 신한투자증권 연계',
    tags: ['코스피200', '국내대형주', '안정투자']
  }
];

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
  const [messages, setMessages] = useState<{role: 'assistant'|'user', text: string, toolBadge?: string | null}[]>([
    { role: 'assistant', text: '조이수님, 안녕하세요! 땡겨요 웍스 AI 매칭 비서 쏠이예요. 원하시는 위치나 업종을 편하게 말씀해 주세요! 🎯 (예: "부평지역 서빙 알바 찾아줘")' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [initialCenter, setInitialCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // AI 대화창 & 전략 안내 바 접기/펼치기 상태 (기본값 false: 지도가 메인으로 전면 표시)
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isTrojanFolded, setIsTrojanFolded] = useState(false);

  // 고정 지도 영역 높이 드래그 조절 상태 (기본 260px, 최소 140px ~ 최대 480px)
  const [mapHeight, setMapHeight] = useState(260);
  const [isResizingMap, setIsResizingMap] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(260);

  const handleResizeStart = (clientY: number) => {
    setIsResizingMap(true);
    startYRef.current = clientY;
    startHeightRef.current = mapHeight;
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizingMap) return;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - startYRef.current;
      const newHeight = Math.max(140, Math.min(480, startHeightRef.current + deltaY));
      setMapHeight(newHeight);
    };

    const handlePointerUp = () => {
      setIsResizingMap(false);
    };

    if (isResizingMap) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isResizingMap]);

  // Chat-Map 양방향 싱크 상태 (useGigStore)
  const { chatTriggerMessage, setChatTriggerMessage, highlightedGigIds, setHighlightedGigIds } = useGigStore();

  // AI 매칭 탭 전용 근무시간/카테고리 범위 필터 및 정렬 상태
  const [selectedHours, setSelectedHours] = useState<'all' | '1h' | '2h' | '4h' | '5h_plus'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sortMode, setSortMode] = useState<'ai' | 'wage_desc' | 'wage_asc' | 'dist_asc' | 'dist_desc' | 'pay_desc'>('ai');
  const [selectedDetailGig, setSelectedDetailGig] = useState<any | null>(null);
  const [instantContractGig, setInstantContractGig] = useState<any | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [healthCertVerified, setHealthCertVerified] = useState(true);
  const [showHealthCertModal, setShowHealthCertModal] = useState(false);
  const [showWorkerProfileModal, setShowWorkerProfileModal] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'all' | 'instapay' | 'high_wage' | 'urgent'>('all');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
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

  // 지도 핀 클릭 ➔ 챗봇 선제 대화 연동 (Bi-directional Chat-Map Sync)
  useEffect(() => {
    if (chatTriggerMessage) {
      sendMessageText(chatTriggerMessage);
      setChatTriggerMessage(null);
    }
  }, [chatTriggerMessage]);

  const [matchedGigsState, setMatchedGigsState] = useState([
    { id: 'ag1', storeName: 'CU 강남파이낸스점',    category: '편의점', district: '강남구',       distanceM: 150, role: '1시간 물류 하역 초단기 알바',    hours: 1, startTime: '12:00', endTime: '13:00', pay: 16000, hourlyRate: 16000, aiScore: 99, urgency: true,  applied: false },
    { id: 'ag2', storeName: '컴포즈커피 역삼역점',  category: '카페',  district: '강남구',       distanceM: 220, role: '점심 2시간 음료 조리 픽업',        hours: 2, startTime: '11:30', endTime: '13:30', pay: 30000, hourlyRate: 15000, aiScore: 97, urgency: true,  applied: false },
    { id: 'ag3', storeName: '스타벅스 강남2호점',   category: '카페',  district: '강남구',       distanceM: 480, role: '홀 서빙 & 음료 조리',              hours: 4, startTime: '14:00', endTime: '18:00', pay: 54000, hourlyRate: 13500, aiScore: 98, urgency: true,  applied: false },
    { id: 'ag4', storeName: '하남돼지집 부평역점',  category: '서빙',  district: '인천 부평구',  distanceM: 320, role: '야간 메인 서빙',                   hours: 4, startTime: '18:00', endTime: '22:00', pay: 58000, hourlyRate: 14500, aiScore: 95, urgency: true,  applied: false },
    { id: 'ag5', storeName: '세븐일레븐 테헤란점',  category: '편의점', district: '강남구',      distanceM: 380, role: '1시간 매장 세팅 긴급 보조',        hours: 1, startTime: '09:00', endTime: '10:00', pay: 15000, hourlyRate: 15000, aiScore: 89, urgency: false, applied: false },
    { id: 'ag6', storeName: '이마트 역삼점',        category: '마트',  district: '강남구',       distanceM: 900, role: '매장 진열 & 물류 관리',             hours: 5, startTime: '10:00', endTime: '15:00', pay: 65000, hourlyRate: 13000, aiScore: 81, urgency: false, applied: false },
    { id: 'ag7', storeName: '올리브영 강남대로점', category: '마트',  district: '강남구',       distanceM: 250, role: '올리브영 재고정리 & 상품 진열',     hours: 4, startTime: '15:00', endTime: '19:00', pay: 58000, hourlyRate: 14500, aiScore: 94, urgency: true,  applied: false },
    { id: 'ag8', storeName: '쉑쉑버거 강남점',     category: '패스트푸드', district: '강남구',   distanceM: 180, role: '피크 타임 홀 서빙 & 퇴식 관리',     hours: 2, startTime: '12:00', endTime: '14:00', pay: 36000, hourlyRate: 18000, aiScore: 96, urgency: true,  applied: false },
    { id: 'ag9', storeName: '메가커피 역삼포스코점', category: '카페', district: '강남구',       distanceM: 410, role: '오전 피크 테이크아웃 전담',         hours: 4, startTime: '08:00', endTime: '12:00', pay: 50000, hourlyRate: 12500, aiScore: 90, urgency: false, applied: false },
    { id: 'ag10', storeName: '교보문고 강남점',    category: '마트',  district: '서초구',       distanceM: 520, role: '주말 도서 분류 및 라벨링',          hours: 5, startTime: '13:00', endTime: '18:00', pay: 60000, hourlyRate: 12000, aiScore: 88, urgency: false, applied: false },
    { id: 'ag11', storeName: 'CGV 강남점',         category: '서빙',  district: '강남구',       distanceM: 350, role: '저녁 영화 피크 매점 포장',          hours: 3, startTime: '18:00', endTime: '21:00', pay: 39000, hourlyRate: 13000, aiScore: 92, urgency: true,  applied: false },
    { id: 'ag12', storeName: '무신사 스탠다드 강남점', category: '마트', district: '강남구',     distanceM: 290, role: '피팅룸 정리 및 의류 정리',          hours: 2, startTime: '16:00', endTime: '18:00', pay: 28000, hourlyRate: 14000, aiScore: 93, urgency: true,  applied: false },
    { id: 'ag13', storeName: '얌샘김밥 강남점',     category: '서빙',  district: '강남구',       distanceM: 190, role: '점심 피크 김밥 포장 & 홀 정리',     hours: 2, startTime: '11:30', endTime: '13:30', pay: 33000, hourlyRate: 16500, aiScore: 95, urgency: true,  applied: false },
    { id: 'ag14', storeName: '투썸플레이스 역삼GFC점', category: '카페', district: '강남구',    distanceM: 310, role: '오후 음료조리 & 케이크 보조',      hours: 4, startTime: '13:00', endTime: '17:00', pay: 55200, hourlyRate: 13800, aiScore: 91, urgency: false, applied: false },
    { id: 'ag15', storeName: '맘스터치 강남역점',   category: '패스트푸드', district: '강남구',   distanceM: 400, role: '저녁 버거 조리보조 & 튀김기 관리',  hours: 4, startTime: '17:00', endTime: '21:00', pay: 56000, hourlyRate: 14000, aiScore: 89, urgency: false, applied: false },
    { id: 'ag16', storeName: '서브웨이 테헤란로점', category: '패스트푸드', district: '강남구',   distanceM: 210, role: '피크타임 샌드위치 메이커',          hours: 2, startTime: '11:00', endTime: '13:00', pay: 31000, hourlyRate: 15500, aiScore: 96, urgency: true,  applied: false },
    { id: 'ag17', storeName: '다이소 강남역점',     category: '마트',  district: '강남구',       distanceM: 450, role: '오전 매장 재고 수량 전수조사',       hours: 3, startTime: '09:00', endTime: '12:00', pay: 39000, hourlyRate: 13000, aiScore: 87, urgency: false, applied: false },
    { id: 'ag18', storeName: 'GS25 강남역중앙점',   category: '편의점', district: '강남구',      distanceM: 160, role: '1시간 야간 수불물류 1인 피크',       hours: 1, startTime: '22:00', endTime: '23:00', pay: 17000, hourlyRate: 17000, aiScore: 98, urgency: true,  applied: false },
    { id: 'ag19', storeName: '버거킹 뱅뱅사거리점', category: '패스트푸드', district: '강남구',   distanceM: 620, role: '점심 딜리버리 픽업 보조',          hours: 2, startTime: '12:00', endTime: '14:00', pay: 30000, hourlyRate: 15000, aiScore: 90, urgency: false, applied: false },
    { id: 'ag20', storeName: '배스킨라빈스 강남대로점', category: '카페', district: '강남구',   distanceM: 340, role: '저녁 디저트 패킹 & 결제 보조',      hours: 3, startTime: '19:00', endTime: '22:00', pay: 40500, hourlyRate: 13500, aiScore: 91, urgency: false, applied: false },
    { id: 'ag21', storeName: '롭스 역삼역점',       category: '마트',  district: '강남구',       distanceM: 280, role: '오후 매장 디스플레이 및 뷰티 정리', hours: 2, startTime: '14:00', endTime: '16:00', pay: 28000, hourlyRate: 14000, aiScore: 92, urgency: true,  applied: false },
    { id: 'ag22', storeName: '쉐이크쉑 강남 2호점', category: '패스트푸드', district: '강남구',   distanceM: 230, role: '퇴근길 패스트 포장 팩맨',          hours: 2, startTime: '18:00', endTime: '20:00', pay: 35000, hourlyRate: 17500, aiScore: 97, urgency: true,  applied: false },
    { id: 'ag23', storeName: '롯데리아 강남역점',   category: '패스트푸드', district: '강남구',   distanceM: 500, role: '모닝 청결 관리자 및 주방 정리',    hours: 2, startTime: '07:00', endTime: '09:00', pay: 29000, hourlyRate: 14500, aiScore: 86, urgency: false, applied: false },
    { id: 'ag24', storeName: '노브랜드버거 역삼점', category: '패스트푸드', district: '강남구',   distanceM: 370, role: '1시간 점심 피크 홀 청결 관리',      hours: 1, startTime: '12:00', endTime: '13:00', pay: 16000, hourlyRate: 16000, aiScore: 95, urgency: true,  applied: false },
    { id: 'ag25', storeName: '아리따움 강남역점',   category: '마트',  district: '강남구',       distanceM: 430, role: '화장품 진열 및 재고 세팅',          hours: 3, startTime: '15:00', endTime: '18:00', pay: 40500, hourlyRate: 13500, aiScore: 88, urgency: false, applied: false },
    { id: 'ag26', storeName: '이디야커피 아침 피크 바리스타', category: '카페', district: '강남구', distanceM: 210, role: '아침 출근 피크 음료 조리', hours: 2, startTime: '08:00', endTime: '10:00', pay: 29000, hourlyRate: 14500, aiScore: 93, urgency: true, applied: false },
    { id: 'ag27', storeName: 'CU 초단기 물류 하역 및 진열', category: '편의점', district: '강남구', distanceM: 330, role: '1시간 긴급 입고 물류 보조', hours: 1, startTime: '13:00', endTime: '14:00', pay: 16000, hourlyRate: 16000, aiScore: 98, urgency: true, applied: false },
    { id: 'ag28', storeName: '올리브영 신상품 디스플레이 세팅', category: '마트', district: '강남구', distanceM: 390, role: '뷰티 앤 메이크업 진열 세팅', hours: 3, startTime: '14:00', endTime: '17:00', pay: 42000, hourlyRate: 14000, aiScore: 90, urgency: false, applied: false },
    { id: 'ag29', storeName: '롤링파스타 주말 홀서빙 긱', category: '서빙', district: '강남구', distanceM: 410, role: '피크 파스타 패밀리 테이블 서빙', hours: 4, startTime: '18:00', endTime: '22:00', pay: 62000, hourlyRate: 15500, aiScore: 95, urgency: true, applied: false },
    { id: 'ag30', storeName: '맥도날드 야간 픽업 포장 메이커', category: '패스트푸드', district: '강남구', distanceM: 260, role: '야간 긴급 픽업 포장 드라이브', hours: 2, startTime: '21:00', endTime: '23:00', pay: 35000, hourlyRate: 17500, aiScore: 97, urgency: true, applied: false },
    { id: 'ag31', storeName: '다이소 저녁 매장 진열 마감', category: '마트', district: '강남구', distanceM: 110, role: '마감 세팅 및 진열 정리', hours: 3, startTime: '19:00', endTime: '22:00', pay: 40500, hourlyRate: 13500, aiScore: 89, urgency: false, applied: false },
    { id: 'ag32', storeName: 'GS25 야간 끝전 1인 수불 긱', category: '편의점', district: '강남구', distanceM: 440, role: '1시간 정산 수불 피크 1인 알바', hours: 1, startTime: '23:00', endTime: '24:00', pay: 16500, hourlyRate: 16500, aiScore: 96, urgency: true, applied: false },
    { id: 'ag33', storeName: '블루보틀 드리퍼 조리 보조', category: '카페', district: '강남구', distanceM: 350, role: '오후 드립 커피 보조 & 포장', hours: 3, startTime: '13:00', endTime: '16:00', pay: 48000, hourlyRate: 16000, aiScore: 94, urgency: true, applied: false },
    { id: 'ag34', storeName: '하남돼지집 주말 피크 홀 전담', category: '서빙', district: '강남구', distanceM: 170, role: '주말 저녁 고기 테이블 케어', hours: 4, startTime: '17:00', endTime: '21:00', pay: 60000, hourlyRate: 15000, aiScore: 92, urgency: false, applied: false },
    { id: 'ag35', storeName: 'ZARA 피팅룸 카운팅 & 패킹', category: '마트', district: '강남구', distanceM: 290, role: '의류 피팅룸 개수 확인 및 포장', hours: 4, startTime: '15:00', endTime: '19:00', pay: 58000, hourlyRate: 14500, aiScore: 91, urgency: false, applied: false },
    { id: 'ag36', storeName: '투썸플레이스 케이크 데코 보조', category: '카페', district: '강남구', distanceM: 330, role: '오전 케이크 세팅 & 음료 조리', hours: 3, startTime: '10:00', endTime: '13:00', pay: 42000, hourlyRate: 14000, aiScore: 93, urgency: true, applied: false },
    { id: 'ag37', storeName: '세븐일레븐 모닝 출근길 세팅', category: '편의점', district: '강남구', distanceM: 140, role: '오전 출근길 직장인 시리얼 진열 1시간', hours: 1, startTime: '08:30', endTime: '09:30', pay: 15000, hourlyRate: 15000, aiScore: 95, urgency: true, applied: false },
    { id: 'ag38', storeName: '시코르 뷰티 아이템 카운팅', category: '마트', district: '강남구', distanceM: 480, role: '뷰티 품목 수량 픽업 체크 2시간', hours: 2, startTime: '16:00', endTime: '18:00', pay: 27600, hourlyRate: 13800, aiScore: 88, urgency: false, applied: false },
    { id: 'ag39', storeName: '맘스터치 버거 조리보조 긱', category: '패스트푸드', district: '강남구', distanceM: 430, role: '점심 2시간 팩맨 버거 튀김 보조', hours: 2, startTime: '11:30', endTime: '13:30', pay: 31000, hourlyRate: 15500, aiScore: 94, urgency: true, applied: false },
    { id: 'ag40', storeName: '컴포즈커피 드링크 포장 헬퍼', category: '카페', district: '강남구', distanceM: 210, role: '피크 테이크아웃 홀 포장 헬퍼', hours: 3, startTime: '12:00', endTime: '15:00', pay: 40500, hourlyRate: 13500, aiScore: 90, urgency: false, applied: false },
    { id: 'ag41', storeName: '교보문고 베스트셀러 진열 보조', category: '마트', district: '강남구', distanceM: 370, role: '신간 도서 박스 언패킹 & 진열', hours: 4, startTime: '09:00', endTime: '13:00', pay: 50000, hourlyRate: 12500, aiScore: 87, urgency: false, applied: false },
    { id: 'ag42', storeName: '아웃백 스테이크하우스 디너 서빙', category: '서빙', district: '강남구', distanceM: 140, role: '디너 4시간 전용 스테이크 테이블 세팅', hours: 4, startTime: '17:30', endTime: '21:30', pay: 66000, hourlyRate: 16500, aiScore: 96, urgency: true, applied: false },
    { id: 'ag43', storeName: '이마트24 스윕 1시간 물류 알바', category: '편의점', district: '강남구', distanceM: 230, role: '1시간 스윕 물류 박스 하역 정리', hours: 1, startTime: '14:00', endTime: '15:00', pay: 16000, hourlyRate: 16000, aiScore: 97, urgency: true, applied: false },
    { id: 'ag44', storeName: 'CGV 영화 피크 미소지기 지원', category: '서빙', district: '강남구', distanceM: 410, role: '주말 팝콘 & 오더 팩맨 헬퍼', hours: 3, startTime: '15:00', endTime: '18:00', pay: 40500, hourlyRate: 13500, aiScore: 89, urgency: false, applied: false },
    { id: 'ag45', storeName: '빽다방 점심 아이스 음료 픽업', category: '카페', district: '강남구', distanceM: 180, role: '점심 직장인 대용량 커피 조리 보조', hours: 2, startTime: '12:00', endTime: '14:00', pay: 26000, hourlyRate: 13000, aiScore: 88, urgency: false, applied: false },
    { id: 'ag46', storeName: '서브웨이 디너 샌드위치 메이커', category: '패스트푸드', district: '강남구', distanceM: 360, role: '저녁 퇴근길 샌드위치 보조', hours: 2, startTime: '18:00', endTime: '20:00', pay: 30000, hourlyRate: 15000, aiScore: 93, urgency: true, applied: false },
    { id: 'ag47', storeName: '하이오커피 샷 서포터 알바', category: '카페', district: '강남구', distanceM: 460, role: '아침 모닝 커피 샷 조리 팩맨 헬퍼', hours: 3, startTime: '08:00', endTime: '11:00', pay: 43500, hourlyRate: 14500, aiScore: 94, urgency: true, applied: false },
    { id: 'ag48', storeName: '감성커피 오더 팩맨 헬퍼', category: '카페', district: '강남구', distanceM: 290, role: '디저트 패킹 및 음료 라벨링 2시간', hours: 2, startTime: '13:00', endTime: '15:00', pay: 27000, hourlyRate: 13500, aiScore: 89, urgency: false, applied: false },
    { id: 'ag49', storeName: '무신사 재고 라벨링 야간 알바', category: '마트', district: '강남구', distanceM: 310, role: '야간 3시간 재고 바코드 라벨링 스캔', hours: 3, startTime: '20:00', endTime: '23:00', pay: 45000, hourlyRate: 15000, aiScore: 95, urgency: true, applied: false },
    { id: 'ag50', storeName: 'CU 야간 1인 물류 1시간 피크', category: '편의점', district: '강남구', distanceM: 110, role: '심야 물류 1시간 하역 세팅 1인 피크', hours: 1, startTime: '23:00', endTime: '24:00', pay: 17000, hourlyRate: 17000, aiScore: 98, urgency: true, applied: false }
  ]);

  // 땡겨요 웍스 VS 알바몬 파괴적 혁신 비교 모달 팝업 상태
  const [showAlbamonModal, setShowAlbamonModal] = useState(false);
  // 지도 핀 선택 상태
  const [mapSelectedGigId, setMapSelectedGigId] = useState<string | null>(null);
  const GIG_MAP: Record<string, string> = {
    'g1': 'CU 강남파이낸스점',
    'g2': '컴포즈커피 역삼역점',
    'g3': '스타벅스 강남2호점',
    'g4': '올리브영 강남대로점',
    'g5': '하남돼지집 부평역점',
    'g6': '세븐일레븐 테헤란점',
    'g7': '이마트 역삼점',
    'g8': '쉑쉑버거 강남점',
    'g9': '메가커피 역삼포스코점',
    'g10': '교보문고 강남점',
    'g11': 'CGV 강남점',
    'g12': '무신사 스탠다드 강남점',
    'g13': '얌샘김밥 강남점',
    'g14': '투썸플레이스 역삼GFC점',
    'g15': '맘스터치 강남역점',
    'g16': '서브웨이 테헤란로점',
    'g17': '다이소 강남역점',
    'g18': 'GS25 강남역중앙점',
    'g19': '버거킹 뱅뱅사거리점',
    'g20': '배스킨라빈스 강남대로점',
    'g21': '롭스 역삼역점',
    'g22': '쉐이크쉑 강남 2호점',
    'g23': '롯데리아 강남역점',
    'g24': '노브랜드버거 역삼점',
    'g25': '아리따움 강남역점',
    'g26': '이디야커피 아침 피크 바리스타',
    'g27': 'CU 초단기 물류 하역 및 진열',
    'g28': '올리브영 신상품 디스플레이 세팅',
    'g29': '롤링파스타 주말 홀서빙 긱',
    'g30': '맥도날드 야간 픽업 포장 메이커',
    'g31': '다이소 저녁 매장 진열 마감',
    'g32': 'GS25 야간 끝전 1인 수불 긱',
    'g33': '블루보틀 드리퍼 조리 보조',
    'g34': '하남돼지집 주말 피크 홀 전담',
    'g35': 'ZARA 피팅룸 카운팅 & 패킹',
    'g36': '투썸플레이스 케이크 데코 보조',
    'g37': '세븐일레븐 모닝 출근길 세팅',
    'g38': '시코르 뷰티 아이템 카운팅',
    'g39': '맘스터치 버거 조리보조 긱',
    'g40': '컴포즈커피 드링크 포장 헬퍼',
    'g41': '교보문고 베스트셀러 진열 보조',
    'g42': '아웃백 스테이크하우스 디너 서빙',
    'g43': '이마트24 스윕 1시간 물류 알바',
    'g44': 'CGV 영화 피크 미소지기 지원',
    'g45': '빽다방 점심 아이스 음료 픽업',
    'g46': '서브웨이 디너 샌드위치 메이커',
    'g47': '하이오커피 샷 서포터 알바',
    'g48': '감성커피 오더 팩맨 헬퍼',
    'g49': '무신사 재고 라벨링 야간 알바',
    'g50': 'CU 야간 1인 물류 1시간 피크'
  };

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
          const toolBadge = data.toolCallExecuted
            ? `${data.toolCallExecuted.toolName}(${data.toolCallExecuted.arguments.location || '전체'}, ${data.toolCallExecuted.arguments.jobType || '맞춤'})`
            : null;
          setMessages(prev => [...prev, { role: 'assistant', text: data.reply, toolBadge }]);
        }
        if (data.gigs && data.gigs.length > 0) {
          const ids = data.gigs.map((g: any) => g.id);
          setHighlightedGigIds(ids);
        }
        if (data.coords) {
          setInitialCenter(data.coords);
        }
      } else {
        const fallback = parseIntentAndExecuteTools(userMsg);
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: fallback.reply,
          toolBadge: `searchGigsByLocation(${fallback.toolCallExecuted.arguments.location || '전체'}, ${fallback.toolCallExecuted.arguments.jobType || '맞춤'})`
        }]);
        if (fallback.gigs && fallback.gigs.length > 0) {
          setHighlightedGigIds(fallback.gigs.map((g: any) => g.id));
        }
        if (fallback.coords) setInitialCenter(fallback.coords);
      }
    } catch (err) {
      const fallback = parseIntentAndExecuteTools(userMsg);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: fallback.reply,
        toolBadge: `searchGigsByLocation(${fallback.toolCallExecuted.arguments.location || '전체'}, ${fallback.toolCallExecuted.arguments.jobType || '맞춤'})`
      }]);
      if (fallback.gigs && fallback.gigs.length > 0) {
        setHighlightedGigIds(fallback.gigs.map((g: any) => g.id));
      }
      if (fallback.coords) setInitialCenter(fallback.coords);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendMessageText(inputText);
  };

  const handleAgentApply = (gigId: string, storeName: string, role: string, gigData?: any) => {
    const targetGig = gigData || matchedGigsState.find(g => g.id === gigId);

    // 🩺 식품위생법 제49조 준수: 카페/음식점/서빙 긱 보건증 자동 검증 가드
    const isFoodGig = targetGig?.category === '카페' || targetGig?.category === '서빙' || targetGig?.category === '패스트푸드';
    if (isFoodGig && !healthCertVerified) {
      triggerPush({
        title: '⚠️ [식품위생법 제49조] 보건증 인증 필요',
        body: `${storeName}은(는) 식품위생법 대상 사업장입니다. 0.1초 AI Vision OCR 보건증을 먼저 인증해주세요. (점주 과태료 500만원 방지)`,
        type: 'apply',
        actionText: '보건증 0.1초 인증',
      });
      setShowHealthCertModal(true);
      return;
    }

    setMatchedGigsState(prev => prev.map(g => g.id === gigId ? { ...g, applied: true } : g));
    
    if (targetGig) {
      setInstantContractGig(targetGig);
      setShowContractModal(true);
    } else {
      triggerPush({
        title: `[지원 접수] ${storeName}`,
        body: `조이수님의 ${role} 지원서가 AI 매칭 비서를 통해 정상 접수되었습니다. (신한 에스크로 원장 예치 대기)`,
        type: 'apply',
        actionText: '지원 상태 보기',
      });
    }

    setTimeout(() => {
      triggerPush({
        title: `[점주 수신 알림] ${storeName}`,
        body: `조이수 지원자(D-GCS 980점 Gold)의 AI 맞춤 지원서가 점주 앱으로 전송되었습니다.`,
        type: 'confirm',
        actionText: '점주 탭 바로가기',
      });
    }, 2500);
  };

  // 근무시간 & 카테고리 필터 및 정렬 처리 (선택 시에도 전체 목록 유지)
  const filteredAgentGigs = matchedGigsState
    .filter(g => {
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
    <div className="flex flex-col h-full overflow-hidden space-y-2">
      {/* 1. 🤖 대화형 AI 매칭 비서 쏠이 (SOL-E 스마트 챗 바) */}
      <div className="shrink-0 z-40">
        {!isChatExpanded ? (
          <div className="bg-gradient-to-r from-[#003db3] via-blue-900 to-slate-900 border-2 border-blue-400/60 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-between gap-2.5 text-white">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer" onClick={() => setIsChatExpanded(true)}>
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 shrink-0 shadow-md text-slate-950 font-black text-sm">
                <span>⚡</span>
              </div>
              <div className="truncate flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white tracking-wide">AI 비서 쏠이</span>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-400/40">
                    스마트 매칭
                  </span>
                  <span className="text-[9px] text-emerald-300 font-bold">🔥 1km 긴급 7건</span>
                </div>
                <p className="text-[11px] text-slate-200 truncate mt-0.5 font-medium">"쏠이에게 물어보기: '부평역 근처 1시간 서빙 찾아줘'"</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatExpanded(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>쏠이와 대화</span>
            </button>
          </div>
        ) : (
          <div className="bg-white p-3.5 rounded-3xl shadow-2xl border-2 border-blue-500 flex flex-col h-[340px] relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-100/40 opacity-60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-100/30 opacity-60 rounded-full blur-3xl pointer-events-none" />
            
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-2 shrink-0 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md text-white font-black text-xs">
                  <span>⚡</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 tracking-wider">땡겨요 웍스 AI 비서 쏠이</span>
                    <span className="text-[8.5px] bg-blue-50 text-blue-700 font-black px-2 py-0.5 rounded-full border border-blue-200 whitespace-nowrap">
                      0.1초 LBS 스마트 매칭
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 font-medium">실시간 위치 기반 최적 알바 & 0.1초 즉시정산 안내</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatExpanded(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] shadow-md border border-slate-700 flex items-center gap-1 active:scale-95 transition-all shrink-0"
              >
                <span>지도 메인으로 (접기)</span>
                <span className="text-amber-400">▼</span>
              </button>
            </div>

            {/* 채팅 영역 */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-md font-medium' 
                      : 'bg-slate-100 text-slate-900 rounded-tl-xs border border-slate-200 shadow-sm font-normal'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 border border-slate-200 text-slate-700 p-2.5 rounded-2xl rounded-tl-xs text-xs flex items-center gap-2">
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-blue-500/30 border-t-blue-600 rounded-full" />
                    <span className="font-bold text-blue-700">쏠이가 실시간 DB와 지도(LBS)를 분석하고 있습니다...</span>
                  </div>
                </div>
              )}
            </div>

            {/* 입력 폼 */}
            <div className="shrink-0 pt-2 border-t border-slate-200 space-y-1.5">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessageText(inputText);
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="예: 부평역 1시간 서빙 알바 찾아줘"
                  className="flex-1 bg-slate-50 border-2 border-blue-400 focus:border-blue-600 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all font-semibold shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="bg-[#0046FF] hover:bg-[#0038cc] disabled:opacity-50 text-white p-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all shrink-0 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </form>

              {/* 퀵 칩 레코멘더 */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  '📍 부평역 야간 서빙 알바',
                  '⚡ 1시간 초단기 긱 (시급 ₩16,000)',
                  '☕ 강남역 점심 피크 카페',
                  '💳 D-GCS 신용한도 증액',
                ].map(chip => (
                  <button
                    key={chip}
                    onClick={() => sendMessageText(chip)}
                    disabled={isTyping}
                    className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-800 hover:bg-[#0046FF] hover:text-white hover:border-[#0046FF] whitespace-nowrap active:scale-95 transition-all disabled:opacity-50 shadow-xs cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 📍 카카오 지도 영역 (AI 쏠이 바로 아래 고정!) */}
      <div className="shrink-0 relative mb-1">
        <div 
          style={{ height: `${mapHeight}px` }}
          className="transition-[height] duration-75 rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 relative group shrink-0"
        >
          <GigMapView
            initialCenter={initialCenter}
            selectedGigId={mapSelectedGigId}
            onAreaGigsLoaded={(areaName, loadedGigs) => {
              if (!loadedGigs || loadedGigs.length === 0) return;
              setMatchedGigsState(prev => {
                return prev.map((item, idx) => {
                  const matchingGig = loadedGigs[idx] || loadedGigs.find(lg => lg.id === item.id.replace('ag', 'g'));
                  if (matchingGig) {
                    GIG_MAP[matchingGig.id] = matchingGig.storeName;
                    GIG_MAP[item.id] = matchingGig.storeName;
                    return {
                      ...item,
                      storeName: matchingGig.storeName,
                      district: areaName,
                      role: matchingGig.title,
                      pay: matchingGig.hourly_wage * (matchingGig.hours || 1),
                      hourlyRate: matchingGig.hourly_wage,
                    };
                  }
                  return item;
                });
              });
            }}
            onGigSelect={(id, gigInfo) => {
              setMapSelectedGigId(id);
              if (id && gigInfo) {
                GIG_MAP[id] = gigInfo.storeName;
                GIG_MAP[`ag${id.replace('g', '')}`] = gigInfo.storeName;
                setMatchedGigsState(prev => prev.map(g => {
                  if (g.id === id || g.id === `ag${id.replace('g', '')}`) {
                    return {
                      ...g,
                      storeName: gigInfo.storeName,
                      role: gigInfo.title,
                      district: gigInfo.district || g.district,
                    };
                  }
                  return g;
                }));
              }
            }}
          />

          {/* 하단 위아래 지도 높이 드래그 조절 리사이즈 바 (Resize Handle Bar) */}
          <div
            onMouseDown={(e) => handleResizeStart(e.clientY)}
            onTouchStart={(e) => handleResizeStart(e.touches[0].clientY)}
            className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-950/90 via-slate-900/80 to-transparent flex items-center justify-center cursor-row-resize select-none z-20 hover:from-indigo-950/90 transition-colors"
            title="드래그하여 지도 높이 조절"
          >
            <div className="w-12 h-1.5 rounded-full bg-slate-400/80 group-hover:bg-amber-400 group-hover:w-16 transition-all flex items-center justify-center shadow-md">
              <div className="w-3 h-0.5 bg-slate-950 rounded-full" />
            </div>
            <span className="absolute right-3 text-[8.5px] font-mono font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 px-1.5 py-0.5 rounded border border-indigo-500/30">
              ↕ {mapHeight}px (높이 조절)
            </span>
          </div>
        </div>
      </div>

      {/* 3. 📜 지도 하단 전용 독립 스크롤 영역 (직종 필터 & 추천 긱 목록 카드) */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pb-4 custom-scrollbar pr-0.5">

      {/* 5. 땡겨요 스타일 직종 카테고리 칩 필터 */}
      <div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: '전체', label: '전체 시프트' },
            { id: '1시간', label: '⚡ 1시간 초단기' },
            { id: '서빙', label: '🍽️ 홀/서빙' },
            { id: '카페', label: '☕ 카페' },
            { id: '편의점', label: '🏪 편의점' },
            { id: '돌봄', label: '🧸 돌봄/심부름' },
            { id: '패스트푸드', label: '🍔 패스트푸드' },
            { id: '마트', label: '📦 마트/물류' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === '1시간') {
                  setSelectedHours('1h');
                  setSelectedCategory('전체');
                } else {
                  setSelectedCategory(cat.id);
                  if (cat.id === '전체') setSelectedHours('all');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                (cat.id === '1시간' && selectedHours === '1h') || (selectedCategory === cat.id && (cat.id !== '전체' || selectedHours !== '1h'))
                  ? 'bg-[#FB521C] text-white font-black shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>



      {/* 6. AI 매칭 추천 긱 (땡겨요 클린 카드 피드) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <span className="text-[9.5px] font-black text-[#FB521C] tracking-widest uppercase">Ddangyo Works AI Matcher</span>
            <h4 className="font-black text-sm text-slate-900">
              쏠이 추천 긱 목록
              {mapSelectedStoreName && (
                <span className="ml-2 text-xs font-bold text-[#FB521C] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  📍 {mapSelectedStoreName}
                </span>
              )}
            </h4>
          </div>

          {/* 정렬 드롭다운 */}
          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value as any)}
            className="bg-orange-50 border border-orange-200 text-[#FB521C] text-[10.5px] font-black rounded-xl px-2.5 py-1 outline-none focus:border-[#FB521C] transition-all cursor-pointer"
          >
            <option value="ai">✨ AI 추천순</option>
            <option value="wage_desc">💰 시급 높은순</option>
            <option value="wage_asc">💵 시급 낮은순</option>
            <option value="dist_asc">📍 거리 가까운순</option>
            <option value="dist_desc">🧭 거리 먼순</option>
            <option value="pay_desc">💵 총급여 높은순</option>
          </select>
        </div>

        {/* 근무시간 범위 필터 칩 */}
        {!mapSelectedGigId && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">시간:</span>
            {[
              { id: 'all', label: '전체' },
              { id: '1h', label: '⚡ 1시간' },
              { id: '2h', label: '⏱️ 2시간' },
              { id: '4h', label: '4시간' },
              { id: '5h_plus', label: '5h+' },
            ].map(hf => (
              <button
                key={hf.id}
                onClick={() => setSelectedHours(hf.id as any)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-xl text-[10.5px] font-bold transition-all active:scale-95 ${
                  selectedHours === hf.id
                    ? 'bg-[#FB521C] text-white font-black shadow-xs'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {hf.label}
              </button>
            ))}
          </div>
        )}

        {/* 필터링 및 정렬된 긱 카드리스트 */}
        <div className="space-y-3 pt-1">
          {filteredAgentGigs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-200">
              선택하신 조건 및 가맹점에 해당 알바 시프트가 없습니다.
            </div>
          ) : (
            filteredAgentGigs.map(g => {
              const isRecommended = highlightedGigIds.includes(g.id);
              const pinId = g.id.startsWith('ag') ? g.id.replace('ag', 'g') : g.id;
              const isCardSelected = Boolean(
                mapSelectedGigId && (
                  mapSelectedGigId === g.id || 
                  mapSelectedGigId === pinId || 
                  `ag${mapSelectedGigId.replace('g', '')}` === g.id ||
                  GIG_MAP[mapSelectedGigId] === g.storeName
                )
              );

              return (
                <div 
                  key={g.id} 
                  onClick={() => {
                    setMapSelectedGigId(isCardSelected ? null : pinId);
                  }}
                  className={`rounded-2xl p-4 transition-all text-left relative overflow-hidden cursor-pointer space-y-2.5 ${
                    isCardSelected
                      ? 'bg-orange-50/40 border-2 border-[#FB521C] ring-4 ring-orange-500/20 shadow-sm scale-[1.01] z-10'
                      : isRecommended
                      ? 'bg-gradient-to-br from-orange-50/30 via-white to-amber-50/20 border border-orange-200/80 shadow-xs hover:border-[#FB521C]'
                      : 'bg-white border border-slate-200/90 shadow-xs hover:border-[#FB521C]'
                  }`}
                >
                  {/* 지도 핀 선택 안내 뱃지 */}
                  {isCardSelected && (
                    <div className="bg-[#FB521C] text-white text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 shadow-xs mb-0.5">
                      <MapPin className="w-3 h-3 fill-white" />
                      <span>📍 선택된 시프트 (지도 ↔ 목록 동기화)</span>
                    </div>
                  )}

                  {/* 상단 1줄: AI 추천 랭킹 배지 */}
                  {isRecommended && !isCardSelected && (
                    <div className="flex items-center justify-between gap-1 border-b border-orange-100 pb-1 mb-0.5">
                      <span className="bg-gradient-to-r from-[#FB521C] to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5 text-amber-200" />
                        AI 1위 추천 (적합도 {g.aiScore}%)
                      </span>
                      <span className="text-[9.5px] font-mono font-bold text-[#FB521C]">
                        AI Score {g.aiScore}점
                      </span>
                    </div>
                  )}

                  {/* 가게명 & 시급/총액 */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h5 className="font-black text-sm text-slate-900 truncate flex items-center gap-1">
                        {g.storeName}
                        <span className="text-[9.5px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-0.5 shrink-0">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> 4.9
                        </span>
                      </h5>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-50 text-[#FB521C] border border-orange-200/80 shrink-0">
                        {g.category}
                      </span>
                      {g.urgency ? (
                        <span className="text-[8.5px] font-black px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                          🚨 1시간 이내 임박
                        </span>
                      ) : (
                        <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                          🕐 1시간 이후
                        </span>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-[#FB521C] leading-tight">₩{g.pay.toLocaleString()}</div>
                      <div className="text-[9px] font-bold text-slate-500">시급 ₩{g.hourlyRate.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* 역할 & 근무시간 1줄 */}
                  <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                    <p className="truncate font-bold text-slate-800">{g.role}</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                      g.urgency
                        ? 'text-rose-700 bg-rose-50 border border-rose-200 shadow-xs'
                        : 'text-slate-700 bg-slate-100 border border-slate-200'
                    }`}>
                      {g.urgency ? `🚨 ${g.startTime}–${g.endTime} (${g.hours}h)` : `🕐 ${g.startTime}–${g.endTime} (${g.hours}h)`}
                    </span>
                  </div>

                  {/* 메타데이터 배지 1줄 (위치 / 도보시간 / ⚡ 0.1초 땡겨받기 / 보건증 상태) */}
                  <div className="flex items-center justify-between text-[10px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/90 flex-wrap gap-1">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-[#FB521C]" />
                      {g.distanceM}m <span className="text-slate-500 font-medium">(도보 {Math.ceil(g.distanceM / 80)}분)</span>
                    </span>
                    {(g.category === '카페' || g.category === '서빙' || g.category === '패스트푸드') && (
                      <span className={`font-bold text-[9px] px-1.5 py-0.2 rounded border flex items-center gap-0.5 ${
                        healthCertVerified
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                      }`}>
                        {healthCertVerified ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : <AlertCircle className="w-2.5 h-2.5 text-amber-600" />}
                        {healthCertVerified ? '보건증 검증 패스' : '보건증 필요'}
                      </span>
                    )}
                    <span className="text-emerald-700 font-black flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> ⚡ 0.1초 즉시정산
                    </span>
                  </div>

                  {/* 지원 & 상세보기 버튼 영역 */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <button
                      onClick={() => setSelectedDetailGig(g)}
                      className="px-3 py-2 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1 shrink-0 transition-all active:scale-95 shadow-xs"
                      title="근무/모집 조건 상세보기"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FB521C]" />
                      <span>상세보기</span>
                    </button>

                    <button
                      onClick={() => {
                        if (g.applied) {
                          setInstantContractGig(g);
                          setShowContractModal(true);
                        } else {
                          handleAgentApply(g.id, g.storeName, g.role, g);
                        }
                      }}
                      className={`flex-1 py-2 rounded-xl font-black text-xs transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95 ${
                        g.applied
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-pointer'
                          : 'bg-[#FB521C] hover:bg-[#E4410E] text-white'
                      }`}
                      title={g.applied ? '전자계약서 및 신한 에스크로 예치 원장 열람' : '즉시 지원하기'}
                    >
                      {g.applied ? (
                        <>
                          <Lock className="w-3 h-3 text-emerald-600" />
                          <span>✓ 계약·에스크로 ₩{g.pay.toLocaleString()} 예치됨</span>
                          <ChevronRight className="w-3 h-3 text-emerald-600" />
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-amber-200 fill-amber-200" />
                          <span>⚡ 0.1초 즉시 지원하기</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 📋 알바 상세 모집/근무 조건 팝업 모달 */}
      <AnimatePresence>
        {selectedDetailGig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDetailGig(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-[420px] max-h-[85vh] overflow-y-auto shadow-2xl text-left space-y-4 custom-scrollbar text-white relative"
            >
              {/* 상단 닫기 & 타이틀 */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9.5px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {selectedDetailGig.category}
                    </span>
                    {selectedDetailGig.urgency && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                        🚨 긴급대타
                      </span>
                    )}
                    <span className="text-[9.5px] font-black px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      AI {selectedDetailGig.aiScore}점 Match
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white leading-snug">{selectedDetailGig.storeName}</h3>
                  <p className="text-xs text-indigo-300 font-bold mt-0.5">{selectedDetailGig.role}</p>
                </div>
                <button
                  onClick={() => setSelectedDetailGig(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 핵심 정보 요약 뱃지 박스 */}
              <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 p-3.5 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">약정 시급 / 총급여</span>
                  <span className="text-lg font-black text-emerald-400">₩{selectedDetailGig.pay.toLocaleString()}원</span>
                  <span className="text-[10px] font-bold text-slate-400 block">(시급 ₩{selectedDetailGig.hourlyRate.toLocaleString()}원 × {selectedDetailGig.hours}시간)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block">근무 시간</span>
                  <span className="text-xs font-black text-amber-300 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/30 inline-block mt-0.5">
                    {selectedDetailGig.startTime} ~ {selectedDetailGig.endTime}
                  </span>
                </div>
              </div>

              {/* 1. 📋 모집조건 (Recruitment Conditions) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>1. 모집 조건</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-2 text-slate-300 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-400">모집인원</span>
                    <span className="font-bold text-white">1명 (성별무관 / 연령무관)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">지원자격</span>
                    <span className="font-bold text-white">초보자 가능, 대학생/휴학생 환영</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">우대사항</span>
                    <span className="font-bold text-emerald-400">동일 업종 경력자, D-GCS 1등급</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">신한 검증</span>
                    <span className="font-bold text-blue-400">S-Bridge 실명인증 완료자 우대</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">마감일자</span>
                    <span className="font-bold text-rose-400">오늘 (피크타임 마감 임박)</span>
                  </div>
                </div>
              </div>

              {/* 2. 💼 근무조건 (Work Conditions) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-300">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>2. 근무 조건</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-2 text-slate-300 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-400">근무기간</span>
                    <span className="font-bold text-white">초단기 긱워크 (1일 / {selectedDetailGig.hours}시간)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">근무요일</span>
                    <span className="font-bold text-white">오늘 (피크타임 대타 시프트)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">정산방식</span>
                    <span className="font-bold text-amber-300">퇴근 직후 0.1초 신한 BaaS 계좌 입금</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">수수료</span>
                    <span className="font-bold text-emerald-400">근로자 수수료 0원 (100% 입금)</span>
                  </div>
                </div>
              </div>

              {/* 3. 🏪 근무지 위치 및 SOL 필수 체크리스트 (Shift Checklist) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>3. 근무지 위치 및 시프트 체크리스트</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-2.5 text-slate-300 font-medium">
                  <div>
                    <span className="text-slate-400 block mb-1">근무지 위치</span>
                    <p className="font-bold text-white leading-relaxed flex items-center justify-between">
                      <span>서울 {selectedDetailGig.district} 테헤란로 매장 ({selectedDetailGig.distanceM}m)</span>
                      <span className="text-indigo-400 text-[10.5px] font-bold">도보 약 {Math.ceil(selectedDetailGig.distanceM / 80)}분 소요</span>
                    </p>
                  </div>
                  
                  {/* SOL 스타일 필수 준비물 및 복장 안내 */}
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block font-bold">👕 복장 규정 (Dress Code)</span>
                      <span className="font-bold text-slate-200">단정한 자유복 및 운동화</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block font-bold">🎒 지참 필수품 (Gear)</span>
                      <span className="font-bold text-emerald-400">보건증 (앱 자동 검증)</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 block mb-1">담당 업무 상세</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-200 text-[11.5px]">
                      <li>{selectedDetailGig.role} 작업 전반 진행</li>
                      <li>매장 내 청결 정돈 및 피크타임 손님 응대</li>
                      <li>퇴근 바코드 스캔 시 신한 0.1초 에스크로 즉시 정산</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. 🏛️ 신한금융그룹 7대 계열사가 지원자(알바생)에게 제공하는 전폭 보장 혜택 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-blue-300">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>4. 지원자(알바생) 전용 7대 금융 혜택</span>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    지원자 부담 0원 (100% 무상제공)
                  </span>
                </div>

                <div className="bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-950 p-3.5 rounded-2xl border border-blue-500/30 text-xs space-y-2.5">
                  {/* ─── 현실적 5% 수수료 흐름 분배 계산 ─── */}
                  {(() => {
                    const pay = selectedDetailGig.pay || (selectedDetailGig.hourlyRate * (selectedDetailGig.hours || 1));

                    // ① 점주가 내는 5% 수수료 = 혜택 재원 총액
                    const feePool = Math.round(pay * 0.05);

                    // ② 플랫폼 운영비 (AI 서버·블록체인·매칭 인프라): 전체 수수료의 28%
                    const platformCost = Math.round(feePool * 0.28);

                    // ③ 신한은행 BaaS 에스크로 이체 수수료: 전체의 10%
                    const bankBaasFee = Math.round(feePool * 0.10);

                    // ④ 신한금융지주 내부 마진 (플랫폼 수익): 전체의 18%
                    const shinhanMargin = Math.round(feePool * 0.18);

                    // ─── 나머지 44%가 금융사별 혜택 재원 ───
                    const benefitPool = feePool - platformCost - bankBaasFee - shinhanMargin;

                    // ⑤ 신한EZ 보험 순보험료 (혜택재원의 43.6%): 실제 보험사에 납입되는 원가
                    const insurancePremium = Math.round(benefitPool * 0.436);

                    // ⑥ 신한투자증권 ETF 소수점매수 수수료 보조 (혜택재원의 18.2%)
                    const etfSubsidy = Math.round(benefitPool * 0.182);

                    // ⑦ 신한라이프 마이크로 연금 적립 지원 (혜택재원의 18.2%)
                    const pensionSubsidy = Math.round(benefitPool * 0.182);

                    // ⑧ 신한카드 캐시백 재원 적립 (혜택재원의 20%)
                    const cashbackPool = feePool - platformCost - bankBaasFee - shinhanMargin - insurancePremium - etfSubsidy - pensionSubsidy;

                    // 알바비 잔돈 ETF (알바비에서 별도, 수수료와 무관)
                    const etfChange = pay % 1000 === 0 ? 0 : pay % 1000;
                    // 연금 적립 (알바비 1%, 수수료와 별도)
                    const pensionDeposit = Math.round(pay * 0.01);
                    // 캐시백 발동 시 (신한카드로 땡겨요 배달 이용 시 10%, 수수료 재원에서 발동)
                    const cashbackMax = Math.round(pay * 0.10);

                    return (
                      <>
                        {/* ─── 상단: 수수료 재원 흐름 ─── */}
                        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 space-y-2">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">🏪 점주 납부 5% 수수료 — 실제 배분 구조</span>
                          </div>

                          {/* 수수료 총액 */}
                          <div className="flex items-center justify-between bg-amber-900/30 border border-amber-500/30 rounded-lg px-2.5 py-2">
                            <div>
                              <span className="text-amber-200 font-black text-[11.5px]">알바비 {pay.toLocaleString()}원 × 5% 수수료</span>
                              <p className="text-amber-400/70 text-[9.5px] font-mono mt-0.5">점주 부담 · 지원자 부담금 0원</p>
                            </div>
                            <span className="text-amber-300 font-black text-[15px] tabular-nums">{feePool.toLocaleString()}원</span>
                          </div>

                          {/* 지출 항목들 */}
                          <div className="space-y-1 pl-2 border-l-2 border-dashed border-amber-500/30">
                            {/* 플랫폼 운영비 */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-4 h-4 flex items-center justify-center bg-slate-700 rounded text-[9px]">⚙️</span>
                                <span className="text-slate-400 text-[10px]">플랫폼 AI·서버·블록체인 운영비 <span className="text-slate-600">(28%)</span></span>
                              </div>
                              <span className="text-slate-400 font-bold text-[10px] tabular-nums">−{platformCost.toLocaleString()}원</span>
                            </div>
                            {/* 신한은행 BaaS */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-4 h-4 flex items-center justify-center bg-blue-900/60 rounded text-[9px]">🏦</span>
                                <span className="text-slate-400 text-[10px]">신한은행 BaaS 에스크로·이체 수수료 <span className="text-slate-600">(10%)</span></span>
                              </div>
                              <span className="text-slate-400 font-bold text-[10px] tabular-nums">−{bankBaasFee.toLocaleString()}원</span>
                            </div>
                            {/* 신한지주 마진 */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-4 h-4 flex items-center justify-center bg-slate-700 rounded text-[9px]">🏛️</span>
                                <span className="text-slate-400 text-[10px]">신한금융지주 플랫폼 수익 <span className="text-slate-600">(18%)</span></span>
                              </div>
                              <span className="text-slate-400 font-bold text-[10px] tabular-nums">−{shinhanMargin.toLocaleString()}원</span>
                            </div>
                          </div>

                          {/* 혜택 재원 잔액 */}
                          <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/40 rounded-lg px-2.5 py-1.5">
                            <div>
                              <span className="text-emerald-300 font-black text-[11px]">▶ 금융사별 혜택 재원 (잔여 44%)</span>
                              <p className="text-emerald-500/70 text-[9px] font-mono">이 금액이 지원자 혜택으로 100% 환원</p>
                            </div>
                            <span className="text-emerald-300 font-black text-[14px] tabular-nums">{benefitPool.toLocaleString()}원</span>
                          </div>
                        </div>

                        {/* ─── 하단: 금융사별 혜택 배분 상세 ─── */}
                        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-indigo-950/40 p-3 space-y-2">
                          <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">💎 혜택 재원 {benefitPool.toLocaleString()}원 — 금융사별 배분</span>

                          <div className="space-y-1.5">
                            {/* 신한은행 */}
                            <div className="flex items-start gap-2 bg-blue-950/40 border border-blue-500/20 rounded-lg px-2.5 py-2">
                              <span className="text-[13px] mt-0.5">🏦</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-blue-300 font-black text-[10.5px]">신한은행 — 0.1초 즉시 정산 인프라</span>
                                  <span className="text-blue-200 font-black text-[10.5px] tabular-nums shrink-0 ml-1">{bankBaasFee.toLocaleString()}원 투입</span>
                                </div>
                                <p className="text-slate-400 text-[9.5px] mt-0.5">에스크로 원장 예치 → 퇴근 스와이프 즉시 {pay.toLocaleString()}원 입금 (수수료 0원)</p>
                                <span className="inline-block mt-0.5 text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">지원자 수혜: 이체수수료 0원 절약</span>
                              </div>
                            </div>

                            {/* 신한EZ 보험 */}
                            <div className="flex items-start gap-2 bg-emerald-950/40 border border-emerald-500/20 rounded-lg px-2.5 py-2">
                              <span className="text-[13px] mt-0.5">🛡️</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-300 font-black text-[10.5px]">신한EZ손해보험 — 단기상해보험 원가</span>
                                  <span className="text-emerald-200 font-black text-[10.5px] tabular-nums shrink-0 ml-1">{insurancePremium.toLocaleString()}원 납입</span>
                                </div>
                                <p className="text-slate-400 text-[9.5px] mt-0.5">보험사에 실제 납입되는 순보험료 → 출근 중 사고 시 최대 5만원 보장</p>
                                <span className="inline-block mt-0.5 text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">지원자 수혜: 본인부담 0원 · 사고 시 최대 50,000원</span>
                              </div>
                            </div>

                            {/* 신한투자증권 */}
                            <div className="flex items-start gap-2 bg-amber-950/40 border border-amber-500/20 rounded-lg px-2.5 py-2">
                              <span className="text-[13px] mt-0.5">📈</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-amber-300 font-black text-[10.5px]">신한투자증권 — ETF 매수수수료 보조</span>
                                  <span className="text-amber-200 font-black text-[10.5px] tabular-nums shrink-0 ml-1">{etfSubsidy.toLocaleString()}원 보조</span>
                                </div>
                                <p className="text-slate-400 text-[9.5px] mt-0.5">소수점 ETF 매수수수료 면제 재원 → 알바비 잔돈 {etfChange > 0 ? `${etfChange.toLocaleString()}원` : '(1천원 미만 시)'} 자동 매수</p>
                                <span className="inline-block mt-0.5 text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">지원자 수혜: ETF 매수수수료 100% 면제</span>
                              </div>
                            </div>

                            {/* 신한라이프 */}
                            <div className="flex items-start gap-2 bg-indigo-950/40 border border-indigo-500/20 rounded-lg px-2.5 py-2">
                              <span className="text-[13px] mt-0.5">🧬</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-indigo-300 font-black text-[10.5px]">신한라이프 — 마이크로 연금 적립 지원</span>
                                  <span className="text-indigo-200 font-black text-[10.5px] tabular-nums shrink-0 ml-1">{pensionSubsidy.toLocaleString()}원 보조</span>
                                </div>
                                <p className="text-slate-400 text-[9.5px] mt-0.5">연금 적립 인프라 운영비 → 알바비 1% = {pensionDeposit.toLocaleString()}원 자동 연금 적립</p>
                                <span className="inline-block mt-0.5 text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/30">지원자 수혜: +{pensionDeposit.toLocaleString()}원 마이크로 연금 적립</span>
                              </div>
                            </div>

                            {/* 신한카드 */}
                            <div className="flex items-start gap-2 bg-purple-950/40 border border-purple-500/20 rounded-lg px-2.5 py-2">
                              <span className="text-[13px] mt-0.5">💳</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-purple-300 font-black text-[10.5px]">신한카드 — 캐시백 재원 적립</span>
                                  <span className="text-purple-200 font-black text-[10.5px] tabular-nums shrink-0 ml-1">{cashbackPool.toLocaleString()}원 적립</span>
                                </div>
                                <p className="text-slate-400 text-[9.5px] mt-0.5">캐시백 재원 풀 적립 → 신한카드로 땡겨요 배달 이용 시 최대 10% 캐시백 발동</p>
                                <span className="inline-block mt-0.5 text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">지원자 수혜: 배달 주문 시 최대 {cashbackMax.toLocaleString()}원 캐시백</span>
                              </div>
                            </div>
                          </div>

                          {/* 총계 요약 */}
                          <div className="bg-gradient-to-r from-emerald-950/80 to-blue-950/80 border border-emerald-500/40 rounded-lg px-3 py-2.5 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-300">수수료 재원 합계</span>
                              <span className="text-[10px] font-black text-amber-300 tabular-nums">{feePool.toLocaleString()}원 (100%)</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">플랫폼 운영 + 은행수수료 + 지주 수익</span>
                              <span className="text-[10px] text-slate-400 tabular-nums">−{(platformCost + bankBaasFee + shinhanMargin).toLocaleString()}원 (56%)</span>
                            </div>
                            <div className="h-px bg-emerald-500/30 my-0.5" />
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-emerald-300">✅ 실제 지원자 혜택으로 환원된 금액</span>
                              <span className="text-[13px] font-black text-emerald-300 tabular-nums">{benefitPool.toLocaleString()}원 (44%)</span>
                            </div>
                            <p className="text-[9px] text-slate-500 font-mono">※ 보험·ETF·연금·캐시백 혜택의 실제 원가 합산 기준</p>
                          </div>
                        </div>

                        {/* 지원자를 위한 7대 계열사 혜택 상세 리스트 */}
                        {/* D-GCS 신용평가 */}
                        <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/20 space-y-0.5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-rose-400 font-black">🏆 D-GCS 신용평가 — Tier Up & 채용우선권</span>
                            <span className="font-bold text-rose-300 text-[10px]">시급 인상 우대</span>
                          </div>
                          <p className="text-[10.5px] text-slate-300">
                            · 이번 근무 성실 출퇴근 데이터가 블록체인 SBT로 기록되어 Silver ➔ Gold ➔ Platinum 승급<br />
                            · Platinum 달성 시 신한은행 1금융권 대출 우대금리 최대 −1.5%p 감면 혜택
                          </p>
                          <span className="inline-block text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30">지원자 수혜: AI 매칭 1순위 & 시급 우대</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* 하단 지원 / 닫기 액션 버튼 */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setSelectedDetailGig(null)}
                  className="w-1/3 py-3 rounded-2xl font-bold text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    handleAgentApply(selectedDetailGig.id, selectedDetailGig.storeName, selectedDetailGig.role, selectedDetailGig);
                    setSelectedDetailGig(null);
                  }}
                  disabled={selectedDetailGig.applied}
                  className={`w-2/3 py-3 rounded-2xl font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1 active:scale-95 ${
                    selectedDetailGig.applied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white hover:brightness-110'
                  }`}
                >
                  {selectedDetailGig.applied ? (
                    <span>✓ 지원 완료됨</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>⚡ 0.1초 즉시 지원하기</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚡ 0초 전자근로계약 자동 체결 플로우 모달 */}
      <InstantContractModal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        gig={instantContractGig}
        onConfirm={(gigId) => {
          setMatchedGigsState(prev => prev.map(g => g.id === gigId ? { ...g, applied: true } : g));
        }}
      />

      {/* 🩺 보건증 AI Vision OCR 자동 인증 & 식품위생법 제49조 준수 모달 */}
      <HealthCertModal
        isOpen={showHealthCertModal}
        onClose={() => setShowHealthCertModal(false)}
        certVerified={healthCertVerified}
        setCertVerified={setHealthCertVerified}
      />
    </div>
  </div>
);
}


// ─── TAB 2: 점주 대시보드 ────────────────────────────────────────────────────

function EmployerTab({ matched, setMatched }: { matched: boolean; setMatched: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [activeLegalTab, setActiveLegalTab] = useState<'contract' | 'insurance' | 'tax' | 'ezCoverage'>('contract');
  const [showAlbamonModal, setShowAlbamonModal] = useState(false);
  const { triggerPush } = useAppPush();

  return (
    <div className="space-y-4 pb-8">
      {/* 💡 [점주 전용] 알바몬 VS 땡겨요 웍스 파괴적 혁신 비교 전략 배너 */}
      <button
        onClick={() => setShowAlbamonModal(true)}
        className="w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-2 border-blue-400/50 rounded-3xl p-3.5 text-white flex items-center justify-between hover:brightness-110 active:scale-98 transition-all shadow-md text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-sm">
            💡
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                점주 전용 혁신 리포트
              </span>
              <span className="text-[10px] text-blue-300 font-bold">광고비 0원 · 세무 자동화</span>
            </div>
            <p className="text-xs font-black text-white truncate mt-0.5">
              왜 사장님들은 알바몬을 버리고 땡겨요 웍스로 올까?
            </p>
          </div>
        </div>
        <span className="text-xs font-black text-amber-300 bg-white/10 px-2.5 py-1.5 rounded-xl border border-amber-300/30 flex items-center gap-1 shrink-0 ml-2">
          혁신 비교 <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </button>

      {/* 땡겨요 웍스 VS 알바몬 파괴적 혁신 비교 팝업 모달 */}
      <ShinhanVsAlbamonModal isOpen={showAlbamonModal} onClose={() => setShowAlbamonModal(false)} />
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
            <span className="text-[10px] font-black text-[#FF5517] tracking-widest uppercase">Fee Transparency & Legal Disclosure</span>
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
            color: '#FF5517',
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
  const [profileImg, setProfileImg] = useState<string>('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80');
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState('SOL 미국배당다우존스');
  const [portfolioCategory, setPortfolioCategory] = useState<'ALL' | 'POPULAR' | 'US' | 'DIVIDEND' | 'STO' | 'KR' | 'BOND'>('ALL');
  const [portfolioSearchQuery, setPortfolioSearchQuery] = useState('');
  const [portfolioSortBy, setPortfolioSortBy] = useState<'POPULAR' | 'YIELD' | 'INVESTORS'>('POPULAR');
  const activeProduct = PORTFOLIO_PRODUCTS.find(p => p.name === selectedPortfolio) || PORTFOLIO_PRODUCTS[0];
  const [certStatus, setCertStatus] = useState<'VERIFIED' | 'EXPIRED' | 'UNREGISTERED'>('VERIFIED');
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const [isCheckedInMyPage, setIsCheckedInMyPage] = useState(false);
  const [showGpsCheckInModal, setShowGpsCheckInModal] = useState(false);
  const [showSynergyModal, setShowSynergyModal] = useState(false);
  const [selectedAffiliateId, setSelectedAffiliateId] = useState('bank');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImg(url);
    }
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOcrScanning(true);
      await new Promise(r => setTimeout(r, 1400));
      setIsOcrScanning(false);
      setCertStatus('VERIFIED');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B'],
      });
    }
  };

  return (
    <div className="space-y-4 pb-8 px-4 font-sans">
      {/* 1. 롤 스위처 */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setRole('worker')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            role === 'worker' 
              ? 'bg-[#FB521C] text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🙋 지원자(알바생) 마이
        </button>
        <button
          onClick={() => setRole('employer')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            role === 'employer' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🏪 점주 마이
        </button>
      </div>

      {role === 'worker' ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 프로필 카드 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              {/* 클릭 시 실시간 사진 변경 가능한 프로필 아바타 */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-15 h-15 rounded-2xl overflow-hidden cursor-pointer group shrink-0 border-2 border-orange-200 shadow-xs"
                title="클릭하여 프로필 사진 변경"
              >
                <img 
                  src={profileImg} 
                  alt="조이수 프로필" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 p-1 bg-[#FB521C] rounded-tl-lg text-white">
                  <Camera className="w-3 h-3" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-lg text-slate-900">조이수</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    👨 남성 · 24세
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FB521C] border border-orange-200">
                    신한 씬파일러 1등급
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  {walletConnected ? walletAddress : '0x71C...4e89 (신한 슈퍼SOL 연동)'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-[9.5px] text-slate-400 font-bold uppercase">SBT 신용뱃지</p>
                <p className="text-xs font-bold text-[#FB521C] mt-0.5">D-GCS 980점</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-[9.5px] text-slate-400 font-bold uppercase">지갑 토큰</p>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">🪙 {solcBalance.toFixed(1)} SOLC</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-[9.5px] text-slate-400 font-bold uppercase">보건증 검증</p>
                <p className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 검증완료
                </p>
              </div>
            </div>
          </div>

          {/* 🏆 SOL Top Pro & 오늘 출근 예정 시프트 Command Center 카드 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4.5 space-y-3 shadow-sm">
            {/* Pro Level Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#FB521C] border border-orange-200 flex items-center justify-center font-bold text-base shadow-xs">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">SOL Top Pro (Gold Level)</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      980 PTS
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal">
                    💯 출근 이행률 100% · 노쇼 0건 · 가맹점 평점 ⭐ 4.9
                  </p>
                </div>
              </div>
              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                S-Bridge 인증
              </span>
            </div>

            {/* Active Confirmed Shift Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-slate-900">오늘 출근 예정 시프트</span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  ⏱️ 01시간 15분 후 시작
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">CU 강남파이낸스점</h5>
                  <p className="text-[10.5px] text-slate-600 font-medium mt-0.5">12:00 ~ 13:00 (1시간 물류 알바)</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#FB521C]">₩16,000</span>
                  <span className="text-[9px] text-slate-400 block font-medium">⚡ 0.1초 즉시정산</span>
                </div>
              </div>

              {/* GPS 출근 바코드 스캔 / 스와이프 버튼 */}
              {!isCheckedInMyPage ? (
                <button
                  onClick={() => setShowGpsCheckInModal(true)}
                  className="w-full bg-gradient-to-r from-[#FB521C] to-orange-500 hover:from-[#E04514] hover:to-orange-600 active:scale-95 text-white text-xs font-bold py-3 rounded-2xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <MapPin className="w-4 h-4 text-amber-200" />
                  <span>GPS 출근 바코드 스캔 (매장 50m 진입 확인)</span>
                </button>
              ) : (
                <div 
                  onClick={() => setShowGpsCheckInModal(true)}
                  className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-center space-y-0.5 cursor-pointer hover:bg-emerald-100/70 transition-all shadow-xs"
                  title="실시간 GPS 연동 지도 열기"
                >
                  <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 출근 인증 완료! (실시간 GPS 지도 보기)
                  </p>
                  <p className="text-[10px] text-slate-600">
                    🛡️ 신한EZ 0.1초 단기 상해보험 자동 개시 · 퇴근 시 ₩16,000 자동 입금
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 🩺 보건증(건강진단결과서) AI Vision OCR 스캔 & 자동 검증 등록 카드 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4.5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8.5 h-8.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-base shadow-xs shrink-0">
                  🩺
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900">보건증 AI Vision OCR 검증</h4>
                    {certStatus === 'VERIFIED' && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> 검증 완료
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal">정부24 연동 AI Vision OCR 자동 텍스트 인식 및 진위 확인</p>
                </div>
              </div>
              <input 
                type="file" 
                ref={certInputRef} 
                onChange={handleCertUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                onClick={() => certInputRef.current?.click()}
                disabled={isOcrScanning}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{certStatus === 'VERIFIED' ? '재촬영/갱신' : '보건증 촬영'}</span>
              </button>
            </div>

            {/* OCR 스캔 중 애니메이션 상태 */}
            {isOcrScanning && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-center space-y-1 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-[#FB521C] font-bold text-xs">
                  <span className="animate-spin w-3.5 h-3.5 border-2 border-[#FB521C]/30 border-t-[#FB521C] rounded-full" />
                  <span>AI Vision OCR 엔진이 보건증을 분석 중입니다...</span>
                </div>
                <p className="text-[10px] text-slate-500">발행기관 · 판정결과 · 검진일자 진위 대조 중 (신뢰도 99.4%)</p>
              </div>
            )}

            {/* 검증 완료 보건증 명세 카드 */}
            {certStatus === 'VERIFIED' && !isOcrScanning && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[9.5px] block font-bold">발급 기관</span>
                    <span className="font-bold text-slate-900">서울 강남구 보건소</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[9.5px] block font-bold">인증 관리번호</span>
                    <span className="font-mono font-bold text-slate-900">2026-강남보건-048291</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[9.5px] block font-bold">판정 결과</span>
                    <span className="font-bold text-emerald-600">정상 (전염성 질환 음성)</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[9.5px] block font-bold">보건증 유효기간</span>
                    <span className="font-bold text-amber-700 font-mono">2027.03.14 (안전 유효)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    시프트 지원 시 점주에게 1초 자동 증명서 전송
                  </span>
                  <span className="font-bold text-emerald-600">OCR 검증 99.4%</span>
                </div>
              </div>
            )}
          </div>

          {/* 🏛️ 1. [핵심] One-Shinhan 7대 금융 계열사 시너지 혜택 종합 허브 (Grand Synergy Ledger) */}
          <div className="bg-gradient-to-br from-[#0c1a30] via-slate-900 to-[#071322] border-2 border-blue-500/40 rounded-3xl p-5 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">
                  🏛️
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      One-Shinhan Synergy
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-mono">
                      SH-7-ECOSYSTEM
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    One-Shinhan 7대 금융사 실시간 수혜 현황
                  </h3>
                </div>
              </div>

              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-amber-300" /> 총 ₩348,200 수혜
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              조이수님이 땡겨요 WORKS에서 긱을 뛸 때마다 <strong>점주 지불 5% 수수료와 신한 7대 금융 계열사 인프라</strong>가 결합되어 <strong>즉시정산·보험·투자·연금·신용 혜택</strong>으로 100% 자동 환원됩니다.
            </p>

            {/* 7대 금융사 인터랙티브 카드 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* ① 신한은행 */}
              <div 
                onClick={() => {
                  setSelectedAffiliateId('bank');
                  setShowSynergyModal(true);
                }}
                className="bg-slate-950/80 hover:bg-slate-900 border border-blue-500/30 hover:border-blue-400/60 rounded-2xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5">
                    🏦 신한은행
                  </span>
                  <span className="text-[10px] text-indigo-300 font-mono font-bold">
                    ₩124,500 수혜
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <p className="font-black text-white text-xs">CASA 모계좌 0.1초 즉시 입금</p>
                  <p className="text-slate-400 text-[10px]">110-482-****** (급여이체 우대금리 3.2% 적용)</p>
                </div>
                <div className="flex items-center justify-between text-[9.5px] text-blue-400 pt-1 border-t border-slate-800/80">
                  <span>PG 수수료 ₩0 전액 면제</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* ② 신한투자증권 */}
              <div 
                onClick={() => {
                  setSelectedAffiliateId('invest');
                  setShowSynergyModal(true);
                }}
                className="bg-slate-950/80 hover:bg-slate-900 border border-purple-500/30 hover:border-purple-400/60 rounded-2xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    📈 신한투자증권
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ₩48,500 (+4.8%)
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <p className="font-black text-white text-xs">{selectedPortfolio} ETF 스윕</p>
                  <p className="text-slate-400 text-[10px]">점주 지원금(₩425) + 잔돈(₩400) 자동 매칭 투자</p>
                </div>
                <div className="flex items-center justify-between text-[9.5px] text-purple-400 pt-1 border-t border-slate-800/80">
                  <span>부동산 STO 조각투자 15주</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* ③ 신한EZ손해보험 */}
              <div 
                onClick={() => {
                  setSelectedAffiliateId('ez');
                  setShowSynergyModal(true);
                }}
                className="bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    🛡️ 신한EZ손해보험
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ₩84,000 보장
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <p className="font-black text-white text-xs">초단기 마이크로 상해/배상책임</p>
                  <p className="text-slate-400 text-[10px]">비급여 치료비 1,000만원 + 대물 배상 5,000만원</p>
                </div>
                <div className="flex items-center justify-between text-[9.5px] text-cyan-400 pt-1 border-t border-slate-800/80">
                  <span>점주 5% 수수료로 100% 무상 가입</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* ④ 신한카드 */}
              <div 
                onClick={() => {
                  setSelectedAffiliateId('card');
                  setShowSynergyModal(true);
                }}
                className="bg-slate-950/80 hover:bg-slate-900 border border-pink-500/30 hover:border-pink-400/60 rounded-2xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-pink-300 flex items-center gap-1.5">
                    💳 신한카드
                  </span>
                  <span className="text-[10px] text-indigo-300 font-mono font-bold">
                    ACS 875점 (상위 2%)
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <p className="font-black text-white text-xs">대안신용 기반 신용한도 +250만원</p>
                  <p className="text-slate-400 text-[10px]">근태 100% 빅데이터로 씬파일러 신용 등급 상향</p>
                </div>
                <div className="flex items-center justify-between text-[9.5px] text-pink-400 pt-1 border-t border-slate-800/80">
                  <span>가맹점 2.0% 상생 캐시백</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* ⑤ 신한라이프 */}
              <div 
                onClick={() => {
                  setSelectedAffiliateId('life');
                  setShowSynergyModal(true);
                }}
                className="bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-400/60 rounded-2xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    🌱 신한라이프
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ₩12,400 연금 적립
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <p className="font-black text-white text-xs">1% 마이크로 연금 자동 적립</p>
                  <p className="text-slate-400 text-[10px]">GPS 동선 헬스케어 생체 DB 연동 추가 리워드</p>
                </div>
                <div className="flex items-center justify-between text-[9.5px] text-emerald-400 pt-1 border-t border-slate-800/80">
                  <span>18시간 초단기 상해보장 무상</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* ⑥ 신한저축은행 & 캐피탈 */}
              <div 
                onClick={() => {
                  setSelectedAffiliateId('savingsCapital');
                  setShowSynergyModal(true);
                }}
                className="bg-slate-950/80 hover:bg-slate-900 border border-orange-500/30 hover:border-orange-400/60 rounded-2xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-orange-300 flex items-center gap-1.5">
                    💰 신한저축은행/캐피탈
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    Cascade 스탠바이
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <p className="font-black text-white text-xs">연 8.5% 중금리 대출 즉시 전환</p>
                  <p className="text-slate-400 text-[10px]">은행 대출 탈락 방지 포용금융 + 서빙로봇 B2B 리스</p>
                </div>
                <div className="flex items-center justify-between text-[9.5px] text-orange-400 pt-1 border-t border-slate-800/80">
                  <span>성실 근무 시 금리 1.5%p 자동 인하</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* ⑦ 신한DS (Gov-Tech) */}
              <div 
                onClick={() => {
                  setSelectedAffiliateId('ds');
                  setShowSynergyModal(true);
                }}
                className="bg-slate-950/80 hover:bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-2xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.99] group shadow-sm sm:col-span-2"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    ⚙️ 신한DS (Gov-Tech & PoA 블록체인)
                  </span>
                  <span className="text-[10px] text-blue-300 font-mono font-bold">
                    BATCH 100% 자동 대행
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-[11px]">
                  <div>
                    <p className="font-black text-white text-xs">국세청 홈택스 일용근로소득 지급명세서</p>
                    <p className="text-slate-400 text-[10px]">1일 15만원 비과세 자동 판정 ➔ 원천징수 세금 0원</p>
                  </div>
                  <div>
                    <p className="font-black text-white text-xs">근로복지공단 4대보험 EDI BATCH</p>
                    <p className="text-slate-400 text-[10px]">월 15시간 미만 초단기 예외 처리 준수</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9.5px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>신한DS PoA 분산원장 D-GCS 980점 평판 영구 박제</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* 하단 금융 증명서 통합 발급 버튼 */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                * 카드를 클릭하면 계열사별 상세 혜택 내역과 원장을 확인할 수 있습니다.
              </span>
              <button
                onClick={() => {
                  setSelectedAffiliateId('bank');
                  setShowSynergyModal(true);
                }}
                className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>7대 금융 혜택 종합 증명서</span>
              </button>
            </div>
          </div>

          {/* 4. 📋 지원자 긱워크 일한 내역 & 종합 수익·투자 정산 리포트 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#FB521C] tracking-widest uppercase">Work History & Investment Ledger</span>
                <h4 className="font-bold text-base text-slate-900 mt-0.5">내가 지금까지 일한 내역 & 수익·투자 리포트</h4>
                <p className="text-xs text-slate-500 mt-0.5">총 24건의 긱워크 완료 · 지각/노쇼 0건 · D-GCS 980점 달성</p>
              </div>
              <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-[#FB521C] border border-orange-200 shrink-0">
                총 24회 완수
              </span>
            </div>

            {/* 수익 & 투자 종합 요약 3대 전광판 */}
            <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="border-r border-slate-200 pr-1">
                <p className="text-[10px] text-slate-500 font-bold">총 긱워크 수입</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">₩1,420,000</p>
                <p className="text-[9px] text-[#FB521C] font-medium mt-0.5">0.1초 정산</p>
              </div>
              <div className="border-r border-slate-200 px-1">
                <p className="text-[10px] text-purple-700 font-bold">증권/연금 투자</p>
                <p className="text-sm font-black text-purple-700 mt-0.5">₩128,500</p>
                <p className="text-[9px] text-purple-600 font-medium mt-0.5">ETF+연금</p>
              </div>
              <div className="pl-1">
                <p className="text-[10px] text-amber-700 font-bold">점주 수수료 지원</p>
                <p className="text-sm font-black text-amber-700 mt-0.5">₩10,200</p>
                <p className="text-[9px] text-amber-600 font-medium mt-0.5">5% 시너지</p>
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

          {/* 📈 신한투자증권 포트폴리오 변경 바텀시트 모달 */}
          <AnimatePresence>
            {showPortfolioModal && (
              <div className="fixed inset-0 z-50 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPortfolioModal(false)}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="relative z-10 w-full bg-[#0F172A] border-t border-slate-700/80 rounded-t-[28px] p-5 text-white shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto"
                >
                  <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto" />

                  {/* 모달 타이틀 헤더 */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-base text-white">신한투자증권 연계 상품 선택</h3>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            소수점 자동 투자
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">알바비 끝전 + 점주 수수료 지원금 0.1초 자동 매수 혜택</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPortfolioModal(false)}
                      className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 검색창 및 정렬 바 */}
                  <div className="space-y-2.5">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={portfolioSearchQuery}
                        onChange={(e) => setPortfolioSearchQuery(e.target.value)}
                        placeholder="상품명, 테마(배당, 나스닥, STO, 금) 검색..."
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      {portfolioSearchQuery && (
                        <button
                          onClick={() => setPortfolioSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* 카테고리 필터 태그 (가로 스크롤) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                      {[
                        { id: 'ALL', label: '전체 (11)' },
                        { id: 'POPULAR', label: '🔥 인기 Top' },
                        { id: 'US', label: '🇺🇸 미국/글로벌' },
                        { id: 'DIVIDEND', label: '💰 월배당' },
                        { id: 'STO', label: '🏢 STO 토큰증권' },
                        { id: 'KR', label: '🇰🇷 K-테크/반도체' },
                        { id: 'BOND', label: '🛡️ 채권/안정형' },
                      ].map((tab) => {
                        const isActive = portfolioCategory === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setPortfolioCategory(tab.id as any)}
                            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                              isActive
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* 정렬 방식 서브 선택기 */}
                    <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-1 pt-1">
                      <span>검색된 연계 상품 <strong className="text-purple-400 font-bold">{
                        PORTFOLIO_PRODUCTS.filter(p => {
                          const matchesTab = portfolioCategory === 'ALL' || p.category.includes(portfolioCategory);
                          const matchesSearch = portfolioSearchQuery.trim() === '' ||
                            p.name.toLowerCase().includes(portfolioSearchQuery.toLowerCase()) ||
                            p.desc.toLowerCase().includes(portfolioSearchQuery.toLowerCase()) ||
                            p.tags.some(t => t.toLowerCase().includes(portfolioSearchQuery.toLowerCase()));
                          return matchesTab && matchesSearch;
                        }).length
                      }개</strong></span>

                      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        {[
                          { id: 'POPULAR', label: '인기순' },
                          { id: 'YIELD', label: '수익률순' },
                          { id: 'INVESTORS', label: '선택자순' },
                        ].map(sort => (
                          <button
                            key={sort.id}
                            onClick={() => setPortfolioSortBy(sort.id as any)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                              portfolioSortBy === sort.id
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {sort.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 연계 상품 리스트 */}
                  <div className="space-y-2.5">
                    {PORTFOLIO_PRODUCTS.filter(p => {
                      const matchesTab = portfolioCategory === 'ALL' || p.category.includes(portfolioCategory);
                      const matchesSearch = portfolioSearchQuery.trim() === '' ||
                        p.name.toLowerCase().includes(portfolioSearchQuery.toLowerCase()) ||
                        p.desc.toLowerCase().includes(portfolioSearchQuery.toLowerCase()) ||
                        p.tags.some(t => t.toLowerCase().includes(portfolioSearchQuery.toLowerCase()));
                      return matchesTab && matchesSearch;
                    }).sort((a, b) => {
                      if (portfolioSortBy === 'YIELD') return b.yieldNum - a.yieldNum;
                      if (portfolioSortBy === 'INVESTORS') return b.investorCount - a.investorCount;
                      return b.investorCount - a.investorCount;
                    }).map((item) => {
                      const isSelected = selectedPortfolio === item.name;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedPortfolio(item.name)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? `bg-gradient-to-r ${item.color} ${item.borderColor} ring-2 ring-purple-500 shadow-lg shadow-purple-900/30`
                              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{item.icon}</span>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-black text-sm text-white">{item.name}</span>
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    {item.badge}
                                  </span>
                                </div>
                                <p className="text-[9.5px] text-slate-400 mt-0.5">{item.provider}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-black text-emerald-400 block">{item.yield}</span>
                              <span className="text-[9px] text-slate-400">{item.investors}</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-relaxed mb-2">{item.desc}</p>

                          {/* 뱃지 및 메타 정보 */}
                          <div className="flex items-center justify-between text-[10px] border-t border-slate-800/80 pt-2 text-slate-400">
                            <div className="flex items-center gap-2">
                              <span className="bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                                {item.risk}
                              </span>
                              {item.dividendPeriod && (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  📅 {item.dividendPeriod}
                                </span>
                              )}
                            </div>
                            {isSelected ? (
                              <span className="flex items-center gap-1 text-purple-300 font-black text-[11px]">
                                <Check className="w-3.5 h-3.5 text-purple-400" /> 선택됨
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">클릭하여 선택</span>
                            )}
                          </div>

                          {/* 선택된 상태시 가상 시뮬레이션 게이지 */}
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 bg-purple-950/40 border border-purple-500/30 rounded-xl p-2.5 text-[10.5px] space-y-1.5"
                            >
                              <div className="flex justify-between items-center font-bold text-purple-200">
                                <span>🔮 1년 후 예상 자산 시뮬레이션</span>
                                <span className="text-emerald-400 font-mono">약 ₩328,000</span>
                              </div>
                              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full rounded-full w-[78%]" />
                              </div>
                              <p className="text-[9.5px] text-slate-400">
                                매일 자투리 400원 + 점주 지원금 425원 지속 적립 시 (연 복리 수익률 반영)
                              </p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 하단 고정 적용하기 버튼 */}
                  <div className="pt-2 sticky bottom-0 bg-[#0F172A] pb-1">
                    <button
                      onClick={() => {
                        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
                        alert(`[신한투자증권] 자동 투자 연계 포트폴리오가 '${selectedPortfolio}'(으)로 최종 설정되었습니다.`);
                        setShowPortfolioModal(false);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white font-black text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>[ {selectedPortfolio} ] 포트폴리오 변경 적용하기</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 🗺️ 실시간 모바일 GPS 연동 지도 & 출근 인증 모달 */}
          <GpsCheckInModal
            isOpen={showGpsCheckInModal}
            onClose={() => setShowGpsCheckInModal(false)}
            onCheckInSuccess={() => setIsCheckedInMyPage(true)}
            storeName="CU 강남파이낸스점"
            storeRole="12:00 ~ 13:00 (1시간 물류 알바)"
            storeLat={37.5000}
            storeLng={127.0365}
          />

          {/* 🏛️ One-Shinhan 7대 금융 계열사 시너지 상세 명세 및 증명서 모달 */}
          <OneShinhanSynergyDetailModal
            isOpen={showSynergyModal}
            onClose={() => setShowSynergyModal(false)}
            initialAffiliateId={selectedAffiliateId}
          />
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

type Tab = 'agent' | 'chat' | 'community' | 'checkout' | 'dgcs' | 'mypage' | 'employer' | 'employer_finance' | 'employer_applicants' | 'admin';
type UserRole = 'worker' | 'employer' | 'admin';

const workerTabs: Array<{ id: Tab; Icon: any; label: string }> = [
  { id: 'agent',     Icon: Sparkles,      label: 'AI 매칭' },
  { id: 'chat',      Icon: MessageSquare, label: '땡톡' },
  { id: 'community', Icon: Users,         label: '땡썰' },
  { id: 'checkout',  Icon: DollarSign,    label: '정산/지갑' },
  { id: 'dgcs',      Icon: ShieldCheck,   label: '안전/보험' },
  { id: 'mypage',    Icon: User,          label: '마이' },
];

const employerTabs: Array<{ id: Tab; Icon: any; label: string }> = [
  { id: 'employer',            Icon: Store,         label: 'AI 구인/지도' },
  { id: 'chat',                Icon: MessageSquare, label: '점주톡' },
  { id: 'community',           Icon: Users,         label: '점주 숲' },
  { id: 'employer_finance',    Icon: CreditCard,    label: '인건비/카드' },
  { id: 'dgcs',                Icon: ShieldCheck,   label: '안전/보험' },
  { id: 'admin',               Icon: Activity,      label: '관리자/마이' },
];

const adminTabs: Array<{ id: Tab; Icon: any; label: string }> = [
  { id: 'admin',               Icon: Activity,      label: '그룹 시너지' },
  { id: 'chat',                Icon: MessageSquare, label: '통합 땡톡' },
  { id: 'community',           Icon: Users,         label: '커뮤니티' },
  { id: 'dgcs',                Icon: ShieldCheck,   label: 'D-GCS 평가' },
  { id: 'checkout',            Icon: DollarSign,    label: 'BaaS 정산' },
  { id: 'mypage',              Icon: User,          label: '시스템 마이' },
];

export default function ShinhanDDangApp() {
  const [userRole, setUserRole] = useState<UserRole>('worker');
  const [activeTab, setActiveTab] = useState<Tab>('agent');
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);
  const [tier, setTier] = useState<0 | 1 | 2>(1);
  const [matched, setMatched] = useState(false);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showWorkerProfileModal, setShowWorkerProfileModal] = useState(false);
  const [showLiveNotificationModal, setShowLiveNotificationModal] = useState(false);
  const [healthCertVerified, setHealthCertVerified] = useState(true);
  const [showHealthCertModal, setShowHealthCertModal] = useState(false);

  // ── Web3 지갑 훅 (Option C: 신한 슈퍼SOL 딥링크 전용)
  const wallet = useWallet();
  const walletConnected = wallet.isConnected;
  const walletAddress   = wallet.address ?? '';
  const solcBalance     = wallet.solcBalance;
  const setSolcBalance  = (_: number) => {}; // useWallet 내부 관리

  const currentTabs = userRole === 'worker' ? workerTabs : userRole === 'employer' ? employerTabs : adminTabs;

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
      <div className="h-[100dvh] sm:min-h-screen bg-[#03030d] font-sans antialiased flex flex-col items-center justify-center sm:py-6 md:py-8 relative overflow-hidden sm:overflow-x-hidden">
      {/* 데스크톱 관람용 배경 어두운 앰비언트 글로우 */}
      <div className="hidden sm:block absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-[#03030d] to-black pointer-events-none" />

      {/* 모바일 디바이스 프레임 (데스크톱: 430px 마이크로 쉘, 모바일: 100% 풀스크린) */}
      <div className="w-full sm:max-w-[430px] h-[100dvh] sm:h-[850px] sm:max-h-[900px] bg-[#F4F6FA] text-slate-900 sm:rounded-[44px] sm:border-[8px] sm:border-slate-800/80 shadow-[0_0_60px_rgba(255,85,23,0.25)] flex flex-col relative overflow-hidden transition-all duration-300">
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
      <header className="sticky top-0 shrink-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="flex items-center justify-between px-2 sm:px-3 py-2 gap-1 w-full overflow-hidden">
          {/* 로고 및 역할 스위처 */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="bg-[#FB521C] text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-xs">
                웍스
              </span>
              <h1 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight leading-none whitespace-nowrap">
                땡겨요 WORKS
              </h1>
            </div>
            
            {/* 동적 역할 모드 스위처 캡슐 버튼 (워커 / 점주 / 관리자 3가지 스위칭) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 shrink-0 gap-0.5 ml-1">
              <button
                onClick={() => {
                  setUserRole('worker');
                  setActiveTab('agent');
                }}
                className={`px-2 py-0.5 rounded-full text-[8.5px] font-black transition-all whitespace-nowrap ${
                  userRole === 'worker'
                    ? 'bg-[#FB521C] text-white shadow-xs'
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
                className={`px-2 py-0.5 rounded-full text-[8.5px] font-black transition-all whitespace-nowrap ${
                  userRole === 'employer'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🏪 점주
              </button>
              <button
                onClick={() => {
                  setUserRole('admin');
                  setActiveTab('admin');
                }}
                className={`px-2 py-0.5 rounded-full text-[8.5px] font-black transition-all whitespace-nowrap ${
                  userRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ⚙️ 관리자
              </button>
            </div>
          </div>

          {/* 우측 조이수 워커 프로필 & 알림 & D-GCS/지갑 정보 영역 */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* 🔔 실시간 정산/에스크로 알림 아이콘 (건수 배지 표시 및 클릭 시 상세 모달) */}
            <button
              onClick={() => setShowLiveNotificationModal(true)}
              className="relative w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all border border-slate-200 shrink-0 cursor-pointer"
              title="실시간 알림 센터 (5건)"
            >
              <Bell className="w-3.5 h-3.5 text-slate-700" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white font-black text-[8.5px] flex items-center justify-center shadow-xs animate-pulse">
                5
              </span>
            </button>

            {/* 👤 조이수 프로필 캡슐 버튼 (이름만 표시, 클릭 시 상세 팝업) */}
            <button
              onClick={() => setShowWorkerProfileModal(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white pl-1.5 pr-2.5 py-1 rounded-full border border-slate-700 shadow-xs transition-all cursor-pointer"
              title="조이수 프로필 및 SBT 신용/보건증 상세 보기"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-[10px] shadow-xs">
                🏆
              </div>
              <span className="text-xs font-black text-white tracking-tight">조이수</span>
              <span 
                className={`w-2 h-2 rounded-full ${healthCertVerified ? 'bg-emerald-400' : 'bg-amber-400'} border border-slate-900`} 
                title={healthCertVerified ? "보건증 인증완료" : "보건증 미인증"} 
              />
            </button>

            {wallet.isConnecting ? (
              <button disabled className="bg-blue-50 text-[#0046FF] text-[8.5px] font-black px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-0.5 whitespace-nowrap">
                <span className="animate-spin w-2 h-2 border-2 border-[#0046FF]/30 border-t-[#0046FF] rounded-full" />
                연결 중
              </button>
            ) : !walletConnected ? (
              <button 
                onClick={triggerWalletConnect}
                className="bg-gradient-to-r from-[#0046FF] via-[#0242CF] to-[#FF5517] hover:brightness-110 active:scale-95 text-white text-[8.5px] sm:text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-0.5 shadow-xs whitespace-nowrap border border-blue-300/30"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                신한 슈퍼SOL
              </button>
            ) : (
              <button 
                onClick={() => {
                  setShowWalletDropdown(!showWalletDropdown);
                  setShowCreditDropdown(false);
                }}
                className="flex items-center gap-0.5 active:scale-95 transition-transform text-right shrink-0"
              >
                <span className="relative overflow-hidden inline-flex items-center text-[8px] font-black px-1.5 py-0.5 rounded-full animate-hologram bg-[linear-gradient(120deg,#0046ff,#6366f1,#a855f7,#ec4899,#0046ff)] text-white shadow-xs whitespace-nowrap">
                  D-GCS 990점
                </span>
                <span className="text-[8.5px] font-black text-[#0046FF] flex items-center gap-0.5 whitespace-nowrap bg-blue-50 border border-blue-100 px-1 py-0.5 rounded-md">
                  🪙 {solcBalance.toFixed(1)}
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
                  <p className="text-[10px] font-black text-[#FF5517] tracking-widest uppercase mb-1">Dynamic Credit</p>
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

      {/* 메인 콘텐츠 영역 (동적 탭 렌더링 - AI 매칭 탭은 지도 상단 고정 & 하단 독립 스크롤) */}
      <main className={`flex-1 ${activeTab === 'agent' ? 'overflow-hidden flex flex-col px-3.5 pt-2 pb-1 min-h-0' : 'overflow-y-auto px-3.5 pt-3 pb-2'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'agent' && (
            <motion.div key="agent" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="flex flex-col h-full overflow-hidden min-h-0">
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
              <CheckoutScreen 
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

          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="h-full flex flex-col min-h-0">
              <AlbamonChatScreen />
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div key="community" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="h-full flex flex-col min-h-0">
              <AlbamonCommunityScreen />
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

      {/* 역할 기반 슬림 동적 하단 내비게이션 바 */}
      <nav className="sticky bottom-0 shrink-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-6 items-center px-1 py-1.5 pb-safe">
          {currentTabs.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-2xl transition-all active:scale-90 ${
                activeTab === id
                  ? 'text-[#FB521C]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                activeTab === id
                  ? 'bg-orange-50/80 shadow-xs'
                  : ''
              }`}>
                <Icon className={`w-4.5 h-4.5 ${activeTab === id ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[9.5px] font-black tracking-tight leading-none text-center ${
                activeTab === id
                  ? 'text-[#FB521C]'
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

        {/* 👤 우측 상단 [조이수 🏆] 클릭 시 표출되는 워커 상세 프로필 & SBT 신용/보건증 모달 */}
        <WorkerProfileDetailModal
          isOpen={showWorkerProfileModal}
          onClose={() => setShowWorkerProfileModal(false)}
          healthCertVerified={healthCertVerified}
          onOpenHealthCertModal={() => setShowHealthCertModal(true)}
          solcBalance={solcBalance}
        />

        {/* 🔔 상단 우측 알림 벨 클릭 시 표출되는 실시간 알림 센터 모달 */}
        <LiveNotificationModal
          isOpen={showLiveNotificationModal}
          onClose={() => setShowLiveNotificationModal(false)}
        />
      </div>
    </div>
    </AppPushProvider>
  );
}
