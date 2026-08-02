// store/revenueStore.ts
// 실시간 수익 데이터 Zustand 스토어 — 신한금융그룹 7대 계열사 시너지 지원

import { create } from 'zustand';

export interface SubsidiaryMetric {
  name: string;
  subtitle?: string;
  synergyGoal?: string;
  color: string;
  revenuePerTx: number;
  annualProjection: number;
  metrics?: Record<string, number | string>;
  painPoint?: string;
  synergy?: string;
}

export interface RevenueData {
  summary: {
    totalTransactions: number;
    totalGrossPay: number;
    totalNetDeposit: number;
    lastUpdated: string;
  };
  subsidiaries: {
    bank: SubsidiaryMetric;
    ezInsurance: SubsidiaryMetric;
    card: SubsidiaryMetric;
    life: SubsidiaryMetric;
    invest: SubsidiaryMetric;
    savingsCapital: SubsidiaryMetric;
    ds: SubsidiaryMetric;
  };
  competitive: {
    pgCostCompetitor: string;
    pgCostShinhan: string;
    annualSavings: number;
    marketShareCapture: string;
  };
  recentTransactions: Array<{
    txId: string;
    userId: string;
    grossPay: number;
    lifePremium: number;
    investSweep: number;
    ezInsuranceFee?: number;
    netDeposit: number;
    dsBaasFee: number;
    createdAt: string;
  }>;
  mode: 'D1' | 'MOCK';
}

interface RevenueStore {
  data: RevenueData | null;
  loading: boolean;
  error: string | null;
  lastFetch: number;
  liveCounter: number;        // 실시간 카운터 애니메이션용
  simulatedTx: number;        // 시뮬레이션 트랜잭션 수
  fetchRevenue: () => Promise<void>;
  simulateTransaction: () => void;
  incrementLive: () => void;
}

export const useRevenueStore = create<RevenueStore>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  lastFetch: 0,
  liveCounter: 0,
  simulatedTx: 0,

  fetchRevenue: async () => {
    const now = Date.now();
    if (now - get().lastFetch < 3000) return; // 3초 디바운스

    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/analytics/revenue.json');
      if (!res.ok) throw new Error('API server returned error status');
      const baseData: RevenueData = await res.json();
      
      // 로컬 시뮬레이터 횟수를 얹어서 실시간 대시보드 역동성 부여
      const simulatedCount = get().simulatedTx;
      const data: RevenueData = {
        ...baseData,
        summary: {
          totalTransactions: baseData.summary.totalTransactions + simulatedCount,
          totalGrossPay: baseData.summary.totalGrossPay + (simulatedCount * 50000),
          totalNetDeposit: baseData.summary.totalNetDeposit + (simulatedCount * 49000),
          lastUpdated: new Date().toISOString(),
        }
      };
      set({ data, loading: false, lastFetch: Date.now() });
    } catch (e: any) {
      console.warn('Revenue API error, using static fallback.', e);
      const mockData: RevenueData = {
        summary: {
          totalTransactions: 1420 + get().simulatedTx,
          totalGrossPay: (1420 + get().simulatedTx) * 50000,
          totalNetDeposit: (1420 + get().simulatedTx) * 49000,
          lastUpdated: new Date().toISOString(),
        },
        subsidiaries: {
          bank: {
            name: '신한은행',
            subtitle: '노쇼 방지와 신용 난민 구제',
            synergyGoal: 'CASA 흡수 및 여신 독식',
            color: '#0052FF',
            revenuePerTx: 150,
            annualProjection: 360000000,
            painPoint: '점주의 노쇼 공포 + 알바생 대출 거절',
            synergy: '0.1초 즉시 정산 모계좌 연동 CASA 락인 + SBT 근태 기반 우대금리 여신 독식',
          },
          ezInsurance: {
            name: '신한EZ손해보험',
            subtitle: '맘카페 협박과 의료 파산 방어',
            synergyGoal: '단기 배상책임 시장 장악',
            color: '#06B6D4',
            revenuePerTx: 150,
            annualProjection: 360000000,
            painPoint: '알바생 비급여 치료 빚 전락 + 점주 합의금 협박',
            synergy: '구인 글 100~200원 결제 + 출근 스와이프 즉시 비급여 상해보험 자동 개시',
          },
          card: {
            name: '신한카드',
            subtitle: '영세 점주 캐시플로우 붕괴',
            synergyGoal: '결제망 100% 종속',
            color: '#EC4899',
            revenuePerTx: 200,
            annualProjection: 480000000,
            painPoint: '알바비 당장 줘야 하나 카드 정산은 3일 뒤',
            synergy: '실시간 고용·매출 데이터 담보 일일 단기 신용한도 부여로 주력 결제망 종속',
          },
          life: {
            name: '신한라이프',
            subtitle: '늙어가는 긱 워커의 공포',
            synergyGoal: '2030 생체 DB 싹쓸이',
            color: '#10B981',
            revenuePerTx: 302,
            annualProjection: 724800000,
            painPoint: '하루살이 근로, 퇴직금·의료비 공포',
            synergy: '알바비 1% 마이크로 연금 자동 적립 + GPS 이동거리 헬스케어 2030 생체 DB 선점',
          },
          invest: {
            name: '신한투자증권',
            subtitle: '자본 양극화 해소',
            synergyGoal: '미래 투자 VIP 강제 편입',
            color: '#F59E0B',
            revenuePerTx: 850,
            annualProjection: 2040000000,
            painPoint: '34,700원 받아 주식 투자 불가능한 한계',
            synergy: '정산 일당 1,000원 미만 자투리 잔돈 소수점 ETF/STO 자동 매수 MTS 편입',
          },
          savingsCapital: {
            name: '신한저축은행&캐피탈',
            subtitle: '이자 유출 방어 & 고정비 공포',
            synergyGoal: '중금리 Cascade & B2B 리스 장악',
            color: '#F97316',
            revenuePerTx: 400,
            annualProjection: 960000000,
            painPoint: '은행 문턱 못 넘은 좌절 + 서빙로봇/기기 부담',
            synergy: '은행 탈락자 0.1초 중금리 대출 Cascade + 매출 담보 서빙로봇 B2B 캐피탈 리스',
          },
          ds: {
            name: '신한DS',
            subtitle: '무능한 레거시 IT 한계 돌파',
            synergyGoal: '독자적 통행료(BaaS) 징수',
            color: '#8B5CF6',
            revenuePerTx: 200,
            annualProjection: 480000000,
            painPoint: '레거시 웹 게시판으로 6개사 융합 무중단 처리 불가능',
            synergy: '출퇴근 스와이프 1번에 0.1초 7개사 융합 처리 API 게이트웨이 건당 통행료 수취',
          },
        },
        competitive: {
          pgCostCompetitor: '3.0%',
          pgCostShinhan: '0.0%',
          annualSavings: 1500000000,
          marketShareCapture: '82%',
        },
        recentTransactions: [
          { txId: 'TX-SH-9081', userId: 'WORKER-8012', grossPay: 50000, lifePremium: 302, investSweep: 850, ezInsuranceFee: 150, netDeposit: 49000, dsBaasFee: 200, createdAt: new Date(Date.now() - 300000).toISOString() },
          { txId: 'TX-SH-9080', userId: 'WORKER-1204', grossPay: 50000, lifePremium: 302, investSweep: 850, ezInsuranceFee: 150, netDeposit: 49000, dsBaasFee: 200, createdAt: new Date(Date.now() - 600000).toISOString() }
        ],
        mode: 'MOCK',
      };
      set({ data: mockData, loading: false, lastFetch: Date.now() });
    }
  },

  simulateTransaction: () => {
    set(s => ({ simulatedTx: s.simulatedTx + 1, liveCounter: s.liveCounter + 1 }));
  },

  incrementLive: () => {
    set(s => ({ liveCounter: s.liveCounter + 1 }));
  },
}));
