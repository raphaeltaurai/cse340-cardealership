const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle details by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0] // Return a single vehicle object
  } catch (error) {
    console.error("getVehicleById error: " + error)
  }
}

async function insertInventory(data) {
  try {
    const sql = `
      INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;
    const params = [
      data.inv_make, data.inv_model, data.inv_year, data.inv_description,
      data.inv_image, data.inv_thumbnail, data.inv_price, data.inv_miles,
      data.inv_color, data.classification_id
    ];
    const result = await pool.query(sql, params);
    return { success: true, row: result.rows[0] };
  } catch (error) {
    return { success: false, errors: [{ msg: error.message }] };
  }
}

async function insertClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *;";
    const result = await pool.query(sql, [classification_name]);
    return { success: true, row: result.rows[0] };
  } catch (error) {
    return { success: false, errors: [{ msg: error.message }] };
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0] ? { success: true, row: data.rows[0] } : { success: false, errors: [{ msg: 'No record updated.' }] };
  } catch (error) {
    return { success: false, errors: [{ msg: error.message }] };
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(
  inv_id
) {
  try {
    const sql =
      'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [
      inv_id
    ])
    if (data.rowCount && data.rowCount > 0) {
      return { success: true };
    } else {
      return { success: false, errors: [{ msg: 'No record deleted.' }] };
    }
  } catch (error) {
    return { success: false, errors: [{ msg: error.message }] };
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, insertInventory, insertClassification, updateInventory, deleteInventory};