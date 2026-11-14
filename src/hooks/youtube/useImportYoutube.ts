import { useMutation, useQueryClient } from "@tanstack/react-query";

import { importYoutube } from "@/api/youtube.api";
import { captureQueryUser } from "@/hooks/use-query-user";
import { invalidateUserData } from "@/lib/query-cache";

export function useImportYoutube() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importYoutube,
    onMutate: captureQueryUser,
    onSuccess: (_data, _url, context) => {
      // A fresh list must not hide a course that was just imported.
      void invalidateUserData(queryClient, context?.userId, [
        "courses",
        "folders",
        "learning-stats",
      ]);
    },
  });
}
