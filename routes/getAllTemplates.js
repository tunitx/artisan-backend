
//! both admin and client
const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/auth");
const db = require("../db");
const Template = require("../Models/templateSchema");

router.get('/getAllTemplates', verifyToken, async (req, res) => {
    try {
        //? get all templates from db
        const templates = await Template.find();
        return res.status(200).json(templates);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;