import { create } from 'zustand';
import { IPayload } from '@/lib/auth';

interface AuthStore {
  user: IPayload | null;
  isAuthenticated: boolean;
  setUser: (user: IPayload | null) => void;
  clearUser: () => void;
  initialize: (user: IPayload | null) => void;
}

let initialized = false;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  initialize: (user) => {
    if (!initialized) {
      initialized = true;
      set({ user, isAuthenticated: !!user });
    }
  },
}));
