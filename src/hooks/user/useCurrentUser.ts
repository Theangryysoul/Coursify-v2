import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/api/user.api";
import { useQueryUser } from "@/hooks/use-query-user";
import { queryKeys } from "@/lib/query-cache";
import type { User } from "@/types/user";

export function useCurrentUser(enabled: boolean) {
  const userId = useQueryUser();

  return useQuery<User, Error>({
    queryKey: queryKeys.currentUser(userId),
    queryFn: getCurrentUser,
    enabled: enabled && !!userId,
  });
}