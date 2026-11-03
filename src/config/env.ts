export const env = {
  // Defaults to the same-origin API path served by the Next.js route handlers.
  API_URL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",

  // The public OAuth client id. This value is public by design - it is the
  // same one Google sees in the browser - so it can live in the bundle. When
  // it is empty Google sign-in is unavailable and the button is hidden.
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
} as const;
