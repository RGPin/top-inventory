const express = require("express");
const controller = require("../controllers/partsController");
const partsRouter = express.Router();

partsRouter.get("/:id", controller.getPartDetails);

module.exports = partsRouter;
