import multer from "multer";

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

export const parseSize = (req, res, next) => {
  if (req.body?.sizes !== undefined) {
    if (typeof req.body.sizes === "string") {
      try {
        req.body.sizes = JSON.parse(req.body.sizes);
      } catch (error) {
        return res.status(400).json({
          message: "Invalid sizes format, must be a valid JSON array",
        });
      }
    }
  }
  next();
};
