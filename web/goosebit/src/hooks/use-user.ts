import { useMemo } from "react";
import type { User } from "@/schemas/auth";
import { useAuthStore } from "@/stores/auth";

function decodeJWT(token: string): User | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(
      paddedPayload.replace(/-/g, "+").replace(/_/g, "/"),
    );
    const parsedPayload = JSON.parse(decodedPayload);
    if (!parsedPayload.username) {
      return null;
    }

    return parsedPayload as User;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

export function useUser() {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);

  const user = useMemo(() => {
    if (!token) {
      return null;
    }

    const decodedUser = decodeJWT(token);

    if (!decodedUser) {
      clearToken();
      return null;
    }

    return decodedUser;
  }, [token, clearToken]);

  return {
    user,
    isAuthenticated: !!token && !!user,
    isLoading: false,
    getUsername: () => user?.username || null,
  };
}
