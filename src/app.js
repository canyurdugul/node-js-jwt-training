const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./endpoints/auth");
const apiRoutes = require("./endpoints/api");
const db = require("./database/database");

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
