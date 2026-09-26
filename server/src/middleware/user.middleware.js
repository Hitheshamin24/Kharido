import { readAccessToken } from "../utils/handleToken.utils.js";

export const authenticate = async (req, res, next) => {
  
  try {
    const accessToken = req.headers?.authorization.split(" ")[1];
    if (!accessToken) {
      return res.status(400).json({
        message: "accessToken not found",
      });
    }
    const decoded = readAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: `token invalid or expired`,
    });
  }
};
