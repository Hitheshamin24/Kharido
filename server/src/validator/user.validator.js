import { body, validationResult } from "express-validator";
export const registerValidator = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be in string ")
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name character must be between 2 to 50 characters"),
  body("email")
    .exists()
    .withMessage("email is required")
    .bail()
    .isString()
    .withMessage("email must be in string format ")
    .bail()
    .trim()
    .isEmail()
    .withMessage("please enter valid email address"),
  body("password")
    .exists()
    .withMessage("password is required")
    .bail()
    .isString()
    .withMessage("password must be in string format ")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 character"),
  body("role")
    .optional()
    .isIn(["user", "seller"])
    .withMessage("Role must be either user or seller"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid Credentials",
        error: errors.array(),
      });
    }
    next();
  },
];

export const loginValidator = [
  body("email")
    .exists()
    .withMessage("email is required")
    .bail()
    .isString()
    .withMessage("email must be in string format ")
    .bail()
    .trim()
    .isEmail()
    .withMessage("please enter valid email address"),
  body("password")
    .exists()
    .withMessage("password is required")
    .bail()
    .isString()
    .withMessage("password must be in string format ")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 character"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid Credentials",
        error: errors.array(),
      });
    }
    next();
  },
];
