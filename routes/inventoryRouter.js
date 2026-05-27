const express = require("express");
const controller = require("../controllers/indexController");
const inventoryRouter = express.Router();

inventoryRouter.get("/", controller.getAllPartsAndCategories);
inventoryRouter.get("/:category", controller.getAllFromCategory);

module.exports = inventoryRouter;
