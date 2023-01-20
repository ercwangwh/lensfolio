import create from 'zustand';

interface PublicationState {
  selectedWorkId: string | null;
  setSelectedWorkId: (id: string | null) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  selectedWorkId: null,
  setSelectedWorkId: (id) => set(() => ({ selectedWorkId: id }))
}));
