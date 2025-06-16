const pool = require('../database/');

async function createOffer({inv_id, account_id, offer_price}) {
  try {
    const sql = `INSERT INTO offers (inv_id, account_id, offer_price) VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(sql, [inv_id, account_id, offer_price]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getAllPendingOffers() {
  try {
    const sql = `SELECT o.offer_id, o.offer_price, o.offer_date, o.status, 
                        i.inv_make, i.inv_model, i.inv_year, i.inv_image,
                        a.account_firstname, a.account_lastname, a.account_email
                 FROM offers o
                 JOIN inventory i ON o.inv_id = i.inv_id
                 LEFT JOIN account a ON o.account_id = a.account_id
                 WHERE o.status = 'pending'
                 ORDER BY o.offer_date DESC`;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { createOffer, getAllPendingOffers }; 