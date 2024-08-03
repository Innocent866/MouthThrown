const mongoose = require("mongoose");
require("dotenv").config();

const mongoDBURL = process.env.DBURL;

const connect = async () => {
  try {
    await mongoose.connect(mongoDBURL);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connect;
