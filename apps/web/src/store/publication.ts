// import type QueuedCommentType from 'lens';
import type { QueuedCommentType } from 'utils';
import { create } from 'zustand';

interface PublicationState {
  selectedWorkId: string | null;
  setSelectedWorkId: (id: string | null) => void;
  queuedComments: QueuedCommentType[];
  setQueuedComments: (queuedComments: QueuedCommentType[]) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  selectedWorkId: null,
  setSelectedWorkId: (id) => set(() => ({ selectedWorkId: id })),
  queuedComments: [],
  setQueuedComments: (queuedComments) => set({ queuedComments })
}));
