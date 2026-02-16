import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
}

const getInitialAuth = (): boolean => {
  if (typeof window !== 'undefined' && window.__INITIAL_AUTH__) {
    return window.__INITIAL_AUTH__.isAuthenticated;
  }
  return false;
};

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: getInitialAuth(),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  logout: () => set({ isAuthenticated: false }),
}));
