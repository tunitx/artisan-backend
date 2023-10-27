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
  parser.fields([
    { name: "template", maxCount: 1 },
    { name: "preview_image", maxCount: 1 },
  ]),
  async (req, res) => {
    if (!req.files || !req.files.template || !req.files.preview_image) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const templateFile = req.files.template[0];
      const previewImageFile = req.files.preview_image[0];

      const templateUpload = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "Templates" },
        async (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Error uploading template to Cloudinary" });
          }
          const cloudinaryUrl = result.url;
          const previewImageUpload = cloudinary.uploader.upload_stream(
            { folder: "PreviewImages" },
            async (error, result) => {
              if (error) {
                return res
                  .status(500)
                  .json({
                    error: "Error uploading preview image to Cloudinary",
                  });
              }
              console.log(result);

              const previewImageUrl = result.url;
              const template = new Template({
                theme_id: req.body.theme_id,
                cloudinaryLink: cloudinaryUrl,
                previewImageUrl: previewImageUrl,
              });

              await template.save();
              console.log(template);

              res.status(200).json({
                message: "template created",
                cloudinaryUrl,
                previewImageUrl,
                template,
              });
            }
          );
          previewImageUpload.end(previewImageFile.buffer);
        }
      );

      templateUpload.end(templateFile.buffer);
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
