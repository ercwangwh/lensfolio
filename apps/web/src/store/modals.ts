import type { Publication } from 'lens';
import { create } from 'zustand';

interface GlobalModalState {
  showReportModal: boolean;
  reportPublication: Publication | null;
  reportConfig: any;
  setShowReportModal: (
    showReportModal: boolean,
    reportPublication: Publication | null,
    reportConfig?: any
  ) => void;
  showStatusModal: boolean;
  setShowStatusModal: (showStatusModal: boolean) => void;
  showProfileSwitchModal: boolean;
  setShowProfileSwitchModal: (showProfileSwitchModal: boolean) => void;
  showWorkDetailModal: boolean;
  setShowWorkDetailModal: (showWorkDetailModal: boolean) => void;
  showCollectModuleModal: boolean;
  setShowCollectModuleModal: (showCollectModuleModal: boolean) => void;
  showReferenceModuleModal: boolean;
  setShowReferenceModuleModal: (showReferenceModuleModal: boolean) => void;
}

export const useGlobalModalStateStore = create<GlobalModalState>((set) => ({
  showReportModal: false,
  reportPublication: null,
  reportConfig: null,
  setShowReportModal: (showReportModal, reportPublication, reportConfig) =>
    set(() => ({ showReportModal, reportPublication, reportConfig })),
  showStatusModal: false,
  setShowStatusModal: (showStatusModal) => set(() => ({ showStatusModal })),
  showProfileSwitchModal: false,
  setShowProfileSwitchModal: (showProfileSwitchModal) => set(() => ({ showProfileSwitchModal })),
  showWorkDetailModal: false,
  setShowWorkDetailModal: (showWorkDetailModal) => set(() => ({ showWorkDetailModal })),
  showCollectModuleModal: false,
  setShowCollectModuleModal: (showCollectModuleModal) => set(() => ({ showCollectModuleModal })),
  showReferenceModuleModal: false,
  setShowReferenceModuleModal: (showReferenceModuleModal) => set(() => ({ showReferenceModuleModal }))
}));
