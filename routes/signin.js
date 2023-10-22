const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/auth");
const User = require("../Models/userModel");
const db = require("../db");


router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
  
    //? populate the user object with the khojoUserProfiles array
    const userWithProfiles = await User.findById(user._id)
    .populate({ path: "khojoUserProfiles", populate: { path: "template" } });
  
    // ? Send JWT token in response
  
    res.json({ message: "Login successful", token, userWithProfiles });
  });


  module.exports = router;