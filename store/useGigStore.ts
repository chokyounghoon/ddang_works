import { create } from 'zustand';

type GigStatus = 'idle' | 'accepted' | 'working' | 'completed';

interface GigState {
  status: GigStatus;
  setGigStatus: (status: GigStatus) => void;
  resetGig: () => void;
}

export const useGigStore = create<GigState>((set) => ({
  status: 'idle',
  setGigStatus: (status) => set({ status }),
  resetGig: () => set({ status: 'idle' }),
}));
