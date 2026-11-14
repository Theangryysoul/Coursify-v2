import { useQuery } from "@tanstack/react-query";

import { getHeatmap } from "@/api/progress.api";
import { useQueryUser } from "@/hooks/use-query-user";
import { queryKeys } from "@/lib/query-cache";

export const useHeatmap = () => {
  const userId = useQueryUser();

  return useQuery({
    queryKey: queryKeys.heatmap(userId),
    queryFn: getHeatmap,
    enabled: !!userId,
  });
};