import { UserService } from "@/service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

type UseUserOptions = {
  enabled?: boolean;
};

export function useUser(options: UseUserOptions = {}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: () => UserService.getMe(),
    enabled: options.enabled ?? true,
  });

  return {
    data,
    isLoading,
    isError,
  };
}
