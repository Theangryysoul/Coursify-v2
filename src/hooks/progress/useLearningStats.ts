import { useQuery } from "@tanstack/react-query";

import { getLearningStats } from "@/api/progress.api";
import { useQueryUser } from "@/hooks/use-query-user";
import { queryKeys } from "@/lib/query-cache";

export const useLearningStats = () => {
  const userId = useQueryUser();

  return useQuery({
    queryKey: queryKeys.learningStats(userId),
    queryFn: getLearningStats,
    enabled: !!userId,
  });
};