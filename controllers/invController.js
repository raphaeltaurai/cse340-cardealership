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

//add inventory
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
  // Create the select list for classifications
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ************************** 
 *  Build Edit Inventory
 * ************************** */

invCont.buildEditInventory= async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult.success) {
    const itemName = updateResult.row.inv_make + " " + updateResult.row.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: updateResult.errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
}

/* ************************** 
 *  Build Delete Inventory Confirmation View
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Carry Out Delete Inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  // Call the model function to delete the inventory item
  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult.success) {
    req.flash("notice", "The inventory item was successfully deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect(`/inv/delete/${inv_id}`);
  }
}

module.exports = invCont