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

module.exports = { createOffer }; 