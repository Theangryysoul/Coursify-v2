import { QueryClient, type Query, type QueryKey } from "@tanstack/react-query";

const MINUTE = 60 * 1000;
const RETAIN_FOR = 30 * MINUTE;

// These four bounded datasets benefit from warm navigation. Playback queries
// deliberately keep their existing freshness and garbage-collection settings.
export const DATA_CACHE_POLICIES = {
  courses: { staleTime: MINUTE, gcTime: RETAIN_FOR },
  folders: { staleTime: 5 * MINUTE, gcTime: RETAIN_FOR },
  "learning-stats": { staleTime: 30 * 1000, gcTime: RETAIN_FOR },
  heatmap: { staleTime: MINUTE, gcTime: RETAIN_FOR },
} as const;

export const queryKeys = {
  courses: (userId: string | null) => ["courses", userId] as const,
  folders: (userId: string | null) => ["folders", userId] as const,
  learningStats: (userId: string | null) => ["learning-stats", userId] as const,
  heatmap: (userId: string | null) => ["heatmap", userId] as const,
  courseDetails: (courseId: string, userId: string | null) =>
    ["course-details", courseId, userId] as const,
  resume: (videoId: string, userId: string | null) =>
    ["resume", videoId, userId] as const,
  currentUser: (userId: string | null) => ["current-user", userId] as const,
};

const PRIVATE_QUERY_ROOTS = [
  "courses",
  "folders",
  "learning-stats",
  "heatmap",
  "course-details",
  "resume",
  "current-user",
] as const;

type PrivateQueryRoot = (typeof PRIVATE_QUERY_ROOTS)[number];
type KeyedQuery = Pick<Query, "queryKey">;

type QuerySession = {
  status: string;
  user: { _id: string } | null;
};

/** A cached record never establishes authentication. */
export function getQueryUserId(session: QuerySession): string | null {
  return session.status === "authenticated" ? session.user?._id ?? null : null;
}

function isPrivateQuery({ queryKey }: KeyedQuery): boolean {
  return PRIVATE_QUERY_ROOTS.some((root) => queryKey[0] === root);
}

function isOwnedBy(query: KeyedQuery, userId: string | null): boolean {
  return userId !== null && isPrivateQuery(query) &&
    query.queryKey.length > 1 && query.queryKey.at(-1) === userId;
}

/** Construct per provider/request; do not share authenticated data on the server. */
export function createQueryClient(): QueryClient {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * MINUTE,
      },
    },
  });

  for (const [root, policy] of Object.entries(DATA_CACHE_POLICIES)) {
    client.setQueryDefaults([root], {
      ...policy,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    });
  }

  return client;
}

/** Also covers session expiry, which does not go through the logout hook. */
export function removeOtherUserQueries(
  client: QueryClient,
  userId: string | null
): void {
  const filters = {
    predicate: (query: Query) => isPrivateQuery(query) && !isOwnedBy(query, userId),
  };

  // Cancellation prevents a late result from repopulating removed data. Do not
  // wait before removal, clear mutation state, or touch the incoming account.
  void client.cancelQueries(filters);
  client.removeQueries(filters);
}

/** Invalidate the mutation's original account, not whoever is signed in later. */
export function invalidateUserData(
  client: QueryClient,
  userId: string | null | undefined,
  roots: readonly PrivateQueryRoot[]
): Promise<void> {
  if (!userId) return Promise.resolve();

  return client.invalidateQueries({
    predicate: (query) => isOwnedBy(query, userId) &&
      roots.some((root) => query.queryKey[0] === root),
  });
}

/** Fetch on the next use, never add a resume request in the middle of playback. */
export function invalidateResume(
  client: QueryClient,
  userId: string | null | undefined,
  videoId?: string
): Promise<void> {
  if (!userId) return Promise.resolve();

  const queryKey: QueryKey = videoId ? ["resume", videoId] : ["resume"];

  return client.invalidateQueries({
    queryKey,
    predicate: (query) => isOwnedBy(query, userId),
    refetchType: "none",
  });
}
