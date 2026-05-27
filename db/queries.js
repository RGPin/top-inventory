const pool = require("./pool");

/**
 * Returns all parts
 * @returns {Promise<{
 * id - number,
 * category_id - number,
 * brand - string,
 * name - string,
 * description - string,
 * image_url - string,
 * rating - number,
 * quantity - number,
 * price - number,
 * created_at - Date,
 * updated_at - Date,
 * category - string,
 * status - string
 * }[]>}
 */
async function getAllParts() {
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        parts.*, 
        categories.name AS category,
        CASE
          WHEN parts.quantity > 0 THEN 'In stock'
          ELSE 'Out of stock'
        END AS status
      FROM parts
      JOIN categories ON parts.category_id = categories.id
      `,
    );
    return rows;
  } catch (error) {
    console.error(`getAllParts failed: ${error}`);
    throw new Error(`getAllParts failed: ${error.message}`);
  }
}

/**
 * Returns all categories
 * @returns {Promise<{
 * id - number,
 * name - string
 * }[]>}
 */
async function getAllCategories() {
  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM categories;
      `,
    );
    return rows;
  } catch (error) {
    console.error(`getAllCategories failed: ${error}`);
    throw new Error(`getAllCategories failed: ${error.message}`);
  }
}

/**
 * Returns all parts from a category
 * @param {string} category
 * @returns {Promise<{
 * id - number,
 * category_id - number,
 * brand - string,
 * name - string,
 * description - string,
 * image_url - string,
 * rating - number,
 * quantity - number,
 * price - number,
 * created_at - Date,
 * updated_at - Date,
 * status - string
 * }[]>}
 */
async function getAllFromCategory(category) {
  const categories = [
    "Keyboards",
    "Mouse",
    "Monitors",
    "Headsets",
    "Consoles",
    "CPU",
    "GPU",
    "RAM",
    "SSD",
    "HDD",
  ];
  if (typeof category !== "string") {
    throw new Error("getAllFromCategory failed: category must be string");
  }
  if (!categories.includes(category)) {
    throw new Error(
      `getAllFromCategory failed: Category ${category} does not exist`,
    );
  }
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        parts.*,
        CASE
          WHEN parts.quantity > 0 THEN 'In stock'
          ELSE 'Out of stock'
        END AS status
      FROM parts 
      WHERE category_id = (SELECT id FROM categories WHERE name = $1)
      `,
      [category],
    );
    return rows;
  } catch (error) {
    console.error(`getAllFromCategory failed: ${error}`);
    throw new Error(`getAllFromCategory failed: ${error.message}`);
  }
}

/**
 * Returns details of one part
 * @param {number} id
 * @returns {Promise<{
 * id - number,
 * category_id - number,
 * brand - string,
 * name - string,
 * description - string,
 * image_url - string,
 * rating - number,
 * quantity - number,
 * price - number,
 * created_at - Date,
 * updated_at - Date,
 * category - string,
 * status - string
 * } | null>}
 */
async function getPartById(id) {
  if (typeof id !== "number") {
    throw new Error("getPartById failed: id must be number");
  }
  try {
    const { rows } = await pool.query(
      `
      SELECT
        parts.*,
        categories.name AS category,
        CASE
          WHEN parts.quantity > 0 THEN 'In stock'
          ELSE 'Out of stock'
        END AS status
        FROM parts
        JOIN categories ON parts.category_id = categories.id
        WHERE parts.id = $1;
      `,
      [id],
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`getPartById failed: ${error}`);
    throw new Error(`getPartById failed: ${error.message}`);
  }
}

async function updatePart({
  id,
  brand,
  name,
  category_id,
  price,
  quantity,
  rating,
  image_url,
  description,
}) {
  try {
    const { rows } = await pool.query(
      `
      UPDATE parts
      SET
        brand = $1,
        name = $2,
        category_id = $3,
        price = $4,
        quantity = $5,
        rating = $6,
        image_url = $7,
        description = $8
      WHERE parts.id = $9
      RETURNING *;
      `,
      [
        brand,
        name,
        Number(category_id),
        Number(price),
        Number(quantity),
        Number(rating),
        image_url || null,
        description || null,
        Number(id),
      ],
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`updatePart failed: ${error}`);
    throw new Error(`updatePart failed: ${error.message}`);
  }
}

module.exports = {
  getAllParts,
  getAllCategories,
  getAllFromCategory,
  getPartById,
  updatePart,
};
