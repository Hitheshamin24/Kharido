import multer from "multer";

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024,
    files: 5,
  },
});

export const parseSize = (req, res, next) => {
  req.body.sizes = JSON.parse(req.body.sizes);
  next()
};
