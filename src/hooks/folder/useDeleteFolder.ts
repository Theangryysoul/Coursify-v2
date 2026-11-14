import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFolder } from "@/api/folder.api";
import { captureQueryUser } from "@/hooks/use-query-user";
import { invalidateUserData } from "@/lib/query-cache";

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,
    onMutate: captureQueryUser,
    onSuccess: (_data, _folderId, context) => {
      // The server moves the deleted folder's courses back to Uncategorised.
      void invalidateUserData(queryClient, context?.userId, ["folders", "courses"]);
    },
  });
}
