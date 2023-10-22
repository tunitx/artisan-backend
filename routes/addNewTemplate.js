//! only admin can use this route

const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const verifyToken = require("../utils/auth");
const db = require("../db");
const Template = require("../Models/templateSchema");

//? setup multer storage

const storage = multer.memoryStorage();
const parser = multer({ storage });

router.post(
  "/addNewTemplate",
  verifyToken,
  parser.single("template"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "raw", folder: "Templates" },
          async (error, result) => {
            if (error) {
              return res
                .status(500)
                .json({ error: "Error uploading to Cloudinary" });
            }
            console.log(result.public_id);

            const cloudinaryUrl = result.url;
            const template = new Template({
              theme_id: req.body.theme_id,
              cloudinaryLink: cloudinaryUrl,
            });

            await template.save();
            console.log(template);

            res
              .status(200)
              .json({ message: "template created", cloudinaryUrl, template });
          }
        )
        .end(req.file.buffer);
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
