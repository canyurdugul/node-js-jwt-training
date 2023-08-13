const express = require("express");
const authMiddleware = require("../middleware/auth_middleware");
const loggerMiddleware = require("../middleware/logger_middleware");
const User = require("../models/user_model");

const router = express.Router();

router.use(authMiddleware);
router.use(loggerMiddleware);

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters or default to 1
  const limit = parseInt(req.query.limit) || 10; // Get the limit (number of items per page) from the query parameters or default to 10

  try {
    const count = await User.countDocuments({ isDeleted: false }); // Count the total number of documents

    const skip = (page - 1) * limit;

    // Fetch the users data with pagination
    const users = await User.find({ isDeleted: false }).skip(skip).limit(limit);

    res.json({
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCount: count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params; // Extract the id value from the URL params

  try {
    // Find the user by id in the database
    const user = await User.findById(id);

    if (!user) {
      // If no user found with the provided id, send a not found response
      return res.status(404).json({ message: "User not found!" });
    }

    // Send the user data in the response
    res.json({ message: "", data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { username, password, name, surname } = req.body; // Extract the username, password, name, and surname from the request body

  try {
    // Create a new instance of the User model with the provided data
    const user = new User({
      username,
      password,
      name,
      surname,
    });

    // Save the new user to the database
    await user.save();

    // Send a success response
    res.status(201).json({ message: "User saved successfully!", data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params; // Extract the id value from the URL params
  const { name, surname, username, password } = req.body; // Extract the other details from the request body

  try {
    // Find the user by id in the database
    let user = await User.findById(id);

    if (!user) {
      // If no user found with the provided id, send a not found response
      return res.status(404).json({ message: "User not found!" });
    }

    // Update the user's details with the new values
    user.name = name;
    user.surname = surname;
    user.username = username;
    user.password = password;

    // Save the updated user to the database
    user = await user.save();

    // Send the updated user data in the response
    res.json({ message: "", user: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Extract the id value from the URL params
  try {
    const result = await User.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true },
      { returnOriginal: false, new: true }
    );
    if (result.isDeleted === true) {
      res.json({ message: `User with id ${id} has been deleted.` });
    } else {
      res.status(404).json({ error: `User with id ${id} not found.` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
