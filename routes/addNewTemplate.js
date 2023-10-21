

//! only admin can use this route

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const verifyToken = require("../utils/auth");
const db = require("../db");
// const User = require("../Models/userModel");
// const khojoProfile = require("../Models/khojoUserProfile");
const Template = require("../Models/templateSchema");
//? setup cloudinary storage

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Templates",
    allowed_formats: ["jpg", "png", "jpeg", "html", "css", "js"],
    // transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const parser = multer({ storage });


router.post('/addNewTemplate', verifyToken, parser.single('template'), async (req, res) => {
    const { file } = req.files;
  
    if (!file || !allowed_formats.includes(file.mimetype.split("/")[1])) {
      return res.status(400).json({ message: "Invalid file format" });
    }
  
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "Templates",
        resource_type: "raw",
      });
  
      const { theme_id } = req.body;
  
      const template = new Template({
        theme_id: theme_id,
        cloudinaryLink: result.secure_url,
      });
  
      await template.save();
  
      res.status(200).json({ message: "Template added successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  });
    
