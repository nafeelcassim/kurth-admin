import { UserService } from "@/service";
import type { FindUsersDto } from "@/models";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useUsers(params: FindUsersDto) {
  const query = useQuery({
    queryKey: queryKeys.user.list(params),
    queryFn: () => UserService.getAllUsers(params),
  });

  return query;
}
