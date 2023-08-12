const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user_model");
const redisClient = require("../caching/redis");
const logger = require("../logging/logging");

const router = express.Router();

router.post("/token", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log({ username });
    const user = await User.findOne({ username });
    console.log(user);
    if (!user || user.password != password) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign({ username }, "secretKey", {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ username }, "refreshSecretKey", {
      expiresIn: "7d",
    });

    // Save refresh token to Redis for future use
    redisClient.set(username, refreshToken);

    const response = {
      accessToken,
      refreshToken,
      expireTime: new Date(Date.now() + 15 * 60 * 1000),
    };

    logger.info(`User '${username}' logged in and received tokens.`);
    res.json(response);
  } catch (error) {
    debugger;
    logger.error("Error while logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    jwt.verify(refreshToken, "refreshSecretKey", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const username = decoded.username;

      redisClient.get(username, (err, cachedToken) => {
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (refreshToken === cachedToken) {
          const accessToken = jwt.sign({ username }, "secretKey", {
            expiresIn: "15m",
          });

          const response = {
            accessToken,
            refreshToken,
            expireTime: new Date(Date.now() + 15 * 60 * 1000),
          };

          logger.info(`User '${username}' refreshed token.`);
          res.json(response);
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      });
    });
  } catch (error) {
    logger.error("Error while refreshing token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
