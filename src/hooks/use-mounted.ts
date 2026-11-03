import { useSyncExternalStore } from "react";

// Nothing external to subscribe to: the only transition is server -> client.
const emptySubscribe = () => () => {};

/**
 * `false` during server rendering and the first client render, then `true`.
 *
 * Use this to gate values that cannot be known on the server (the resolved
 * theme, for example) so the hydration pass matches the server HTML. Reading
 * `window`/`matchMedia` directly would produce a hydration mismatch instead.
 */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
