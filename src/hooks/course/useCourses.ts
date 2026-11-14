import { useQuery } from "@tanstack/react-query";

import { getCourses } from "@/api/course.api";
import { useQueryUser } from "@/hooks/use-query-user";
import { queryKeys } from "@/lib/query-cache";

export function useCourses() {
  const userId = useQueryUser();

  return useQuery({
    queryKey: queryKeys.courses(userId),
    queryFn: getCourses,
    enabled: !!userId,
  });
}