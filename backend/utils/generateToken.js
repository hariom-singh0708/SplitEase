import jwt from "jsonwebtoken";

export const signAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
};

export const signRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";
  const secure = process.env.COOKIE_SECURE === "true" || isProd;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: 1000 * 60 * 60, // 1 hour (cookie can outlive token slightly)
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

export const clearAuthCookies = (res) => {
  const isProd = process.env.NODE_ENV === "production";
  const secure = process.env.COOKIE_SECURE === "true" || isProd;

  res.clearCookie("accessToken", { httpOnly: true, secure, sameSite: secure ? "none" : "lax" });
  res.clearCookie("refreshToken", { httpOnly: true, secure, sameSite: secure ? "none" : "lax" });
};
