// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accController = require("../controllers/accountController")

// Route: GET /account (only the part after 'account', handled in server.js)
router.get(
  "/", utilities.handleErrors(accController.buildAccount)
)

// Export the router
module.exports = router