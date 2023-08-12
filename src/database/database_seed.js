const User = require("../models/user_model");
const db = require("./database.js");

async function seedData() {
  try {
    const dataToSeed = [
      {
        name: "John",
        surname: "Doe",
        username: "john.doe",
        password: "1234",
      },
    ];

    dataToSeed.forEach((element) => {
      const seed = new User(element);
      seed.save();
    });

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Close the connection to the MongoDB server
  }
}

// Call the function to seed the data
seedData();
