import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const createAccessToken = ({ userId, role }) => {
  const accessToken = jwt.sign({ userId, role }, config.ACCESS_SECRET, {
    expiresIn: config.ACCESS_SECRET_EXPIRE,
  });
  return accessToken;
};

export const createRefreshToken = ({ userId, role }) => {
  const refreshToken = jwt.sign({ userId, role }, config.REFRESH_SECRET, {
    expiresIn: config.REFRESH_SECRET_EXPIRE,
  });
  return refreshToken;
};

export const readAccessToken = (token) => {
  return jwt.verify(token, config.ACCESS_SECRET);
};

export const readRefreshToken = (token) => {
  return jwt.verify(token, config.REFRESH_SECRET);
};
