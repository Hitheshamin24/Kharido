export const authenticateSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(400).json({
      message: "Not authenticated seller",
    });
  }
  next()
};
