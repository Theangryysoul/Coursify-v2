import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleCompleted } from "@/api/progress.api";
import { captureQueryUser } from "@/hooks/use-query-user";
import { invalidateResume, invalidateUserData } from "@/lib/query-cache";

export function useToggleCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCompleted,
    onMutate: captureQueryUser,
    onSuccess: (_data, videoId, context) => {
      void invalidateUserData(queryClient, context?.userId, [
        "course-details",
        "courses",
        "learning-stats",
        "heatmap",
      ]);
      void invalidateResume(queryClient, context?.userId, videoId);
    },
  });
}
