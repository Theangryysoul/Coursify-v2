import { z } from "zod";

// Next.js loads `.env`, `.env.local` and friends automatically, so this module
// only validates what is present. It never throws: a missing variable is
// collected in `configErrors` and the API answers with a readable JSON error
// instead of failing every request with an opaque server error.
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development")
    .catch("development"),

  MONGODB_URI: z.string().default(""),

  JWT_ACCESS_SECRET: z.string().default(""),

  JWT_REFRESH_SECRET: z.string().default(""),

  CLOUDINARY_CLOUD_NAME: z.string().default(""),

  CLOUDINARY_API_KEY: z.string().default(""),

  CLOUDINARY_API_SECRET: z.string().default(""),

  YOUTUBE_API_KEY: z.string().default(""),

  GOOGLE_CLIENT_ID: z.string().default(""),
});

const parsedEnv = envSchema.parse(process.env);

const REQUIRED_KEYS = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
] as const;

const FEATURE_KEYS = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "YOUTUBE_API_KEY",
  "GOOGLE_CLIENT_ID",
] as const;

/** Names of required variables that are not set. Empty when configured. */
export const configErrors: string[] = REQUIRED_KEYS.filter(
  (key) => !parsedEnv[key]
);

const unsetFeatureKeys = FEATURE_KEYS.filter((key) => !parsedEnv[key]);

if (unsetFeatureKeys.length > 0 && process.env.NODE_ENV !== "test") {
  console.warn(
    `⚠️  Missing feature environment variables: ${unsetFeatureKeys.join(
      ", "
    )}. Avatar upload, YouTube import and Google sign-in will not work.`
  );
}

export const env = parsedEnv;
