import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginResponse } from "@/schemas/auth";

type AuthStoreState = {
  token: string | null;
};

type AuthStoreActions = {
  setToken: (response: LoginResponse) => void;
  clearToken: () => void;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
  persist(
    (set) => ({
      token: null,

      setToken: (response) => {
        set({ token: response.access_token });
      },

      clearToken: () => {
        set({ token: null });
      },
    }),
    {
      name: "goosebit-auth-storage",
      partialize: (state) => ({
        token: state.token,
      }),
    },
  ),
);
