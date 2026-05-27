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

async function getPartEditForm(req, res) {
  try {
    const partId = Number(req.params.id);

    if (isNaN(partId)) {
      return res.status(400).send("Invalid Part ID format");
    }

    const [details, categories] = await Promise.all([
      db.getPartById(partId),
      db.getAllCategories(),
    ]);

    if (!details) {
      return res.status(404).send("PC Part not found");
    }

    res.render("edit", { details, categories });
  } catch (error) {
    console.error(`Controller error. getPartEditForm failed: ${error}`);
    res.status(500).json({ error: error.message });
  }
}

async function savePartEditForm(req, res) {
  try {
    const id = Number(req.params.id);
    const {
      brand,
      name,
      category_id,
      price,
      quantity,
      rating,
      image_url,
      description,
    } = req.body;
    const updated = await db.updatePart({
      id,
      brand,
      name,
      category_id,
      price,
      quantity,
      rating,
      image_url,
      description,
    });
    if (!updated) {
      return res.status(404).send("PC Part not found or failed to update");
    }
    res.redirect(`/parts/${id}`);
  } catch (error) {
    console.error(`Controller error. savePartEditForm failed: ${error}`);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPartDetails,
  getPartEditForm,
  savePartEditForm,
};
