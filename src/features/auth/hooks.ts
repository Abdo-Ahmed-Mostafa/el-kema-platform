"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useRouter } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import { roleDashboardSegment } from "@/config/roles";
import { tokenStore } from "@/lib/api";
import type { ApiError } from "@/types/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, clearUser } from "@/store/slices/auth.slice";
import { authApi } from "./api";
import type { LoginPayload, RegisterPayload, AuthResponse } from "./types";

/** React Query keys for auth. */
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

/** Read the current auth state from Redux. */
export function useAuth() {
  return useAppSelector((state) => state.auth);
}

/**
 * Shared success handler: persist tokens, mirror the user into Redux, warm
 * the query cache, then route to the role's dashboard.
 */
function useAuthSuccess() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return (res: AuthResponse) => {
    tokenStore.set({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    });
    dispatch(setUser(res.user));
    queryClient.setQueryData(authKeys.me(), res.user);

    const segment = roleDashboardSegment[res.user.role];
    router.push(`/${segment}`);
  };
}

/** Log in mutation. */
export function useLogin() {
  const t = useTranslations("auth");
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (res) => {
      toast.success(t("success.loggedIn"));
      onSuccess(res);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t("errors.loginFailed"));
    },
  });
}

/** Register mutation. */
export function useRegister() {
  const t = useTranslations("auth");
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (res) => {
      toast.success(t("success.registered"));
      onSuccess(res);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t("errors.registerFailed"));
    },
  });
}

/** Log out mutation: clear tokens, Redux, and query cache, then go home. */
export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    // Clear local state regardless of server outcome.
    onSettled: () => {
      tokenStore.clear();
      dispatch(clearUser());
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.push(routes.home);
    },
  });
}
