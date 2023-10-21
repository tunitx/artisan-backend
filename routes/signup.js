const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/auth");
const User = require("../Models/userModel");
const db = require("../db");

//? for registering new user

const saltRounds = 10;

router.post("/signup", async (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  const existingUserName = await User.findOne({ name: username });

  //? to check if the user has already registered

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  if (existingUserName) {
    return res.status(409).json({ message: "Username already exists" });
  }

  //? Hashing the password to store in the db securely

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userWithProfiles = new User({
    name: username,
    email: email,
    password: hashedPassword,
  });
  await userWithProfiles.save();

  //? Generating JWT token (to be sent to the client and be saved in browsers local storage)

  const token = jwt.sign({ email }, process.env.JWT_SECRET);

  // res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 10 });
  res.status(201).json({ message: "User created", token, userWithProfiles });
});

module.exports = router;