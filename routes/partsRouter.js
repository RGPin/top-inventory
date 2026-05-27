const express = require("express");
const controller = require("../controllers/partsController");
const partsRouter = express.Router();

partsRouter.get("/:id", controller.getPartDetails);
partsRouter.get("/:id/edit", controller.getPartEditForm);
partsRouter.post("/:id/edit", controller.savePartEditForm);

module.exports = partsRouter;
