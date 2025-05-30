// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accController = require("../controllers/accountController")

// Route: GET /account
router.get(
  "/", utilities.handleErrors(accController.buildAccount)
)

// Route: GET /account/login
router.get(
  "/login", utilities.handleErrors(accController.buildLogin)
)

// Route: GET /account/register
router.get(
  "/register", utilities.handleErrors(accController.buildRegister)
)


// Export the router
module.exports = router