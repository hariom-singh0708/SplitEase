import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Ensure required env variable exists
 */
const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1️⃣ Check Authorization header first
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Fallback to cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, requireEnv("JWT_ACCESS_SECRET"));
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid access token" });
      }
      throw err;
    }

    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(decoded.id)
      .select("_id name email mobile");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Protect middleware error:", error.message);
    res.status(500).json({ message: "Authentication failed" });
  }
};