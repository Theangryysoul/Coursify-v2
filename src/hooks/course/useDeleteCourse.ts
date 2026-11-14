import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCourse } from "@/api/course.api";
import { captureQueryUser } from "@/hooks/use-query-user";
import { invalidateResume, invalidateUserData, queryKeys } from "@/lib/query-cache";

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onMutate: captureQueryUser,
    onSuccess: (_data, courseId, context) => {
      const userId = context?.userId;
      if (!userId) return;

      // Remove only this account's deleted detail page, including a pending GET.
      const filters = {
        queryKey: queryKeys.courseDetails(courseId, userId),
        exact: true,
      };
      void queryClient.cancelQueries(filters);
      queryClient.removeQueries(filters);

      void invalidateUserData(queryClient, userId, [
        "courses",
        "folders",
        "learning-stats",
      ]);
      void invalidateResume(queryClient, userId);
    },
  });
}
