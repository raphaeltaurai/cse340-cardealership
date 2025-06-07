const { body, validationResult } = require("express-validator");
const utilities = require(".");
const invValidation = {};

invValidation.addInventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty().withMessage("Classification is required."),
    body("inv_make")
      .trim().notEmpty().isLength({ max: 50 }).withMessage("Make is required and must be less than 50 characters."),
    body("inv_model")
      .trim().notEmpty().isLength({ max: 50 }).withMessage("Model is required and must be less than 50 characters."),
    body("inv_year")
      .notEmpty().isInt({ min: 1886, max: 2099 }).withMessage("Year must be between 1886 and 2099."),
    body("inv_description")
      .trim().notEmpty().isLength({ max: 1000 }).withMessage("Description is required and must be less than 1000 characters."),
    body("inv_image")
      .trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price")
      .notEmpty().isInt({ min: 0 }).withMessage("Price is required and must be a positive number."),
    body("inv_miles")
      .notEmpty().isInt({ min: 0 }).withMessage("Miles is required and must be a positive number."),
    body("inv_color")
      .trim().notEmpty().isLength({ max: 20 }).withMessage("Color is required and must be less than 20 characters.")
  ];
};

invValidation.checkAddInventoryData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(req.body.classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      ...req.body,
      errors
    });
    return;
  }
  next();
};

invValidation.addClassificationRules = () => [
  body("classification_name")
    .trim()
    .notEmpty().withMessage("Classification name is required.")
    .matches(/^[A-Za-z0-9]+$/).withMessage("Classification name must only contain letters and numbers, with no spaces or special characters.")
    .isLength({ max: 30 }).withMessage("Classification name must be less than 30 characters.")
];

invValidation.checkAddClassificationData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      ...req.body,
      errors
    });
    return;
  }
  next();
};

module.exports = invValidation; 