
const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/auth");
const db = require("../db");
const User = require("../Models/userModel");

router.get("/getAllUsers", verifyToken, async (req, res) => {
    try {
        //? get all users from db and populate khojoUserProfiles
        const users = await User.find().populate("khojoUserProfiles");
        
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
