import { useQuery } from "@tanstack/react-query";

import { getCourseDetails } from "@/api/course-details.api";
import { useQueryUser } from "@/hooks/use-query-user";
import { queryKeys } from "@/lib/query-cache";

export function useCourseDetails(courseId: string) {
  const userId = useQueryUser();

  return useQuery({
    queryKey: queryKeys.courseDetails(courseId, userId),
    queryFn: () => getCourseDetails(courseId),
    enabled: !!userId && !!courseId,
    staleTime: 0,
  });
}