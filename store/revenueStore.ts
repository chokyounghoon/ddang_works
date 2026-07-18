// store/revenueStore.ts
// 실시간 수익 데이터 Zustand 스토어

import { create } from 'zustand';

export interface SubsidiaryMetric {
  name: string;
  color: string;
  revenuePerTx: number;
  annualProjection: number;
  metrics: Record<string, number | string>;
  description?: string;
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
    card: SubsidiaryMetric;
    life: SubsidiaryMetric;
    invest: SubsidiaryMetric;
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
          totalNetDeposit: baseData.summary.totalNetDeposit + (simulatedCount * 50000),
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
          totalNetDeposit: (1420 + get().simulatedTx) * 50000,
          lastUpdated: new Date().toISOString(),
        },
        subsidiaries: {
          bank: { name: '신한은행', color: '#0052FF', revenuePerTx: 150, annualProjection: 360000000, metrics: {} },
          card: { name: '신한카드', color: '#EC4899', revenuePerTx: 200, annualProjection: 480000000, metrics: {} },
          life: { name: '신한라이프', color: '#10B981', revenuePerTx: 302, annualProjection: 724800000, metrics: {} },
          invest: { name: '신한투자증권', color: '#F59E0B', revenuePerTx: 850, annualProjection: 2040000000, metrics: {} },
          ds: { name: '신한DS', color: '#8B5CF6', revenuePerTx: 200, annualProjection: 480000000, metrics: {} },
        },
        competitive: {
          pgCostCompetitor: '3.0%',
          pgCostShinhan: '0.0%',
          annualSavings: 1500000000,
          marketShareCapture: '82%',
        },
        recentTransactions: [
          { txId: 'TX-SH-9081', userId: 'WORKER-8012', grossPay: 50000, lifePremium: 302, investSweep: 850, netDeposit: 49150, dsBaasFee: 200, createdAt: new Date(Date.now() - 300000).toISOString() },
          { txId: 'TX-SH-9080', userId: 'WORKER-1204', grossPay: 50000, lifePremium: 302, investSweep: 850, netDeposit: 49150, dsBaasFee: 200, createdAt: new Date(Date.now() - 600000).toISOString() }
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
