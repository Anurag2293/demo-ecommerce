import { createStore } from "zustand";

export type AuthState = {
  userId: number;
  name: string;
  email: string;
  otp: string;
  isVerified: boolean;
  isAuthenticated: boolean;
};

export type AuthActions = {
  verifyOTP: () => void;
  updateAuthState: (newAuthState: AuthState) => void;
};

export type AuthStore = AuthState & AuthActions;

export const initAuthStore = (): AuthState => {
  return {
    userId: -1,
    name: "",
    email: "",
    otp: "",
    isVerified: false,
    isAuthenticated: false,
  };
};

export const defaultInitState: AuthState = {
  userId: -1,
  name: "",
  email: "",
  otp: "",
  isVerified: false,
  isAuthenticated: false,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    verifyOTP: () => set((state) => {
      return { ...state, isVerified: true }
    }),
    updateAuthState: (authState) => set((state) => {
        return { ...state, ...authState }
      }),
  }));
};
