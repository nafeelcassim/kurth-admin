import { ThicknessService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateThicknessModel } from "@/models/thickness";
import { queryKeys } from "./queryKeys";

export function useCreateThickness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.thickness.create(),
    mutationFn: (payload: CreateThicknessModel) =>
      ThicknessService.createThickness(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.thickness.list(),
      });
    },
  });
}
