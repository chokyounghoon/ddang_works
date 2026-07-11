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
      const res = await fetch('/api/analytics/revenue');
      const data: RevenueData = await res.json();
      set({ data, loading: false, lastFetch: Date.now() });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  simulateTransaction: () => {
    set(s => ({ simulatedTx: s.simulatedTx + 1, liveCounter: s.liveCounter + 1 }));
  },

  incrementLive: () => {
    set(s => ({ liveCounter: s.liveCounter + 1 }));
  },
}));
