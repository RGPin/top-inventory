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

module.exports = {
  getAllParts,
  getAllFromCategory,
};
