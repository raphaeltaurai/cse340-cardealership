const express = require('express');
const router = new express.Router();
const offerController = require('../controllers/offerController');
const { body } = require('express-validator');
const utilities = require('../utilities/');

// Show buy car confirmation form
router.get('/buy/:inv_id', utilities.checkClient, offerController.showBuyCarForm);

// Handle offer submission
router.post(
  '/buy/:inv_id',
  utilities.checkClient,
  body('offer_price')
    .trim()
    .notEmpty().withMessage('Offer price is required.')
    .isFloat({ min: 1 }).withMessage('Offer price must be a positive number.'),
  offerController.submitOffer
);

// Order inbox for admin/employee
router.get('/inbox', utilities.checkEmployeeOrAdmin, offerController.showOrderInbox);

module.exports = router; 