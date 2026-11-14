import { useQuery } from "@tanstack/react-query";

import { getResume } from "@/api/progress.api";
import { useQueryUser } from "@/hooks/use-query-user";
import { queryKeys } from "@/lib/query-cache";

export function useResume(videoId: string) {
  const userId = useQueryUser();

  return useQuery({
    queryKey: queryKeys.resume(videoId, userId),
    queryFn: () => getResume(videoId),
    enabled: !!userId && !!videoId,
  });
}