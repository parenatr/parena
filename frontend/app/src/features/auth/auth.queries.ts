import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as authApi from "./auth.api";
import type { SessionUser } from "./auth.types";

export const authKeys = {
  session: ["auth", "session"] as const,
};

export function useSession() {
  const query = useQuery<SessionUser | null>({
    queryKey: authKeys.session,
    queryFn: ({ signal }) => authApi.fetchSession(signal),
    staleTime: 60_000,
    retry: false,
  });

  return {
    user: query.data ?? null,
    isAuthenticated: Boolean(query.data),
    isLoading: query.isPending,
  };
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session }),
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: authApi.resetPassword });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: (data) => {
      queryClient.clear();
      window.location.href = data.redirectUrl; // Keycloak'taki oturumu da kapatmak için tam sayfa yönlendirme
    },
  });
}