const resolvedAuthSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "development"
    ? "dev-only-auth-secret-change-in-env"
    : undefined);

if (!resolvedAuthSecret) {
  throw new Error(
    "Missing AUTH_SECRET. Define AUTH_SECRET (or NEXTAUTH_SECRET) in environment variables."
  );
}

export const authSecret = resolvedAuthSecret;
