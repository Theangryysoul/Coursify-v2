import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProgress } from "@/api/progress.api";
import { captureQueryUser } from "@/hooks/use-query-user";
import { invalidateResume, invalidateUserData } from "@/lib/query-cache";

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      videoId,
      data,
    }: {
      videoId: string;
      data: Parameters<typeof updateProgress>[1];
    }) => updateProgress(videoId, data),

    onMutate: captureQueryUser,
    onSuccess: (_data, { videoId }, context) => {
      void invalidateUserData(queryClient, context?.userId, [
        "courses",
        "learning-stats",
        "course-details",
        "heatmap",
      ]);
      void invalidateResume(queryClient, context?.userId, videoId);
    },
  });
}
