const express = require('express');
const router = new express.Router();
const offerController = require('../controllers/offerController');
const { body } = require('express-validator');

// Show buy car confirmation form
router.get('/buy/:inv_id', offerController.showBuyCarForm);

// Handle offer submission
router.post(
  '/buy/:inv_id',
  body('offer_price')
    .trim()
    .notEmpty().withMessage('Offer price is required.')
    .isFloat({ min: 1 }).withMessage('Offer price must be a positive number.'),
  offerController.submitOffer
);

module.exports = router; 