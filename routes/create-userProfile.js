const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const verifyToken = require("../utils/auth");
const db = require("../db");
const User = require("../Models/userModel");
const khojoProfile = require("../Models/khojoUserProfile");
//? setup cloudinary storage

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user-profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
    // transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const parser = multer({ storage });

// todo : /create-userProfile route for creating khojo user profile

router.post(
  "/create-userProfile",
  verifyToken,
  parser.single("pfp"),
  async (req, res) => {
    // console.log(JSON.stringify(req.body));
    console.log(req.body);
    console.log(req.user);
    const pfp = req.file.path;
    console.log(req.file);

    try {
      //? upload profile photo to cloudinary

      const result = await cloudinary.uploader.upload(pfp);
      const {
        name,
        businessName,
        businessAddress,
        businessDetails,
        district,
        instagram,
        facebook,
        twitter
      } = req.body;

      //? create new user profile object

      const userProfile = new khojoProfile({
        pfp: result.secure_url,
        name: name,
        businessName: businessName,
        businessAddress: businessAddress,
        businessDetails: businessDetails,
        socialLinks:{
            'instagram': instagram,
            'facebook': facebook,
            'twitter': twitter
        },
        district: district,
        theme_id: req.body.theme_id,
        User: await User.findOne({ email: req.user.email })._id,
      });

      //? save user profile to database

      await userProfile.save();

      //? push the reference of the new userProfile into the current user's khojoProfiles array

      const user = await User.findOne({ email: req.user.email });
      console.log(userProfile._id);
      user.khojoUserProfiles = user.khojoUserProfiles || []; //? initialize khojoProfile to an empty array if it's undefined
      user.khojoUserProfiles.push(userProfile._id);

      await user.save();

      //? populate the user object with the khojoUserProfiles array

      const userWithProfiles = await User.findById(user._id).populate(
        "khojoUserProfiles"
      );
      console.log(userWithProfiles);
      res
        .status(201)
        .json({ message: "KhojoUserprofile created", userWithProfiles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


module.exports = router;