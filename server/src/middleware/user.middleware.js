import { readAccessToken } from "../utils/handleToken.utils.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "accessToken not found or invalid format",
      });
    }

    const accessToken = authHeader.split(" ")[1];
    const decoded = readAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "token invalid or expired",
    });
  }
};
