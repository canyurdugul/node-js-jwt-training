const jwt = require("jsonwebtoken");
const logger = require("../logging/logging");
const User = require("../models/user_model");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretKey", async (err, decoded) => {
    if (err) {
      logger.error("Unauthorized access to " + req.originalUrl + " ", {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        body: req.body,
        error: err,
        token: token,
        ipAddress: req.socket.remoteAddress,
      });
    }

    req.username = decoded.username;
    const user = await User.findOne({ username: req.username });
    if (user.isDeleted) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  });
}

module.exports = authMiddleware;
