const pool = require("./pool");

/**
 * Returns all parts
 * @returns {Promise<Object[]>} - Returns all rows from parts table
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
 * @returns {Promise<Object[]>} - Returns all rows from the category table
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
 * @returns {Promise<Object[]>} - Returns all parts under a specific category.
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
 * @returns {Promise<Object|null>} - An object or null if not found.
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

/**
 * Updates an existing part in the database.
 *
 * @async
 * @function updatePart
 * @param {Object} partData - The part data to update.
 * @param {number|string} partData.id - The ID of the part to update.
 * @param {string} partData.brand - The brand name of the part.
 * @param {string} partData.name - The name of the part.
 * @param {number|string} partData.category_id - The category ID the part belongs to.
 * @param {number|string} partData.price - The price of the part.
 * @param {number|string} partData.quantity - Available quantity in stock.
 * @param {number|string} partData.rating - Rating of the part.
 * @param {string|null} [partData.image_url] - Optional image URL for the part.
 * @param {string|null} [partData.description] - Optional description of the part.
 *
 * @returns {Promise<Object|null>} The updated part object, or null if no part was found.
 */
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

/**
 * Adds a new part in the database.
 *
 * @async
 * @function createPart
 * @param {Object} partData - The part data to update.
 * @param {string} partData.brand - The brand name of the part.
 * @param {string} partData.name - The name of the part.
 * @param {number|string} partData.category_id - The category ID the part belongs to.
 * @param {number|string} partData.price - The price of the part.
 * @param {number|string} partData.quantity - Available quantity in stock.
 * @param {number|string} partData.rating - Rating of the part.
 * @param {string|null} [partData.image_url] - Optional image URL for the part.
 * @param {string|null} [partData.description] - Optional description of the part.
 *
 * @returns {Promise<Object|null>} The created part object, or null if no part was added.
 *
 * @throws {Error} Throws an error if the database update fails.
 */
async function createPart({
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
      INSERT INTO parts (brand, name, category_id, price, quantity, rating, image_url, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
      ],
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`createPart failed: ${error}`);
    throw new Error(`createPart failed: ${error.message}`);
  }
}

/**
 *
 * @function deletePartById
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function deletePartById(id) {
  if (typeof id !== "number") {
    throw new Error("deletePartById failed: id must be number");
  }
  try {
    const { rows } = await pool.query(
      `
      DELETE FROM parts
      WHERE id = $1
      RETURNING *;
      `,
      [id],
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`deletePartById failed: ${error}`);
    throw new Error(`deletePartById failed: ${error.message}`);
  }
}

module.exports = {
  getAllParts,
  getAllCategories,
  getAllFromCategory,
  getPartById,
  updatePart,
  createPart,
  deletePartById,
};
