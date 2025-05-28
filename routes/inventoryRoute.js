// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for inventory detail view
router.get("/detail/:inv_id", invController.getVehicleDetail);

// Route to trigger intentional 500 error
router.get("/trigger-error", invController.throwError)

module.exports = router;