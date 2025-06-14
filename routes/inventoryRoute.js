// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidation = require('../utilities/inventory-validation');
const utilities = require("../utilities/");


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for inventory detail view
router.get("/detail/:inv_id", invController.getVehicleDetail);

// Route to trigger intentional 500 error
router.get("/trigger-error", invController.throwError)

// Route to deliver add inventory form
router.get("/add-inventory", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory form
router.post(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  invValidation.addInventoryRules(),
  invValidation.checkAddInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to deliver management view
router.get("/", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildManagement));

// Route to deliver add-classification form
router.get("/add-classification", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddClassification));

// Route to process add-classification form
router.post(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  invValidation.addClassificationRules(),
  invValidation.checkAddClassificationData,
  utilities.handleErrors(invController.addClassification)
);

/* ************************************************** 
 *  Get Inventory by Classification
 * ************************************************** */
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

/*****************************************************
 *  Edit Inventory
 * ************************************************** */
router.get(
  "/edit/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventory)
);

router.post(
  "/update/",
  utilities.checkEmployeeOrAdmin,
  invValidation.newInventoryRules(),
  invValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

/*****************************************************
 *  Edit Inventory
 * ************************************************** */
router.get(
  "/delete/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteInventory)
);

router.post("/delete/",
  utilities.checkEmployeeOrAdmin,
  invValidation.deleteInventoryRules(),
  invValidation.checkDeleteData,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;