export const parseSize = (req, res, next) => {
  console.log("BODY:", req.body);
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
