import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as authApi from "./auth.api";
import type { SessionUser } from "./auth.types";

export const authKeys = {
  session: ["auth", "session"] as const,
};

/** Oturum durumu tek kaynaktan okunur (cookie tabanlı, /me üzerinden). */
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

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session }),
  });
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
    onSettled: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
    },
  });
}
