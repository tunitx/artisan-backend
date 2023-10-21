
//! both admin and client can use this route (client can only access their own templates)


const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/auth");
const db = require("../db");
const Template = require("../Models/templateSchema");

router.get("/getTemplateByID/:id", verifyToken, async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        return res.status(200).json(template);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;