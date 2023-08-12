const jwt = require("jsonwebtoken");
const logger = require("../logging/logging");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      logger.error("Unauthorized access:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded.username;
    next();
  });
}

module.exports = authMiddleware;
