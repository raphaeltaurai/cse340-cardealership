const offerModel = require('../models/offer-model');
const invModel = require('../models/inventory-model');
const { validationResult } = require('express-validator');

// Show buy car confirmation form
async function showBuyCarForm(req, res) {
  const inv_id = req.params.inv_id;
  const vehicle = await invModel.getVehicleById(inv_id);
  if (!vehicle) {
    return res.status(404).render('errors/404', { title: 'Vehicle Not Found' });
  }
  let nav = await require('../utilities/').getNav();
  res.render('offers/buy-car', {
    title: 'Buy Car',
    nav,
    vehicle,
    errors: null,
    offer_price: ''
  });
}

// Handle offer submission
async function submitOffer(req, res) {
  const inv_id = req.params.inv_id;
  const vehicle = await invModel.getVehicleById(inv_id);
  if (!vehicle) {
    return res.status(404).render('errors/404', { title: 'Vehicle Not Found' });
  }
  let nav = await require('../utilities/').getNav();
  const errors = validationResult(req);
  const offer_price = req.body.offer_price;
  if (!errors.isEmpty()) {
    return res.render('offers/buy-car', {
      title: 'Buy Car',
      nav,
      vehicle,
      errors,
      offer_price
    });
  }
  try {
    await offerModel.createOffer({
      inv_id,
      account_id: req?.res?.locals?.accountData?.account_id || null,
      offer_price
    });
    return res.render('offers/thank-you', {
      title: 'Thank You',
      nav,
      vehicle,
      offer_price
    });
  } catch (error) {
    return res.render('offers/buy-car', {
      title: 'Buy Car',
      nav,
      vehicle,
      errors: { errors: [{ msg: 'Could not process your offer. Please try again.' }] },
      offer_price
    });
  }
}

// Show order inbox for admin/employee
async function showOrderInbox(req, res) {
  let nav = await require('../utilities/').getNav();
  try {
    const offers = await offerModel.getAllPendingOffers();
    res.render('offers/inbox', {
      title: 'Order Inbox',
      nav,
      offers
    });
  } catch (error) {
    res.status(500).render('errors/500', { title: 'Server Error', nav });
  }
}

module.exports = { showBuyCarForm, submitOffer, showOrderInbox }; 