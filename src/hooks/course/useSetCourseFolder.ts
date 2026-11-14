import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setCourseFolder } from "@/api/course.api";
import { captureQueryUser } from "@/hooks/use-query-user";
import { invalidateUserData } from "@/lib/query-cache";

type SetCourseFolderVariables = {
  courseId: string;
  folderId: string | null;
};

export function useSetCourseFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, folderId }: SetCourseFolderVariables) =>
      setCourseFolder(courseId, folderId),
    onMutate: captureQueryUser,
    onSuccess: (_data, _variables, context) => {
      // Moving a course changes both the cards and folder counts.
      void invalidateUserData(queryClient, context?.userId, ["courses", "folders"]);
    },
  });
}
