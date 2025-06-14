const { body, validationResult } = require("express-validator");
const utilities = require(".");
const invValidation = {};

/* **********************************
 * Add New Classification Validation Rules
 * ********************************* */
invValidation.addClassificationRules = () => [
  body("classification_name")
    .trim()
    .notEmpty().withMessage("Classification name is required.")
    .isLength({ min: 3 }).withMessage("Classification name must be at least 3 characters long.")
    .matches(/^[A-Za-z]+$/).withMessage("Classification name must only contain letters, with no spaces or special characters.")
    .isLength({ max: 30 }).withMessage("Classification name must be less than 30 characters.")
];

/* **********************************
 * Check Add Classification Data and Return Errors or Continue
 * ********************************* */
invValidation.checkAddClassificationData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      ...req.body
    });
    return;
  }
  next();
};


/* **********************************
 * Add New Inventory Validation Rules
 * ********************************* */
invValidation.addInventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty().withMessage("Classification is required."),
    
    body("inv_make")
      .trim()
      .notEmpty().withMessage("Make is required.")
      .isLength({ max: 50 }).withMessage("Make must be less than 50 characters."),

    body("inv_model")
      .trim()
      .notEmpty().withMessage("Model is required.")
      .isLength({ max: 50 }).withMessage("Model must be less than 50 characters."),

    body("inv_year")
      .notEmpty().withMessage("Year is required.")
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 }).withMessage("Year must be a valid 4-digit year."),

    body("inv_description")
      .trim()
      .notEmpty().withMessage("Description is required.")
      .isLength({ max: 1000 }).withMessage("Description must be less than 1000 characters."),

    body("inv_image")
      .trim()
      .notEmpty().withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty().withMessage("Thumbnail path is required."),

    body("inv_price")
      .notEmpty().withMessage("Price is required.")
      .isFloat({ min: 0 }).withMessage("Price must be a positive number."),

    body("inv_miles")
      .notEmpty().withMessage("Miles is required.")
      .isInt({ min: 0 }).withMessage("Miles must be a positive number."),

    body("inv_color")
      .trim()
      .notEmpty().withMessage("Color is required.")
      .isLength({ max: 20 }).withMessage("Color must be less than 20 characters.")
  ];
};

/* **********************************
 * Check Add Inventory Data and Return Errors or Continue
 * ********************************* */
invValidation.checkAddInventoryData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(req.body.classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
      ...req.body,
    });
    return;
  }
  next();
};


/* **********************************
 * Validation Rules for Updating Inventory
 * Leverages the addInventoryRules and adds a check for inv_id
 * ********************************* */
invValidation.newInventoryRules = () => {
  const rules = invValidation.addInventoryRules();
  // Add a rule for inv_id, which is required for an update
  rules.push(
    body("inv_id")
      .trim()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("A valid inventory item must be selected.")
  );
  return rules;
};

/* **********************************
 * Check Update Data and Return Errors to Edit View or Continue
 * ********************************* */
invValidation.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req);
  const inv_id = req.body.inv_id; 

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(req.body.classification_id);
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`;
    res.render("./inventory/edit-inventory", { 
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors,
      inv_id, 
      ...req.body, // Send all submitted data back to repopulate the form
    });
    return;
  }
  next();
};

/* **********************************
 * Validation Rules for Deleting Inventory
 * ********************************* */
invValidation.deleteInventoryRules = () => [
  body("inv_id")
    .trim()
    .notEmpty().withMessage("Inventory ID is required for deletion.")
    .isInt({ min: 1 }).withMessage("A valid inventory ID must be provided.")
];

/* **********************************
 * Check Delete Data and Return Errors to Delete View or Continue
 * ********************************* */
invValidation.checkDeleteData = async (req, res, next) => {
  let errors = validationResult(req);
  const inv_id = req.body.inv_id;

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/delete-confirm", {
      title: "Delete Inventory",
      nav,
      errors,
      inv_id,
      ...req.body,
    });
    return;
  }
  next();
};

module.exports = invValidation;