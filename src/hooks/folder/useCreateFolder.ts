import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createFolder } from "@/api/folder.api";
import { captureQueryUser } from "@/hooks/use-query-user";
import { invalidateUserData } from "@/lib/query-cache";

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onMutate: captureQueryUser,
    onSuccess: (_data, _variables, context) => {
      void invalidateUserData(queryClient, context?.userId, ["folders"]);
    },
  });
}
