import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    OWNER_WALLET_PRIVATE_KEY: z.string(),
    TW_CLIENT_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SHOULD_POLL_PROFILE: z.preprocess(
      (v) =>
        z
          .enum(["true", "false"])
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          .transform((v) => JSON.parse(v))
          .catch(v)
          .parse(v),
      z.boolean().default(false),
    ),
    NEXT_PUBLIC_POLL_PROFILE_INTERVAL_MS: z.coerce.number().default(5000),
    NEXT_PUBLIC_AWARD_CONTRACT_ADDRESS: z.string(),
    NEXT_PUBLIC_TW_CLIENT_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    OWNER_WALLET_PRIVATE_KEY: process.env.OWNER_WALLET_PRIVATE_KEY,
    TW_CLIENT_SECRET: process.env.TW_CLIENT_SECRET,
    NEXT_PUBLIC_SHOULD_POLL_PROFILE:
      process.env.NEXT_PUBLIC_SHOULD_POLL_PROFILE,
    NEXT_PUBLIC_POLL_PROFILE_INTERVAL_MS:
      process.env.NEXT_PUBLIC_POLL_PROFILE_INTERVAL_MS,
    NEXT_PUBLIC_AWARD_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_AWARD_CONTRACT_ADDRESS,
    NEXT_PUBLIC_TW_CLIENT_ID: process.env.NEXT_PUBLIC_TW_CLIENT_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
