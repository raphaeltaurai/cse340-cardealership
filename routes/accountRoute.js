// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route: GET /account
router.get(
  "/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagement)
)

// Route: GET /account/login
router.get(
  "/login", utilities.handleErrors(accountController.buildLogin)
)

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Logout route
router.get("/logout", accountController.logout);

// GET: Deliver account update view
router.get(
  "/update/:id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.deliverUpdateAccount)
);

// POST: Process account update
router.post(
  "/update/:id",
  utilities.checkLogin,
  require('../utilities/account-validation').updateAccountRules(),
  require('../utilities/account-validation').checkUpdateAccountData,
  utilities.handleErrors(accountController.processUpdateAccount)
);

// POST: Process password update
router.post(
  "/update-password/:id",
  utilities.checkLogin,
  require('../utilities/account-validation').updatePasswordRules(),
  require('../utilities/account-validation').checkUpdatePasswordData,
  utilities.handleErrors(accountController.processUpdatePassword)
);

module.exports = router