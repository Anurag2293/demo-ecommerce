import { createStore } from "zustand";

export type AuthState = {
  name: string;
  email: string;
  otp: string;
  verified: boolean;
  isAuthenticated: boolean;
};

export type AuthActions = {
  verifyOTP: () => void;
  updateAuthState: () => void;
};

export type AuthStore = AuthState & AuthActions;

export const initAuthStore = (): AuthState => {
  return {
    name: "",
    email: "",
    otp: "",
    verified: false,
    isAuthenticated: false,
  };
};

export const defaultInitState: AuthState = {
  name: "",
  email: "",
  otp: "",
  verified: false,
  isAuthenticated: false,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    verifyOTP: () => set((state) => ({ ...state, verified: true })),
    updateAuthState: () =>
      set((state) => ({ ...state, isAuthenticated: true })),
  }));
};
