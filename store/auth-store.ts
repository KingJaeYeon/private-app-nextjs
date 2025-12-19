import { create } from 'zustand';
import { IPayload } from '@/lib/auth';

interface AuthStore {
  user: IPayload | null;
  initialized: boolean;
  isAuthenticated: boolean;
  setUser: (user: IPayload | null) => void;
  clearUser: () => void;
  initialize: (user: IPayload | null) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  initialized: false,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  initialize: (user) => {
    const initialized = get().initialized;
    if (!initialized) {
      set({ user, isAuthenticated: !!user, initialized: true });
    }
  },
}));
