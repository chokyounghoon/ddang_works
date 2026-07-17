import { create } from 'zustand';

type GigStatus = 'idle' | 'accepted' | 'working' | 'completed';

interface GigState {
  status: GigStatus;
  appliedGig: any | null; // Gig info
  setGigStatus: (status: GigStatus) => void;
  setAppliedGig: (gig: any | null) => void;
  resetGig: () => void;
}

export const useGigStore = create<GigState>((set) => ({
  status: 'idle',
  appliedGig: null,
  setGigStatus: (status) => set({ status }),
  setAppliedGig: (gig) => set({ appliedGig: gig }),
  resetGig: () => set({ status: 'idle', appliedGig: null }),
}));
