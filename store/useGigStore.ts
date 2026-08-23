import { create } from 'zustand';
import { GENERATED_200_P2P_GIGS } from '../app/lib/p2pGigsData';
import { GENERATED_200_GIGS } from '../app/lib/gigsData';

export interface GigItem {
  id: string;
  storeName: string;
  category: string;
  district: string;
  distanceM: number;
  role: string;
  hours: number;
  startTime: string;
  endTime: string;
  pay: number;
  hourlyRate: number;
  aiScore: number;
  urgency: boolean;
  applied: boolean;
  isP2P: boolean;
  escrowLocked?: boolean;
  description?: string;
  minDgcsScore?: number; // 요구 최소 D-GCS 신용점수 (예: 900점 이상)
  healthCertRequired?: boolean; // 보건증 필수 여부
  cleanRecordRequired?: boolean; // 범죄경력/신원 무사고 검증 필수 여부
  preferredConditions?: string[]; // 우대 사항 태그 (예: '동일직종 6개월 이상', '인근 거주자', '비흡연자')
}

export type P2PGigItem = GigItem;

type GigStatus = 'idle' | 'accepted' | 'working' | 'completed';

interface GigState {
  status: GigStatus;
  appliedGig: any | null;
  selectedMapGig: any | null;
  highlightedGigIds: string[];
  chatTriggerMessage: string | null;
  
  // 🏢 점주 등록 공고 목록 & 관리
  employerGigs: GigItem[];
  addEmployerGig: (gig: GigItem) => void;
  updateEmployerGig: (gig: GigItem) => void;
  deleteEmployerGig: (id: string) => void;

  // 🏡 개인 의뢰 P2P 공고 목록 & 관리
  p2pGigs: GigItem[];
  addP2PGig: (gig: GigItem) => void;
  updateP2PGig: (gig: GigItem) => void;
  deleteP2PGig: (id: string) => void;

  setGigStatus: (status: GigStatus) => void;
  setAppliedGig: (gig: any | null) => void;
  setSelectedMapGig: (gig: any | null) => void;
  setHighlightedGigIds: (ids: string[]) => void;
  setChatTriggerMessage: (msg: string | null) => void;
  resetGig: () => void;
}

const INITIAL_P2P_GIG: GigItem = {
  id: 'p2p-init-1',
  storeName: '역삼 래미안 (이웃 의뢰인)',
  category: '돌봄',
  district: '강남구 역삼동',
  distanceM: 350,
  role: '🧸 초등 2학년 방과후 하원 및 실내 놀이 돌봄',
  hours: 2,
  startTime: '15:00',
  endTime: '17:00',
  pay: 30000,
  hourlyRate: 15000,
  aiScore: 99,
  urgency: true,
  applied: false,
  isP2P: true,
  escrowLocked: true,
  description: '방과후 학교 앞에서 픽업 후 아파트 단지 도서관에서 2시간 책 읽기 및 안전 하원 지도',
  minDgcsScore: 950,
  cleanRecordRequired: true,
  healthCertRequired: false,
  preferredConditions: ['아동돌봄 경험자', '비흡연자', '인근 거주자'],
};

const INITIAL_EMPLOYER_GIGS: GigItem[] = [
  {
    id: 'emp-init-1',
    storeName: '스타벅스 강남2호점',
    category: '카페',
    district: '강남구',
    distanceM: 480,
    role: '홀 서빙 & 음료 조리 피크타임 지원',
    hours: 4,
    startTime: '14:00',
    endTime: '18:00',
    pay: 54000,
    hourlyRate: 13500,
    aiScore: 98,
    urgency: true,
    applied: false,
    isP2P: false,
    description: '오후 피크타임 에스프레소 머신 음료 제조 및 고객 응대, 컨디바 정리',
    minDgcsScore: 920,
    healthCertRequired: true,
    cleanRecordRequired: true,
    preferredConditions: ['바리스타 자격증', '카페 유경험자 우대'],
  },
  {
    id: 'emp-init-2',
    storeName: '스타벅스 강남2호점',
    category: '카페',
    district: '강남구',
    distanceM: 480,
    role: '마감 홀 마감 및 재고 카운트 보조',
    hours: 3,
    startTime: '19:00',
    endTime: '22:00',
    pay: 42000,
    hourlyRate: 14000,
    aiScore: 95,
    urgency: false,
    applied: false,
    isP2P: false,
    description: '영업 마감 후 머신 클리닝, 매장 바닥 청소 및 재고 실사 전수조사',
    minDgcsScore: 900,
    healthCertRequired: true,
    cleanRecordRequired: false,
    preferredConditions: ['성실한 마감 근무자', '야간 교통편 용이한 분'],
  }
];

export const useGigStore = create<GigState>((set) => ({
  status: 'idle',
  appliedGig: null,
  selectedMapGig: null,
  highlightedGigIds: [],
  chatTriggerMessage: null,
  
  employerGigs: GENERATED_200_GIGS.slice(0, 20),
  addEmployerGig: (gig) => set((state) => ({ employerGigs: [gig, ...state.employerGigs] })),
  updateEmployerGig: (gig) => set((state) => ({
    employerGigs: state.employerGigs.map(g => g.id === gig.id ? gig : g)
  })),
  deleteEmployerGig: (id) => set((state) => ({
    employerGigs: state.employerGigs.filter(g => g.id !== id)
  })),

  p2pGigs: GENERATED_200_P2P_GIGS,
  addP2PGig: (gig) => set((state) => ({ p2pGigs: [gig, ...state.p2pGigs] })),
  updateP2PGig: (gig) => set((state) => ({
    p2pGigs: state.p2pGigs.map(g => g.id === gig.id ? gig : g)
  })),
  deleteP2PGig: (id) => set((state) => ({
    p2pGigs: state.p2pGigs.filter(g => g.id !== id)
  })),

  setGigStatus: (status) => set({ status }),
  setAppliedGig: (appliedGig) => set({ appliedGig }),
  setSelectedMapGig: (selectedMapGig) => set({ selectedMapGig }),
  setHighlightedGigIds: (highlightedGigIds) => set({ highlightedGigIds }),
  setChatTriggerMessage: (chatTriggerMessage) => set({ chatTriggerMessage }),
  resetGig: () => set({ status: 'idle', appliedGig: null, selectedMapGig: null, highlightedGigIds: [], chatTriggerMessage: null })
}));
