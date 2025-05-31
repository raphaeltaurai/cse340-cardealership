// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route: GET /account
router.get(
  "/", utilities.handleErrors(accountController.buildAccount)
)

// Route: GET /account/login
router.get(
  "/login", utilities.handleErrors(accountController.buildLogin)
)

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Route: POST /account/register
router.post('/register', utilities.handleErrors(accountController.registerAccount))


// Export the router
module.exports = router