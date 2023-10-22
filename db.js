//? setting up mongo connection

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectionURL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/artisans";
mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

module.exports = db;
