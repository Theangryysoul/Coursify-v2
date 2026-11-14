import { getQueryUserId } from "@/lib/query-cache";
import { useAuthStore } from "@/store/auth.store";

export function useQueryUser(): string | null {
  return useAuthStore(getQueryUserId);
}

/** Capture at mutation start: a request may finish after an account switch. */
export function captureQueryUser() {
  return { userId: getQueryUserId(useAuthStore.getState()) };
}
