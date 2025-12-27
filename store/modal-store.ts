import { IModalKey, ModalData, ModalType } from '@/components/modals/interface';
import { create } from 'zustand';

export interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData | null;
}

interface ModalStore extends ModalState {
  openModal: <T extends ModalType>(type: T, data: IModalKey[T]['data']) => void;
  reOpenModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: null,

  openModal: <T extends ModalType>(type: T, data: IModalKey[T]['data']) => {
    set({ type, isOpen: true, data });
  },
  reOpenModal: (type: ModalType) => {
    set({ type, isOpen: true });
  },
  closeModal: () => {
    set({ type: null, isOpen: false, data: null });
  },
}));
