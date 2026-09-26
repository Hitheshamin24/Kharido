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
    .isLength({ min: 2, max: 50 })
    .withMessage("title length should be between 2 to 50 characters")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage(
      "title can only contain english small case and capital case characters",
    ),
  body("description")
    .exists()
    .withMessage("description must be required")
    .bail()
    .isString()
    .withMessage("description must be in string ")
    .bail()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage("description length should be between 20 to 500 characters "),
  body("price")
    .exists()
    .withMessage("price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("price number must be floating number or greater than 0 "),
  body("sizes")
    .exists()
    .withMessage("sizes are required ")
    .bail()
    .isArray()
    .withMessage("sizes must be an array of Object"),
  body("sizes.*.size")
    .exists()
    .withMessage("size must be required for every entry")
    .bail()
    .trim()
    .isString()
    .withMessage("size must be in string format")
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Size can be these XS S M L XL XXL"),
  body("sizes.*.stock")
    .exists()
    .withMessage("stock mus be present in every entry of the sizes array")
    .isInt({ min: 0 })
    .withMessage("stock must be a integer value"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        message: "invalid credentials",
        errors: errors.array(),
      });
    }
    next()
  },
];
