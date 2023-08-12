const express = require("express");
const authMiddleware = require("../middleware/auth_middleware");
const loggerMiddleware = require("../middleware/logger_middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(loggerMiddleware);

router.get("/data", (req, res) => {
  res.json({ message: "Data retrieved successfully" });
});

module.exports = router;
