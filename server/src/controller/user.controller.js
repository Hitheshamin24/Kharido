import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from "../utils/handleToken.utils.js";

export const registerController = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }
    const user = await userModel.create({
      name,
      email,
      role,
      passwordHash: await bcrypt.hash(password, 12),
    });

    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });
    const refreshToken = createRefreshToken({
      userId: user._id,
      role: user.role,
    });
    await userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
    return res.status(201).json({
      message: "user registered successFully",
      data: {
        name: user.name,
        role: user.role,
        email: user.email,
        id: user._id,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: `error while registering user ${error.message}`,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "invalid email or password ",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "invalid email or password ",
      });
    }
    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });
    const refreshToken = createRefreshToken({
      userId: user._id,
      role: user.role,
    });
    await userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
    return res.status(200).json({
      message: "login successFull",
      data: {
        email: user.email,
        role: user.role,
        name: user.name,
        id: user._id,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: `error while login user ${error.message}`,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      message: "user fetched successfully",
      data: {
        email: user.email,
        name: user.name,
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: "error while fetching user",
      error: error.message,
    });
  }
};

export const refreshController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "refreshToken is required" });
  try {
    const decoded = readRefreshToken(refreshToken);
    const { userId, role } = decoded;
    const user = await userModel.findById(userId);
    if (refreshToken !== user.refreshToken) {
      await userModel.findByIdAndUpdate(userId, {
        refreshToken: null,
      });
      res.clearCookie("refreshToken");
      return res.status(400).json({
        message: "refreshToken mismatch",
      });
    }
    const newRefreshToken = createRefreshToken({
      userId: user._id,
      role: user.role,
    });
    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });
    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });
    res.cookie("refreshToken", newRefreshToken);
    return res.status(200).json({
      message: "token refreshed successfully",
      accessToken
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "error while generating new RefreshToken",
        error: error.message,
      });
  }
};
