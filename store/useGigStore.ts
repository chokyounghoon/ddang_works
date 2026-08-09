import { create } from 'zustand';

type GigStatus = 'idle' | 'accepted' | 'working' | 'completed';

interface GigState {
  status: GigStatus;
  appliedGig: any | null; // Gig info
  selectedMapGig: any | null; // Map pin click selected gig
  highlightedGigIds: string[]; // Gigs highlighted by Dodam AI Chatbot
  chatTriggerMessage: string | null; // Message triggered from map to Dodam Chat
  
  setGigStatus: (status: GigStatus) => void;
  setAppliedGig: (gig: any | null) => void;
  setSelectedMapGig: (gig: any | null) => void;
  setHighlightedGigIds: (ids: string[]) => void;
  setChatTriggerMessage: (msg: string | null) => void;
  resetGig: () => void;
}

export const useGigStore = create<GigState>((set) => ({
  status: 'idle',
  appliedGig: null,
  selectedMapGig: null,
  highlightedGigIds: [],
  chatTriggerMessage: null,

  setGigStatus: (status) => set({ status }),
  setAppliedGig: (gig) => set({ appliedGig: gig }),
  setSelectedMapGig: (gig) => set({ selectedMapGig: gig }),
  setHighlightedGigIds: (highlightedGigIds) => set({ highlightedGigIds }),
  setChatTriggerMessage: (chatTriggerMessage) => set({ chatTriggerMessage }),
  resetGig: () =>
    set({
      status: 'idle',
      appliedGig: null,
      selectedMapGig: null,
      highlightedGigIds: [],
      chatTriggerMessage: null,
    }),
}));
