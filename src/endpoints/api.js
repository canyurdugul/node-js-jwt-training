const express = require("express");
const authMiddleware = require("../middleware/auth_middleware");
const loggerMiddleware = require("../middleware/logger_middleware");
const users = require("./users");

const router = express.Router();

router.use(authMiddleware);
router.use(loggerMiddleware);

router.get("/healthcheck", (req, res) => {
  res.json({ message: "Healthy" });
});

router.use("/users", users);

module.exports = router;
