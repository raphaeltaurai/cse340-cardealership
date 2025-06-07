const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Get vehicle detail by ID
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicle = await invModel.getVehicleById(inv_id) // Fetch vehicle data

    if (!vehicle) {
      return res.status(404).render("errors/404", { title: "Vehicle Not Found" })
    }

    let nav = await utilities.getNav()

    res.render("./inventory/detail", {
      title: `${vehicle.make} ${vehicle.model}`,
      nav,
      vehicle,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Intentional 500 Error Route
 * ************************** */
invCont.throwError = async function (req, res, next) {
  try {
    throw new Error("Intentional server error for testing.")
  } catch (error) {
    next(error) // Pass error to middleware for proper handling
  }
}

invCont.buildAddInventory = async function(req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList(null);
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: {},
  });
};

invCont.addInventory = async function(req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList(req.body.classification_id);
  const result = await invModel.insertInventory(req.body);
  if (result.success) {
    req.flash("notice", "Inventory item added successfully!");
    nav = await utilities.getNav(); // Rebuild nav to show new item
    res.render("inventory/management", { title: "Inventory Management", nav });
  } else {
    req.flash("notice", "Failed to add inventory item.");
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      ...req.body,
      errors: result.errors
    });
  }
};

invCont.buildManagement = async function(req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav
  });
};

invCont.buildAddClassification = async function(req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    ...req.body
  });
};

invCont.addClassification = async function(req, res) {
  let nav = await utilities.getNav();
  const result = await invModel.insertClassification(req.body.classification_name);
  if (result.success) {
    req.flash("notice", "Classification added successfully!");
    nav = await utilities.getNav(); // Rebuild nav to show new classification
    res.render("inventory/management", { title: "Inventory Management", nav });
  } else {
    req.flash("notice", "Failed to add classification.");
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      ...req.body,
      errors: result.errors
    });
  }
};

module.exports = invCont