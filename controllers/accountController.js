const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    notice: req.flash("notice"),
  })
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  // Placeholder: In real use, add authentication logic here
  req.flash("notice", "Login attempted (add authentication logic here).");
  res.render("account/login", {
    title: "Login",
    nav,
    account_email: req.body.account_email,
  });
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  
  // This will handle fetching the user from the DB
  const accountData = await accountModel.getAccountByEmail(account_email);

  // REFINED LOGIC: This single block now handles a non-existent user.
  // If accountData is null or undefined, the user does not exist.
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    // The 'return' statement is crucial to stop the function here.
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null, // No validation errors, this is a logic error
      account_email,
      notice: req.flash("notice"),
    });
  }

  try {
    // This block now only runs if we found a user.
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/");
    } else {
      // This 'else' handles the case of a correct email but incorrect password.
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        notice: req.flash("notice"),
      });
    }
  } catch (error) {
    // This catch block handles errors during the bcrypt or JWT process
    console.error("Error during login process:", error);
    req.flash("notice", "An unexpected error occurred. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      notice: req.flash("notice"),
    });
  }
}

/* ****************************************
 *  Deliver account management view
 * ************************************ */
async function accountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: req.flash("error"),
    success: req.flash("success"),
    notice: req.flash("notice"),
    accountData: res.locals.accountData
  });
}

/* ****************************************
 *  Deliver account update view
 * ************************************ */
async function deliverUpdateAccount(req, res) {
  let nav = await utilities.getNav();
  const account_id = req.params.id || req.body.account_id;
  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/update", {
    title: "Update Account",
    nav,
    accountData
  });
}

/* ****************************************
 *  Process account update
 * ************************************ */
async function processUpdateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
  let message;
  if (updateResult) {
    message = "Account information updated successfully.";
    req.flash("success", message);
    return res.redirect("/account/");
  } else {
    message = "Sorry, the update failed. Please try again.";
    // Get updated account data
    const accountData = await accountModel.getAccountById(account_id);
    req.flash("notice", message);
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      accountData,
      notice: req.flash("notice")
    });
  }
}

/* ****************************************
 *  Process password update
 * ************************************ */
async function processUpdatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  const bcrypt = require("bcryptjs");
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password update.");
    const accountData = await accountModel.getAccountById(account_id);
    return res.render("account/update", {
      title: "Update Account",
      nav,
      accountData
    });
  }
  const updateResult = await accountModel.updateAccountPassword(account_id, hashedPassword);
  let message;
  if (updateResult) {
    message = "Password updated successfully.";
  } else {
    message = "Sorry, the password update failed. Please try again.";
  }
  // Get updated account data
  const accountData = await accountModel.getAccountById(account_id);
  req.flash("notice", message);
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    accountData,
    notice: req.flash("notice")
  });
}

/* ****************************************
 *  Logout process
 * ************************************ */
function logout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, accountManagement, deliverUpdateAccount, processUpdateAccount, processUpdatePassword, logout}