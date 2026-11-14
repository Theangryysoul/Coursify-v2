import { useQuery } from "@tanstack/react-query";

import { getFolders } from "@/api/folder.api";
import { useQueryUser } from "@/hooks/use-query-user";
import { queryKeys } from "@/lib/query-cache";

export function useFolders() {
  const userId = useQueryUser();

  return useQuery({
    queryKey: queryKeys.folders(userId),
    queryFn: getFolders,
    enabled: !!userId,
  });
}
