
//! only admin can use this route

const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../utils/auth");
const db = require("../db");
const khojoProfile = require("../Models/khojoUserProfile");

router.get('/getAllKhojoProfiles', verifyToken, async (req, res) => {
    try {
        //? get all khojo profiles from db
        const profiles = await khojoProfile.find();
        return res.status(200).json(profiles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;