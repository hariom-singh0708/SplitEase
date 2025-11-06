import { validationResult } from "express-validator";
import User from "../models/User.js";
import { signAccessToken, signRefreshToken, setAuthCookies, clearAuthCookies } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Input validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Duplicate check
    const exists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (exists) {
      return res.status(409).json({ message: "Email or mobile already in use" });
    }

    // Create user
    const user = await User.create({ name, email, mobile, password });

    // Token generation
    const access = signAccessToken(user._id);
    const refresh = signRefreshToken(user._id);
    if (!access || !refresh) {
      throw new Error("Token generation failed");
    }

    // Set cookies
    setAuthCookies(res, access, refresh);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
    });
  } catch (e) {
    console.error("🔥 Register error:", e.message);
    next(e);
  }
};


export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Invalid input");
      err.statusCode = 400;
      err.errors = errors.array();
      throw err;
    }

    const { emailOrMobile, password } = req.body;
    const query = emailOrMobile.includes("@") ? { email: emailOrMobile.toLowerCase() } : { mobile: emailOrMobile };
    const user = await User.findOne(query).select("+password");
    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const access = signAccessToken(user._id);
    const refresh = signRefreshToken(user._id);
    setAuthCookies(res, access, refresh);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile }
    });
  } catch (e) {
    next(e);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      const err = new Error("Refresh token missing");
      err.statusCode = 401;
      throw err;
    }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const access = signAccessToken(decoded.id);
    const refresh = signRefreshToken(decoded.id);
    setAuthCookies(res, access, refresh);
    res.json({ ok: true });
  } catch (e) {
    e.statusCode = 401;
    next(e);
  }
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, mobile } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (mobile) updates.mobile = mobile;

    if (mobile) {
      const exists = await User.findOne({ mobile, _id: { $ne: req.user._id } });
      if (exists) {
        const err = new Error("Mobile already in use");
        err.statusCode = 409;
        throw err;
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
  } catch (e) {
    next(e);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    const ok = await user.comparePassword(currentPassword);
    if (!ok) {
      const err = new Error("Current password incorrect");
      err.statusCode = 400;
      throw err;
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (e) {
    next(e);
  }
};

export const logout = async (_req, res) => {
  clearAuthCookies(res);
  res.json({ message: "Logged out" });
};

export const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.query?.trim();
    if (!query) return res.json([]);

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { mobile: { $regex: query, $options: "i" } },
      ],
    }).select("_id name email mobile");

    res.json(users);
  } catch (err) {
    console.error("❌ User search error:", err);
    next(err);
  }
};
