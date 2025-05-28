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


module.exports = invCont