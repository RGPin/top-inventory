const db = require("../db/queries");

async function getAllPartsAndCategories(req, res) {
  try {
    const [parts, categories] = await Promise.all([
      db.getAllParts(),
      db.getAllCategories(),
    ]);
    res.render("index", { parts, categories });
  } catch (error) {
    console.error(`Controller error. getAllParts failed: ${error}`);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllPartsAndCategories,
};
