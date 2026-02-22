import jwt from "jsonwebtoken";

/**
 * Helper to ensure required env vars exist
 */
const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

/**
 * Convert string (ms) to number safely
 */
const toNumber = (value, key) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return num;
};

/**
 * Access Token
 */
export const signAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    requireEnv("JWT_ACCESS_SECRET"),
    {
      expiresIn: requireEnv("JWT_ACCESS_EXPIRES"),
    }
  );
};

/**
 * Refresh Token
 */
export const signRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    requireEnv("JWT_REFRESH_SECRET"),
    {
      expiresIn: requireEnv("JWT_REFRESH_EXPIRES"),
    }
  );
};

/**
 * Set Cookies
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
  const secure = requireEnv("COOKIE_SECURE") === "true";
  const sameSite = requireEnv("COOKIE_SAMESITE");
  const accessMaxAge = toNumber(requireEnv("COOKIE_ACCESS_MAXAGE"), "COOKIE_ACCESS_MAXAGE");
  const refreshMaxAge = toNumber(requireEnv("COOKIE_REFRESH_MAXAGE"), "COOKIE_REFRESH_MAXAGE");

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: accessMaxAge,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: refreshMaxAge,
  });
};

/**
 * Clear Cookies
 */
export const clearAuthCookies = (res) => {
  const secure = requireEnv("COOKIE_SECURE") === "true";
  const sameSite = requireEnv("COOKIE_SAMESITE");

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure,
    sameSite,
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure,
    sameSite,
  });
};