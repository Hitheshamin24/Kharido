export const parseSize = (req, res, next) => {
  if (req.body?.sizes !== undefined) {
    try {
      req.body.sizes = JSON.parse(req.body.sizes);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid sizes format",
      });
    }
  }
  next();
};
