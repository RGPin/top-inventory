const express = require("express");
const path = require("node:path");

const app = express();
const indexRouter = require("./routes/indexRouter");
const inventoryRouter = require("./routes/inventoryRouter");
const partsRouter = require("./routes/partsRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/inventory", inventoryRouter);
app.use("/parts", partsRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Listening to port ${PORT}`);
});
