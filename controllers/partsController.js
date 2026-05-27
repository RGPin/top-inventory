const db = require("../db/queries");

async function getPartDetails(req, res) {
  try {
    const partId = Number(req.params.id);

    if (isNaN(partId)) {
      return res.status(400).send("Invalid Part ID format");
    }

    const details = await db.getPartById(partId);

    if (!details) {
      return res.status(404).send("PC Part not found");
    }

    res.render("details.ejs", { details });
  } catch (error) {
    console.error(`Controller error. getPartDetails failed: ${error}`);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPartDetails,
};
