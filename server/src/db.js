const mongoose = require("mongoose");
const config = require("./config");

async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(config.mongoUri);

  console.log("✅ MongoDB connected successfully");
}

module.exports = {
  connectDatabase,
};