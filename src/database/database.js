const database = require("mongoose");
const User = require("../models/user_model");

database
  .connect("mongodb://localhost:27017/nodejs_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("Data seed started.");
    console.log("Data seed finished.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = database;
