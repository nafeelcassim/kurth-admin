import { AuthService } from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "./queryKeys";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutateAsync: login,
    isPending: isLoginLoading,
    isError: isLoginError,
    isSuccess: isLoginSuccess,
    error: loginError,
  } = useMutation({
    mutationKey: queryKeys.auth.login(),
    mutationFn: AuthService.login,
    onSuccess: () => {
      router.refresh();
      router.push("/");
    },
  });

  const {
    mutateAsync: logout,
    isPending: isLogoutLoading,
    isError: isLogoutError,
    isSuccess: isLogoutSuccess,
    error: logoutError,
  } = useMutation({
    mutationKey: queryKeys.auth.logout(),
    mutationFn: AuthService.logout,
    onSuccess: () => {
      queryClient.clear();
      router.refresh();
      router.push("/login");
    },
  });

  return {
    login: {
      mutateAsync: login,
      isPending: isLoginLoading,
      isError: isLoginError,
      isSuccess: isLoginSuccess,
      error: loginError,
    },
    logout: {
      mutateAsync: logout,
      isPending: isLogoutLoading,
      isError: isLogoutError,
      isSuccess: isLogoutSuccess,
      error: logoutError,
    },
  };
}
