import { body, validationResult } from "express-validator";

export const productValidator = [
  body("title")
    .exists()
    .withMessage("title is required")
    .bail()
    .isString()
    .withMessage("title must be string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("title length should be between 2 to 100 characters"),
  body("description")
    .exists()
    .withMessage("description must be required")
    .bail()
    .isString()
    .withMessage("description must be in string")
    .bail()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage("description length should be between 20 to 500 characters"),
  body("price")
    .exists()
    .withMessage("price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("price must be a number greater than or equal to 0"),
  body("sizes")
    .exists()
    .withMessage("sizes are required")
    .bail()
    .isArray({ min: 1 })
    .withMessage("sizes must be an array of size entries"),
  body("sizes.*.size")
    .exists()
    .withMessage("size is required for every entry")
    .bail()
    .trim()
    .isString()
    .withMessage("size must be in string format")
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Size must be one of: XS, S, M, L, XL, XXL"),
  body("sizes.*.stock")
    .exists()
    .withMessage("stock must be present in every entry of the sizes array")
    .isInt({ min: 0 })
    .withMessage("stock must be an integer value >= 0"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

export const updateProductValidator = [
  body("title")
    .optional()
    .isString()
    .withMessage("title must be string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("title length should be between 2 to 100 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("description must be in string")
    .bail()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage("description length should be between 20 to 500 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("price must be a number greater than or equal to 0"),

  body("sizes")
    .optional()
    .isArray()
    .withMessage("sizes must be an array"),

  body("sizes.*.size")
    .optional()
    .isString()
    .withMessage("size must be a string")
    .bail()
    .trim()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Size can be XS, S, M, L, XL or XXL"),

  body("sizes.*.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("stock must be an integer greater than or equal to 0"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];