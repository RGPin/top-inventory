const db = require("../db/queries");

async function getPartDetails(req, res) {
  try {
    const partId = Number(req.params.id);

    if (isNaN(partId)) {
      return res.status(400).send("getPartDetails: Invalid Part ID format");
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
      return res.status(400).send("getPartEditForm: Invalid Part ID format");
    }

    const [details, categories] = await Promise.all([
      db.getPartById(partId),
      db.getAllCategories(),
    ]);

    if (!details) {
      return res.status(404).send("PC Part not found");
    }

    res.render("form", { details, categories });
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

async function getPartCreateForm(req, res) {
  try {
    const categories = await db.getAllCategories();
    res.render("form", { details: null, categories });
  } catch (error) {
    console.error(`Controller error. getAddPartForm failed: ${error}`);
    res.status(500).json({ error: error.message });
  }
}

async function savePartCreateForm(req, res) {
  try {
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
    const added = await db.createPart({
      brand,
      name,
      category_id,
      price,
      quantity,
      rating,
      image_url,
      description,
    });
    if (!added) {
      return res.status(404).send("Failed to create PC part");
    }
    res.redirect(`/parts/${added.id}`);
  } catch (error) {
    console.error(`Controller error. savePartCreateForm failed: ${error}`);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPartDetails,
  getPartEditForm,
  savePartEditForm,
  getPartCreateForm,
  savePartCreateForm,
};
